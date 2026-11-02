// KUROGRAM - Créé par Hazraael
const SYMBOLS = ['1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G'];
const SAVE_KEY = 'kurogram_hazraael_v7';
const MAX_LIVES = 4;

const PGM_BONUS_REWARDS = {
    10: 10, 11: 13, 12: 16, 13: 20, 14: 24, 15: 28, 16: 32
};

const MODES = [
    { id: 0, name: "Mode 0 : Règles", reqWins: 0, desc: "Apprendre les 3 règles d'or pas à pas (2 étapes)" },
    { id: 1, name: "Mode 1 : Apprentissage", reqWins: 0, desc: "Grilles 3x3 & 4x4 avec assistant (Sans chrono)" },
    { id: 2, name: "Mode 2 : Débutant", reqWins: 0, desc: "Grilles 4x4, chrono, bonus actifs, murs gravés" },
    { id: 3, name: "Mode 3 : Difficile", reqWins: 15, desc: "Grilles 5x5, 4 vies, erreurs pénalisées" },
    { id: 4, name: "Mode 4 : Expert", reqWins: 30, desc: "Grilles 5x5 à 9x9, murs opaques, 2 pubs vie max", sizes: [5, 6, 7, 8, 9] },
    { id: 5, name: "Mode 5 : Mode Dieu", reqWins: 50, desc: "Grilles 5x5 à 9x9, bonus 35% échec, vies dégressives", sizes: [5, 6, 7, 8, 9] },
    { id: 6, name: "Mode 6 : 🤩 PGM", reqWins: 999, desc: "Grilles 10x10 à 16x16 Hexa (10 à 32 bonus par victoire !)", sizes: [10, 11, 12, 13, 14, 15, 16] }
];

const THEMES = [
    { id: 'theme-paper', name: "Carnet & Crayon", cond: "Débloqué par défaut", icons: ['🔨','🪶','✏️'], names: ['Tampon','Plume','Crayon'] },
    { id: 'theme-stone', name: "Plateau & Pierre", cond: "3 jours consécutifs ou 5 victoires sans bonus", icons: ['🔨','⛏️','🔍'], names: ['Marteau','Burin','Craie'] },
    { id: 'theme-slate', name: "Nuit d'Ardoise & Or", cond: "10 victoires sans erreur ou 7 jours consécutifs", icons: ['⚡','⚜️','🔭'], names: ['Sceau','Plume d\'Or','Astrolabe'] }
];

