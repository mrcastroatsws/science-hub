const CHALLENGE = "AAAAByMjDQYFEgcTIx0ADgQc"; 
const STORAGE_KEY = "sws_session_cipher_v5";

function processCipher(text, key) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
}

function reverseCipher(encodedText, key) {
    try {
        const text = atob(encodedText);
        let result = "";
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    } catch (e) {
        return "";
    }
}

function checkAuth() {
    const candidateKey = localStorage.getItem(STORAGE_KEY);
    if (!candidateKey) {
        setAdminState(false);
        return;
    }
    const decryptedMessage = reverseCipher(CHALLENGE, candidateKey);
    
    if (decryptedMessage === "SWS-SECURE-SESSION") {
        setAdminState(true);
    } else {
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

    // Test the input immediately against the Challenge
    const attempt = reverseCipher(CHALLENGE, input);

    if (attempt === "SWS-SECURE-SESSION") {
        localStorage.setItem(STORAGE_KEY, input);
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

// --- NAVIGATION & UTILS ---
function switchView(viewName, btn) {
    const key = localStorage.getItem(STORAGE_KEY);
    if (viewName === 'script' && reverseCipher(CHALLENGE, key || "") !== "SWS-SECURE-SESSION") {
        alert("Teacher Login Required.");
        return;
    }
}

function toggleTeacherMode() {
    const key = localStorage.getItem(STORAGE_KEY);
    if (reverseCipher(CHALLENGE, key || "") !== "SWS-SECURE-SESSION") {
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
            display.classList.add("text-red-500", "animate-pulse");
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', checkAuth);
