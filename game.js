// KUROGRAM - Moteur principal (v1.3.0 i18n + Unlocks) - Créé par Hazraael
const SYMBOLS = ['1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G'];
const SAVE_KEY = 'kurogram_hazraael_v7';
const MAX_LIVES = 4;

const PGM_BONUS_REWARDS = {
    10: 10, 11: 13, 12: 16, 13: 20, 14: 24, 15: 28, 16: 32
};

const MODES = [
    { id: 0, nameKey: "mode0Name", descKey: "mode0Desc", reqWins: 0 },
    { id: 1, nameKey: "mode1Name", descKey: "mode1Desc", reqWins: 0 },
    { id: 2, nameKey: "mode2Name", descKey: "mode2Desc", reqWins: 0 },
    { id: 3, nameKey: "mode3Name", descKey: "mode3Desc", reqWins: 15 },
    { id: 4, nameKey: "mode4Name", descKey: "mode4Desc", reqWins: 30, sizes: [5, 6, 7, 8, 9] },
    { id: 5, nameKey: "mode5Name", descKey: "mode5Desc", reqWins: 50, sizes: [5, 6, 7, 8, 9] },
    { id: 6, nameKey: "mode6Name", descKey: "mode6Desc", reqWins: 999, sizes: [10, 11, 12, 13, 14, 15, 16] }
];

const THEMES = [
    { id: 'theme-paper', nameKey: "themePaperName", condKey: "themePaperCond", icons: ['🔨','🪶','✏️'], bKeys: ['themePaperB1','themePaperB2','themePaperB3'] },
    { id: 'theme-stone', nameKey: "themeStoneName", condKey: "themeStoneCond", icons: ['🔨','⛏️','🔍'], bKeys: ['themeStoneB1','themeStoneB2','themeStoneB3'] },
    { id: 'theme-slate', nameKey: "themeSlateName", condKey: "themeSlateCond", icons: ['⚡','⚜️','🔭'], bKeys: ['themeSlateB1','themeSlateB2','themeSlateB3'] }
];

