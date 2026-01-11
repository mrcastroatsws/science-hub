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
    renderScheduleTable();
    
    // Start the clock
    updateLiveStatus();
    setInterval(updateLiveStatus, 1000);
    
    // Run security check from scripts.js
    if (typeof checkAuth === "function") {
        checkAuth();
    }
};