// --- NOTIFICATIONS IN-PAGE ---
function showToast(htmlMsg, type = 'info', duration = 4200) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${htmlMsg}</span>
        <button class="toast-close" title="Fermer">✕</button>
    `;
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, duration);
    }
}

// --- CONFIRMATION IN-PAGE ---
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('modal-confirm');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').innerHTML = message;
    modal.classList.remove('hidden');

    document.getElementById('btn-confirm-yes').onclick = () => {
        modal.classList.add('hidden');
        onConfirm();
    };
    document.getElementById('btn-confirm-no').onclick = () => {
        modal.classList.add('hidden');
    };
}

function createEmptyStatBucket() {
    return {
        gamesStarted: 0,
        gamesWon: 0,
        timedGamesWon: 0,
        gamesAbandoned: 0,
        gamesLost: 0,
        livesUsed: 0,
        flawlessWins: 0,
        noBonusWinsTotal: 0,
        withBonusWinsTotal: 0,
        totalErrors: 0,
        totalBonusesUsed: 0,
        bestTime: null,
        worstTime: null,
        totalWinTime: 0
    };
}

function getDefaultStats() {
    return { global: createEmptyStatBucket(), bySize: {} };
}

function getStatBucketForSize(sz) {
    if (!state.stats.bySize) state.stats.bySize = {};
    if (!state.stats.bySize[sz]) state.stats.bySize[sz] = createEmptyStatBucket();
    return state.stats.bySize[sz];
}

function getDefaultState() {
    return {
        mode: 0,
        tutorialStep: 0,
        hasSeenIntroRules: false,
        size: 3,
        customSizes: { 4: 6, 5: 6, 6: 10 },
        solutionNumbers: [],
        solutionWalls: [],
        rowClues: [],
        colClues: [],
        playerNumbers: [],
        playerWalls: [],
        playerNotes: [],
        selected: { r: 0, c: 0 },
        tool: 'num',
        lives: MAX_LIVES,
        revivesUsedThisGrid: 0,
        usedVerifyThisGrid: false,
        hasMadeMoveThisGrid: false,
        bonuses: { b1: 3, b2: 2, b3: 3 },
        usedBonusThisGrid: false,
        errorsThisGrid: 0,
        elapsedSeconds: 0,
        noBonusWins: 0,
        flawlessStreak: 0,
        perfect9x9Count: 0,
        devUnlocked: false,
        allUnlockedTest: false,
        debugVisible: false,
        showEngraved: true,
        theme: 'theme-paper',
        streak: 1,
        lastLogin: null,
        isDaily: false,
        stats: getDefaultStats(),
        savedGridsByKey: {}
    };
}

let state = getDefaultState();
let timerInterval = null;
let adCountdownInterval = null;
let currentRuleSlide = 0;

function hashSecret(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    return '0x' + h.toString(16);
}

// --- CARROUSEL VISUEL DES 3 RÈGLES (SWIPE + FLÈCHES + POINTS + SOURIS) ---
function openRulesModal(slideIndex = 0, showStartTutoBtn = false) {
    setRuleSlide(slideIndex);
    document.getElementById('btn-rules-start-tuto').classList.toggle('hidden', !showStartTutoBtn);
    document.getElementById('modal-rules').classList.remove('hidden');
}

function setRuleSlide(idx) {
    const slides = document.querySelectorAll('.rule-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    currentRuleSlide = (idx + slides.length) % slides.length;

    slides.forEach((s, i) => s.classList.toggle('hidden', i !== currentRuleSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentRuleSlide));
}

document.getElementById('btn-help').addEventListener('click', () => {
    openRulesModal(0, state.mode !== 0 || state.isDaily);
});

document.getElementById('rule-prev').addEventListener('click', () => setRuleSlide(currentRuleSlide - 1));
document.getElementById('rule-next').addEventListener('click', () => setRuleSlide(currentRuleSlide + 1));

document.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => setRuleSlide(parseInt(dot.dataset.dot, 10)));
});

document.getElementById('btn-close-rules').addEventListener('click', () => {
    state.hasSeenIntroRules = true;
    saveProgress();
    document.getElementById('modal-rules').classList.add('hidden');
});

document.getElementById('btn-rules-start-tuto').addEventListener('click', () => {
    state.hasSeenIntroRules = true;
    saveCurrentGridSnapshot();
    state.isDaily = false;
    state.mode = 0;
    state.tutorialStep = 0;
    saveProgress();
    document.getElementById('modal-rules').classList.add('hidden');
    generatePuzzle(true);
});

// Support du glissement au doigt (Touch Swipe) et à la souris (Mouse Drag) sur le carrousel
(function initCarouselSwipe() {
    const carousel = document.getElementById('rules-carousel');
    let startX = null;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const diff = e.changedTouches[0].screenX - startX;
        if (Math.abs(diff) > 40) {
            setRuleSlide(diff < 0 ? currentRuleSlide + 1 : currentRuleSlide - 1);
        }
        startX = null;
    }, { passive: true });

    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
    });

    carousel.addEventListener('mouseup', (e) => {
        if (startX === null) return;
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 40) {
            setRuleSlide(diff < 0 ? currentRuleSlide + 1 : currentRuleSlide - 1);
        }
        startX = null;
    });
})();

// --- SYSTÈME DE PUBLICITÉ RÉCOMPENSÉE ---
function requestRewardedAd({ title, description, onReward }) {
    const modal = document.getElementById('modal-ad');
    const titleEl = document.getElementById('ad-modal-title');
    const descEl = document.getElementById('ad-modal-desc');
    const videoBox = document.getElementById('ad-video-box');
    const buttonsBox = document.getElementById('ad-modal-buttons');
    const countdownText = document.getElementById('ad-countdown-text');
    const watchBtn = document.getElementById('btn-watch-ad');
    const cancelBtn = document.getElementById('btn-cancel-ad');

    titleEl.textContent = title;
    descEl.innerHTML = description;
    videoBox.classList.add('hidden');
    buttonsBox.classList.remove('hidden');
    modal.classList.remove('hidden');

    watchBtn.onclick = () => {
        buttonsBox.classList.add('hidden');
        videoBox.classList.remove('hidden');
        let remaining = 3;
        countdownText.textContent = `Publicité vidéo en cours... ${remaining}s`;

        if (adCountdownInterval) clearInterval(adCountdownInterval);
        adCountdownInterval = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                countdownText.textContent = `Publicité vidéo en cours... ${remaining}s`;
            } else {
                clearInterval(adCountdownInterval);
                modal.classList.add('hidden');
                onReward();
            }
        }, 1000);
    };

    cancelBtn.onclick = () => {
        if (adCountdownInterval) clearInterval(adCountdownInterval);
        modal.classList.add('hidden');
    };
}

// --- CHRONOMÈTRE ---
function isTimedMode() {
    return state.isDaily || state.mode >= 2;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    const timerEl = document.getElementById('timer-label');

    if (!isTimedMode()) {
        timerEl.classList.add('hidden');
        return;
    }

    timerEl.classList.remove('hidden');
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        const modalOpen = Array.from(document.querySelectorAll('.modal')).some(m => !m.classList.contains('hidden'));
        if (!modalOpen && isTimedMode()) {
            state.elapsedSeconds++;
            updateTimerDisplay();
            if (state.elapsedSeconds % 5 === 0) saveCurrentGridSnapshot();
        }
    }, 1000);
}

function formatTime(sec) {
    if (sec === null || sec === undefined) return "--:--";
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function updateTimerDisplay() {
    document.getElementById('timer-label').textContent = `⏱️ ${formatTime(state.elapsedSeconds)}`;
}

// --- SAUVEGARDE & SYNCHRONISATION ---
function getTargetSizeForCurrentMode() {
    if (state.isDaily) return 5;
    if (state.mode === 0) return 3;
    if (state.mode === 1) return ((state.stats.global.gamesWon || 0) % 2 === 1) ? 4 : 3;
    if (state.mode === 2) return 4;
    if (state.mode === 3) return 5;
    if (state.mode >= 4 && state.mode <= 6) {
        const fallback = state.mode === 6 ? 10 : 6;
        let sz = state.customSizes?.[state.mode] || fallback;
        if (state.mode === 6 && sz < 10) sz = 10;
        return sz;
    }
    return 4;
}

function getGridKey() {
    if (state.isDaily) {
        const todayStr = new Date().toISOString().slice(0, 10);
        return `daily_${todayStr}`;
    }
    if (state.mode === 0) {
        return `mode_0_step_${state.tutorialStep}`;
    }
    const sz = getTargetSizeForCurrentMode();
    return `mode_${state.mode}_size_${sz}`;
}

function saveCurrentGridSnapshot() {
    if (!state.solutionNumbers || state.solutionNumbers.length === 0) return;
    const key = getGridKey();
    state.savedGridsByKey[key] = {
        size: state.size,
        tutorialStep: state.tutorialStep,
        solutionNumbers: state.solutionNumbers,
        solutionWalls: state.solutionWalls,
        rowClues: state.rowClues,
        colClues: state.colClues,
        playerNumbers: state.playerNumbers,
        playerWalls: state.playerWalls,
        playerNotes: state.playerNotes.map(row => row.map(set => Array.from(set))),
        elapsedSeconds: state.elapsedSeconds,
        lives: state.lives,
        revivesUsedThisGrid: state.revivesUsedThisGrid,
        usedVerifyThisGrid: state.usedVerifyThisGrid,
        hasMadeMoveThisGrid: state.hasMadeMoveThisGrid,
        usedBonusThisGrid: state.usedBonusThisGrid,
        errorsThisGrid: state.errorsThisGrid
    };
    saveProgress();
    const ind = document.getElementById('save-indicator');
    if (ind) ind.textContent = "💾 Sauvegardé";
}

function restoreGridSnapshotIfAvailable(key) {
    const snap = state.savedGridsByKey[key];
    if (!snap) return false;
    state.size = snap.size;
    state.tutorialStep = snap.tutorialStep ?? state.tutorialStep;
    state.solutionNumbers = snap.solutionNumbers;
    state.solutionWalls = snap.solutionWalls;
    state.rowClues = snap.rowClues;
    state.colClues = snap.colClues;
    state.playerNumbers = snap.playerNumbers;
    state.playerWalls = snap.playerWalls;
    state.playerNotes = snap.playerNotes.map(row => row.map(arr => new Set(arr)));
    state.elapsedSeconds = snap.elapsedSeconds || 0;
    state.lives = snap.lives ?? MAX_LIVES;
    state.revivesUsedThisGrid = snap.revivesUsedThisGrid || 0;
    state.usedVerifyThisGrid = snap.usedVerifyThisGrid || false;
    state.hasMadeMoveThisGrid = snap.hasMadeMoveThisGrid || false;
    state.usedBonusThisGrid = snap.usedBonusThisGrid || false;
    state.errorsThisGrid = snap.errorsThisGrid || 0;
    state.selected = { r: 0, c: 0 };
    renderAll();
    startTimer();
    return true;
}

function loadProgress() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
            if (!state.stats || !state.stats.global) state.stats = getDefaultStats();
            if (!state.customSizes) state.customSizes = { 4: 6, 5: 6, 6: 10 };
            if (state.customSizes[6] < 10) state.customSizes[6] = 10;
        } catch (e) {
            state = getDefaultState();
        }
    }
    updateDailyStreak();
    applyTheme(state.theme);
}

function saveProgress() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
        mode: state.mode,
        tutorialStep: state.tutorialStep,
        hasSeenIntroRules: state.hasSeenIntroRules,
        customSizes: state.customSizes,
        bonuses: state.bonuses,
        noBonusWins: state.noBonusWins,
        flawlessStreak: state.flawlessStreak,
        perfect9x9Count: state.perfect9x9Count,
        devUnlocked: state.devUnlocked,
        allUnlockedTest: state.allUnlockedTest,
        debugVisible: state.debugVisible,
        showEngraved: state.showEngraved,
        theme: state.theme,
        streak: state.streak,
        lastLogin: state.lastLogin,
        isDaily: state.isDaily,
        stats: state.stats,
        savedGridsByKey: state.savedGridsByKey
    }));
}

window.addEventListener('storage', (e) => {
    if (e.key === SAVE_KEY && e.newValue) {
        loadProgress();
        restoreGridSnapshotIfAvailable(getGridKey());
    }
});

function updateDailyStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastLogin !== today) {
        if (state.lastLogin) {
            const diff = (new Date(today) - new Date(state.lastLogin)) / (1000 * 3600 * 24);
            state.streak = (diff === 1) ? state.streak + 1 : 1;
        }
        state.lastLogin = today;
        saveProgress();
    }
    document.getElementById('streak-badge').textContent = `🔥 ${state.streak}j`;
}

let currentSeed = Date.now();
function seededRandom() {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
}

// --- GÉNÉRATION D'UNE GRILLE ---
function generatePuzzle(forceNew = false) {
    const key = getGridKey();
    if (!forceNew && restoreGridSnapshotIfAvailable(key)) {
        // Si c'est le tout premier démarrage en Mode 0, afficher automatiquement les 3 règles visuelles
        if (!state.isDaily && state.mode === 0 && !state.hasSeenIntroRules) {
            openRulesModal(0, false);
        }
        return;
    }

    state.usedBonusThisGrid = false;
    state.errorsThisGrid = 0;
    state.lives = MAX_LIVES;
    state.revivesUsedThisGrid = 0;
    state.usedVerifyThisGrid = false;
    state.hasMadeMoveThisGrid = false;
    state.elapsedSeconds = 0;

    if (!state.isDaily && state.mode === 0) {
        setupRuleTutorialStep(state.tutorialStep);
        recordGameStarted(3);
        saveCurrentGridSnapshot();
        startTimer();
        if (!state.hasSeenIntroRules) {
            openRulesModal(0, false);
        }
        return;
    }

    state.size = getTargetSizeForCurrentMode();
    recordGameStarted(state.size);

    if (state.isDaily) {
        const todayNum = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
        currentSeed = todayNum * 7919;
    } else {
        currentSeed = Date.now() + state.stats.global.gamesStarted * 997 + state.size * 31;
    }

    const N = state.size;
    state.solutionNumbers = Array.from({ length: N }, (_, r) =>
        Array.from({ length: N }, (_, c) => ((r + c) % N) + 1)
    );

    for (let i = N - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [state.solutionNumbers[i], state.solutionNumbers[j]] = [state.solutionNumbers[j], state.solutionNumbers[i]];
    }
    for (let c1 = N - 1; c1 > 0; c1--) {
        const c2 = Math.floor(seededRandom() * (c1 + 1));
        for (let r = 0; r < N; r++) {
            [state.solutionNumbers[r][c1], state.solutionNumbers[r][c2]] = [state.solutionNumbers[r][c2], state.solutionNumbers[r][c1]];
        }
    }

    state.solutionWalls = Array.from({ length: N }, () => Array(N).fill(false));
    const wallCount = Math.max(2, Math.floor(N * N * 0.28));
    let placed = 0;
    while (placed < wallCount) {
        const r = Math.floor(seededRandom() * N);
        const c = Math.floor(seededRandom() * N);
        if (!state.solutionWalls[r][c]) {
            state.solutionWalls[r][c] = true;
            placed++;
        }
    }

    computeAllTargetClues();
    initEmptyPlayerGrid(N, N);
    saveCurrentGridSnapshot();
    renderAll();
    startTimer();
}

function recordGameStarted(sz) {
    state.stats.global.gamesStarted++;
    getStatBucketForSize(sz).gamesStarted++;
}

function recordGameAbandoned(sz) {
    state.stats.global.gamesAbandoned = (state.stats.global.gamesAbandoned || 0) + 1;
    const b = getStatBucketForSize(sz);
    b.gamesAbandoned = (b.gamesAbandoned || 0) + 1;
}

function computeAllTargetClues() {
    const N = state.size;
    state.rowClues = [];
    state.colClues = [];
    for (let r = 0; r < N; r++) {
        state.rowClues.push(computeLineClues(state.solutionNumbers[r], state.solutionWalls[r]));
    }
    for (let c = 0; c < N; c++) {
        const colNums = state.solutionNumbers.map(row => row[c]);
        const colWalls = state.solutionWalls.map(row => row[c]);
        state.colClues.push(computeLineClues(colNums, colWalls));
    }
}

function setupRuleTutorialStep(step) {
    state.size = 3;
    if (step === 0) {
        state.solutionNumbers = [[1, 2, 3], [2, 3, 1], [3, 1, 2]];
        state.solutionWalls = [[false, true, false], [false, false, false], [false, false, false]];
        computeAllTargetClues();
        initEmptyPlayerGrid(3, 3);
        for (let r = 1; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                state.playerNumbers[r][c] = state.solutionNumbers[r][c];
            }
        }
    } else {
        state.solutionNumbers = [[1, 3, 2], [3, 2, 1], [2, 1, 3]];
        state.solutionWalls = [[false, true, false], [false, false, true], [true, false, false]];
        computeAllTargetClues();
        initEmptyPlayerGrid(3, 3);
    }
    renderAll();
}

function initEmptyPlayerGrid(rows, cols) {
    state.playerNumbers = Array.from({ length: rows }, () => Array(cols).fill(0));
    state.playerWalls = Array.from({ length: rows }, () => Array(cols).fill(false));
    state.playerNotes = Array.from({ length: rows }, () => Array.from({ length: cols }, () => new Set()));
    state.selected = { r: 0, c: 0 };
}

// --- CALCUL DES INDICES & VALIDATION ---
function computeLineClues(numbers, walls) {
    let clues = [];
    let currentSum = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (!walls[i]) {
            currentSum += numbers[i];
        } else if (currentSum > 0) {
            clues.push(currentSum);
            currentSum = 0;
        }
    }
    if (currentSum > 0) clues.push(currentSum);
    return clues.length > 0 ? clues : [0];
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

function isLineFullyAndCorrectlySolved(isRow, index) {
    const N = state.size;
    const nums = [];
    const walls = [];
    const seenWhiteNumbers = new Set();

    for (let i = 0; i < N; i++) {
        const r = isRow ? index : i;
        const c = isRow ? i : index;
        const isW = state.playerWalls[r][c];
        const val = state.playerNumbers[r][c];

        if (!isW) {
            if (val < 1 || val > N) return false;
            if (seenWhiteNumbers.has(val)) return false;
            seenWhiteNumbers.add(val);
        } else {
            if (val >= 1 && val <= N) {
                if (seenWhiteNumbers.has(val)) return false;
                seenWhiteNumbers.add(val);
            }
        }
        walls.push(isW);
        nums.push(val);
    }

    const playerClues = computeLineClues(nums, walls);
    const targetClues = isRow ? state.rowClues[index] : state.colClues[index];
    return arraysEqual(playerClues, targetClues);
}

// --- RENDU DU PLATEAU 2.5D ---
function renderAll() {
    const N = state.size;
    const container = document.getElementById('grid-container');
    container.innerHTML = '';

    const isCompact = N >= 10;
    container.classList.toggle('compact-grid', isCompact);

    const tilePx = N <= 4 ? 50 : (N === 5 ? 44 : (N <= 9 ? 36 : 28));
    container.style.gridTemplateColumns = `max-content repeat(${N}, ${tilePx}px)`;
    container.style.gridTemplateRows = `max-content repeat(${N}, ${tilePx}px)`;

    const corner = document.createElement('div');
    corner.className = 'corner-cell';
    container.appendChild(corner);

    for (let c = 0; c < N; c++) {
        const clues = state.colClues[c] || [0];
        const clueDiv = document.createElement('div');
        clueDiv.className = 'clue-cell col-clue' + (isLineFullyAndCorrectlySolved(false, c) ? ' valid-clue' : '');
        clueDiv.style.fontSize = isCompact ? '0.68rem' : '0.76rem';
        clueDiv.innerHTML = clues.map(v => `<span>${v}</span>`).join('');
        container.appendChild(clueDiv);
    }

    const hideEngraved = (!state.isDaily && state.mode >= 4) || !state.showEngraved;

    for (let r = 0; r < N; r++) {
        const clues = state.rowClues[r] || [0];
        const rowClueDiv = document.createElement('div');
        rowClueDiv.className = 'clue-cell row-clue' + (isLineFullyAndCorrectlySolved(true, r) ? ' valid-clue' : '');
        rowClueDiv.style.fontSize = isCompact ? '0.68rem' : '0.76rem';
        rowClueDiv.textContent = clues.join(' - ');
        container.appendChild(rowClueDiv);

        for (let c = 0; c < N; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.style.width = `${tilePx}px`;
            tile.style.height = `${tilePx}px`;
            tile.style.fontSize = isCompact ? '0.82rem' : '1.2rem';
            tile.dataset.r = r;
            tile.dataset.c = c;

            if (state.selected.r === r && state.selected.c === c) tile.classList.add('selected');
            const isWall = state.playerWalls[r][c];
            if (isWall) {
                tile.classList.add('wall');
                if (hideEngraved) tile.classList.add('hide-engraved');
            }

            const val = state.playerNumbers[r][c];
            if (val > 0) {
                const span = document.createElement('span');
                span.className = 'tile-value';
                span.textContent = SYMBOLS[val - 1];
                tile.appendChild(span);

                if (isWall) {
                    const lockBadge = document.createElement('span');
                    lockBadge.className = 'wall-lock-badge';
                    lockBadge.textContent = '🔒';
                    lockBadge.title = "Chiffre masqué sous le mur : compte pour le Sudoku (unicité), mais vaut 0 dans la somme !";
                    tile.appendChild(lockBadge);
                }
            } else if (!isWall && state.playerNotes[r][c].size > 0) {
                const notesDiv = document.createElement('div');
                notesDiv.className = 'notes-grid';
                Array.from(state.playerNotes[r][c]).sort((a,b) => a - b).slice(0, 9).forEach(n => {
                    const s = document.createElement('span');
                    s.textContent = SYMBOLS[n - 1];
                    notesDiv.appendChild(s);
                });
                tile.appendChild(notesDiv);
            }

            tile.addEventListener('click', () => {
                state.selected = { r, c };
                renderAll();
            });
            container.appendChild(tile);
        }
    }

    renderNumpad();
    updateUIStatus();
    updateGuideBanner();
}

function renderNumpad() {
    const numpad = document.getElementById('numpad');
    numpad.innerHTML = '';
    numpad.classList.toggle('hexa-pad', state.size > 9);

    for (let i = 1; i <= state.size; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        if (i >= 10) {
            btn.innerHTML = `<span>${SYMBOLS[i - 1]}</span><span class="num-sub">${i}</span>`;
            btn.title = `${SYMBOLS[i - 1]} = ${i}`;
        } else {
            btn.textContent = SYMBOLS[i - 1];
        }
        btn.addEventListener('click', () => handleNumberInput(i));
        numpad.appendChild(btn);
    }

    const eraseBtn = document.createElement('button');
    eraseBtn.className = 'num-btn';
    eraseBtn.textContent = '⌫';
    eraseBtn.title = "Effacer la case sélectionnée (Suppr)";
    eraseBtn.addEventListener('click', () => handleErase());
    numpad.appendChild(eraseBtn);
}

function updateUIStatus() {
    const modeObj = MODES.find(m => m.id === state.mode) || MODES[0];
    if (state.isDaily) {
        document.getElementById('mode-label').textContent = "📅 Défi du Jour (5x5)";
    } else if (state.mode === 0) {
        document.getElementById('mode-label').textContent = `Mode 0 : Règles (Étape ${state.tutorialStep + 1}/2)`;
    } else {
        document.getElementById('mode-label').textContent = `${modeObj.name} (${state.size}x${state.size})`;
    }
    document.getElementById('btn-daily').classList.toggle('active-daily', state.isDaily);

    const sizeSelect = document.getElementById('size-selector');
    if (!state.isDaily && modeObj.sizes) {
        sizeSelect.classList.remove('hidden');
        sizeSelect.innerHTML = modeObj.sizes.map(sz =>
            `<option value="${sz}" ${state.size === sz ? 'selected' : ''}>${sz}x${sz}</option>`
        ).join('');
    } else {
        sizeSelect.classList.add('hidden');
    }

    const livesEl = document.getElementById('lives-container');
    if (!state.isDaily && state.mode >= 3 && state.mode <= 5) {
        livesEl.classList.remove('hidden');
        livesEl.textContent = '❤️'.repeat(Math.max(0, state.lives)) + '🖤'.repeat(Math.max(0, MAX_LIVES - state.lives));
    } else {
        livesEl.classList.add('hidden');
    }

    const bonusBar = document.getElementById('bonus-bar');
    bonusBar.classList.toggle('hidden', !state.isDaily && state.mode <= 1);

    ['b1', 'b2', 'b3'].forEach(k => {
        const el = document.getElementById(`count-${k}`);
        el.textContent = state.bonuses[k];
        el.classList.toggle('empty-count', state.bonuses[k] <= 0);
    });
}

document.getElementById('size-selector').addEventListener('change', (e) => {
    saveCurrentGridSnapshot();
    const newSize = parseInt(e.target.value, 10);
    state.customSizes[state.mode] = newSize;
    saveProgress();
    generatePuzzle(false);
});

// Guide pas-à-pas clarifié sur le double rôle du Mur (0 dans la somme, mais compte pour le Sudoku)
function updateGuideBanner() {
    const banner = document.getElementById('guide-banner');
    const text = document.getElementById('guide-text');
    if (state.isDaily || state.mode > 1) {
        banner.classList.add('hidden');
        return;
    }
    banner.classList.remove('hidden');

    if (state.mode === 0 && state.tutorialStep === 0) {
        if (state.playerWalls[0][1]) {
            text.innerHTML = "<strong>Étape 1/2 :</strong> Super ! Le <b>Mur ⬛</b> au milieu cache le chiffre <b><i>2</i> 🔒</b> : ce <b>2</b> ne compte <u>pas</u> dans la somme <b>1 - 3</b>, mais il est déjà pris pour le Sudoku ! Il ne te reste plus qu'à poser <b>1</b> à gauche et <b>3</b> à droite.";
        } else {
            text.innerHTML = "<strong>Étape 1/2 :</strong> Regarde la 1re ligne : l'indice est <b>1 - 3</b> (deux blocs séparés par un Mur). Touche la 1re case et pose <b>1</b>. Touche la case du milieu et clique sur <b>⬛ Mur</b>. Touche la 3e case et pose <b>3</b> ! <i>(Besoin d'exemples ? Clique sur <b>?</b> en haut)</i>.";
        }
        return;
    }

    if (state.mode === 0 && state.tutorialStep === 1) {
        text.innerHTML = "<strong>Étape 2/2 (Grille 3x3) :</strong> Chaque ligne/colonne doit contenir <b>1, 2 et 3</b>. Rappel : le chiffre <b>🔒</b> caché sous un <b>Mur ⬛</b> ne s'additionne <u>pas</u> dans les sommes des bords, mais il compte pour le Sudoku (unicité) !";
        return;
    }

    const N = state.size;
    const maxSum = (N * (N + 1)) / 2;
    for (let r = 0; r < N; r++) {
        if (isLineFullyAndCorrectlySolved(true, r)) continue;
        const clues = state.rowClues[r];
        if (clues.length === 1 && clues[0] === maxSum) {
            text.innerHTML = `💡 <b>Astuce :</b> La ligne ${r + 1} a une somme de <b>${maxSum}</b> (1+2+...=${maxSum}) : elle ne contient donc <b>aucun mur</b> !`;
            return;
        }
        if (clues.length > 1) {
            text.innerHTML = `💡 <b>Astuce :</b> Ligne ${r + 1} (<b>${clues.join(' - ')}</b>) : place un <b>⬛ Mur</b> entre ces sommes. Le chiffre caché sous le mur ne compte pas dans la somme, mais compte pour le Sudoku !`;
            return;
        }
    }
    text.innerHTML = `💡 <b>Astuce :</b> Chaque chiffre de 1 à ${N} est unique par ligne et par colonne, même s'il est caché sous un Mur ⬛ !`;
}