// --- NOTIFICATIONS IN-PAGE & DÉBLOCAGES ---
function showToast(htmlMsg, type = 'info', duration = 4200) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${htmlMsg}</span>
        <button class="toast-close" title="✕">✕</button>
    `;
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, duration);
    }
}

function showUnlockNotification(detailHtml) {
    const fullHtml = `<strong>${t('unlockTitle')}</strong><br>${detailHtml}`;
    showToast(fullHtml, 'unlock', 6500);
    const dot = document.getElementById('menu-unlock-dot');
    if (dot) dot.classList.remove('hidden');
}

// Capture l'état actuel des déblocages pour détecter tout nouveau palier franchi
function getUnlockStateMap() {
    const totalWins = state.stats?.global?.gamesWon || 0;
    return {
        mode_3: state.allUnlockedTest || totalWins >= 15,
        mode_4: state.allUnlockedTest || totalWins >= 30,
        mode_5: state.allUnlockedTest || totalWins >= 50,
        mode_6: state.allUnlockedTest || state.devUnlocked,
        theme_stone: isThemeUnlocked('theme-stone'),
        theme_slate: isThemeUnlocked('theme-slate'),
        ach_pure: state.allUnlockedTest || state.noBonusWins >= 5,
        ach_flawless: state.allUnlockedTest || state.flawlessStreak >= 10,
        ach_regular: state.allUnlockedTest || state.streak >= 3,
        ach_pgm: state.allUnlockedTest || state.devUnlocked
    };
}

function checkAndNotifyNewUnlocks(beforeMap) {
    const afterMap = getUnlockStateMap();

    // Modes 3 à 6
    [3, 4, 5, 6].forEach(mId => {
        const key = `mode_${mId}`;
        if (!beforeMap[key] && afterMap[key]) {
            const mObj = MODES.find(m => m.id === mId);
            showUnlockNotification(t('unlockModeMsg', { name: t(mObj.nameKey) }));
        }
    });

    // Thèmes
    if (!beforeMap.theme_stone && afterMap.theme_stone) {
        showUnlockNotification(t('unlockThemeMsg', { name: t('themeStoneName') }));
    }
    if (!beforeMap.theme_slate && afterMap.theme_slate) {
        showUnlockNotification(t('unlockThemeMsg', { name: t('themeSlateName') }));
    }

    // Hauts-Faits
    if (!beforeMap.ach_pure && afterMap.ach_pure) {
        showUnlockNotification(t('unlockAchMsg', { name: t('achPureName') }));
    }
    if (!beforeMap.ach_flawless && afterMap.ach_flawless) {
        showUnlockNotification(t('unlockAchMsg', { name: t('achFlawlessName') }));
    }
    if (!beforeMap.ach_regular && afterMap.ach_regular) {
        showUnlockNotification(t('unlockAchMsg', { name: t('achRegularName') }));
    }
    if (!beforeMap.ach_pgm && afterMap.ach_pgm) {
        showUnlockNotification(t('unlockAchMsg', { name: t('achPgmName') }));
    }
}

// --- APPLICATION DE LA LANGUE (FR / EN / ES) ---
function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'fr';
    currentLang = lang;
    localStorage.setItem('kurogram_lang', lang);
    document.documentElement.lang = lang;

    const langSelect = document.getElementById('lang-selector');
    if (langSelect) langSelect.value = lang;

    // Traduire tous les éléments HTML statiques ayant data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Info-bulles et placeholders
    document.getElementById('streak-badge').title = t('streakTitle');
    document.getElementById('btn-help').title = t('helpTitle');
    document.getElementById('btn-new-grid').title = t('newGridTitle');
    document.getElementById('btn-daily').title = t('dailyTitle');
    document.getElementById('btn-menu').title = t('menuTitle');
    document.getElementById('secret-code-input').placeholder = t('secretPlaceholder');
    document.getElementById('daily-check-desc').innerHTML = t('dailyCheckDesc');

    // Injecter les 3 diapositives du carrousel des règles dans la langue active
    const slides = document.querySelectorAll('#rules-carousel .rule-slide');
    const slidesContent = RULES_SLIDES_HTML[lang] || RULES_SLIDES_HTML.fr;
    slides.forEach((s, idx) => {
        if (slidesContent[idx]) s.innerHTML = slidesContent[idx];
    });

    // Mettre à jour le filtre des tailles dans l'onglet Statistiques
    const filterEl = document.getElementById('stats-size-filter');
    if (filterEl) {
        const prevVal = filterEl.value || 'global';
        let opts = `<option value="global">${t('statsGlobalOpt')}</option>`;
        for (let sz = 3; sz <= 16; sz++) {
            opts += `<option value="${sz}">${t('statsGridOpt', { sz })}${sz >= 10 ? ' (PGM)' : ''}</option>`;
        }
        filterEl.innerHTML = opts;
        filterEl.value = prevVal;
    }

    applyTheme(state.theme);
    updateUIStatus();
    updateGuideBanner();
}

document.getElementById('lang-selector').addEventListener('change', (e) => {
    applyLanguage(e.target.value);
});

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
        gamesStarted: 0, gamesWon: 0, timedGamesWon: 0, gamesAbandoned: 0,
        gamesLost: 0, livesUsed: 0, flawlessWins: 0, noBonusWinsTotal: 0,
        withBonusWinsTotal: 0, totalErrors: 0, totalBonusesUsed: 0,
        bestTime: null, worstTime: null, totalWinTime: 0
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
        mode: 0, tutorialStep: 0, hasSeenIntroRules: false, size: 3,
        customSizes: { 4: 6, 5: 6, 6: 10 },
        solutionNumbers: [], solutionWalls: [], rowClues: [], colClues: [],
        playerNumbers: [], playerWalls: [], playerNotes: [],
        selected: { r: 0, c: 0 }, tool: 'num', lives: MAX_LIVES,
        revivesUsedThisGrid: 0, usedVerifyThisGrid: false, hasMadeMoveThisGrid: false,
        bonuses: { b1: 3, b2: 2, b3: 3 }, usedBonusThisGrid: false,
        errorsThisGrid: 0, elapsedSeconds: 0, noBonusWins: 0, flawlessStreak: 0,
        perfect9x9Count: 0, devUnlocked: false, allUnlockedTest: false,
        debugVisible: false, showEngraved: true, theme: 'theme-paper',
        streak: 1, lastLogin: null, isDaily: false,
        stats: getDefaultStats(), savedGridsByKey: {}
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

// --- CARROUSEL VISUEL DES 3 RÈGLES ---
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

(function initCarouselSwipe() {
    const carousel = document.getElementById('rules-carousel');
    let startX = null;
    carousel.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const diff = e.changedTouches[0].screenX - startX;
        if (Math.abs(diff) > 40) setRuleSlide(diff < 0 ? currentRuleSlide + 1 : currentRuleSlide - 1);
        startX = null;
    }, { passive: true });
    carousel.addEventListener('mousedown', (e) => { startX = e.clientX; });
    carousel.addEventListener('mouseup', (e) => {
        if (startX === null) return;
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 40) setRuleSlide(diff < 0 ? currentRuleSlide + 1 : currentRuleSlide - 1);
        startX = null;
    });
})();

// --- SYSTÈME DE PUBLICITÉ RÉCOMPENSÉE ---
function requestRewardedAd({ title, description, onReward }) {
    const modal = document.getElementById('modal-ad');
    document.getElementById('ad-modal-title').textContent = title;
    document.getElementById('ad-modal-desc').innerHTML = description;
    const videoBox = document.getElementById('ad-video-box');
    const buttonsBox = document.getElementById('ad-modal-buttons');
    const countdownText = document.getElementById('ad-countdown-text');

    videoBox.classList.add('hidden');
    buttonsBox.classList.remove('hidden');
    modal.classList.remove('hidden');

    document.getElementById('btn-watch-ad').onclick = () => {
        buttonsBox.classList.add('hidden');
        videoBox.classList.remove('hidden');
        let remaining = 3;
        countdownText.textContent = t('adCountdown', { s: remaining });

        if (adCountdownInterval) clearInterval(adCountdownInterval);
        adCountdownInterval = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                countdownText.textContent = t('adCountdown', { s: remaining });
            } else {
                clearInterval(adCountdownInterval);
                modal.classList.add('hidden');
                onReward();
            }
        }, 1000);
    };

    document.getElementById('btn-cancel-ad').onclick = () => {
        if (adCountdownInterval) clearInterval(adCountdownInterval);
        modal.classList.add('hidden');
    };
}

// --- CHRONOMÈTRE ---
function isTimedMode() { return state.isDaily || state.mode >= 2; }

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
    if (state.isDaily) return `daily_${new Date().toISOString().slice(0, 10)}`;
    if (state.mode === 0) return `mode_0_step_${state.tutorialStep}`;
    return `mode_${state.mode}_size_${getTargetSizeForCurrentMode()}`;
}

function saveCurrentGridSnapshot() {
    if (!state.solutionNumbers || state.solutionNumbers.length === 0) return;
    state.savedGridsByKey[getGridKey()] = {
        size: state.size, tutorialStep: state.tutorialStep,
        solutionNumbers: state.solutionNumbers, solutionWalls: state.solutionWalls,
        rowClues: state.rowClues, colClues: state.colClues,
        playerNumbers: state.playerNumbers, playerWalls: state.playerWalls,
        playerNotes: state.playerNotes.map(row => row.map(set => Array.from(set))),
        elapsedSeconds: state.elapsedSeconds, lives: state.lives,
        revivesUsedThisGrid: state.revivesUsedThisGrid,
        usedVerifyThisGrid: state.usedVerifyThisGrid,
        hasMadeMoveThisGrid: state.hasMadeMoveThisGrid,
        usedBonusThisGrid: state.usedBonusThisGrid,
        errorsThisGrid: state.errorsThisGrid
    };
    saveProgress();
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
    applyLanguage(currentLang);
}

function saveProgress() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
        mode: state.mode, tutorialStep: state.tutorialStep,
        hasSeenIntroRules: state.hasSeenIntroRules, customSizes: state.customSizes,
        bonuses: state.bonuses, noBonusWins: state.noBonusWins,
        flawlessStreak: state.flawlessStreak, perfect9x9Count: state.perfect9x9Count,
        devUnlocked: state.devUnlocked, allUnlockedTest: state.allUnlockedTest,
        debugVisible: state.debugVisible, showEngraved: state.showEngraved,
        theme: state.theme, streak: state.streak, lastLogin: state.lastLogin,
        isDaily: state.isDaily, stats: state.stats, savedGridsByKey: state.savedGridsByKey
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
        const beforeUnlocks = getUnlockStateMap();
        if (state.lastLogin) {
            const diff = (new Date(today) - new Date(state.lastLogin)) / (1000 * 3600 * 24);
            state.streak = (diff === 1) ? state.streak + 1 : 1;
        }
        state.lastLogin = today;
        saveProgress();
        checkAndNotifyNewUnlocks(beforeUnlocks);
    }
    document.getElementById('streak-badge').textContent = `🔥 ${state.streak}d`;
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
        if (!state.hasSeenIntroRules) openRulesModal(0, false);
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
            for (let c = 0; c < 3; c++) state.playerNumbers[r][c] = state.solutionNumbers[r][c];
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

function computeLineClues(numbers, walls) {
    let clues = [];
    let currentSum = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (!walls[i]) currentSum += numbers[i];
        else if (currentSum > 0) { clues.push(currentSum); currentSum = 0; }
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
            if (val < 1 || val > N || seenWhiteNumbers.has(val)) return false;
            seenWhiteNumbers.add(val);
        } else if (val >= 1 && val <= N) {
            if (seenWhiteNumbers.has(val)) return false;
            seenWhiteNumbers.add(val);
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
        } else {
            btn.textContent = SYMBOLS[i - 1];
        }
        btn.addEventListener('click', () => handleNumberInput(i));
        numpad.appendChild(btn);
    }

    const eraseBtn = document.createElement('button');
    eraseBtn.className = 'num-btn';
    eraseBtn.textContent = '⌫';
    eraseBtn.addEventListener('click', () => handleErase());
    numpad.appendChild(eraseBtn);
}

function updateUIStatus() {
    const modeObj = MODES.find(m => m.id === state.mode) || MODES[0];
    if (state.isDaily) {
        document.getElementById('mode-label').textContent = t('dailyHeader');
    } else if (state.mode === 0) {
        document.getElementById('mode-label').textContent = t('rulesStepHeader', { step: state.tutorialStep + 1 });
    } else {
        document.getElementById('mode-label').textContent = `${t(modeObj.nameKey)} (${state.size}x${state.size})`;
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
    state.customSizes[state.mode] = parseInt(e.target.value, 10);
    saveProgress();
    generatePuzzle(false);
});

function updateGuideBanner() {
    const banner = document.getElementById('guide-banner');
    const text = document.getElementById('guide-text');
    if (state.isDaily || state.mode > 1) {
        banner.classList.add('hidden');
        return;
    }
    banner.classList.remove('hidden');

    if (state.mode === 0 && state.tutorialStep === 0) {
        text.innerHTML = state.playerWalls[0][1] ? t('tutoStep1WallPlaced') : t('tutoStep1Start');
        return;
    }
    if (state.mode === 0 && state.tutorialStep === 1) {
        text.innerHTML = t('tutoStep2');
        return;
    }

    const N = state.size;
    const maxSum = (N * (N + 1)) / 2;
    for (let r = 0; r < N; r++) {
        if (isLineFullyAndCorrectlySolved(true, r)) continue;
        const clues = state.rowClues[r];
        if (clues.length === 1 && clues[0] === maxSum) {
            text.innerHTML = t('hintNoWall', { r: r + 1, sum: maxSum });
            return;
        }
        if (clues.length > 1) {
            text.innerHTML = t('hintSplitSum', { r: r + 1, clues: clues.join(' - ') });
            return;
        }
    }
    text.innerHTML = t('hintDefault', { n: N });
}

// --- ACTIONS JOUEUR ---
function applyWallOnSelectedTile() {
    const { r, c } = state.selected;
    state.hasMadeMoveThisGrid = true;
    const wasRowSolved = isLineFullyAndCorrectlySolved(true, r);
    const wasColSolved = isLineFullyAndCorrectlySolved(false, c);

    if (!state.playerWalls[r][c] && !state.isDaily && state.mode >= 3 && state.mode <= 5 && !state.solutionWalls[r][c]) {
        penalizeError(t('errNotWall'));
        return;
    }

    state.playerWalls[r][c] = !state.playerWalls[r][c];
    if (state.playerWalls[r][c]) {
        state.playerNumbers[r][c] = (state.showEngraved && (state.isDaily || state.mode <= 3))
            ? state.solutionNumbers[r][c] : 0;
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
            penalizeError(t('errIsWall'));
            return;
        }
        for (let k = 0; k < state.size; k++) {
            if ((k !== c && !state.playerWalls[r][k] && state.playerNumbers[r][k] === num) ||
                (k !== r && !state.playerWalls[k][c] && state.playerNumbers[k][c] === num)) {
                penalizeError(t('errDuplicate'));
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
            if (!state.playerWalls[r][c] && state.playerNumbers[r][c] <= 0) remainingCells++;

            if (state.playerWalls[r][c] && !state.solutionWalls[r][c]) {
                errorCoords.push({ r, c });
            } else if (!state.playerWalls[r][c] && state.playerNumbers[r][c] > 0) {
                if (state.solutionWalls[r][c]) {
                    errorCoords.push({ r, c });
                } else {
                    const val = state.playerNumbers[r][c];
                    for (let k = 0; k < N; k++) {
                        if (k !== c && state.playerNumbers[r][k] === val && (!state.playerWalls[r][k] || state.showEngraved)) errorCoords.push({ r, c });
                        if (k !== r && state.playerNumbers[k][c] === val && (!state.playerWalls[k][c] || state.showEngraved)) errorCoords.push({ r, c });
                    }
                }
            }
        }
    }

    if (errorCoords.length > 0) {
        errorCoords.forEach(({ r, c }) => {
            const tile = document.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
            if (tile) { tile.classList.remove('error-highlight'); void tile.offsetWidth; tile.classList.add('error-highlight'); }
        });
        showToast(t('verifyErrors', { count: errorCoords.length }), 'error');
    } else if (remainingCells > 0) {
        showToast(t('verifyOkRemaining', { rem: remainingCells }), 'success');
    } else {
        showToast(t('verifyAllFilled'), 'info');
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
        showEndModal(false, `${msg} ${t('errNoLives')}`);
    } else {
        showToast(t('livesLeftToast', { msg, lives: state.lives }), 'error', 2800);
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
        setTimeout(() => showEndModal(true, t('step1DoneMsg'), true), 450);
        return;
    }

    setTimeout(() => onGridVictory(), 450);
}

function triggerWave(isRow, index) {
    document.querySelectorAll('.tile').forEach(tile => {
        const tr = parseInt(tile.dataset.r);
        const tc = parseInt(tile.dataset.c);
        if ((isRow && tr === index) || (!isRow && tc === index)) {
            setTimeout(() => tile.classList.add('wave-anim'), (isRow ? tc : tr) * 40);
        }
    });
}

// --- LES 3 BONUS ---
function promptAdForEmptyBonus(bonusKey, bonusLabel) {
    requestRewardedAd({
        title: t('emptyBonusTitle', { name: bonusLabel }),
        description: t('emptyBonusDesc', { name: bonusLabel }),
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
            const tObj = THEMES.find(th => th.id === state.theme) || THEMES[0];
            showToast(t('bonusRewardToast', {
                b1: gained.b1, n1: t(tObj.bKeys[0]),
                b2: gained.b2, n2: t(tObj.bKeys[1]),
                b3: gained.b3, n3: t(tObj.bKeys[2])
            }), 'success');
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
        showToast(t('godModeFizzle'), 'warn');
        updateUIStatus();
        return true;
    }
    return false;
}

document.getElementById('bonus-hammer').addEventListener('click', () => {
    const tObj = THEMES.find(th => th.id === state.theme) || THEMES[0];
    if (state.bonuses.b1 <= 0) { promptAdForEmptyBonus('b1', t(tObj.bKeys[0])); return; }

    const unrevealedWalls = [];
    for (let r = 0; r < state.size; r++) {
        for (let c = 0; c < state.size; c++) {
            if (state.solutionWalls[r][c] && !state.playerWalls[r][c]) unrevealedWalls.push({ r, c });
        }
    }
    if (unrevealedWalls.length === 0) { showToast(t('allWallsFound'), 'info'); return; }

    state.bonuses.b1--;
    recordBonusUsed();
    if (checkGodModeFizzle()) return;

    const pick = unrevealedWalls[Math.floor(Math.random() * unrevealedWalls.length)];
    const wrapper = document.getElementById('board-wrapper');
    wrapper.classList.remove('shake'); void wrapper.offsetWidth; wrapper.classList.add('shake');

    state.playerWalls[pick.r][pick.c] = true;
    state.playerNumbers[pick.r][pick.c] = (state.showEngraved && (state.isDaily || state.mode <= 3))
        ? state.solutionNumbers[pick.r][pick.c] : 0;
    saveCurrentGridSnapshot();
    renderAll();
    highlightTiles([pick]);
    checkLineWaveAndVictory(pick.r, pick.c, false, false);
});

document.getElementById('bonus-quill').addEventListener('click', () => {
    const tObj = THEMES.find(th => th.id === state.theme) || THEMES[0];
    if (state.bonuses.b2 <= 0) { promptAdForEmptyBonus('b2', t(tObj.bKeys[1])); return; }

    let bestCell = null, bestScore = -1;
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
                if (score > bestScore) { bestScore = score; bestCell = { r, c }; }
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
    const tObj = THEMES.find(th => th.id === state.theme) || THEMES[0];
    if (state.bonuses.b3 <= 0) { promptAdForEmptyBonus('b3', t(tObj.bKeys[2])); return; }

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
            if (!used && n !== trueVal && Math.random() < 0.5) state.playerNotes[r][c].add(n);
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

// --- VICTOIRE, DÉBLOCAGES & STATISTIQUES ---
function applyVictoryStatsToBucket(bucket, timed, elapsed) {
    bucket.gamesWon++;
    if (timed) {
        bucket.timedGamesWon = (bucket.timedGamesWon || 0) + 1;
        bucket.totalWinTime += elapsed;
        if (bucket.bestTime === null || elapsed < bucket.bestTime) bucket.bestTime = elapsed;
        if (bucket.worstTime === null || elapsed > bucket.worstTime) bucket.worstTime = elapsed;
    }
    if (!state.usedBonusThisGrid) bucket.noBonusWinsTotal++;
    else bucket.withBonusWinsTotal = (bucket.withBonusWinsTotal || 0) + 1;
    if (state.errorsThisGrid === 0) bucket.flawlessWins++;
}

function onGridVictory() {
    delete state.savedGridsByKey[getGridKey()];

    // Photo des déblocages AVANT d'incrémenter les compteurs de victoire
    const beforeUnlocks = getUnlockStateMap();

    const timed = isTimedMode();
    const el = state.elapsedSeconds;
    applyVictoryStatsToBucket(state.stats.global, timed, el);
    applyVictoryStatsToBucket(getStatBucketForSize(state.size), timed, el);

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
                state.bonuses[keys[Math.floor(Math.random() * keys.length)]]++;
            }
            pgmRewardText = t('pgmReward', { count });
        } else {
            pgmRewardText = t('pgmNoReward');
        }
    }

    if (!state.isDaily && state.mode === 0) {
        state.mode = 1;
        state.tutorialStep = 0;
    }
    saveProgress();
    updateUIStatus();

    // Déclencher les notifications dorées si un Mode, Thème ou Haut-Fait vient d'être débloqué !
    checkAndNotifyNewUnlocks(beforeUnlocks);

    const msg = timed
        ? t('winTimedMsg', {
            time: formatTime(state.elapsedSeconds),
            bonus: state.usedBonusThisGrid ? t('withBonus') : t('withoutBonus'),
            pgm: pgmRewardText
          })
        : t('winUntimedMsg');
    showEndModal(true, msg, false);
}

function showEndModal(isWin, msg, isTutorialStepTransition = false) {
    document.getElementById('end-title').textContent = isWin
        ? (isTutorialStepTransition ? t('step1DoneTitle') : t('winTitle'))
        : t('loseTitle');
    document.getElementById('end-message').textContent = msg;
    document.getElementById('btn-next-level').textContent = isTutorialStepTransition
        ? t('nextStepBtn') : t('nextGridBtn');

    const adInfoBox = document.getElementById('end-ad-info');
    const reviveBtn = document.getElementById('btn-extra-life');

    if (isWin) {
        adInfoBox.classList.add('hidden');
        reviveBtn.classList.add('hidden');
    } else if (state.mode === 3) {
        adInfoBox.classList.remove('hidden');
        adInfoBox.innerHTML = t('adRuleHard');
        reviveBtn.textContent = t('adBtnHard');
        reviveBtn.classList.remove('hidden');
    } else if (state.mode === 4) {
        const rem = Math.max(0, 2 - state.revivesUsedThisGrid);
        adInfoBox.classList.remove('hidden');
        adInfoBox.innerHTML = t('adRuleExpert', { rem });
        reviveBtn.textContent = t('adBtnExpert', { rem });
        reviveBtn.classList.toggle('hidden', rem <= 0);
    } else if (state.mode === 5) {
        const rem = Math.max(0, 2 - state.revivesUsedThisGrid);
        const livesToRestore = Math.max(1, MAX_LIVES - (state.revivesUsedThisGrid + 1));
        adInfoBox.classList.remove('hidden');
        adInfoBox.innerHTML = t('adRuleGod', { rem });
        reviveBtn.textContent = t('adBtnGod', { lives: livesToRestore, rem });
        reviveBtn.classList.toggle('hidden', rem <= 0);
    } else {
        adInfoBox.classList.add('hidden');
        reviveBtn.classList.add('hidden');
    }

    document.getElementById('modal-end').classList.remove('hidden');
}

// --- ÉVÉNEMENTS D'INTERFACE ---
document.getElementById('tool-num').addEventListener('click', () => setTool('num'));
document.getElementById('tool-note').addEventListener('click', () => setTool('note'));

function setTool(toolName) {
    state.tool = toolName;
    document.getElementById('tool-num').classList.toggle('active', toolName === 'num');
    document.getElementById('tool-note').classList.toggle('active', toolName === 'note');
}

document.getElementById('btn-next-level').addEventListener('click', () => {
    document.getElementById('modal-end').classList.add('hidden');
    if (state.isDaily) state.isDaily = false;
    delete state.savedGridsByKey[getGridKey()];
    generatePuzzle(true);
});

document.getElementById('btn-extra-life').addEventListener('click', () => {
    let livesToGain = MAX_LIVES;
    let ruleNote = t('adRuleHard');

    if (state.mode === 4) {
        if (state.revivesUsedThisGrid >= 2) return;
        ruleNote = t('adRuleExpert', { rem: 2 - (state.revivesUsedThisGrid + 1) });
    } else if (state.mode === 5) {
        if (state.revivesUsedThisGrid >= 2) return;
        livesToGain = Math.max(1, MAX_LIVES - (state.revivesUsedThisGrid + 1));
        ruleNote = t('adRuleGod', { rem: 2 - (state.revivesUsedThisGrid + 1) });
    }

    requestRewardedAd({
        title: "❤️",
        description: ruleNote,
        onReward: () => {
            state.revivesUsedThisGrid++;
            state.lives = livesToGain;
            document.getElementById('modal-end').classList.add('hidden');
            saveCurrentGridSnapshot();
            updateUIStatus();
            showToast(`❤️ +${livesToGain} !`, 'success');
        }
    });
});

document.getElementById('btn-new-grid').addEventListener('click', () => {
    if (!state.isDaily && state.mode <= 1) {
        showConfirmModal(t('newGridConfirmTitle'), t('newGridConfirmDesc'), () => {
            recordGameAbandoned(state.size);
            delete state.savedGridsByKey[getGridKey()];
            generatePuzzle(true);
        });
        return;
    }

    requestRewardedAd({
        title: t('newGridAdTitle'),
        description: t('newGridAdDesc'),
        onReward: () => {
            recordGameAbandoned(state.size);
            delete state.savedGridsByKey[getGridKey()];
            generatePuzzle(true);
        }
    });
});

function promptDailyPuzzleCheck() {
    document.getElementById('modal-daily-check').classList.remove('hidden');
}

document.getElementById('btn-daily').addEventListener('click', () => {
    if (state.isDaily) {
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

// --- CLAVIER ---
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

    if (Array.from(document.querySelectorAll('.modal')).some(m => !m.classList.contains('hidden'))) return;

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
        const idx = SYMBOLS.indexOf(e.key.toUpperCase());
        if (idx !== -1 && idx + 1 <= state.size) { e.preventDefault(); handleNumberInput(idx + 1); }
    }
});

// --- MENU HUB ---
document.getElementById('btn-menu').addEventListener('click', () => {
    const dot = document.getElementById('menu-unlock-dot');
    if (dot) dot.classList.add('hidden');
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
                <strong>${m.id === 6 && !unlocked ? 'Mode 6 : ????' : t(m.nameKey)}</strong>
                <div style="font-size:0.74rem">${unlocked ? t(m.descKey) : t('modeLocked', { req: m.reqWins, cur: totalWins })}</div>
            </div>
            <button ${unlocked ? '' : 'disabled'} class="primary-btn" style="padding:6px 10px">${isCurrent ? t('active') : t('choose')}</button>
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
                if (m.id === 0) { state.tutorialStep = 0; state.hasSeenIntroRules = false; }
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
    const st = (filterVal === 'global') ? state.stats.global : getStatBucketForSize(parseInt(filterVal, 10));

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
            <div class="stat-lbl">${t('statsSolved', { rate: winRate })}</div>
        </div>
        <div class="stat-card">
            <div class="stat-val">${formatTime(st.bestTime)}</div>
            <div class="stat-lbl">${t('statsBestTime')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-val">${formatTime(avgTime)}</div>
            <div class="stat-lbl">${t('statsAvgTime')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-val">${formatTime(st.worstTime)}</div>
            <div class="stat-lbl">${t('statsWorstTime')}</div>
        </div>
    `;

    document.getElementById('stats-details').innerHTML = `
        <div class="stats-row"><span>${t('statsStarted')}</span><strong>${st.gamesStarted}</strong></div>
        <div class="stats-row"><span>${t('statsAbandoned')}</span><strong>${abandoned}</strong></div>
        <div class="stats-row"><span>${t('statsLost')}</span><strong>${lost}</strong></div>
        <div class="stats-row"><span>${t('statsLivesUsed')}</span><strong>❤️ ${livesUsed}</strong></div>
        <div class="stats-row"><span>${t('statsNoBonus')}</span><strong>${st.noBonusWinsTotal} (${noBonusRate}%)</strong></div>
        <div class="stats-row"><span>${t('statsWithBonus')}</span><strong>${withBonusWins} (${withBonusRate}%)</strong></div>
        <div class="stats-row"><span>${t('statsTotalBonuses')}</span><strong>${st.totalBonusesUsed}</strong></div>
        <div class="stats-row"><span>${t('statsFlawless')}</span><strong>${st.flawlessWins} (${flawlessRate}%)</strong></div>
    `;
}

