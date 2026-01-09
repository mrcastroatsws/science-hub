const LOCK_VALUE = "U1dTMjAyNl9TV1NfU0VDVVJF"; 
const SALT = "_SWS_SECURE";

const STORAGE_KEY = "sws_layout_config_v2";

function checkAuth() {
    const candidate = localStorage.getItem(STORAGE_KEY);

    if (!candidate) {
        setAdminState(false);
        return;
    }

    try {
        const rawPassword = atob(candidate);
        
        const salted = rawPassword + SALT;
        const check = btoa(salted);

        if (check === LOCK_VALUE) {
            setAdminState(true);
        } else {
            setAdminState(false);
        }
    } catch (e) {
        setAdminState(false);
    }
}

function setAdminState(isAdmin) {
    const adminSections = document.querySelectorAll('.admin-only');
    const publicSections = document.querySelectorAll('.public-only');
    const teacherBtns = document.querySelectorAll('.btn-teacher');

    if (isAdmin) {
        adminSections.forEach(el => el.classList.remove('hidden'));
        publicSections.forEach(el => el.classList.add('hidden'));
        teacherBtns.forEach(el => el.style.display = 'block');
    } else {
        adminSections.forEach(el => el.classList.add('hidden'));
        publicSections.forEach(el => el.classList.remove('hidden'));
        teacherBtns.forEach(el => el.style.display = 'none');
    }
}

function login() {
    const input = prompt("Enter Teacher Access Code:");
    if (!input) return;

    const testSalted = input + SALT;
    const testCheck = btoa(testSalted);

    if (testCheck === LOCK_VALUE) {
        localStorage.setItem(STORAGE_KEY, btoa(input));
        alert("Access Granted. Welcome, Mr. Castro.");
        location.reload();
    } else {
        alert("Access Denied.");
        localStorage.removeItem(STORAGE_KEY);
    }
}

function logout() {
    localStorage.removeItem(STORAGE_KEY);
    alert("Session Closed.");
    location.reload();
}

function switchView(viewName, btn) {
    const candidate = localStorage.getItem(STORAGE_KEY);
    // Double check auth before showing sensitive views
    if (viewName === 'script') {
        if (!candidate || btoa(atob(candidate) + SALT) !== LOCK_VALUE) {
            alert("Teacher Login Required.");
            return;
        }
    }
}

function toggleTeacherMode() {
    const candidate = localStorage.getItem(STORAGE_KEY);
    // Secure Check
    if (!candidate || btoa(atob(candidate) + SALT) !== LOCK_VALUE) {
        alert("Login Required");
        return;
    }
    
    document.body.classList.toggle('teacher-mode');
    const btn = document.getElementById('teacher-toggle');
    if(btn) {
        btn.classList.toggle('active');
        btn.textContent = document.body.classList.contains('teacher-mode') ? "Teacher Mode: ON" : "Teacher Mode";
    }
}

// --- TIMER LOGIC ---
let timerInterval;
function startTimer(duration, displayId) {
    const display = document.getElementById(displayId);
    if (!display) return;
    clearInterval(timerInterval);
    let timer = duration, minutes, seconds;
    timerInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        display.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        if (--timer < 0) {
            clearInterval(timerInterval);
            display.textContent = "DONE";
            display.classList.add("text-red-500", "animate-pulse");
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', checkAuth);
