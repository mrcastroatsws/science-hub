// dashboard.js - Specific logic for the Master Dashboard

// 1. DATA FOR LIVE STATUS (Timing Logic)
const schedule = {
    1: [{s:"08:00",e:"08:40",c:"Prep/Vacant"}, {s:"08:40",e:"09:20",c:"Science 8 (Electronics)"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Science 9"}, {s:"11:05",e:"11:45",c:"Prep"}, {s:"11:45",e:"12:20",c:"Science 7"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"13:35",c:"Prep"}, {s:"13:35",e:"14:55",c:"Chem 10"}],
    2: [{s:"08:00",e:"09:20",c:"Science 8"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Science 9"}, {s:"11:05",e:"12:20",c:"Bio 10"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"14:15",c:"Bio 11"}, {s:"14:15",e:"14:55",c:"Prep"}],
    3: [{s:"08:00",e:"09:20",c:"Econ 11"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Science 7"}, {s:"11:05",e:"12:20",c:"Chem 11"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"13:35",c:"Prep"}, {s:"13:35",e:"14:55",c:"Bio 11"}],
    4: [{s:"08:00",e:"09:20",c:"Science 7"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Chem 10"}, {s:"11:05",e:"11:45",c:"Prep"}, {s:"11:45",e:"12:20",c:"Science 9"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"14:15",c:"Chem 11"}, {s:"14:15",e:"14:55",c:"Prep"}],
    5: [{s:"08:00",e:"09:20",c:"Science 8"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Bio 10"}, {s:"11:05",e:"12:20",c:"Science 9"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"13:35",c:"Science 7"}, {s:"13:35",e:"14:15",c:"Prep"}, {s:"14:15",e:"14:55",c:"Science 8"}]
};

// 2. DATA FOR PRINTABLE TABLE (Visual Logic)
const tableRows = [
    { id: 1, time: "8:00 - 8:40", mon: "vacant", tue: "g8", wed: "g11", thu: "g7", fri: "g8", lbls: ["PREP", "Science 8", "Econ 11", "Science 7", "Science 8"] },
    { id: 2, time: "8:40 - 9:20", mon: "g8", tue: "g8", wed: "g11", thu: "g7", fri: "g8", lbls: ["Science 8", "Science 8", "Econ 11", "Science 7", "Science 8"] },
    { type: "break", label: "RECESS (9:20 - 9:45)" },
    { id: 3, time: "9:45 - 10:25", mon: "g9", tue: "g9", wed: "g7", thu: "g10", fri: "g10", lbls: ["Science 9", "Science 9", "Science 7", "Chem 10", "Bio 10"] },
    { id: 4, time: "10:25 - 11:05", mon: "g9", tue: "g9", wed: "g7", thu: "g10", fri: "g10", lbls: ["Science 9", "Science 9", "Science 7", "Chem 10", "Bio 10"] },
    { id: 5, time: "11:05 - 11:45", mon: "vacant", tue: "g10", wed: "g11", thu: "vacant", fri: "g9", lbls: ["PREP", "Bio 10", "Chem 11", "PREP", "Science 9"] },
    { id: 6, time: "11:45 - 12:20", mon: "g7", tue: "g10", wed: "g11", thu: "g9", fri: "g9", lbls: ["Science 7", "Bio 10", "Chem 11", "Science 9", "Science 9"] },
    { type: "break", label: "LUNCH (12:20 - 12:55)" },
    { id: 8, time: "12:55 - 1:35", mon: "vacant", tue: "g11", wed: "vacant", thu: "g11", fri: "g7", lbls: ["PREP", "Bio 11", "PREP", "Chem 11", "Science 7"] },
    { id: 9, time: "1:35 - 2:15", mon: "g10", tue: "g11", wed: "g11", thu: "g11", fri: "vacant", lbls: ["Chem 10", "Bio 11", "Bio 11", "Chem 11", "PREP"] },
    { id: 10, time: "2:15 - 2:55", mon: "g10", tue: "vacant", wed: "g11", thu: "vacant", fri: "g8", lbls: ["Chem 10", "PREP", "Bio 11", "PREP", "Science 8"] }
];
// 6. CURRICULUM DATA
const courses = [
    { grade: "7th", topic: "Planetary Science", color: "bg-green-500", desc: "Space, Earth Systems, Maps", portal: "7th-portal.html", slides: "7th-slides.html" },
    { grade: "8th", topic: "Electronics", color: "bg-blue-500", desc: "Circuits, Arduino, Logic", portal: "8th-portal.html", slides: ["8th-slides.html", "8th-week2.html"], weekNames: ["Week 3.1", "Week 3.2"] },
    { grade: "9th", topic: "Chemistry", color: "bg-purple-500", desc: "Matter, Atoms, Reactions", portal: "9th-portal.html", slides: "9th-slides.html" },
    { grade: "10th", topic: "Biology", color: "bg-yellow-500", desc: "Cells, Genetics, Energy", portal: "10thbio-portal.html", slides: "10thbio-slides.html" },
    { grade: "Universal", topic: "Protocol", color: "bg-white/20", desc: "Design Thinking", special: "dthink.html" },
    { grade: "10th", topic: "Chemistry", color: "bg-yellow-500", desc: "Bonds, Stoichiometry", portal: "10thchem-portal.html", slides: "10thchem-slides.html" },
    { grade: "11th", topic: "Biology", color: "bg-red-500", desc: "Evolution, Systems", portal: "11thbio-portal.html", slides: ["11thbio-slides.html", "11thbio-week2.html"], weekNames: ["Week 3.1", "Week 3.2"] },
    { grade: "11th", topic: "Economics", color: "bg-red-500", desc: "Banking, Finance", portal: "11thecon-portal.html", slides: "11thecon-slides.html" },
    { grade: "11th", topic: "Chemistry", color: "bg-red-500", desc: "Organic, Solutions", portal: "11thchem-portal.html", slides: ["11thchem-slides.html", "11thchem-week2.html"], extra: "moles.html", weekNames: ["Wk 3.1", "Wk 3.2"] }
];

// 7. CURRICULUM GENERATOR
function renderCurriculum() {
    const grid = document.getElementById('curriculum-grid');
    if (!grid) return;

    grid.innerHTML = courses.map(c => {
        // Special logic for the Design Thinking card
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
                        <div class="admin-only hidden mt-4">
                            <a href="${c.special}" class="block w-full py-2 bg-[#f9db66] text-black rounded text-xs font-bold">Open Tool</a>
                        </div>
                    </div>
                </div>`;
        }

        // Standard Grade Cards
        return `
            <div class="hub-card bg-white rounded-2xl p-0 overflow-hidden flex flex-col">
                <div class="${c.grade === '9th' || c.grade === '11th' && c.topic === 'Chemistry' ? 'bg-[#ac2e55]' : 'bg-slate-800'} p-3 flex justify-between items-center text-white">
                    <span class="sketch text-xl ${c.grade === '9th' || (c.grade === '11th' && c.topic === 'Chemistry') ? 'text-[#f9db66]' : ''}">${c.grade} Grade</span>
                    <span class="${c.color} text-[9px] px-2 py-1 rounded font-bold uppercase text-black ${c.color === 'bg-purple-500' || c.color === 'bg-red-500' ? 'text-white' : ''}">${c.topic}</span>
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

// 3. TABLE RENDERER
function renderScheduleTable() {
    const table = document.getElementById('main-schedule-table');
    if (!table) return;

    let html = `
        <thead>
            <tr>
                <th class="w-12">#</th>
                <th class="w-24">Time</th>
                <th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th>
            </tr>
        </thead>
        <tbody>`;

    tableRows.forEach(row => {
        if (row.type === 'break') {
            html += `<tr class="break"><td colspan="7">${row.label}</td></tr>`;
        } else {
            html += `
                <tr>
                    <td>${row.id}</td>
                    <td>${row.time}</td>
                    <td class="${row.mon}"><span class="sub-name">${row.lbls[0]}</span></td>
                    <td class="${row.tue}"><span class="sub-name">${row.lbls[1]}</span></td>
                    <td class="${row.wed}"><span class="sub-name">${row.lbls[2]}</span></td>
                    <td class="${row.thu}"><span class="sub-name">${row.lbls[3]}</span></td>
                    <td class="${row.fri}"><span class="sub-name">${row.lbls[4]}</span></td>
                </tr>`;
        }
    });

    html += `</tbody>`;
    table.innerHTML = html;
}

// 4. CLOCK & STATUS ENGINE
function getHondurasTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * -6));
}

function updateLiveStatus() {
    const now = getHondurasTime();
    let day = now.getDay();
    const timeVal = now.getHours() * 60 + now.getMinutes();

    const clockEl = document.getElementById('live-clock');
    const nowEl = document.getElementById('status-now');
    const nextEl = document.getElementById('status-next');

    if (clockEl) clockEl.innerText = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', weekday:'long'});

    if (day === 0 || day === 6 || (day === 5 && timeVal > 900)) { 
        if (nowEl) nowEl.innerText = "Weekend Mode";
        if (nextEl) nextEl.innerText = "Next: Mon 8:00 AM - Prep / Science 8";
        return;
    }

    const todaySched = schedule[day];
    let currentBlock = null;
    let nextBlock = null;

    if (todaySched) {
        for (let i = 0; i < todaySched.length; i++) {
            const block = todaySched[i];
            const startMin = parseInt(block.s.split(':')[0])*60 + parseInt(block.s.split(':')[1]);
            const endMin = parseInt(block.e.split(':')[0])*60 + parseInt(block.e.split(':')[1]);
            if (timeVal >= startMin && timeVal < endMin) {
                currentBlock = block;
                nextBlock = todaySched[i+1] || null;
                break;
            }
            if (timeVal < startMin) {
                nextBlock = block;
                break;
            }
        }
    }

    if (currentBlock && nowEl && nextEl) {
        nowEl.innerText = currentBlock.c;
        nowEl.style.color = currentBlock.t === 'b' ? '#f9db66' : 'white';
        nextEl.innerText = nextBlock ? `Next: ${nextBlock.s} - ${nextBlock.c}` : "End of Day";
    }
}

// 5. INITIALIZATION
window.onload = function() {
    // Show the page
    document.documentElement.classList.add('loaded');
    
    // Build the UI
    renderCurriculum(); // <--- Add this
    renderScheduleTable();
    
    // Start the clock
    updateLiveStatus();
    setInterval(updateLiveStatus, 1000);
    
    // Run security check from scripts.js
    if (typeof checkAuth === "function") {
        checkAuth();
    }
};