// --- ACTIONS JOUEUR ---
function applyWallOnSelectedTile() {
    const { r, c } = state.selected;
    state.hasMadeMoveThisGrid = true;
    const wasRowSolved = isLineFullyAndCorrectlySolved(true, r);
    const wasColSolved = isLineFullyAndCorrectlySolved(false, c);

    if (!state.playerWalls[r][c] && !state.isDaily && state.mode >= 3 && state.mode <= 5 && !state.solutionWalls[r][c]) {
        penalizeError("Ce n'est pas un mur !");
        return;
    }

    state.playerWalls[r][c] = !state.playerWalls[r][c];
    if (state.playerWalls[r][c]) {
        if (state.showEngraved && (state.isDaily || state.mode <= 3)) {
            state.playerNumbers[r][c] = state.solutionNumbers[r][c];
        } else {
            state.playerNumbers[r][c] = 0;
        }
    } else {
        state.playerNumbers[r][c] = 0;
    }

    saveCurrentGridSnapshot();
    renderAll();
    checkLineWaveAndVictory(r, c, wasRowSolved, wasColSolved);
}

document.getElementById('action-wall').addEventListener('click', () => applyWallOnSelectedTile());

function handleNumberInput(num) {
    if (num < 1 || num > state.size) return;
    const { r, c } = state.selected;
    state.hasMadeMoveThisGrid = true;
    const wasRowSolved = isLineFullyAndCorrectlySolved(true, r);
    const wasColSolved = isLineFullyAndCorrectlySolved(false, c);

    if (state.tool === 'note') {
        if (state.playerNotes[r][c].has(num)) state.playerNotes[r][c].delete(num);
        else state.playerNotes[r][c].add(num);
        saveCurrentGridSnapshot();
        renderAll();
        return;
    }

    if (!state.isDaily && state.mode >= 3 && state.mode <= 5) {
        if (state.solutionWalls[r][c]) {
            penalizeError("Cette case est un mur !");
            return;
        }
        for (let k = 0; k < state.size; k++) {
            if ((k !== c && !state.playerWalls[r][k] && state.playerNumbers[r][k] === num) ||
                (k !== r && !state.playerWalls[k][c] && state.playerNumbers[k][c] === num)) {
                penalizeError("Chiffre déjà présent sur la ligne ou colonne !");
                return;
            }
        }
    }

    state.playerWalls[r][c] = false;
    state.playerNumbers[r][c] = num;
    state.playerNotes[r][c].clear();
    saveCurrentGridSnapshot();
    renderAll();
    checkLineWaveAndVictory(r, c, wasRowSolved, wasColSolved);
}

