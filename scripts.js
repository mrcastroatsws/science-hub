// --- ADMIN GATEKEEPER LOGIC ---
const TEACHER_CODE = "SWS2026"; // Change this to your secret code



function checkAuth() {
    const isAuthorized = localStorage.getItem("sws_admin_auth");
    const adminSections = document.querySelectorAll('.admin-only');
    const publicSections = document.querySelectorAll('.public-only');

    if (isAuthorized === "true") {
        adminSections.forEach(el => el.classList.remove('hidden'));
        publicSections.forEach(el => el.classList.add('hidden'));
    } else {
        adminSections.forEach(el => el.classList.add('hidden'));
        publicSections.forEach(el => el.classList.remove('hidden'));
    }
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
    location.reload(); // Refresh to lock everything
}

// Ensure script tab is only readable by Admin
function switchView(viewName) {
    if (viewName === 'script' && localStorage.getItem("sws_admin_auth") !== "true") {
        alert("Teacher Login Required for Annotated Scripts.");
        return;
    }
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById('view-' + viewName).classList.add('active');
    // We update the active state of the button
}

// --- TIMER LOGIC ---
let timerInterval;

function startTimer(duration, displayId) {
    clearInterval(timerInterval); // Stop any existing timer
    let timer = duration, minutes, seconds;
    const display = document.getElementById(displayId);

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
    document.getElementById(displayId).textContent = "05:00";
    document.getElementById(displayId).classList.remove("text-red-500", "animate-pulse");
}

// Run auth check on every page load
window.onload = checkAuth;