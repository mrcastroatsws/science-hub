const ADMIN_TOKEN = "U1dTMjAyNg=="; 

const AUTH_KEY = "sws_layout_config_v2"; 
const AUTH_VAL = "active_user_mode";

// --- ADMIN GATEKEEPER LOGIC ---
function checkAuth() {
    const currentSession = localStorage.getItem(AUTH_KEY);
    const adminSections = document.querySelectorAll('.admin-only');
    const publicSections = document.querySelectorAll('.public-only');
    const teacherBtns = document.querySelectorAll('.btn-teacher');

    if (currentSession === AUTH_VAL) {
        // User is Logged In
        adminSections.forEach(el => el.classList.remove('hidden'));
        publicSections.forEach(el => el.classList.add('hidden'));
        // If we are on a slide deck, show the Teacher Mode button
        teacherBtns.forEach(el => el.style.display = 'block');
    } else {
        // User is Logged Out
        adminSections.forEach(el => el.classList.add('hidden'));
        publicSections.forEach(el => el.classList.remove('hidden'));
        // Hide Teacher Mode button on slides if not logged in
        teacherBtns.forEach(el => el.style.display = 'none');
    }
}

function login() {
    const input = prompt("Enter Teacher Access Code:");
    
    if (!input) return;

    // Simple obfuscation (Base64) that works offline/locally
    // This turns "SWS2026" into "U1dTMjAyNg=="
    const encoded = btoa(input);

    if (encoded === ADMIN_TOKEN) {
        localStorage.setItem(AUTH_KEY, AUTH_VAL);
        checkAuth();
        alert("Access Granted. Welcome, Mr. Castro.");
        location.reload(); 
    } else {
        alert("Access Denied.");
        console.log("Debug Info:", encoded); // Check console if you can't login
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    alert("Session Closed.");
    location.reload();
}

// --- NAVIGATION & VIEW LOGIC ---
function switchView(viewName, btn) {
    if (viewName === 'script' && localStorage.getItem(AUTH_KEY) !== AUTH_VAL) {
        alert("Teacher Login Required for Annotated Scripts.");
        return;
    }
    // ... existing navigation logic if needed ...
}

// --- SLIDE DECK LOGIC (Shared) ---
// This handles the Teacher Mode toggle inside the slide files
function toggleTeacherMode() {
    if (localStorage.getItem(AUTH_KEY) !== AUTH_VAL) {
        alert("Teacher Login Required.");
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
            display.style.color = "var(--sws-maroon)";
        }
    }, 1000);
}

// Run auth check as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', checkAuth);
