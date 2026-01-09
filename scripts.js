const ADMIN_TOKEN = "U1dTMjAyNg=="; 

const STORAGE_KEY = "sws_config_cache_v4"; 

function checkAuth() {
    // 1. Get the value from the browser
    const userSession = localStorage.getItem(STORAGE_KEY);
    const isAuthorized = (userSession === ADMIN_TOKEN);

    // 3. UI Toggle
    const adminSections = document.querySelectorAll('.admin-only');
    const publicSections = document.querySelectorAll('.public-only');
    const teacherBtns = document.querySelectorAll('.btn-teacher');

    if (isAuthorized) {
        // User is Legit
        adminSections.forEach(el => el.classList.remove('hidden'));
        publicSections.forEach(el => el.classList.add('hidden'));
        teacherBtns.forEach(el => el.style.display = 'block');
    } else {
        // User is NOT Legit (or tried to hack with "true")
        adminSections.forEach(el => el.classList.add('hidden'));
        publicSections.forEach(el => el.classList.remove('hidden'));
        teacherBtns.forEach(el => el.style.display = 'none');
    }
}

function login() {
    const input = prompt("Enter Teacher Access Code:");
    
    if (!input) return;

    // Encode what the user typed to see if it matches the token
    const encodedInput = btoa(input);

    if (encodedInput === ADMIN_TOKEN) {
        // SUCCESS: We store the TOKEN, not "true"
        localStorage.setItem(STORAGE_KEY, ADMIN_TOKEN);
        checkAuth();
        alert("Access Granted. Welcome, Mr. Castro.");
        location.reload(); 
    } else {
        alert("Access Denied.");
    }
}

function logout() {
    localStorage.removeItem(STORAGE_KEY);
    alert("Session Closed.");
    location.reload();
}

// --- NAVIGATION & VIEW LOGIC ---
function switchView(viewName, btn) {
    // Security Check using the Token, not "true"
    if (viewName === 'script' && localStorage.getItem(STORAGE_KEY) !== ADMIN_TOKEN) {
        alert("Teacher Login Required for Annotated Scripts.");
        return;
    }
    // ... (Your existing navigation logic here if you have specific view switching) ...
}

// --- SLIDE DECK LOGIC (Shared) ---
function toggleTeacherMode() {
    // Security Check
    if (localStorage.getItem(STORAGE_KEY) !== ADMIN_TOKEN) {
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
