// --- ADMIN GATEKEEPER LOGIC ---
const TEACHER_CODE = "SWS2026"; 

function checkAuth() {
    const isAuthorized = localStorage.getItem("sws_admin_auth");
    const adminSections = document.querySelectorAll('.admin-only');
    const publicSections = document.querySelectorAll('.public-only');

    adminSections.forEach(el => {
        if (isAuthorized === "true") el.classList.remove('hidden');
        else el.classList.add('hidden');
    });

    publicSections.forEach(el => {
        if (isAuthorized === "true") el.classList.add('hidden');
        else el.classList.remove('hidden');
    });
}

function login() {
    const code = prompt("Enter Teacher Access Code:");
    if (code === TEACHER_CODE) {
        localStorage.setItem("sws_admin_auth", "true");
        checkAuth();
        alert("Access Granted, Mr. Castro.");
    } else {
        alert("Incorrect code.");
    }
}

function logout() {
    localStorage.removeItem("sws_admin_auth");
    location.reload();
}

// --- NAVIGATION & VIEW LOGIC ---
// This version works for both the Hub tabs and general navigation
function switchView(viewName, btn) {
    // 1. Security Check for Teacher Script
    if (viewName === 'script' && localStorage.getItem("sws_admin_auth") !== "true") {
        alert("Teacher Login Required for Annotated Scripts.");
        return;
    }

    // 2. Switch the Content Views
    const views = document.querySelectorAll('.view');
    if (views.length > 0) {
        views.forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById('view-' + viewName);
        if (targetView) targetView.classList.add('active');
    }
    
    // 3. Update the Button/Tab styling
    const tabs = document.querySelectorAll('.tab-btn');
    if (tabs.length > 0 && btn) {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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

function resetTimer(displayId) {
    clearInterval(timerInterval);
    const display = document.getElementById(displayId);
    if (display) {
        display.textContent = "05:00";
        display.classList.remove("text-red-500", "animate-pulse");
    }
}

// Run auth check as soon as the DOM is ready (Better than window.onload)
document.addEventListener('DOMContentLoaded', checkAuth);