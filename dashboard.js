// dashboard.js - Modular Logic Engine
let hubData = {}; // Global store for JSON data

async function loadData() {
    try {
        const response = await fetch('data.json');
        hubData = await response.json();
        
        renderCurriculum(hubData.courses);
        renderScheduleTable(hubData.tableRows);
        updateLiveStatus(); // Initial run
    } catch (e) {
        console.error("Master Binder Error: Content failed to load.", e);
    }
}

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

function renderScheduleTable(rows) {
    const table = document.getElementById('main-schedule-table');
    if (!table) return;
    let html = `<thead><tr><th class="w-12">#</th><th class="w-24">Time</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr></thead><tbody>`;
    rows.forEach(row => {
        if (row.type === 'break') html += `<tr class="break"><td colspan="7">${row.label}</td></tr>`;
        else {
            html += `<tr><td>${row.id}</td><td>${row.time}</td>${row.lbls.map((l, i) => `<td class="${[row.mon, row.tue, row.wed, row.thu, row.fri][i]}"><span class="sub-name">${l}</span></td>`).join('')}</tr>`;
        }
    });
    table.innerHTML = html + `</tbody>`;
}

function updateLiveStatus() {
    const now = getHondurasTime();
    const day = now.getDay();
    const timeVal = now.getHours() * 60 + now.getMinutes();
    const clockEl = document.getElementById('live-clock');
    if (clockEl) clockEl.innerText = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', weekday:'long'});

    if (!hubData.schedule || day === 0 || day === 6 || (day === 5 && timeVal > 900)) {
        document.getElementById('status-now').innerText = "Weekend Mode";
        document.getElementById('status-next').innerText = "Next: Mon 8:00 AM - Prep / Science 8";
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
    }
}

function getHondurasTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * -6));
}

window.onload = async function() {
    await loadData();
    document.documentElement.classList.add('loaded');
    setInterval(updateLiveStatus, 1000);
    if (typeof checkAuth === "function") checkAuth();
};
