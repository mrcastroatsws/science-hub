// dashboard.js - Specific logic for the Master Dashboard

const schedule = {
    1: [{s:"08:00",e:"08:40",c:"Prep/Vacant"}, {s:"08:40",e:"09:20",c:"Science 8 (Electronics)"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Science 9"}, {s:"11:05",e:"11:45",c:"Prep"}, {s:"11:45",e:"12:20",c:"Science 7"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"13:35",c:"Prep"}, {s:"13:35",e:"14:55",c:"Chem 10"}],
    2: [{s:"08:00",e:"09:20",c:"Science 8"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Science 9"}, {s:"11:05",e:"12:20",c:"Bio 10"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"14:15",c:"Bio 11"}, {s:"14:15",e:"14:55",c:"Prep"}],
    3: [{s:"08:00",e:"09:20",c:"Econ 11"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Science 7"}, {s:"11:05",e:"12:20",c:"Chem 11"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"13:35",c:"Prep"}, {s:"13:35",e:"14:55",c:"Bio 11"}],
    4: [{s:"08:00",e:"09:20",c:"Science 7"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Chem 10"}, {s:"11:05",e:"11:45",c:"Prep"}, {s:"11:45",e:"12:20",c:"Science 9"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"14:15",c:"Chem 11"}, {s:"14:15",e:"14:55",c:"Prep"}],
    5: [{s:"08:00",e:"09:20",c:"Science 8"}, {s:"09:20",e:"09:45",c:"RECESS",t:"b"}, {s:"09:45",e:"11:05",c:"Bio 10"}, {s:"11:05",e:"12:20",c:"Science 9"}, {s:"12:20",e:"12:55",c:"LUNCH",t:"b"}, {s:"12:55",e:"13:35",c:"Science 7"}, {s:"13:35",e:"14:15",c:"Prep"}, {s:"14:15",e:"14:55",c:"Science 8"}]
};

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
    let currentClass = null;
    let nextClass = null;

    if (todaySched) {
        for (let i = 0; i < todaySched.length; i++) {
            const block = todaySched[i];
            const startMin = parseInt(block.s.split(':')[0])*60 + parseInt(block.s.split(':')[1]);
            const endMin = parseInt(block.e.split(':')[0])*60 + parseInt(block.e.split(':')[1]);
            if (timeVal >= startMin && timeVal < endMin) {
                currentClass = block;
                nextClass = todaySched[i+1] || null;
                break;
            }
            if (timeVal < startMin) {
                nextClass = block;
                break;
            }
        }
    }

    if (currentClass && nowEl && nextEl) {
        nowEl.innerText = currentClass.c;
        nowEl.style.color = currentClass.t === 'b' ? '#f9db66' : 'white';
        nextEl.innerText = nextClass ? `Next: ${nextClass.s} - ${nextClass.c}` : "End of Day";
    }
}

window.onload = function() {
    document.documentElement.classList.add('loaded');
}

// Start the dashboard loops
setInterval(updateLiveStatus, 1000);
updateLiveStatus();
