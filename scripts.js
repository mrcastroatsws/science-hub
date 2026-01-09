const ADMIN_HASH = "b039d915442f9dfdb34316d5528b33534a70cb6da52523277c15437877209772";

const AUTH_KEY = "sws_layout_config_v2"; 
const AUTH_VAL = "active_user_mode";

function checkAuth() {
    const currentSession = localStorage.getItem(AUTH_KEY);
    const adminSections = document.querySelectorAll('.admin-only');
    const publicSections = document.querySelectorAll('.public-only');

    if (currentSession === AUTH_VAL) {
        adminSections.forEach(el => el.classList.remove('hidden'));
        publicSections.forEach(el => el.classList.add('hidden'));
    } else {
        adminSections.forEach(el => el.classList.add('hidden'));
        publicSections.forEach(el => el.classList.remove('hidden'));
    }
}

async function login() {
    const input = prompt("Enter Teacher Access Code:");
    
    if (!input) return;

    // Hash the input and compare it to the stored hash
    const hash = await sha256(input);

    if (hash === ADMIN_HASH) {
        localStorage.setItem(AUTH_KEY, AUTH_VAL);
        checkAuth();
        alert("Access Granted. Welcome, Mr. Castro.");
        location.reload(); // Refresh to update UI state immediately
    } else {
        alert("Access Denied.");
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    alert("Session Closed.");
    location.reload();
}

// --- HELPER: HASHING FUNCTION ---
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// --- NAVIGATION & VIEW LOGIC ---
function switchView(viewName, btn) {
    // 1. Security Check for Teacher Script using the obscured key
    if (viewName === 'script' && localStorage.getItem(AUTH_KEY) !== AUTH_VAL) {
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

// Run auth check as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', checkAuth);
