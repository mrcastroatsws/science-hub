// dashboard.js - Modular Logic Engine 2.0
let hubData = {};

/**
 * 1. CORE DATA INITIALIZATION
 */
async function loadData() {
    try {
        const response = await fetch('data.json');
        hubData = await response.json();
        
        renderCurriculum(hubData.courses);
        renderUtilityCards();
        
        // Render Schedule for Screen
        renderScheduleTable('schedule-container', 'main-schedule-table'); 
        
        // Render Full Grid for Printer (Ghost table)
        if (document.getElementById('print-only-schedule')) {
            renderFullGrid('print-only-schedule'); 
        }

        updateLiveStatus(); 
    } catch (e) {
        console.error("Master Binder Error: Content failed to load.", e);
    }
}

/**
 * 2. CURRICULUM UI GENERATOR (Modal Enabled)
 */
function renderCurriculum(courses) {
    const grid = document.getElementById('curriculum-grid');
    if (!grid) return;
    grid.innerHTML = courses.map(c => {
        const isSpecial = c.grade === '9th' || (c.grade === '11th' && c.topic === 'Chemistry');
        const headerClass = isSpecial ? 'bg-[#ac2e55]' : 'bg-slate-800';
        const titleColor = isSpecial ? 'text-[#f9db66]' : 'text-white';

        return `
            <div class="hub-card bg-white rounded-2xl p-0 overflow-hidden flex flex-col cursor-pointer active:scale-95 transition-transform shadow-sm" 
                 onclick="openCourseModal('${c.grade}', '${c.topic}')">
                <div class="${headerClass} p-3 flex justify-between items-center text-white">
                    <span class="sketch text-xl ${titleColor}">${c.grade} ${c.grade === "Universal" ? "" : "Grade"}</span>
                    <span class="${c.color} text-[9px] px-2 py-1 rounded font-bold uppercase text-white tracking-widest">${c.topic}</span>
                </div>
                <div class="p-5 flex-grow">
                    <h3 class="font-bold text-slate-700 text-lg">${c.topic}</h3>
                    <p class="text-xs text-slate-500 mt-1 line-clamp-2">${c.desc}</p>
                    <div class="mt-4 flex items-center text-[#ac2e55] font-bold text-[10px] uppercase tracking-widest">
                        Open Resources <span class="ml-2">→</span>
                    </div>
                </div>
            </div>`;
    }).join('');
}

/**
 * 3. COURSE MODAL LOGIC
 */
function openCourseModal(grade, topic) {
    const course = hubData.courses.find(c => c.grade === grade && c.topic === topic);
    if (!course) return;

    const modal = document.getElementById('course-modal');
    const header = document.getElementById('modal-header');
    
    document.getElementById('modal-grade').innerText = course.grade + (course.grade === "Universal" ? "" : " Grade");
    document.getElementById('modal-title').innerText = course.topic;
    document.getElementById('modal-desc').innerText = course.desc;
    document.getElementById('modal-portal-link').href = course.portal;

    // Thematic Coloring
    header.className = `p-6 text-white flex justify-between items-center ${course.grade === '9th' || (course.grade === '11th' && course.topic === 'Chemistry') ? 'bg-[#ac2e55]' : 'bg-slate-800'}`;

    // Slide Generation
    const slidesBox = document.getElementById('modal-slides-container');
    if (Array.isArray(course.slides)) {
        slidesBox.innerHTML = `
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Weekly Archive</span>
            <div class="space-y-2">
                ${course.slides.map((url, i) => `
                    <a href="${url}" class="block w-full p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition flex justify-between items-center">
                        <span>${course.weekNames[i]}</span>
                        <span class="text-slate-300 text-lg">→</span>
                    </a>
                `).join('')}
            </div>`;
    } else {
        slidesBox.innerHTML = `
            <a href="${course.slides}" class="block w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 text-center transition">
                Open Master Slide Deck
            </a>`;
    }

    modal.classList.remove('hidden');
}

function closeCourseModal() {
    document.getElementById('course-modal').classList.add('hidden');
}

/**
 * 4. RESPONSIVE SCHEDULE ENGINE
 */
function renderScheduleTable(containerId, tableId) {
    const container = document.getElementById(containerId);
    if (!container || !hubData.tableRows) return;
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        const now = getHondurasTime();
        let todayIdx = now.getDay(); 
        if (todayIdx === 0 || todayIdx === 6) todayIdx = 1; 
        const nextDayIdx = todayIdx < 5 ? todayIdx + 1 : 1;
        const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

        let mobileHtml = `<div class="p-3 space-y-8">`;
        [todayIdx, nextDayIdx].forEach((dIdx, stackLoop) => {
            mobileHtml += `
                <div>
                    <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center">
                        <span class="w-2 h-2 rounded-full ${stackLoop === 0 ? 'bg-green-500' : 'bg-blue-400'} mr-2"></span>
                        ${stackLoop === 0 ? 'Today' : 'Upcoming'}: ${dayNames[dIdx]}
                    </h4>
                    <div class="space-y-2">
                        ${hubData.tableRows.map(row => {
                            if (row.type === 'break') return `<div class="text-[9px] text-slate-400 font-bold uppercase text-center py-2 italic">${row.label}</div>`;
                            const classLabel = row.lbls[dIdx - 1];
                            const classColor = [row.mon, row.tue, row.wed, row.thu, row.fri][dIdx - 1];
                            return `
                                <div class="schedule-card">
                                    <div class="card-time">${row.time.split(' ')[0]}</div>
                                    <div class="card-content ${classColor}"><span class="sub-name">${classLabel}</span></div>
                                </div>`;
                        }).join('')}
                    </div>
                </div>`;
        });
        container.innerHTML = mobileHtml + `</div>`;
    } else {
        renderFullGrid(containerId);
    }
}