function handleErase() {
    const { r, c } = state.selected;
    state.playerNumbers[r][c] = 0;
    state.playerWalls[r][c] = false;
    state.playerNotes[r][c].clear();
    saveCurrentGridSnapshot();
    renderAll();
}

document.getElementById('btn-verify').addEventListener('click', () => {
    state.usedVerifyThisGrid = true;
    saveCurrentGridSnapshot();

    const N = state.size;
    const errorCoords = [];
    let remainingCells = 0;

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const isCompleteCell = state.playerWalls[r][c] || state.playerNumbers[r][c] > 0;
            if (!isCompleteCell) remainingCells++;

            if (state.playerWalls[r][c] && !state.solutionWalls[r][c]) {
                errorCoords.push({ r, c });
            } else if (!state.playerWalls[r][c] && state.playerNumbers[r][c] > 0) {
                if (state.solutionWalls[r][c]) {
                    errorCoords.push({ r, c });
                } else {
                    const val = state.playerNumbers[r][c];
                    for (let k = 0; k < N; k++) {
                        if (k !== c && state.playerNumbers[r][k] === val && (!state.playerWalls[r][k] || state.showEngraved)) {
                            errorCoords.push({ r, c });
                        }
                        if (k !== r && state.playerNumbers[k][c] === val && (!state.playerWalls[k][c] || state.showEngraved)) {
                            errorCoords.push({ r, c });
                        }
                    }
                }
            }
        }
    }

    if (errorCoords.length > 0) {
        errorCoords.forEach(({ r, c }) => {
            const tile = document.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
            if (tile) {
                tile.classList.remove('error-highlight');
                void tile.offsetWidth;
                tile.classList.add('error-highlight');
            }
        });
        showToast(`⚠️ ${errorCoords.length} case(s) comporte(nt) une erreur (en rouge).`, 'error');
    } else if (remainingCells > 0) {
        showToast(`✔️ Aucune erreur dans tes saisies actuelles ! (Il reste <b>${remainingCells} case(s)</b> à compléter).`, 'success');
    } else {
        showToast(`✔️ Aucune contradiction détectée ! Vérifie que les sommes des blocs correspondent aux indices.`, 'info');
    }
});

