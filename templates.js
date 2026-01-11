// templates.js - UI Component Storage
const Templates = {
    // 1. Course Card HTML
    courseCard: (c) => {
        const isSpecial = c.grade === '9th' || (c.grade === '11th' && c.topic === 'Chemistry');
        const headerClass = isSpecial ? 'bg-[#ac2e55]' : 'bg-slate-800';
        const titleColor = isSpecial ? 'text-[#f9db66]' : 'text-white';

        return `
        <div class="hub-card bg-white rounded-2xl p-0 overflow-hidden flex flex-col cursor-pointer active:scale-95 transition-transform shadow-sm" 
             onclick="Logic.openCourseModal('${c.grade}', '${c.topic}')">
            <div class="${headerClass} p-3 flex justify-between items-center text-white">
                <span class="sketch text-xl ${titleColor}">${c.grade} ${c.grade === "Universal" ? "" : "Grade"}</span>
                <span class="${c.color} text-[9px] px-2 py-1 rounded font-bold uppercase text-white tracking-widest">${c.topic}</span>
            </div>
            <div class="p-5 flex-grow">
                <h3 class="font-bold text-slate-700 text-lg">${c.topic}</h3>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">${c.desc}</p>
                <div class="mt-4 flex items-center text-[#ac2e55] font-bold text-[10px] uppercase tracking-widest">
                    Open Resources <span class="ml-2">→</span>
                </div>
            </div>
        </div>`;
    },

    // 2. Utility Cards
    utilityCards: () => `
        <a href="safety.html" class="hub-card bg-red-50 border-red-100 p-6 rounded-2xl flex items-center gap-4">
            <div><h3 class="font-bold text-red-900 text-lg">Safety and Rules</h3><p class="text-xs text-red-700">Safety protocols and lab expectations</p></div>
        </a>
        <a href="science-fair.html" class="hub-card bg-teal-50 border-teal-100 p-6 rounded-2xl flex items-center gap-4">
            <div><h3 class="font-bold text-teal-900 text-lg">Science Fair</h3><p class="text-xs text-teal-700">Progress tracking and rubric details</p></div>
        </a>`,

    // 3. Inject Modals into DOM (Run once on load)
    injectModals: () => {
        const layer = document.getElementById('modal-layer');
        if(!layer) return;
        layer.innerHTML = `
        <div id="course-modal" class="fixed inset-0 z-[160] hidden flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onclick="Templates.closeModal('course-modal')"></div>
            <div class="relative bg-white w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-fade-in">
                <div id="modal-header" class="p-6 text-white flex justify-between items-center bg-slate-800">
                    <div><span id="modal-grade" class="sketch text-xl uppercase tracking-widest"></span><h2 id="modal-title" class="text-3xl font-bold uppercase tracking-tight"></h2></div>
                    <button onclick="Templates.closeModal('course-modal')" class="bg-white/20 hover:bg-white/30 rounded-full p-2 transition text-white">✕</button>
                </div>
                <div class="p-8 space-y-6 overflow-auto max-h-[70vh]">
                    <p id="modal-desc" class="text-slate-600 text-lg italic border-l-4 border-slate-200 pl-4"></p>
                    <div class="grid grid-cols-1 gap-4">
                        <a id="modal-portal-link" href="#" class="flex items-center justify-between p-5 border-2 border-slate-100 rounded-2xl hover:border-[#ac2e55] hover:bg-red-50 transition group">
                            <div><span class="block font-bold text-slate-800 uppercase text-xs">Quarter Plan Portal</span><span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Unit maps & Grading</span></div>
                            <span class="text-[#ac2e55] font-bold">OPEN →</span>
                        </a>
                        <div id="modal-slides-container" class="space-y-3 pt-4"></div>
                    </div>
                </div>
            </div>
        </div>

        <div id="login-modal" class="fixed inset-0 z-[200] hidden flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onclick="Templates.toggleLogin()"></div>
            <div class="relative w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 animate-fade-in">
                <div class="bg-[#ac2e55] p-8 text-center border-b-4 border-[#f9db66]">
                    <h2 class="sketch text-4xl text-white font-bold m-0 uppercase tracking-tight">Teacher Access</h2>
                </div>
                <div class="p-8 space-y-6">
                    <div><label class="block text-slate-400 text-[10px] font-black uppercase mb-2 tracking-widest">Master Passcode</label>
                    <input type="password" id="admin-passcode" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xl tracking-[0.5em]" placeholder="••••••"></div>
                    <div id="login-error" class="hidden text-center text-red-500 text-xs font-bold animate-pulse">Invalid Code</div>
                    <button onclick="handleLoginSubmit()" class="w-full bg-[#29c4a9] hover:bg-teal-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-lg">Enter Portal</button>
                    <button onclick="Templates.toggleLogin()" class="w-full text-slate-400 text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                </div>
            </div>
        </div>

        <div id="schedule-modal" class="fixed inset-0 z-[120] hidden flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onclick="Templates.toggleScheduleModal()"></div>
            <div class="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
                <div class="p-6 border-b flex justify-between items-center bg-slate-50">
                    <h2 class="sketch text-2xl text-slate-800 uppercase tracking-widest">Full Schedule</h2>
                    <button onclick="Templates.toggleScheduleModal()" class="text-slate-400 hover:text-slate-600 text-xl p-2">✕</button>
                </div>
                <div id="modal-schedule-container" class="p-4 overflow-auto bg-slate-50 flex-grow"></div>
                <div class="p-4 bg-white border-t text-center">
                    <button onclick="window.print()" class="text-[10px] text-slate-400 uppercase font-bold hover:text-[#ac2e55]">Print Master 5-Day Grid</button>
                </div>
            </div>
        </div>`;
    },

    // 4. Modal Helpers
    closeModal: (id) => document.getElementById(id).classList.add('hidden'),
    toggleLogin: () => document.getElementById('login-modal').classList.toggle('hidden'),
    toggleScheduleModal: () => {
        const m = document.getElementById('schedule-modal');
        m.classList.toggle('hidden');
        if(!m.classList.contains('hidden')) Logic.renderScheduleTable('modal-schedule-container');
    }
};
