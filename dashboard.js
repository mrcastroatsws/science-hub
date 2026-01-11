// dashboard.js - Logic Controller
let hubData = {};

const Logic = {
    // 1. Init
    init: async () => {
        try {
            Templates.injectModals(); // Build DOM
            const response = await fetch('data.json');
            hubData = await response.json();
            
            Logic.renderCurriculum();
            Logic.renderScheduleTable('schedule-container');
            
            // Print Version
            if(document.getElementById('print-only-schedule')) Logic.renderFullGrid('print-only-schedule');

            // Start Clock
            Logic.updateLiveStatus();
            setInterval(Logic.updateLiveStatus, 1000);
            
            if (typeof checkAuth === "function") checkAuth();
        } catch (e) { console.error("Load Error", e); }
    },

    // 2. Renderers
    renderCurriculum: () => {
        const grid = document.getElementById('curriculum-grid');
        if (grid) {
            grid.innerHTML = hubData.courses.map(c => Templates.courseCard(c)).join('');
            document.getElementById('utility-grid').innerHTML = Templates.utilityCards();
        }
    },

    renderScheduleTable: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container || !hubData.tableRows) return;
        
        // Mobile View
        if (window.innerWidth < 768 && containerId !== 'print-only-schedule') {
            const now = Logic.getHondurasTime();
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
            Logic.renderFullGrid(containerId);
        }
    },

    renderFullGrid: (targetId) => {
        const container = document.getElementById(targetId);
        if (!container) return;
        let html = `<table class="schedule-table w-full"><thead><tr><th class="w-24">Time</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr></thead><tbody>`;
        hubData.tableRows.forEach(row => {
            if (row.type === 'break') html += `<tr class="break"><td colspan="6" style="background:#f1f5f9; color:#64748b; font-size:10px; font-weight:bold;">${row.label}</td></tr>`;
            else html += `<tr><td class="font-mono text-[10px] bg-slate-50 font-bold">${row.time}</td>${row.lbls.map((l, i) => `<td class="${[row.mon, row.tue, row.wed, row.thu, row.fri][i]}"><span class="sub-name">${l}</span></td>`).join('')}</tr>`;
        });
        container.innerHTML = html + `</tbody></table>`;
    },

    // 3. Logic Actions
    openCourseModal: (grade, topic) => {
        const course = hubData.courses.find(c => c.grade === grade && c.topic === topic);
        if (!course) return;

        const modal = document.getElementById('course-modal');
        document.getElementById('modal-grade').innerText = course.grade + (course.grade === "Universal" ? "" : " Grade");
        document.getElementById('modal-title').innerText = course.topic;
        document.getElementById('modal-desc').innerText = course.desc;
        document.getElementById('modal-portal-link').href = course.portal;

        // Theme
        const header = document.getElementById('modal-header');
        header.className = `p-6 text-white flex justify-between items-center ${course.grade === '9th' || (course.grade === '11th' && course.topic === 'Chemistry') ? 'bg-[#ac2e55]' : 'bg-slate-800'}`;

        // Slides
        const slidesBox = document.getElementById('modal-slides-container');
        if (Array.isArray(course.slides)) {
            slidesBox.innerHTML = `
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Weekly Archive</span>
                <div class="space-y-2">
                    ${course.slides.map((url, i) => `
                        <a href="${url}" class="block w-full p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition flex justify-between items-center">
                            <span>${course.weekNames[i]}</span><span class="text-slate-300 text-lg">→</span>
                        </a>`).join('')}
                </div>`;
        } else {
            slidesBox.innerHTML = `<a href="${course.slides}" class="block w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 text-center transition">Open Master Slide Deck</a>`;
        }
        modal.classList.remove('hidden');
    },

    updateLiveStatus: () => {
        const now = Logic.getHondurasTime();
        const day = now.getDay();
        const timeVal = now.getHours() * 60 + now.getMinutes();
        
        // Update DOM elements if they exist
        const clockEl = document.getElementById('live-clock');
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
            
            const liveBtn = document.getElementById('live-class-btn');
            const portalMap = { "Science 7": "7th-portal.html", "Science 8": "8th-portal.html", "Science 9": "9th-portal.html", "Bio 10": "10thbio-portal.html", "Chem 10": "10thchem-portal.html", "Bio 11": "11thbio-portal.html", "Chem 11": "11thchem-portal.html", "Econ 11": "11thecon-portal.html" };
            if (portalMap[current.c] && liveBtn) {
                liveBtn.href = portalMap[current.c];
                liveBtn.classList.replace('text-white/50', 'text-[#f9db66]');
                document.getElementById('live-indicator')?.classList.remove('hidden');
            }
        }
    },

    getHondurasTime: () => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * -6));
    }
};

window.onload = Logic.init;
window.addEventListener('resize', () => Logic.renderScheduleTable('schedule-container'));
function toggleMenu() { document.getElementById('mobile-menu').classList.toggle('hidden'); }