function penalizeError(msg) {
    state.errorsThisGrid++;
    state.lives--;

    const b = getStatBucketForSize(state.size);
    state.stats.global.totalErrors++;
    state.stats.global.livesUsed = (state.stats.global.livesUsed || 0) + 1;
    b.totalErrors++;
    b.livesUsed = (b.livesUsed || 0) + 1;

    const wrapper = document.getElementById('board-wrapper');
    wrapper.classList.remove('shake');
    void wrapper.offsetWidth;
    wrapper.classList.add('shake');
    saveCurrentGridSnapshot();
    updateUIStatus();

    if (state.lives <= 0) {
        state.stats.global.gamesLost++;
        b.gamesLost++;
        saveProgress();
        showEndModal(false, msg + " Tu n'as plus de vies.");
    } else {
        showToast(`💔 ${msg} (${state.lives} vie(s) restante(s))`, 'error', 2800);
    }
}

// --- VAGUE D'ANIMATION & VICTOIRE ---
function checkLineWaveAndVictory(r, c, wasRowSolved, wasColSolved) {
    const nowRowSolved = isLineFullyAndCorrectlySolved(true, r);
    const nowColSolved = isLineFullyAndCorrectlySolved(false, c);

    if (!wasRowSolved && nowRowSolved) triggerWave(true, r);
    if (!wasColSolved && nowColSolved) triggerWave(false, c);

    for (let i = 0; i < state.size; i++) {
        if (!isLineFullyAndCorrectlySolved(true, i) || !isLineFullyAndCorrectlySolved(false, i)) return;
    }

    if (!state.isDaily && state.mode === 0 && state.tutorialStep === 0) {
        delete state.savedGridsByKey[getGridKey()];
        state.tutorialStep = 1;
        saveProgress();
        setTimeout(() => {
            showEndModal(true, "Étape 1/2 réussie ! Passons maintenant à l'Étape 2/2 sur une grille 3x3 complète.", true);
        }, 450);
        return;
    }

    setTimeout(() => onGridVictory(), 450);
}

function triggerWave(isRow, index) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(t => {
        const tr = parseInt(t.dataset.r);
        const tc = parseInt(t.dataset.c);
        if ((isRow && tr === index) || (!isRow && tc === index)) {
            const delay = (isRow ? tc : tr) * 40;
            setTimeout(() => t.classList.add('wave-anim'), delay);
        }
    });
}

// --- LES 3 BONUS ---
function promptAdForEmptyBonus(bonusKey, bonusLabel) {
    requestRewardedAd({
        title: `Oh non ! Plus de ${bonusLabel} !`,
        description: `Vous n'avez plus de <b>${bonusLabel}</b>.<br><br>Regardez une courte publicité pour obtenir <b>3 bonus aléatoires</b> (dont au moins <b>1 ${bonusLabel} garanti</b>) !`,
        onReward: () => {
            const keys = ['b1', 'b2', 'b3'];
            const gained = { b1: 0, b2: 0, b3: 0 };
            state.bonuses[bonusKey]++;
            gained[bonusKey]++;
            for (let i = 0; i < 2; i++) {
                const rk = keys[Math.floor(Math.random() * keys.length)];
                state.bonuses[rk]++;
                gained[rk]++;
            }
            saveProgress();
            updateUIStatus();
            const tObj = THEMES.find(t => t.id === state.theme) || THEMES[0];
            showToast(`🎁 Récompense : +${gained.b1} ${tObj.names[0]}, +${gained.b2} ${tObj.names[1]}, +${gained.b3} ${tObj.names[2]} !`, 'success');
        }
    });
}

function recordBonusUsed() {
    state.usedBonusThisGrid = true;
    state.stats.global.totalBonusesUsed++;
    getStatBucketForSize(state.size).totalBonusesUsed++;
}

function checkGodModeFizzle() {
    if (!state.isDaily && state.mode === 5 && Math.random() < 0.35) {
        showToast("⚡ Mode Dieu : Ton bonus s'est brisé sous la pression divine !", 'warn');
        updateUIStatus();
        return true;
    }
    return false;
}

document.getElementById('bonus-hammer').addEventListener('click', () => {
    const tObj = THEMES.find(t => t.id === state.theme) || THEMES[0];
    if (state.bonuses.b1 <= 0) {
        promptAdForEmptyBonus('b1', tObj.names[0]);
        return;
    }
    const unrevealedWalls = [];
    for (let r = 0; r < state.size; r++) {
        for (let c = 0; c < state.size; c++) {
            if (state.solutionWalls[r][c] && !state.playerWalls[r][c]) {
                unrevealedWalls.push({ r, c });
            }
        }
    }
    if (unrevealedWalls.length === 0) {
        showToast("Tous les murs sont déjà découverts !", 'info');
        return;
    }

    state.bonuses.b1--;
    recordBonusUsed();
    if (checkGodModeFizzle()) return;

    const pick = unrevealedWalls[Math.floor(Math.random() * unrevealedWalls.length)];
    const wrapper = document.getElementById('board-wrapper');
    wrapper.classList.remove('shake');
    void wrapper.offsetWidth;
    wrapper.classList.add('shake');

    state.playerWalls[pick.r][pick.c] = true;
    if (state.showEngraved && (state.isDaily || state.mode <= 3)) {
        state.playerNumbers[pick.r][pick.c] = state.solutionNumbers[pick.r][pick.c];
    } else {
        state.playerNumbers[pick.r][pick.c] = 0;
    }
    saveCurrentGridSnapshot();
    renderAll();
    highlightTiles([pick]);
    checkLineWaveAndVictory(pick.r, pick.c, false, false);
});

document.getElementById('bonus-quill').addEventListener('click', () => {
    const tObj = THEMES.find(t => t.id === state.theme) || THEMES[0];
    if (state.bonuses.b2 <= 0) {
        promptAdForEmptyBonus('b2', tObj.names[1]);
        return;
    }
    let bestCell = null;
    let bestScore = -1;

    for (let r = 0; r < state.size; r++) {
        for (let c = 0; c < state.size; c++) {
            const isSolved = (state.playerWalls[r][c] === state.solutionWalls[r][c]) &&
                             (state.solutionWalls[r][c] || state.playerNumbers[r][c] === state.solutionNumbers[r][c]);
            if (!isSolved) {
                let progress = 0;
                for (let k = 0; k < state.size; k++) {
                    if (state.playerNumbers[r][k] > 0 || state.playerWalls[r][k]) progress += 2;
                    if (state.playerNumbers[k][c] > 0 || state.playerWalls[k][c]) progress += 2;
                }
                const score = progress + state.solutionNumbers[r][c];
                if (score > bestScore) {
                    bestScore = score;
                    bestCell = { r, c };
                }
            }
        }
    }
    if (!bestCell) return;

    state.bonuses.b2--;
    recordBonusUsed();
    if (checkGodModeFizzle()) return;

    const { r, c } = bestCell;
    state.playerWalls[r][c] = state.solutionWalls[r][c];
    state.playerNumbers[r][c] = state.solutionNumbers[r][c];
    state.playerNotes[r][c].clear();
    saveCurrentGridSnapshot();
    renderAll();
    highlightTiles([bestCell]);
    checkLineWaveAndVictory(r, c, false, false);
});