function renderThemesTab() {
    const tList = document.getElementById('theme-selector');
    tList.innerHTML = '';
    THEMES.forEach(th => {
        const unlocked = isThemeUnlocked(th.id);
        const div = document.createElement('div');
        div.className = 'theme-item' + (unlocked ? '' : ' locked');
        div.innerHTML = `
            <div><strong>${t(th.nameKey)}</strong><div style="font-size:0.74rem">${t(th.condKey)}</div></div>
            <button ${unlocked ? '' : 'disabled'} class="primary-btn" style="padding:6px 10px">${state.theme === th.id ? t('equipped') : t('choose')}</button>
        `;
        if (unlocked) {
            div.querySelector('button').addEventListener('click', () => {
                applyTheme(th.id);
                renderThemesTab();
            });
        }
        tList.appendChild(div);
    });

    const aList = document.getElementById('achievements-list');
    const achs = [
        { name: t('achPureName'), desc: t('achPureDesc', { cur: state.noBonusWins }), done: state.allUnlockedTest || state.noBonusWins >= 5 },
        { name: t('achFlawlessName'), desc: t('achFlawlessDesc', { cur: state.flawlessStreak }), done: state.allUnlockedTest || state.flawlessStreak >= 10 },
        { name: t('achRegularName'), desc: t('achRegularDesc', { cur: state.streak }), done: state.allUnlockedTest || state.streak >= 3 },
        { name: state.devUnlocked ? t('achPgmName') : "????", desc: state.devUnlocked ? t('achPgmUnlockedDesc') : t('achPgmLockedDesc'), done: state.devUnlocked }
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
        document.getElementById('secret-code-input').value = '';
        return;
    }

    const beforeUnlocks = getUnlockStateMap();
    const h = hashSecret(val);
    if (h === '0xfbf74c7d' || h === '0xbfde7f15') {
        state.devUnlocked = true;
        saveProgress();
        checkAndNotifyNewUnlocks(beforeUnlocks);
        renderModesTab();
        renderThemesTab();
    } else {
        showToast(t('codeInvalid'), 'error');
    }
});

