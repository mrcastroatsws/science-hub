// dashboard.js - Modular Logic Engine 2.0
let hubData = {};

/**
 * 1. CORE DATA INITIALIZATION
 * Fetches JSON and triggers the layout builds.
 */
async function loadData() {
    try {
        const response = await fetch('data.json');
        hubData = await response.json();
        
        // Build UI Components
        renderCurriculum(hubData.courses);
        renderUtilityCards();
        
        // Build Schedule views (Screen + Hidden Print Area)
        renderScheduleTable('schedule-container', 'main-schedule-table'); 
        if (document.getElementById('print-only-schedule')) {
            renderFullGrid('print-only-schedule'); 
        }

        updateLiveStatus(); 
    } catch (e) {
        console.error("Master Binder Error: Content failed to load.", e);
    }
}

/**
 * 2. CURRICULUM UI GENERATOR
 */
function renderCurriculum(courses) {
    const grid = document.getElementById('curriculum-grid');
    if (!grid) return;
    grid.innerHTML = courses.map(c => {
        if (c.grade === "Universal") {
            return `
                <div class="hub-card bg-slate-900 rounded-2xl p-0 overflow-hidden flex flex-col border-2 border-[#f9db66]">
                    <div class="bg-slate-950 p-3 flex justify-between items-center text-white">
                        <span class="sketch text-xl text-[#f9db66]">${c.grade}</span>
                        <span class="${c.color} text-[9px] px-2 py-1 rounded font-bold uppercase text-white">${c.topic}</span>
                    </div>
                    <div class="p-5 flex-grow flex flex-col justify-center text-center">
                        <h3 class="font-bold text-white text-xl">${c.desc}</h3>
                        <p class="text-xs text-slate-400 mt-1">Activity Framework</p>
                        <div class="admin-only hidden mt-4"><a href="${c.special}" class="block w-full py-2 bg-[#f9db66] text-black rounded text-xs font-bold">Open Tool</a></div>
                    </div>
                </div>`;
        }
        return `
            <div class="hub-card bg-white rounded-2xl p-0 overflow-hidden flex flex-col">
                <div class="${c.grade === '9th' || (c.grade === '11th' && c.topic === 'Chemistry') ? 'bg-[#ac2e55]' : 'bg-slate-800'} p-3 flex justify-between items-center text-white">
                    <span class="sketch text-xl ${c.grade === '9th' || (c.grade === '11th' && c.topic === 'Chemistry') ? 'text-[#f9db66]' : ''}">${c.grade} Grade</span>
                    <span class="${c.color} text-[9px] px-2 py-1 rounded font-bold uppercase text-black ${c.color.includes('purple') || c.color.includes('red') ? 'text-white' : ''}">${c.topic}</span>
                </div>
                <div class="p-5 flex-grow">
                    <h3 class="font-bold text-slate-700 text-lg">${c.topic}</h3>
                    <p class="text-xs text-slate-500 mt-1">${c.desc}</p>
                    <a href="${c.portal}" class="mt-4 block w-full text-center py-2 border border-slate-200 rounded hover:bg-slate-50 text-xs font-bold uppercase text-slate-600">Quarter Plan</a>
                    <div class="admin-only hidden mt-2 space-y-1">
                        ${Array.isArray(c.slides) 
                            ? c.slides.map((url, i) => `<a href="${url}" class="block w-full text-center py-1 bg-[#ac2e55] text-white rounded text-[10px] font-bold">${c.weekNames[i]}</a>`).join('')
                            : `<a href="${c.slides}" class="block w-full text-center py-2 bg-[#ac2e55] text-white rounded text-xs font-bold">Slides</a>`
                        }
                        ${c.extra ? `<a href="${c.extra}" class="block w-full text-center py-1 border border-slate-200 text-slate-500 rounded text-[10px] font-bold">Tools</a>` : ''}
                    </div>
                </div>
            </div>`;
    }).join('');
}

/**
 * 3. RESPONSIVE SCHEDULE ENGINE
 * Smart-switches between Card Stack (Mobile) and Grid (Laptop)
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
 * 4. FULL GRID GENERATOR (Laptop & Printing)
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
 * 5. UTILITY & NAVIGATION
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
 * 6. LIVE STATUS ENGINE (Routing + Indicators)
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

// 7. BOOTSTRAP
window.onload = async function() {
    await loadData();
    document.documentElement.classList.add('loaded');
    setInterval(updateLiveStatus, 1000);
    if (typeof checkAuth === "function") checkAuth();
};

window.addEventListener('resize', () => { 
    renderScheduleTable('schedule-container', 'main-schedule-table'); 
});