document.getElementById('bonus-pencil').addEventListener('click', () => {
    const tObj = THEMES.find(t => t.id === state.theme) || THEMES[0];
    if (state.bonuses.b3 <= 0) {
        promptAdForEmptyBonus('b3', tObj.names[2]);
        return;
    }
    const candidatesPool = [];
    for (let r = 0; r < state.size; r++) {
        for (let c = 0; c < state.size; c++) {
            const isSolved = (state.playerWalls[r][c] === state.solutionWalls[r][c]) &&
                             (state.solutionWalls[r][c] || state.playerNumbers[r][c] === state.solutionNumbers[r][c]);
            if (!isSolved && !state.playerWalls[r][c]) candidatesPool.push({ r, c });
        }
    }
    if (candidatesPool.length === 0) return;

    state.bonuses.b3--;
    recordBonusUsed();
    if (checkGodModeFizzle()) return;

    candidatesPool.sort(() => Math.random() - 0.5);
    const chosen = candidatesPool.slice(0, Math.min(3, candidatesPool.length));

    chosen.forEach(({ r, c }) => {
        state.playerNotes[r][c].clear();
        const trueVal = state.solutionNumbers[r][c];
        state.playerNotes[r][c].add(trueVal);

        for (let n = 1; n <= state.size; n++) {
            if (state.playerNotes[r][c].size >= 3) break;
            let used = false;
            for (let k = 0; k < state.size; k++) {
                if (!state.playerWalls[r][k] && state.playerNumbers[r][k] === n) used = true;
                if (!state.playerWalls[k][c] && state.playerNumbers[k][c] === n) used = true;
            }
            if (!used && n !== trueVal && Math.random() < 0.5) {
                state.playerNotes[r][c].add(n);
            }
        }
    });

    saveCurrentGridSnapshot();
    renderAll();
    highlightTiles(chosen);
});

function highlightTiles(coordsList) {
    coordsList.forEach(({ r, c }) => {
        const tile = document.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
        if (tile) tile.classList.add('bonus-highlight');
    });
}

// --- VICTOIRE & STATISTIQUES ---
function applyVictoryStatsToBucket(bucket, timed, elapsed) {
    bucket.gamesWon++;
    if (timed) {
        bucket.timedGamesWon = (bucket.timedGamesWon || 0) + 1;
        bucket.totalWinTime += elapsed;
        if (bucket.bestTime === null || elapsed < bucket.bestTime) bucket.bestTime = elapsed;
        if (bucket.worstTime === null || elapsed > bucket.worstTime) bucket.worstTime = elapsed;
    }
    if (!state.usedBonusThisGrid) {
        bucket.noBonusWinsTotal++;
    } else {
        bucket.withBonusWinsTotal = (bucket.withBonusWinsTotal || 0) + 1;
    }
    if (state.errorsThisGrid === 0) {
        bucket.flawlessWins++;
    }
}

function onGridVictory() {
    delete state.savedGridsByKey[getGridKey()];

    const timed = isTimedMode();
    const t = state.elapsedSeconds;
    applyVictoryStatsToBucket(state.stats.global, timed, t);
    applyVictoryStatsToBucket(getStatBucketForSize(state.size), timed, t);

    if (!state.usedBonusThisGrid) state.noBonusWins++;
    if (state.errorsThisGrid === 0) state.flawlessStreak++;
    else state.flawlessStreak = 0;

    if (state.size === 9 && !state.usedBonusThisGrid && state.errorsThisGrid === 0) {
        state.perfect9x9Count++;
        if (state.perfect9x9Count >= 5) state.devUnlocked = true;
    }

    let pgmRewardText = "";
    if (!state.isDaily && state.mode === 6) {
        if (!state.usedVerifyThisGrid) {
            const count = PGM_BONUS_REWARDS[state.size] || 10;
            const keys = ['b1', 'b2', 'b3'];
            for (let i = 0; i < count; i++) {
                const rk = keys[Math.floor(Math.random() * keys.length)];
                state.bonuses[rk]++;
            }
            pgmRewardText = ` — 🤩 Jackpot PGM : +${count} bonus aléatoires gagnés !`;
        } else {
            pgmRewardText = ` — (Bouton Vérifier utilisé : pas de jackpot de bonus PGM)`;
        }
    }

    const wasTutorial = (!state.isDaily && state.mode === 0);
    if (wasTutorial) {
        state.mode = 1;
        state.tutorialStep = 0;
    }
    saveProgress();
    updateUIStatus();

    const msg = timed
        ? `Temps : ${formatTime(state.elapsedSeconds)} — ${state.usedBonusThisGrid ? 'Avec bonus' : 'Sans bonus 🌟'}${pgmRewardText}`
        : `Parfait ! Grille d'apprentissage maîtrisée 🌟`;
    showEndModal(true, msg, false);
}

function showEndModal(isWin, msg, isTutorialStepTransition = false) {
    document.getElementById('end-title').textContent = isWin
        ? (isTutorialStepTransition ? "👏 Étape 1/2 Terminée !" : "🎉 Grille Résolue !")
        : "💔 Partie Terminée";
    document.getElementById('end-message').textContent = msg;
    document.getElementById('btn-next-level').textContent = isTutorialStepTransition
        ? "Passer à l'Étape 2/2 ▶"
        : (isWin ? "Nouvelle Grille ▶" : "Nouvelle Grille 🔄");

    const adInfoBox = document.getElementById('end-ad-info');
    const reviveBtn = document.getElementById('btn-extra-life');

    if (isWin) {
        adInfoBox.classList.add('hidden');
        reviveBtn.classList.add('hidden');
    } else {
        if (state.mode === 3) {
            adInfoBox.classList.remove('hidden');
            adInfoBox.innerHTML = `📺 Regarder une publicité restaure vos <b>4 vies (❤️❤️❤️❤️)</b>.`;
            reviveBtn.textContent = `📺 Pub : Restaurer 4 Vies`;
            reviveBtn.classList.remove('hidden');
        } else if (state.mode === 4) {
            const rem = Math.max(0, 2 - state.revivesUsedThisGrid);
            adInfoBox.classList.remove('hidden');
            adInfoBox.innerHTML = `⚠️ <b>Règle Mode Expert :</b> Limité à 2 recharges par grille (12 erreurs max).<br>Recharges restantes : <b>${rem} / 2</b>`;
            if (rem > 0) {
                reviveBtn.textContent = `📺 Pub : Restaurer 4 Vies (${rem}/2 restant)`;
                reviveBtn.classList.remove('hidden');
            } else {
                reviveBtn.classList.add('hidden');
            }
        } else if (state.mode === 5) {
            const rem = Math.max(0, 2 - state.revivesUsedThisGrid);
            const livesToRestore = Math.max(1, MAX_LIVES - (state.revivesUsedThisGrid + 1));
            adInfoBox.classList.remove('hidden');
            adInfoBox.innerHTML = `⚡ <b>Règle Mode Dieu :</b> Limité à 2 recharges par grille et <b>-1 vie régénérée à chaque pub</b> (9 erreurs max).<br>Recharges restantes : <b>${rem} / 2</b>`;
            if (rem > 0) {
                reviveBtn.textContent = `📺 Pub : Restaurer ${livesToRestore} Vies (${rem}/2 restant)`;
                reviveBtn.classList.remove('hidden');
            } else {
                reviveBtn.classList.add('hidden');
            }
        } else {
            adInfoBox.classList.add('hidden');
            reviveBtn.classList.add('hidden');
        }
    }

    document.getElementById('modal-end').classList.remove('hidden');
}

// --- ÉVÉNEMENTS D'INTERFACE ---
document.getElementById('tool-num').addEventListener('click', () => setTool('num'));
document.getElementById('tool-note').addEventListener('click', () => setTool('note'));

function setTool(t) {
    state.tool = t;
    document.getElementById('tool-num').classList.toggle('active', t === 'num');
    document.getElementById('tool-note').classList.toggle('active', t === 'note');
}

document.getElementById('btn-next-level').addEventListener('click', () => {
    document.getElementById('modal-end').classList.add('hidden');
    if (state.isDaily) state.isDaily = false;
    delete state.savedGridsByKey[getGridKey()];
    generatePuzzle(true);
});