let footerTapCount = 0;
document.getElementById('footer-credits').addEventListener('click', () => {
    footerTapCount++;
    if (footerTapCount >= 5) {
        footerTapCount = 0;
        state.debugVisible = !state.debugVisible;
        saveProgress();
        showToast(state.debugVisible ? "🛠️ Dev Mode ON" : "🛠️ Dev Mode OFF", 'info');
    }
});

document.getElementById('btn-player-reset').addEventListener('click', () => {
    showConfirmModal(t('resetConfirmTitle'), t('resetConfirmDesc'), () => {
        localStorage.removeItem(SAVE_KEY);
        state = getDefaultState();
        applyLanguage(currentLang);
        document.getElementById('modal-hub').classList.add('hidden');
        generatePuzzle(true);
        showToast(t('resetDoneToast'), 'info');
    });
});

document.getElementById('btn-debug-unlock').addEventListener('click', () => {
    const beforeUnlocks = getUnlockStateMap();
    state.allUnlockedTest = true;
    state.devUnlocked = true;
    state.bonuses = { b1: 99, b2: 0, b3: 99 };
    saveProgress();
    checkAndNotifyNewUnlocks(beforeUnlocks);
    renderModesTab();
    renderThemesTab();
    updateUIStatus();
});

document.getElementById('btn-debug-reset').addEventListener('click', () => {
    showConfirmModal("🗑️ Reset Total", t('resetConfirmDesc'), () => {
        localStorage.removeItem(SAVE_KEY);
        state = getDefaultState();
        applyLanguage(currentLang);
        document.getElementById('modal-hub').classList.add('hidden');
        generatePuzzle(true);
    });
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
    const tObj = THEMES.find(th => th.id === themeId) || THEMES[0];
    document.getElementById('icon-b1').textContent = tObj.icons[0];
    document.getElementById('icon-b2').textContent = tObj.icons[1];
    document.getElementById('icon-b3').textContent = tObj.icons[2];
    document.getElementById('name-b1').textContent = t(tObj.bKeys[0]);
    document.getElementById('name-b2').textContent = t(tObj.bKeys[1]);
    document.getElementById('name-b3').textContent = t(tObj.bKeys[2]);
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

// Lancement
loadProgress();
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('debug') === '1') state.debugVisible = true;
if (urlParams.get('daily') === '1') {
    generatePuzzle(false);
    promptDailyPuzzleCheck();
} else {
    generatePuzzle(false);
}