/**
 * 5. FULL GRID GENERATOR (Laptop & Print)
 */
function renderFullGrid(targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;
    let html = `<table class="schedule-table w-full"><thead><tr><th class="w-24">Time</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr></thead><tbody>`;
    hubData.tableRows.forEach(row => {
        if (row.type === 'break') html += `<tr class="break"><td colspan="6" style="background:#f1f5f9; color:#64748b; font-size:10px; font-weight:bold;">${row.label}</td></tr>`;
        else {
            html += `<tr><td class="font-mono text-[10px] bg-slate-50 font-bold">${row.time}</td>${row.lbls.map((l, i) => `<td class="${[row.mon, row.tue, row.wed, row.thu, row.fri][i]}"><span class="sub-name">${l}</span></td>`).join('')}</tr>`;
        }
    });
    container.innerHTML = html + `</tbody></table>`;
}

/**
 * 6. UTILITY & NAVIGATION
 */
function renderUtilityCards() {
    const grid = document.getElementById('utility-grid');
    if(!grid) return;
    grid.innerHTML = `
        <a href="safety.html" class="hub-card bg-red-50 border-red-100 p-6 rounded-2xl flex items-center gap-4">
            <div><h3 class="font-bold text-red-900 text-lg">Safety and Rules</h3><p class="text-xs text-red-700">Safety protocols and lab expectations</p></div>
        </a>
        <a href="science-fair.html" class="hub-card bg-teal-50 border-teal-100 p-6 rounded-2xl flex items-center gap-4">
            <div><h3 class="font-bold text-teal-900 text-lg">Science Fair</h3><p class="text-xs text-teal-700">Progress tracking and rubric details</p></div>
        </a>`;
}

function toggleMenu() { document.getElementById('mobile-menu').classList.toggle('hidden'); }

function toggleSchedule() {
    const modal = document.getElementById('schedule-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        renderScheduleTable('modal-schedule-container', 'modal-table');
    }
}

/**
 * 7. LIVE STATUS ENGINE
 */
function updateLiveStatus() {
    const now = getHondurasTime();
    const day = now.getDay();
    const timeVal = now.getHours() * 60 + now.getMinutes();
    const clockEl = document.getElementById('live-clock');
    const liveBtn = document.getElementById('live-class-btn');
    const liveIndicator = document.getElementById('live-indicator');

    if (clockEl) clockEl.innerText = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', weekday:'long'});

    if (!hubData.schedule || day === 0 || day === 6 || (day === 5 && timeVal > 900)) {
        document.getElementById('status-now').innerText = "Weekend Mode";
        document.getElementById('status-next').innerText = "Next: Mon 8:00 AM";
        return;
    }

    const today = hubData.schedule[day];
    let current = null, next = null;
    for (let i = 0; i < today.length; i++) {
        const s = parseInt(today[i].s.split(':')[0])*60 + parseInt(today[i].s.split(':')[1]);
        const e = parseInt(today[i].e.split(':')[0])*60 + parseInt(today[i].e.split(':')[1]);
        if (timeVal >= s && timeVal < e) { current = today[i]; next = today[i+1]; break; }
        if (timeVal < s) { next = today[i]; break; }
    }

    if (current) {
        document.getElementById('status-now').innerText = current.c;
        document.getElementById('status-next').innerText = next ? `Next: ${next.s} - ${next.c}` : "End of Day";
        
        const portalMap = { "Science 7": "7th-portal.html", "Science 8": "8th-portal.html", "Science 9": "9th-portal.html", "Bio 10": "10thbio-portal.html", "Chem 10": "10thchem-portal.html", "Bio 11": "11thbio-portal.html", "Chem 11": "11thchem-portal.html", "Econ 11": "11thecon-portal.html" };
        if (portalMap[current.c] && liveBtn) {
            liveBtn.href = portalMap[current.c];
            liveBtn.classList.replace('text-white/50', 'text-[#f9db66]');
            if(liveIndicator) liveIndicator.classList.remove('hidden');
        }
    }
}

function getHondurasTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * -6));
}

// 8. BOOTSTRAP
window.onload = async function() {
    await loadData();
    document.documentElement.classList.add('loaded');
    setInterval(updateLiveStatus, 1000);
    if (typeof checkAuth === "function") checkAuth();
};

window.addEventListener('resize', () => { 
    renderScheduleTable('schedule-container', 'main-schedule-table'); 
});