document.getElementById('btn-extra-life').addEventListener('click', () => {
    let livesToGain = MAX_LIVES;
    let ruleNote = `Vos <b>4 vies</b> seront intégralement restaurées.`;

    if (state.mode === 4) {
        if (state.revivesUsedThisGrid >= 2) return;
        const remAfter = 2 - (state.revivesUsedThisGrid + 1);
        ruleNote = `Mode Expert : restaure <b>4 vies</b>.<br>Il vous restera <b>${remAfter}/2</b> recharge(s) sur cette grille.`;
    } else if (state.mode === 5) {
        if (state.revivesUsedThisGrid >= 2) return;
        livesToGain = Math.max(1, MAX_LIVES - (state.revivesUsedThisGrid + 1));
        const remAfter = 2 - (state.revivesUsedThisGrid + 1);
        ruleNote = `Mode Dieu : restaure <b>${livesToGain} vies</b> (1 vie de moins à chaque pub).<br>Il vous restera <b>${remAfter}/2</b> recharge(s) sur cette grille.`;
    }

    requestRewardedAd({
        title: "❤️ Recharger vos vies",
        description: ruleNote,
        onReward: () => {
            state.revivesUsedThisGrid++;
            state.lives = livesToGain;
            document.getElementById('modal-end').classList.add('hidden');
            saveCurrentGridSnapshot();
            updateUIStatus();
            showToast(`❤️ +${livesToGain} vies restaurées !`, 'success');
        }
    });
});

document.getElementById('btn-new-grid').addEventListener('click', () => {
    if (!state.isDaily && state.mode <= 1) {
        showConfirmModal(
            "🔄 Nouvelle grille",
            "Recommencer ou générer une nouvelle grille d'apprentissage ?",
            () => {
                recordGameAbandoned(state.size);
                delete state.savedGridsByKey[getGridKey()];
                generatePuzzle(true);
            }
        );
        return;
    }

    requestRewardedAd({
        title: "🔄 Générer une nouvelle grille",
        description: "Regardez une courte publicité pour abandonner la grille actuelle et en générer une nouvelle.<br><small>(Cette grille sera comptabilisée comme abandonnée dans vos statistiques).</small>",
        onReward: () => {
            recordGameAbandoned(state.size);
            delete state.savedGridsByKey[getGridKey()];
            generatePuzzle(true);
        }
    });
});

// --- CLIC SUR PUZZLE DU JOUR : DEMANDER SI LE JOUEUR CONNAÎT LES RÈGLES ---
function promptDailyPuzzleCheck() {
    document.getElementById('modal-daily-check').classList.remove('hidden');
}

document.getElementById('btn-daily').addEventListener('click', () => {
    if (state.isDaily) {
        // Si déjà sur le Défi du jour, un second clic ramène au mode normal en cours
        saveCurrentGridSnapshot();
        state.isDaily = false;
        saveProgress();
        generatePuzzle(false);
        return;
    }
    promptDailyPuzzleCheck();
});

document.getElementById('btn-daily-know-yes').addEventListener('click', () => {
    document.getElementById('modal-daily-check').classList.add('hidden');
    saveCurrentGridSnapshot();
    state.isDaily = true;
    saveProgress();
    generatePuzzle(false);
});

document.getElementById('btn-daily-know-no').addEventListener('click', () => {
    document.getElementById('modal-daily-check').classList.add('hidden');
    openRulesModal(0, true);
});

document.getElementById('btn-daily-cancel').addEventListener('click', () => {
    document.getElementById('modal-daily-check').classList.add('hidden');
});

// --- NAVIGATION CLAVIER (INCLUANT LES FLÈCHES DANS LE CARROUSEL DE RÈGLES) ---
window.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

    const rulesModal = document.getElementById('modal-rules');
    if (!rulesModal.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); setRuleSlide(currentRuleSlide - 1); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); setRuleSlide(currentRuleSlide + 1); return; }
        if (e.key === 'Escape') { e.preventDefault(); document.getElementById('btn-close-rules').click(); return; }
        return;
    }

    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        return;
    }

    const endModal = document.getElementById('modal-end');
    if (!endModal.classList.contains('hidden') && e.key === 'Enter') {
        document.getElementById('btn-next-level').click();
        return;
    }

    const anyModalOpen = Array.from(document.querySelectorAll('.modal')).some(m => !m.classList.contains('hidden'));
    if (anyModalOpen) return;

    const N = state.size;
    if (e.key === 'ArrowUp') { e.preventDefault(); state.selected.r = (state.selected.r - 1 + N) % N; renderAll(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); state.selected.r = (state.selected.r + 1) % N; renderAll(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); state.selected.c = (state.selected.c - 1 + N) % N; renderAll(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); state.selected.c = (state.selected.c + 1) % N; renderAll(); }
    else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); handleErase(); }
    else if (e.key === ' ' || e.key.toLowerCase() === 'm' || e.key.toLowerCase() === 'w') { e.preventDefault(); applyWallOnSelectedTile(); }
    else if (e.key.toLowerCase() === 'n') { e.preventDefault(); setTool(state.tool === 'num' ? 'note' : 'num'); }
    else if (e.key === '?') { e.preventDefault(); openRulesModal(0, state.mode !== 0); }
    else {
        const up = e.key.toUpperCase();
        const idx = SYMBOLS.indexOf(up);
        if (idx !== -1 && idx + 1 <= state.size) {
            e.preventDefault();
            handleNumberInput(idx + 1);
        }
    }
});

// --- MENU HUB CENTRALISÉ ---
document.getElementById('btn-menu').addEventListener('click', () => {
    renderModesTab();
    renderStatsTab();
    renderThemesTab();
    document.getElementById('modal-hub').classList.remove('hidden');
});

document.querySelectorAll('.hub-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.hub-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        tabBtn.classList.add('active');
        document.getElementById(tabBtn.dataset.tab).classList.remove('hidden');
    });
});

document.getElementById('stats-size-filter').addEventListener('change', () => renderStatsTab());

function renderModesTab() {
    const list = document.getElementById('mode-list');
    list.innerHTML = '';
    const totalWins = state.stats.global.gamesWon || 0;

    MODES.forEach(m => {
        const unlocked = state.allUnlockedTest || ((m.id === 6) ? state.devUnlocked : (totalWins >= m.reqWins));
        const isCurrent = (!state.isDaily && state.mode === m.id);
        const div = document.createElement('div');
        div.className = 'mode-item' + (unlocked ? '' : ' locked');
        div.innerHTML = `
            <div>
                <strong>${m.id === 6 && !unlocked ? 'Mode 6 : ????' : m.name}</strong>
                <div style="font-size:0.74rem">${unlocked ? m.desc : `Débloqué à ${m.reqWins} grilles résolues (${totalWins}/${m.reqWins})`}</div>
            </div>
            <button ${unlocked ? '' : 'disabled'} class="primary-btn" style="padding:6px 10px">${isCurrent ? 'Actif' : 'Choisir'}</button>
        `;
        if (unlocked) {
            div.querySelector('button').addEventListener('click', () => {
                if (!state.isDaily && state.mode === m.id) {
                    if (m.id === 0) {
                        state.tutorialStep = 0;
                        state.hasSeenIntroRules = false;
                        saveProgress();
                        document.getElementById('modal-hub').classList.add('hidden');
                        generatePuzzle(true);
                        return;
                    }
                    document.getElementById('modal-hub').classList.add('hidden');
                    return;
                }
                saveCurrentGridSnapshot();
                state.isDaily = false;
                state.mode = m.id;
                if (m.id === 0) {
                    state.tutorialStep = 0;
                    state.hasSeenIntroRules = false;
                }
                saveProgress();
                document.getElementById('modal-hub').classList.add('hidden');
                generatePuzzle(false);
            });
        }
        list.appendChild(div);
    });
    document.getElementById('toggle-engraved').checked = state.showEngraved;
    document.getElementById('debug-zone').classList.toggle('hidden', !state.debugVisible);
}

function renderStatsTab() {
    const filterVal = document.getElementById('stats-size-filter').value;
    const st = (filterVal === 'global')
        ? state.stats.global
        : getStatBucketForSize(parseInt(filterVal, 10));

    const timedWins = st.timedGamesWon || 0;
    const abandoned = st.gamesAbandoned || 0;
    const lost = st.gamesLost || 0;
    const livesUsed = st.livesUsed || 0;
    const withBonusWins = st.withBonusWinsTotal || (st.gamesWon - st.noBonusWinsTotal);

    const winRate = st.gamesStarted > 0 ? Math.round((st.gamesWon / st.gamesStarted) * 100) : 0;
    const flawlessRate = st.gamesWon > 0 ? Math.round((st.flawlessWins / st.gamesWon) * 100) : 0;
    const noBonusRate = st.gamesWon > 0 ? Math.round((st.noBonusWinsTotal / st.gamesWon) * 100) : 0;
    const withBonusRate = st.gamesWon > 0 ? (100 - noBonusRate) : 0;
    const avgTime = timedWins > 0 ? Math.round(st.totalWinTime / timedWins) : null;

    document.getElementById('stats-grid').innerHTML = `
        <div class="stat-card">
            <div class="stat-val">${st.gamesWon}</div>
            <div class="stat-lbl">Grilles Résolues (${winRate}%)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val">${formatTime(st.bestTime)}</div>
            <div class="stat-lbl">Temps le plus rapide</div>
        </div>
        <div class="stat-card">
            <div class="stat-val">${formatTime(avgTime)}</div>
            <div class="stat-lbl">Temps Moyen</div>
        </div>
        <div class="stat-card">
            <div class="stat-val">${formatTime(st.worstTime)}</div>
            <div class="stat-lbl">Temps le plus lent</div>
        </div>
    `;

    document.getElementById('stats-details').innerHTML = `
        <div class="stats-row"><span>Grilles démarrées :</span><strong>${st.gamesStarted}</strong></div>
        <div class="stats-row"><span>Grilles abandonnées (🔄) :</span><strong>${abandoned}</strong></div>
        <div class="stats-row"><span>Grilles perdues (Plus de vies) :</span><strong>${lost}</strong></div>
        <div class="stats-row"><span>Vies utilisées / perdues :</span><strong>❤️ ${livesUsed}</strong></div>
        <div class="stats-row"><span>Résolues SANS bonus :</span><strong>${st.noBonusWinsTotal} (${noBonusRate}%)</strong></div>
        <div class="stats-row"><span>Résolues AVEC bonus :</span><strong>${withBonusWins} (${withBonusRate}%)</strong></div>
        <div class="stats-row"><span>Total de bonus consommés :</span><strong>${st.totalBonusesUsed}</strong></div>
        <div class="stats-row"><span>Victoires sans aucune erreur :</span><strong>${st.flawlessWins} (${flawlessRate}%)</strong></div>
    `;
}

function renderThemesTab() {
    const tList = document.getElementById('theme-selector');
    tList.innerHTML = '';
    THEMES.forEach(t => {
        const unlocked = isThemeUnlocked(t.id);
        const div = document.createElement('div');
        div.className = 'theme-item' + (unlocked ? '' : ' locked');
        div.innerHTML = `
            <div><strong>${t.name}</strong><div style="font-size:0.74rem">${t.cond}</div></div>
            <button ${unlocked ? '' : 'disabled'} class="primary-btn" style="padding:6px 10px">${state.theme === t.id ? 'Équipé' : 'Choisir'}</button>
        `;
        if (unlocked) {
            div.querySelector('button').addEventListener('click', () => {
                applyTheme(t.id);
                renderThemesTab();
            });
        }
        tList.appendChild(div);
    });

    const aList = document.getElementById('achievements-list');
    const achs = [
        { name: "Esprit Pur", desc: `Gagner 5 grilles sans bonus (${state.noBonusWins}/5)`, done: state.allUnlockedTest || state.noBonusWins >= 5 },
        { name: "Infaillible", desc: `Série de 10 grilles sans erreur (${state.flawlessStreak}/10)`, done: state.allUnlockedTest || state.flawlessStreak >= 10 },
        { name: "Habitué", desc: `Connexion 3 jours d'affilée (${state.streak}/3)`, done: state.allUnlockedTest || state.streak >= 3 },
        { name: state.devUnlocked ? "🤩 Maître PGM Hexadécimal" : "????", desc: state.devUnlocked ? "Mode 6 : 🤩 PGM (10x10 à 16x16) débloqué" : "Terminer 5 grilles 9x9 sans erreur ni bonus (ou code donateur)", done: state.devUnlocked }
    ];
    aList.innerHTML = achs.map(a => `
        <div class="ach-item ${a.done ? '' : 'locked'}">
            <div><strong>${a.done ? '🏆' : '🔒'} ${a.name}</strong><div style="font-size:0.74rem">${a.desc}</div></div>
        </div>
    `).join('');
}

document.getElementById('toggle-engraved').addEventListener('change', (e) => {
    state.showEngraved = e.target.checked;
    saveProgress();
    renderAll();
});

document.getElementById('btn-secret-code').addEventListener('click', () => {
    const val = document.getElementById('secret-code-input').value.trim().toUpperCase();
    if (val === 'TEST' || val === 'DEBUG') {
        state.debugVisible = !state.debugVisible;
        saveProgress();
        renderModesTab();
        showToast(state.debugVisible ? "🛠️ Outils de test affichés dans ce menu." : "🛠️ Outils de test masqués.", 'info');
        document.getElementById('secret-code-input').value = '';
        return;
    }

    const h = hashSecret(val);
    if (h === '0xfbf74c7d' || h === '0xbfde7f15') {
        state.devUnlocked = true;
        saveProgress();
        showToast("🤩 Mode PGM (Hexadécimal 10x10 à 16x16) débloqué !", 'success');
        renderModesTab();
    } else {
        showToast("❌ Code invalide.", 'error');
    }
});

let footerTapCount = 0;
document.getElementById('footer-credits').addEventListener('click', () => {
    footerTapCount++;
    if (footerTapCount >= 5) {
        footerTapCount = 0;
        state.debugVisible = !state.debugVisible;
        saveProgress();
        showToast(state.debugVisible ? "🛠️ Mode Test Développeur activé dans le menu ☰ !" : "🛠️ Mode Test Développeur masqué.", 'info');
    }
});

document.getElementById('btn-player-reset').addEventListener('click', () => {
    showConfirmModal(
        "🗑️ Réinitialiser la progression",
        "Voulez-vous vraiment effacer votre progression et revoir les règles depuis le tutoriel ?",
        () => {
            localStorage.removeItem(SAVE_KEY);
            state = getDefaultState();
            applyTheme('theme-paper');
            document.getElementById('modal-hub').classList.add('hidden');
            generatePuzzle(true);
            showToast("Progression réinitialisée.", 'info');
        }
    );
});

document.getElementById('btn-debug-unlock').addEventListener('click', () => {
    state.allUnlockedTest = true;
    state.devUnlocked = true;
    state.bonuses = { b1: 99, b2: 0, b3: 99 };
    saveProgress();
    renderModesTab();
    renderThemesTab();
    updateUIStatus();
    showToast("🔓 Mode Test activé : Tous les modes (dont 🤩 PGM), tailles et thèmes sont débloqués !", 'success');
});

document.getElementById('btn-debug-reset').addEventListener('click', () => {
    showConfirmModal(
        "🗑️ Reset Total (Test)",
        "Réinitialiser complètement le jeu et les statistiques comme au tout 1er lancement ?",
        () => {
            localStorage.removeItem(SAVE_KEY);
            state = getDefaultState();
            applyTheme('theme-paper');
            document.getElementById('modal-hub').classList.add('hidden');
            generatePuzzle(true);
            showToast("Jeu remis à zéro (1er démarrage).", 'info');
        }
    );
});

function isThemeUnlocked(id) {
    if (state.allUnlockedTest || id === 'theme-paper') return true;
    if (id === 'theme-stone') return state.streak >= 3 || state.noBonusWins >= 5;
    if (id === 'theme-slate') return state.streak >= 7 || state.flawlessStreak >= 10;
    return false;
}

function applyTheme(themeId) {
    if (themeId === 'theme-neon') themeId = 'theme-slate';
    state.theme = themeId;
    document.body.className = `game-screen ${themeId}`;
    const tObj = THEMES.find(t => t.id === themeId) || THEMES[0];
    document.getElementById('icon-b1').textContent = tObj.icons[0];
    document.getElementById('icon-b2').textContent = tObj.icons[1];
    document.getElementById('icon-b3').textContent = tObj.icons[2];
    document.getElementById('name-b1').textContent = tObj.names[0];
    document.getElementById('name-b2').textContent = tObj.names[1];
    document.getElementById('name-b3').textContent = tObj.names[2];
    saveProgress();
}

document.querySelectorAll('.close-modal-btn').forEach(btn => {
    if (btn.dataset.close) {
        btn.addEventListener('click', () => document.getElementById(btn.dataset.close).classList.add('hidden'));
    }
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Lancement (avec vérification des règles si l'utilisateur arrive via ?daily=1)
loadProgress();
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('debug') === '1') state.debugVisible = true;

if (urlParams.get('daily') === '1') {
    generatePuzzle(false);
    promptDailyPuzzleCheck();
} else {
    generatePuzzle(false);
}