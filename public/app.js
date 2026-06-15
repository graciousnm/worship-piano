// ═══════════════════════════════════════════════════════════════
//  Worship Piano Learning Platform — app.js
//  Card-based 3-tier navigation: Phases → Lessons → Video
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── SVG Icons ────────────────────────────────────────
  const ICONS = {
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    piano: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 20V10"/><path d="M10 20V10"/><path d="M14 20V4"/><path d="M18 20V10"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15-3-3a6 6 0 0 1 6-6c.67 0 1.34.09 2 .27C15.83 5.56 16 3.84 16 2c0 0 2 2 2 5 .27.66.27 1.33.27 2a6 6 0 0 1-6 6z"/><path d="M9 15-6-6"/><path d="M15 9-6 6"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M2.5 16h19"/><path d="M5 20h14"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><polyline points="20 6 9 17 4 12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><polyline points="9 18 15 12 9 6"/></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><polyline points="15 18 9 12 15 6"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    barChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width:1em;height:1em"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>',
  };

  // ── Phase Definitions ──────────────────────────────────
  const PHASES = [
    { name: 'Foundations', icon: ICONS.leaf, range: [0, 2], color: '#34d399', desc: 'Notes, chords, inversions & your first worship songs' },
    { name: 'Worship Foundations', icon: ICONS.wrench, range: [3, 8], color: '#38bdf8', desc: 'Rhythm patterns, 7th chords, sus/add chords, song tutorials, techniques & riffs' },
    { name: 'Contemporary Worship', icon: ICONS.piano, range: [9, 12], color: '#fb923c', desc: 'Passing chords, reharmonization & modern gospel style' },
    { name: 'Worship Leading', icon: ICONS.rocket, range: [13, 14], color: '#f472b6', desc: 'Rootless voicings, improvisation & performance skills' },
    { name: 'Mastery & Ministry', icon: ICONS.crown, range: [15, 16], color: '#c084fc', desc: 'Artist styles, worship leadership & service flow' },
  ];

  // ── DOM References ────────────────────────────────────────
  const phaseGrid = document.getElementById('phase-grid');
  const lessonGrid = document.getElementById('lesson-grid');
  const lessonViewTitle = document.getElementById('lesson-view-title');
  const lessonSearch = document.getElementById('lesson-search');
  const lessonSearchClear = document.getElementById('lesson-search-clear');
  const videoLessonTitle = document.getElementById('video-lesson-title');
  const videoModuleTitle = document.getElementById('video-module-title');
  const playerContainer = document.getElementById('player-container');
  const markComplete = document.getElementById('mark-complete');
  const completeLabel = document.getElementById('complete-label');
  const progressStats = document.getElementById('progress-stats');
  const progressBar = document.getElementById('progress-bar');
  const loopToggle = document.getElementById('loop-toggle');
  const loopClearBtn = document.getElementById('loop-clear');
  const loopStatus = document.getElementById('loop-status');
  const loopAInput = document.getElementById('loop-a');
  const loopBInput = document.getElementById('loop-b');
  const notesArea = document.getElementById('notes-area');
  const notesSaved = document.getElementById('notes-saved');
  const resetBtn = document.getElementById('reset-progress');

  const phaseView = document.getElementById('phase-view');
  const lessonView = document.getElementById('lesson-view');
  const videoView = document.getElementById('video-view');
  const lessonBackBtn = document.getElementById('lesson-back-btn');
  const videoBackBtn = document.getElementById('video-back-btn');
  const ringFill = document.getElementById('ring-fill');
  const ringPct = document.getElementById('ring-pct');
  const progressRing = document.getElementById('progress-ring');
  const prevLessonBtn = document.getElementById('prev-lesson-btn');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const breadcrumb = document.getElementById('breadcrumb');
  const addSectionBtn = document.getElementById('add-section-btn');
  const sectionMarkers = document.getElementById('section-markers');
  const sectionList = document.getElementById('section-list');
  const sectionsEmpty = document.getElementById('sections-empty');
  const badgeGalleryBtn = document.getElementById('badge-gallery-btn');
  const badgeCount = document.getElementById('badge-count');
  const badgeModal = document.getElementById('badge-modal');
  const badgeModalClose = document.getElementById('badge-modal-close');
  const toastContainer = document.getElementById('toast-container');
  const galleryPhases = document.getElementById('gallery-phases');
  const galleryModules = document.getElementById('gallery-modules');
  const heroSection = document.getElementById('hero-section');
  const speedTabPanel = document.getElementById('speed-tab-panel');
  const sectionsTabPanel = document.getElementById('sections-tab-panel');
  const progressTabPanel = document.getElementById('progress-tab-panel');
  const miniPlayer = document.getElementById('mini-player');
  const miniPlayerInner = document.getElementById('mini-player-inner');
  const miniPlayerTitle = document.getElementById('mini-player-title');
  const miniPlayBtn = document.getElementById('mini-play');
  const miniCloseBtn = document.getElementById('mini-close');
  const miniPlayerHandle = document.getElementById('mini-player-handle');
  const globalSearchInput = document.getElementById('global-search');
  const globalSearchDropdown = document.getElementById('global-search-dropdown');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const hamburgerCloseIcon = document.getElementById('hamburger-close-icon');
  const hamburgerDropdown = document.getElementById('hamburger-dropdown');
  const hamburgerProgressText = document.getElementById('hamburger-progress-text');
  const hamburgerProgressBar = document.getElementById('hamburger-progress-bar');
  const hamburgerResetBtn = document.getElementById('hamburger-reset-btn');
  const installPwaBtn = document.getElementById('install-pwa-btn');

  // ── State ─────────────────────────────────────────────────
  let player = null;
  let modules = [];
  let currentLesson = null;
  let currentModule = null;
  let completedLessons = new Set();
  let notesData = {};
  let notesSaveTimer = null;
  let loopInterval = null;
  let loopA = null; // seconds
  let loopB = null; // seconds
  let currentSpeed = 1;
  let currentPhaseIdx = -1;
  let viewHistory = []; // stack: [{view: 'phase'|'lesson', phaseIdx: number}]
  let watchProgress = {};    // { lessonId: maxFractionWatched }
  let watchInterval = null;
  let sectionsData = {};    // { lessonId: [{ id, label, timestamp }] }
  let achievements = new Set();
  const ACHIEVEMENTS_KEY = 'gospel_piano_achievements';
  let pipActive = false;        // whether mini player is visible
  const WATCH_THRESHOLD = 0.9; // 90% of video must be watched
  let globalSearchIdx = -1;    // highlighted result index

  // ── Lesson Navigation Helpers ──────────────────────────
  function getPhaseLessons() {
    if (currentPhaseIdx < 0 || !modules.length) return [];
    const phase = PHASES[currentPhaseIdx];
    const result = [];
    modules
      .filter(m => m.sort_order >= phase.range[0] && m.sort_order <= phase.range[1])
      .forEach(mod => {
        mod.lessons.forEach(lesson => {
          result.push({ lesson, module: mod });
        });
      });
    return result;
  }

  function updateNavButtons() {
    if (!prevLessonBtn || !nextLessonBtn || !currentLesson) {
      if (prevLessonBtn) prevLessonBtn.disabled = true;
      if (nextLessonBtn) nextLessonBtn.disabled = true;
      return;
    }
    const phaseLessons = getPhaseLessons();
    const idx = phaseLessons.findIndex(pl => pl.lesson.id === currentLesson.id);
    prevLessonBtn.disabled = idx <= 0;
    nextLessonBtn.disabled = idx < 0 || idx >= phaseLessons.length - 1;
  }

  function navigateToAdjacentLesson(direction) {
    if (!currentLesson) return;
    const phaseLessons = getPhaseLessons();
    const idx = phaseLessons.findIndex(pl => pl.lesson.id === currentLesson.id);
    if (idx < 0) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= phaseLessons.length) return;
    const { lesson, module: mod } = phaseLessons[targetIdx];
    saveCurrentNote();
    // If in PiP mode, just change the video in the mini player
    if (pipActive) {
      currentLesson = lesson;
      currentModule = mod;
      updateMiniPlayerTitle();
      if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(lesson.youtube_id);
      }
      // Replace the top of viewHistory so Back returns correctly
      if (viewHistory.length > 0) {
        viewHistory[viewHistory.length - 1] = { view: 'lesson', phaseIdx: currentPhaseIdx };
      }
      return;
    }
    stopPlayback();
    if (viewHistory.length > 0) {
      viewHistory[viewHistory.length - 1] = { view: 'lesson', phaseIdx: currentPhaseIdx };
    }
    navigateToVideoView(lesson, mod);
  }

  // ── Breadcrumb ────────────────────────────────────────
  function updateBreadcrumb() {
    if (!breadcrumb) return;
    const activeView = document.querySelector('.view.active');
    let html = '';

    if (activeView === phaseView) {
      html = '<span class="breadcrumb-item current">Phases</span>';
    } else if (activeView === lessonView && currentPhaseIdx >= 0) {
      const phase = PHASES[currentPhaseIdx];
      html = `<span class="breadcrumb-item clickable" data-nav="phase">Phases</span>` +
             `<span class="breadcrumb-chevron">›</span>` +
             `<span class="breadcrumb-item current">${phase.name}</span>`;
    } else if (activeView === videoView && currentLesson) {
      const phase = currentPhaseIdx >= 0 ? PHASES[currentPhaseIdx] : null;
      html = `<span class="breadcrumb-item clickable" data-nav="phase">Phases</span>` +
             (phase ? `<span class="breadcrumb-chevron">›</span><span class="breadcrumb-item clickable" data-nav="lesson">${phase.name}</span>` : '') +
             `<span class="breadcrumb-chevron">›</span>` +
             `<span class="breadcrumb-item current">${currentLesson.title}</span>`;
    } else {
      html = '<span class="breadcrumb-item current">Phases</span>';
    }

    breadcrumb.innerHTML = html;

    // Attach click handlers to clickable breadcrumb items
    breadcrumb.querySelectorAll('.breadcrumb-item.clickable').forEach(item => {
      item.addEventListener('click', function () {
        const nav = this.dataset.nav;
        if (nav === 'phase') {
          saveCurrentNote();
          // Enter PiP if a video is playing
          if (player && currentLesson && videoView.classList.contains('active')) {
            enterPipMode();
          } else {
            stopPlayback();
          }
          viewHistory = [];
          currentPhaseIdx = -1;
          showView('phase', 'back');
          updateBreadcrumb();
        } else if (nav === 'lesson') {
          saveCurrentNote();
          goBack();
        }
      });
    });
  }

  // ── View Manager ──────────────────────────────────────────
  function showView(viewName, direction) {
    const oldActive = document.querySelector('.view.active');
    const newView = viewName === 'phase' ? phaseView : viewName === 'lesson' ? lessonView : videoView;

    // No-op if the target view is already active
    if (oldActive === newView) return;

    // Animate old view out
    if (oldActive && direction) {
      const exitClass = direction === 'forward' ? 'slide-forward-out' : 'slide-back-out';
      oldActive.classList.remove('active');
      oldActive.classList.add(exitClass);
      setTimeout(() => oldActive.classList.remove(exitClass), 350);
    } else if (oldActive) {
      oldActive.classList.remove('active');
    }

    // Animate new view in
    if (direction) {
      const enterClass = direction === 'forward' ? 'slide-forward-in' : 'slide-back-in';
      newView.classList.add(enterClass, 'active');
      setTimeout(() => newView.classList.remove(enterClass), 400);
    } else {
      newView.classList.add('active');
    }
  }

  function navigateToLessonView(phaseIdx) {
    viewHistory.push({ view: 'phase', phaseIdx: currentPhaseIdx });
    currentPhaseIdx = phaseIdx;
    const phase = PHASES[phaseIdx];
    lessonViewTitle.innerHTML = `<span class="text-zinc-500 font-normal">${phase.icon}</span> ${phase.name}`;
    lessonSearch.value = '';
    lessonSearchClear.classList.add('hidden');
    renderLessonCards(phaseIdx);
    showView('lesson', 'forward');
    lessonView.querySelector('.custom-scroll').scrollTop = 0;
    updateBreadcrumb();
  }

  function navigateToVideoView(lesson, mod) {
    // If PiP is active, exit it and restore full view
    if (pipActive) exitPipMode();
    viewHistory.push({ view: 'lesson', phaseIdx: currentPhaseIdx });
    currentLesson = lesson;
    currentModule = mod;
    videoLessonTitle.textContent = lesson.title;
    videoModuleTitle.textContent = mod.title;
    showView('video', 'forward');

    // Enable manual completion — checkbox is fully interactive
    markComplete.disabled = false;
    completeLabel.style.opacity = '1';
    completeLabel.style.cursor = 'pointer';
    completeLabel.title = 'Click to mark this lesson as complete';
    markComplete.classList.remove('cursor-not-allowed');
    notesArea.disabled = false;
    notesArea.classList.remove('cursor-not-allowed');
    updateCompleteCheckbox();
    loadNoteForLesson(lesson.id);
    updateWatchBar();
    clearSectionsUI();
    renderSections();

    // Update next/prev button states
    updateNavButtons();

    // Clear loop
    clearLoop();

    // Load video
    if (player && typeof player.loadVideoById === 'function') {
      player.loadVideoById(lesson.youtube_id);
    } else {
      createPlayer(lesson.youtube_id);
    }

    // Scroll controls to top
    const scroll = videoView.querySelector('.custom-scroll');
    if (scroll) scroll.scrollTop = 0;
    updateBreadcrumb();
  }

  function goBack() {
    saveCurrentNote();
    // If coming from video view and player exists, enter PiP mode
    if (videoView.classList.contains('active') && player && currentLesson) {
      enterPipMode();
    } else {
      stopPlayback();
    }
    if (viewHistory.length === 0) {
      showView('phase', 'back');
      currentPhaseIdx = -1;
      return;
    }
    const prev = viewHistory.pop();
    if (prev.view === 'phase') {
      currentPhaseIdx = prev.phaseIdx;
      showView('phase', 'back');
    } else if (prev.view === 'lesson') {
      currentPhaseIdx = prev.phaseIdx;
      const phase = PHASES[currentPhaseIdx];
      lessonViewTitle.innerHTML = `<span class="text-zinc-500 font-normal">${phase.icon}</span> ${phase.name}`;
      renderLessonCards(currentPhaseIdx);
      showView('lesson', 'back');
    }
    updateBreadcrumb();
    if (document.querySelector('.view.active') === phaseView) renderHero();
  }

  // ── localStorage Helpers ─────────────────────────────────
  const STORAGE_KEY = 'gospel_piano_completed';
  const NOTES_KEY = 'gospel_piano_notes';

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) completedLessons = new Set(JSON.parse(raw));
    } catch (e) { completedLessons = new Set(); }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedLessons]));
  }

  function markLessonComplete(lessonId) {
    if (completedLessons.has(lessonId)) return;
    completedLessons.add(lessonId);
    saveProgress();
    updateProgressUI();
    updateCompleteCheckbox();
    updateWatchBar();
    refreshLessonCards();
    refreshPhaseCards();
    checkAchievements(lessonId);
    renderHero();
  }

  // ── Notes ────────────────────────────────────────────────
  const WATCH_KEY = 'gospel_piano_watch';

  function loadNotes() {
    try { notesData = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'); } catch (e) { notesData = {}; }
  }

  function loadWatchProgress() {
    try { watchProgress = JSON.parse(localStorage.getItem(WATCH_KEY) || '{}'); } catch (e) { watchProgress = {}; }
  }

  function loadSections() {
    try { sectionsData = JSON.parse(localStorage.getItem('gospel_piano_sections') || '{}'); } catch (e) { sectionsData = {}; }
  }

  function loadAchievements() {
    try {
      const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (raw) achievements = new Set(JSON.parse(raw));
    } catch (e) { achievements = new Set(); }
    updateBadgeCountUI();
  }

  function saveAchievements() {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...achievements]));
  }

  function updateBadgeCountUI() {
    if (badgeCount) badgeCount.textContent = achievements.size;
  }

  function saveWatchProgress() { localStorage.setItem(WATCH_KEY, JSON.stringify(watchProgress)); }
  function saveSections() { localStorage.setItem('gospel_piano_sections', JSON.stringify(sectionsData)); }

  function saveNotes() { localStorage.setItem(NOTES_KEY, JSON.stringify(notesData)); }

  function saveCurrentNote() {
    if (!currentLesson) return;
    const text = notesArea.value.trim();
    if (text) notesData[currentLesson.id] = text;
    else delete notesData[currentLesson.id];
    saveNotes();
  }

  function loadNoteForLesson(lessonId) { notesArea.value = notesData[lessonId] || ''; }

  function flashNotesSaved() {
    notesSaved.classList.remove('hidden');
    clearTimeout(notesSaveTimer);
    notesSaveTimer = setTimeout(() => notesSaved.classList.add('hidden'), 1500);
  }

  // ── Render Phase Cards ────────────────────────────────────
  function renderPhaseCards() {
    if (!modules.length) return;

    let html = '';
    PHASES.forEach((phase, i) => {
      const phaseMods = modules.filter(m => m.sort_order >= phase.range[0] && m.sort_order <= phase.range[1]);
      const totalLessons = phaseMods.reduce((s, m) => s + m.lessons.length, 0);
      const done = phaseMods.reduce((s, m) => s + m.lessons.filter(l => completedLessons.has(l.id)).length, 0);
      const pct = totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0;
      const isDone = pct === 100;

      html += `
      <div class="phase-card rounded-2xl border p-5 sm:p-6 md:p-7 flex flex-col gap-4"
           style="background: rgba(24,24,27,0.8); border-color: rgba(255,255,255,0.06);"
           data-phase-idx="${i}"
           onmousemove="const r=this.getBoundingClientRect();this.style.setProperty('--mx',((event.clientX-r.left)/r.width*100)+'%');this.style.setProperty('--my',((event.clientY-r.top)/r.height*100)+'%')">
        <div class="phase-card-accent" style="background: ${phase.color}; ${isDone ? 'box-shadow: 0 0 12px ' + phase.color : ''}"></div>

        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <span class="text-3xl sm:text-4xl flex-shrink-0" style="filter: drop-shadow(0 0 6px ${phase.color}44);">${phase.icon}</span>
            <div class="min-w-0">
              <h3 class="text-lg sm:text-xl font-bold text-zinc-200 truncate">${phase.name}</h3>
              <p class="text-xs sm:text-sm text-zinc-500 mt-0.5">${phase.desc}</p>
            </div>
          </div>
          ${isDone ? '<span class="flex-shrink-0 text-brand" style="width:1.5rem;height:1.5rem" title="Complete!">' + ICONS.trophy + '</span>' : ''}
        </div>

        <div class="flex items-center gap-4 text-xs text-zinc-500">
          <span>${phaseMods.length} modules</span>
          <span>·</span>
          <span>${totalLessons} lessons</span>
          <span>·</span>
          <span class="phase-stat-complete ${isDone ? 'text-brand font-semibold' : ''}">${done}/${totalLessons} complete</span>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-mono font-semibold ${isDone ? 'text-brand' : 'text-zinc-600'}">${pct}%</span>
          </div>
          <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700 ease-out shimmer-bar"
                 style="width:${pct}%; background:${phase.color}; ${isDone ? 'box-shadow: 0 0 10px ' + phase.color : ''}"></div>
          </div>
        </div>

        <div class="mt-auto pt-2">
          <span class="inline-flex items-center gap-1 text-xs font-semibold" style="color: ${phase.color};">
            ${isDone ? 'Review lessons' : pct > 0 ? 'Continue learning' : 'Start learning'}
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>`;
    });

    phaseGrid.innerHTML = html;

    phaseGrid.querySelectorAll('.phase-card').forEach(card => {
      card.addEventListener('click', function () {
        const idx = parseInt(this.dataset.phaseIdx, 10);
        navigateToLessonView(idx);
      });
    });
  }

  function refreshPhaseCards() {
    if (!modules.length) return;
    const cards = phaseGrid.querySelectorAll('.phase-card');
    PHASES.forEach((phase, i) => {
      if (i >= cards.length) return;
      const card = cards[i];
      const phaseMods = modules.filter(m => m.sort_order >= phase.range[0] && m.sort_order <= phase.range[1]);
      const totalLessons = phaseMods.reduce((s, m) => s + m.lessons.length, 0);
      const done = phaseMods.reduce((s, m) => s + m.lessons.filter(l => completedLessons.has(l.id)).length, 0);
      const pct = totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0;
      const isDone = pct === 100;

      const bar = card.querySelector('.h-full.rounded-full');
      if (bar) { bar.style.width = `${pct}%`; bar.style.boxShadow = isDone ? `0 0 10px ${phase.color}` : ''; }

      const pctSpan = card.querySelector('.font-mono');
      if (pctSpan) { pctSpan.textContent = `${pct}%`; pctSpan.className = `font-mono font-semibold text-xs ${isDone ? 'text-brand' : 'text-zinc-600'}`; }

      const completeSpan = card.querySelector('.phase-stat-complete');
      if (completeSpan) {
        completeSpan.textContent = `${done}/${totalLessons} complete`;
        completeSpan.className = `phase-stat-complete ${isDone ? 'text-brand font-semibold' : ''}`;
      }

      const accent = card.querySelector('.phase-card-accent');
      if (accent) accent.style.boxShadow = isDone ? `0 0 12px ${phase.color}` : '';

      const cta = card.querySelector('.mt-auto span');
      if (cta) cta.innerHTML = `${isDone ? 'Review lessons' : pct > 0 ? 'Continue learning' : 'Start learning'} <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;

      const trophy = card.querySelector('span[title="Complete!"]');
      if (isDone && !trophy) {
        const iconDiv = card.querySelector('.flex.items-start');
        if (iconDiv) iconDiv.insertAdjacentHTML('beforeend', '<span class="flex-shrink-0 text-lg" title="Complete!">🏆</span>');
      } else if (!isDone && trophy) {
        trophy.remove();
      }
    });
  }

  // ── Render Lesson Cards ──────────────────────────────────
  function renderLessonCards(phaseIdx) {
    if (!modules.length) return;

    const phase = PHASES[phaseIdx];
    const phaseMods = modules.filter(m => m.sort_order >= phase.range[0] && m.sort_order <= phase.range[1]);
    const query = lessonSearch.value.toLowerCase().trim();

    let html = '';
    let totalVisible = 0;

    phaseMods.forEach(mod => {
      const filteredLessons = query
        ? mod.lessons.filter(l => l.title.toLowerCase().includes(query) || (l.description && l.description.toLowerCase().includes(query)))
        : mod.lessons;

      if (filteredLessons.length === 0) return;
      totalVisible += filteredLessons.length;

      const modDone = mod.lessons.filter(l => completedLessons.has(l.id)).length;

      html += `
      <div class="module-section">
        <div class="module-section-header flex items-center gap-3 px-3 py-2.5 rounded-lg mb-3" style="background: rgba(24,24,27,0.9); border: 1px solid rgba(255,255,255,0.04);">
          <span class="text-sm font-semibold text-zinc-300 truncate">${mod.title}</span>
          ${mod.sort_order <= 6 ? '<span class="wpa-attribution" title="Videos from Worship Piano Academy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:0.65rem;height:0.65rem;display:inline-block;vertical-align:middle;margin-right:2px"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> WPA</span>' : ''}
          ${mod.difficulty ? `<span class="diff-badge diff-${(mod.difficulty || '').toLowerCase().replace(/\s+/g, '-').replace(/[\/+]/g, '')}">${mod.difficulty}</span>` : ''}
          <span class="text-xs text-zinc-600 ml-auto flex-shrink-0">${modDone}/${mod.lessons.length}</span>
        </div>

        <div class="lesson-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          ${filteredLessons.map((lesson, li) => {
            const isComplete = completedLessons.has(lesson.id);
            const thumbUrl = `https://img.youtube.com/vi/${lesson.youtube_id}/mqdefault.jpg`;
            return `
            <div class="lesson-card rounded-xl border overflow-hidden flex flex-col ${isComplete ? 'completed' : ''}"
                 style="background: rgba(24,24,27,0.7); border-color: rgba(255,255,255,0.06);"
                 data-lesson-id="${lesson.id}"
                 data-module-id="${mod.id}"
                 data-video-id="${lesson.youtube_id}"
                 onmousemove="const r=this.getBoundingClientRect();this.style.setProperty('--mx',((event.clientX-r.left)/r.width*100)+'%');this.style.setProperty('--my',((event.clientY-r.top)/r.height*100)+'%')">
              <!-- Thumbnail -->
              <div class="relative w-full" style="aspect-ratio:16/9">
                <img src="${thumbUrl}" alt="${escapeHtml(lesson.title)}" loading="lazy" class="absolute inset-0 w-full h-full object-cover" style="background:#18181b" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                ${isComplete ? '<span class="absolute top-2 right-2 bg-brand text-zinc-900 text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">✓ Done</span>' : ''}
              </div>
              <!-- Card Body -->
              <div class="p-4 flex flex-col gap-2.5 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-xs font-mono font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isComplete ? 'bg-brand text-zinc-900' : 'bg-zinc-700 text-zinc-400'}" style="font-size:0.6rem;">
                      ${isComplete ? '✓' : li + 1}
                    </span>
                    <h4 class="text-sm font-semibold text-zinc-200 leading-snug line-clamp-2 ${isComplete ? 'line-through decoration-brand/60 opacity-70' : ''}">${lesson.title}</h4>
                  </div>
                </div>
                ${lesson.description ? `<p class="text-xs text-zinc-500 leading-relaxed line-clamp-2">${lesson.description}</p>` : ''}
                <div class="mt-auto flex items-center gap-2 text-[0.6rem] text-zinc-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Play tutorial</span>
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    });

    if (totalVisible === 0) {
      html = `
      <div class="flex flex-col items-center justify-center py-16 text-zinc-600 gap-3">
        <span style="width:2rem;height:2rem;color:#52525b" class="no-results-icon">${ICONS.search}</span>
        <p class="font-medium text-zinc-500">No results found</p>
        <p class="text-xs text-zinc-700">Try a different keyword</p>
      </div>`;
    }

    lessonGrid.innerHTML = html;

    if (query) lessonSearchClear.classList.remove('hidden');
    else lessonSearchClear.classList.add('hidden');

    lessonGrid.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', function () {
        const lessonId = parseInt(this.dataset.lessonId, 10);
        const modId = parseInt(this.dataset.moduleId, 10);
        const mod = modules.find(m => m.id === modId);
        const lesson = mod ? mod.lessons.find(l => l.id === lessonId) : null;
        if (!lesson || !mod) return;
        saveCurrentNote();
        navigateToVideoView(lesson, mod);
      });
    });
  }

  function refreshLessonCards() {
    if (currentPhaseIdx < 0) return;
    if (!lessonView.classList.contains('active')) return;
    renderLessonCards(currentPhaseIdx);
  }

  // ── Video Control Tabs ──────────────────────────────────
  function switchTab(tabName) {
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    // Update panel visibility
    [speedTabPanel, sectionsTabPanel, progressTabPanel].forEach(panel => {
      if (!panel) return;
      panel.classList.remove('active');
    });
    const target = document.getElementById(tabName === 'playback' ? 'speed-tab-panel' : tabName + '-tab-panel');
    if (target) target.classList.add('active');
  }

  // ── Hero Section ─────────────────────────────────────────
  function renderHero() {
    if (!heroSection || !modules.length) return;
    const allLessons = modules.flatMap(m => m.lessons);
    const nextIncomplete = allLessons.find(l => !completedLessons.has(l.id));
    const done = completedLessons.size;
    const total = allLessons.length;

    if (!nextIncomplete && total > 0) {
      // All done!
      heroSection.innerHTML = `          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-4">
            <span style="width:1.25rem;height:1.25rem;color:#f59e0b">${ICONS.trophy}</span>
            <span class="text-xs sm:text-sm text-brand font-semibold">All ${total} lessons complete!</span>
          </div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
          <span class="text-brand">Amazing</span>
          <span class="text-zinc-200"> Work!</span>
        </h2>
        <p class="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto">
          You've mastered every lesson. Revisit any phase to keep your skills sharp.
        </p>`;
    } else if (nextIncomplete) {
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const nextMod = modules.find(m => m.lessons.some(l => l.id === nextIncomplete.id));
      const nextPhaseIdx = PHASES.findIndex(p => nextMod && nextMod.sort_order >= p.range[0] && nextMod.sort_order <= p.range[1]);
      const nextPhase = nextPhaseIdx >= 0 ? PHASES[nextPhaseIdx] : null;
      heroSection.innerHTML = `
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/30 mb-4">
          <span class="text-xs text-zinc-500">${pct}% complete</span>
          <div class="h-1.5 w-12 bg-zinc-700 rounded-full overflow-hidden flex-shrink-0">
            <div class="h-full bg-brand rounded-full" style="width:${pct}%"></div>
          </div>
        </div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
          <span class="text-brand">Continue</span>
          <span class="text-zinc-200"> Learning</span>
        </h2>
        <button id="hero-cta" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-brand text-zinc-900 hover:bg-brand-light transition shadow-lg shadow-brand/20 hover:shadow-brand/30 active:scale-95 mb-3"
                data-phase-idx="${nextPhaseIdx}" data-lesson-id="${nextIncomplete.id}" data-module-id="${nextMod ? nextMod.id : ''}">
          ${nextPhase ? '<span style="width:1.25rem;height:1.25rem">' + nextPhase.icon + '</span>' : '<span style="width:1.25rem;height:1.25rem">' + ICONS.piano + '</span>'} Jump back in: <span class="underline underline-offset-2">${escapeHtml(nextIncomplete.title)}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <p class="text-zinc-500 text-xs sm:text-sm">${nextPhase ? nextPhase.name + ' phase' : ''} · ${nextMod ? escapeHtml(nextMod.title) : ''}</p>`;
      // Bind CTA click
      setTimeout(() => {
        const cta = document.getElementById('hero-cta');
        if (cta) {
          cta.addEventListener('click', function () {
            const phaseIdx = parseInt(this.dataset.phaseIdx, 10);
            const lessonId = parseInt(this.dataset.lessonId, 10);
            const modId = parseInt(this.dataset.moduleId, 10);
            if (phaseIdx >= 0 && lessonId && modId) {
              const mod = modules.find(m => m.id === modId);
              const lesson = mod ? mod.lessons.find(l => l.id === lessonId) : null;
              if (lesson && mod) {
                currentPhaseIdx = phaseIdx;
                viewHistory = [{ view: 'phase', phaseIdx: -1 }];
                navigateToVideoView(lesson, mod);
              }
            }
          });
        }
      }, 0);
    }
  }

  function showNextLessonPrompt() {
    if (!currentLesson) return;
    const phaseLessons = getPhaseLessons();
    const idx = phaseLessons.findIndex(pl => pl.lesson.id === currentLesson.id);
    if (idx < 0 || idx >= phaseLessons.length - 1) return;
    const next = phaseLessons[idx + 1];
    const prompt = document.createElement('div');
    prompt.className = 'achievement-toast bg-zinc-800/90 backdrop-blur border border-brand/30 rounded-xl p-3 flex items-center gap-3 shadow-2xl cursor-pointer';
    prompt.style.cssText = 'width:300px;';
    prompt.innerHTML = '<span style="width:1.25rem;height:1.25rem;color:#34d399" class="flex-shrink-0">' + ICONS.check + '</span><div class="flex-1 min-w-0"><p class="text-xs text-zinc-400">Lesson complete!</p><p class="text-sm font-semibold text-zinc-200 truncate">Next: ' + escapeHtml(next.lesson.title) + '</p></div><button class="next-prompt-btn flex-shrink-0 px-3 py-1.5 rounded-lg bg-brand text-zinc-900 text-xs font-semibold hover:bg-brand-light transition">Next →</button>';
    let autoDismiss = setTimeout(function () { dismissToast(prompt); }, 8000);
    prompt.addEventListener('click', function (e) {
      if (e.target.closest('.next-prompt-btn')) {
        clearTimeout(autoDismiss);
        dismissToast(prompt);
        saveCurrentNote();
        stopPlayback();
        navigateToVideoView(next.lesson, next.module);
        return;
      }
      clearTimeout(autoDismiss);
      dismissToast(prompt);
    });
    if (toastContainer) toastContainer.prepend(prompt);
  }

  let youtubeApiReady = false;
  let pendingVideoId = null;

  function createPlayer(videoId) {
    if (typeof YT === 'undefined' || !YT.Player) {
      pendingVideoId = videoId;
      return;
    }
    playerContainer.innerHTML = '';
    player = new YT.Player('player-container', {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: { autoplay: 0, modestbranding: 1, rel: 0, fs: 1, controls: 1, iv_load_policy: 3, origin: window.location.origin },
      events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange, onError: onPlayerError },
    });
  }

  function onPlayerReady() {
    player.setPlaybackRate(currentSpeed);
    updateSpeedButtons();
    updateLoopControls();
    renderSections();
  }

  function onPlayerStateChange(event) {
    if (event.data === 1) { // playing
      startWatchMonitoring();
      if (loopA !== null && loopB !== null) startLoopMonitoring();
    } else {
      stopWatchMonitoring();
    }
    updateMiniPlayButton();
  }

  function onPlayerError(event) {
    // YouTube player errors — 101/150 usually mean embedding disabled
    console.warn('YouTube player error:', event.data);
    if (player && typeof player.destroy === 'function') player.destroy();
    player = null;
    showVideoFallback(currentLesson ? currentLesson.youtube_id : null);
  }

  function resetPlayerPlaceholder() {
    playerContainer.innerHTML = '<div class="text-center empty-glow px-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;color:rgba(245,158,11,0.5);margin:0 auto 1rem" class="sm:w-14 sm:h-14"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 20V10"/><path d="M10 20V10"/><path d="M14 20V4"/><path d="M18 20V10"/></svg><p class="text-lg sm:text-xl font-semibold text-zinc-400 mb-1">Ready to Learn</p><p class="text-xs sm:text-sm text-zinc-600">Select a lesson card to start playing</p></div>';
  }

  function showVideoFallback(videoId) {
    if (!videoId) return;
    const watchUrl = 'https://www.youtube.com/watch?v/' + videoId;
    playerContainer.innerHTML = `
      <div class="video-fallback flex flex-col items-center justify-center text-center px-6 py-10 gap-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:2.5rem;height:2.5rem;color:#ef4444"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        <div>
          <p class="text-base sm:text-lg font-semibold text-zinc-300 mb-1">Video unavailable in embedded player</p>
          <p class="text-xs sm:text-sm text-zinc-500 max-w-sm">This video's uploader has disabled embedding. You can still watch it directly on YouTube.</p>
        </div>
        <a href="${watchUrl}" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-red-600 text-white hover:bg-red-500 transition shadow-lg shadow-red-600/20 hover:shadow-red-500/30 active:scale-95 no-underline">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
          Watch on YouTube
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <button id="fallback-dismiss-btn" class="text-xs text-zinc-600 hover:text-zinc-400 transition mt-2 underline cursor-pointer bg-transparent border-none">Dismiss</button>
      </div>`;
    // Attach cleaner dismiss handler
    setTimeout(() => {
      const dismissBtn = document.getElementById('fallback-dismiss-btn');
      if (dismissBtn) dismissBtn.addEventListener('click', resetPlayerPlaceholder);
    }, 0);
  }

  function stopPlayback() {
    stopWatchMonitoring();
    stopMetronome();
    if (player && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
  }

  // ── Watch Progress Monitoring (auto-complete) ──────────
  function startWatchMonitoring() {
    stopWatchMonitoring();
    watchInterval = setInterval(checkWatchProgress, 2000);
  }

  function stopWatchMonitoring() {
    if (watchInterval) { clearInterval(watchInterval); watchInterval = null; }
  }

  function checkWatchProgress() {
    if (!player || !currentLesson) return;
    if (typeof player.getDuration !== 'function' || typeof player.getCurrentTime !== 'function') return;
    const duration = player.getDuration();
    if (!duration || duration <= 0) return;
    const pct = player.getCurrentTime() / duration;
    const prev = watchProgress[currentLesson.id] || 0;
    const maxPct = Math.max(prev, pct);
    if (maxPct > prev) {
      watchProgress[currentLesson.id] = maxPct;
      saveWatchProgress();
    }
    updateWatchBar();
    if (maxPct >= WATCH_THRESHOLD && !completedLessons.has(currentLesson.id)) {
      markLessonComplete(currentLesson.id);
      stopWatchMonitoring();
      showNextLessonPrompt();
    }
  }

  function updateWatchBar() {
    const watchFill = document.getElementById('watch-progress-fill');
    const watchPct = document.getElementById('watch-pct');
    if (!watchFill || !watchPct || !currentLesson) return;
    const rawPct = (watchProgress[currentLesson.id] || 0) * 100;
    const displayPct = Math.min(rawPct, 100);
    watchFill.style.width = displayPct + '%';
    watchPct.textContent = Math.round(displayPct) + '%';
    const isComplete = completedLessons.has(currentLesson.id);
    if (isComplete) {
      watchFill.classList.add('watch-complete');
    } else {
      watchFill.classList.remove('watch-complete');
    }
    // Reposition section markers as the bar width changes
    renderSectionMarkers();
  }

  // ── Sections (bookmarked timestamps) ───────────────────
  function clearSectionsUI() {
    if (sectionMarkers) sectionMarkers.innerHTML = '';
    if (sectionList) sectionList.innerHTML = '';
    if (sectionsEmpty) sectionsEmpty.classList.remove('hidden');
    if (addSectionBtn) addSectionBtn.disabled = true;
  }

  function addSection() {
    if (!currentLesson || !player) return;
    if (typeof player.getCurrentTime !== 'function' || typeof player.getDuration !== 'function') return;
    const duration = player.getDuration();
    if (!duration || duration <= 0) return;
    const wasPlaying = typeof player.getPlayerState === 'function' && player.getPlayerState() === 1;
    player.pauseVideo();
    const label = prompt('Section label (e.g. "Chorus voicing"):');
    if (label === null) {
      // User cancelled — resume if was playing
      if (wasPlaying) player.playVideo();
      return;
    }
    const trimmed = label.trim();
    if (!trimmed) {
      if (wasPlaying) player.playVideo();
      return;
    }
    const timestamp = player.getCurrentTime();
    const entry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), label: trimmed, timestamp };
    if (!sectionsData[currentLesson.id]) sectionsData[currentLesson.id] = [];
    sectionsData[currentLesson.id].push(entry);
    // Sort by timestamp ascending
    sectionsData[currentLesson.id].sort((a, b) => a.timestamp - b.timestamp);
    saveSections();
    renderSections();
    if (wasPlaying) player.playVideo();
  }

  function renderSections() {
    renderSectionMarkers();
    renderSectionList();
  }

  function renderSectionMarkers() {
    if (!sectionMarkers || !currentLesson || !player) return;
    if (typeof player.getDuration !== 'function') return;
    const duration = player.getDuration();
    if (!duration || duration <= 0) { sectionMarkers.innerHTML = ''; return; }
    const sections = sectionsData[currentLesson.id] || [];
    sectionMarkers.innerHTML = sections.map(s => {
      const leftPct = (s.timestamp / duration) * 100;
      return `<span class="section-marker" style="left:${leftPct}%" data-seek="${s.timestamp}" title="${escapeHtml(s.label)} — ${formatTime(s.timestamp)}"></span>`;
    }).join('');
    // Bind click handlers
    sectionMarkers.querySelectorAll('.section-marker').forEach(marker => {
      marker.addEventListener('click', function (e) {
        e.stopPropagation();
        const seek = parseFloat(this.dataset.seek);
        seekToSection(seek);
      });
    });
  }

  function renderSectionList() {
    if (!sectionList || !sectionsEmpty || !currentLesson) return;
    const sections = sectionsData[currentLesson.id] || [];
    if (sections.length === 0) {
      sectionList.innerHTML = '';
      sectionsEmpty.classList.remove('hidden');
      if (addSectionBtn) addSectionBtn.disabled = !player || !(typeof player.getDuration === 'function' && player.getDuration() > 0);
      return;
    }
    sectionsEmpty.classList.add('hidden');
    if (addSectionBtn) addSectionBtn.disabled = false;
    sectionList.innerHTML = sections.map(s => `
      <div class="section-item">
        <span class="section-item-label" data-seek="${s.timestamp}" title="Seek to ${formatTime(s.timestamp)}">${escapeHtml(s.label)}</span>
        <span class="section-item-time" data-seek="${s.timestamp}" title="Seek to ${formatTime(s.timestamp)}">${formatTime(s.timestamp)}</span>
        <button class="section-item-delete" data-delete="${s.id}" title="Remove section">×</button>
      </div>
    `).join('');
    // Bind click handlers
    sectionList.querySelectorAll('.section-item-label, .section-item-time').forEach(el => {
      el.addEventListener('click', function () {
        seekToSection(parseFloat(this.dataset.seek));
      });
    });
    sectionList.querySelectorAll('.section-item-delete').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        removeSection(this.dataset.delete);
      });
    });
  }

  function seekToSection(timestamp) {
    if (!player || typeof player.seekTo !== 'function') return;
    player.seekTo(timestamp, true);
    if (typeof player.playVideo === 'function') player.playVideo();
  }

  function removeSection(sectionId) {
    if (!currentLesson || !sectionsData[currentLesson.id]) return;
    sectionsData[currentLesson.id] = sectionsData[currentLesson.id].filter(s => s.id !== sectionId);
    if (sectionsData[currentLesson.id].length === 0) delete sectionsData[currentLesson.id];
    saveSections();
    renderSections();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Achievements ────────────────────────────────────────
  function checkAchievements(lessonId) {
    if (!modules.length) return;

    // Locate the module this lesson belongs to
    let targetMod = null;
    for (const m of modules) {
      if (m.lessons.some(l => l.id === lessonId)) {
        targetMod = m;
        break;
      }
    }
    if (!targetMod) return;

    // Check Module Badge — all lessons in this module complete?
    const modId = 'module_' + targetMod.id;
    const modEarned = targetMod.lessons.every(l => completedLessons.has(l.id));      if (modEarned && !achievements.has(modId)) {
        grantAchievement(modId, 'Module Complete!', targetMod.title, ICONS.trophy, '#fbbf24');
      }

    // Find which phase this module belongs to
    let targetPhaseIdx = -1;
    for (let i = 0; i < PHASES.length; i++) {
      const p = PHASES[i];
      if (targetMod.sort_order >= p.range[0] && targetMod.sort_order <= p.range[1]) {
        targetPhaseIdx = i;
        break;
      }
    }

    // Check Phase Badge — all lessons in this phase complete?
    if (targetPhaseIdx >= 0) {
      const phase = PHASES[targetPhaseIdx];
      const phaseId = 'phase_' + targetPhaseIdx;
      const phaseMods = modules.filter(m => m.sort_order >= phase.range[0] && m.sort_order <= phase.range[1]);
      const allLessons = phaseMods.flatMap(m => m.lessons);
      const phaseEarned = allLessons.length > 0 && allLessons.every(l => completedLessons.has(l.id));
      if (phaseEarned && !achievements.has(phaseId)) {
        grantAchievement(phaseId, 'Phase Certified!', phase.name, phase.icon, phase.color);
      }
    }
  }

  function grantAchievement(id, subtitle, name, icon, color) {
    achievements.add(id);
    saveAchievements();
    updateBadgeCountUI();

    const toast = document.createElement('div');
    toast.className = 'achievement-toast bg-zinc-800/90 backdrop-blur border rounded-xl p-3 flex shadow-2xl';
    toast.style.cssText = 'width:280px;border-color:' + color + ';';
    toast.innerHTML = `
      <div class="flex items-center justify-center w-12 h-12 rounded-full border bg-zinc-900 border-zinc-700/50 flex-shrink-0 text-2xl mr-3" style="box-shadow: 0 0 15px ${color}33">${icon}</div>
      <div class="flex-1 min-w-0 flex flex-col justify-center">
        <p class="text-[0.65rem] font-bold uppercase tracking-wider" style="color:${color}">${subtitle}</p>
        <p class="text-sm font-semibold text-zinc-100 truncate">${escapeHtml(name)}</p>
      </div>
    `;

    let autoDismiss = setTimeout(() => dismissToast(toast), 5000);
    toast.addEventListener('click', function () {
      clearTimeout(autoDismiss);
      dismissToast(toast);
    });

    if (toastContainer) toastContainer.prepend(toast);
  }

  function dismissToast(toast) {
    if (toast.classList.contains('dismissing')) return;
    toast.classList.add('dismissing');
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
  }

  // ── Badge Gallery ────────────────────────────────────────
  function openBadgeGallery() {
    renderGallery();
    badgeModal.classList.add('show');
  }

  function closeBadgeGallery() {
    badgeModal.classList.remove('show');
  }

  function renderGallery() {
    if (!galleryPhases || !galleryModules) return;

    // Phase badges
    galleryPhases.innerHTML = PHASES.map((phase, i) => {
      const isEarned = achievements.has('phase_' + i);
      return `
      <div class="gallery-badge border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 ${isEarned ? 'bg-zinc-800/50' : 'bg-zinc-900/50 opacity-40'}"
           style="border-color: ${isEarned ? phase.color : '#3f3f46'}">
        <span class="text-4xl" style="filter: ${isEarned ? 'drop-shadow(0 0 10px ' + phase.color + '66)' : 'grayscale(1)'}">${phase.icon}</span>
        <span class="text-[0.65rem] sm:text-xs font-bold leading-tight" style="color: ${isEarned ? '#fff' : '#71717a'}">${phase.name}</span>
        ${isEarned ? '<span class="text-[0.55rem] text-brand font-semibold">Earned</span>' : '<span class="text-[0.55rem] text-zinc-600">Locked</span>'}
      </div>`;
    }).join('');

    // Module badges
    galleryModules.innerHTML = modules.map(m => {
      const isEarned = achievements.has('module_' + m.id);
      return `
      <div class="gallery-badge border rounded-xl p-3 flex items-center gap-3 ${isEarned ? 'bg-zinc-800/50' : 'bg-zinc-900/50 opacity-40'}"
           style="border-color: ${isEarned ? '#fbbf24' : '#3f3f46'}">
        <span class="flex-shrink-0" style="width:1.5rem;height:1.5rem;color:#fbbf24;filter: ${isEarned ? 'none' : 'grayscale(1)'}">${ICONS.trophy}</span>
        <div class="flex-1 min-w-0">
          <span class="text-xs font-semibold leading-snug line-clamp-2" style="color: ${isEarned ? '#d4d4d8' : '#71717a'}">${escapeHtml(m.title)}</span>
        </div>
        <span class="text-[0.55rem] flex-shrink-0 ${isEarned ? 'text-brand font-semibold' : 'text-zinc-600'}">${isEarned ? 'Earned' : 'Locked'}</span>
      </div>`;
    }).join('');
  }

  // ── Loop Logic ───────────────────────────────────────────
  function parseTime(str) {
    if (!str || !str.trim()) return null;
    str = str.trim();
    const m = str.match(/^(\d+):(\d+(?:\.\d+)?)$/);
    if (m) return parseInt(m[1], 10) * 60 + parseFloat(m[2]);
    const n = parseFloat(str);
    return isNaN(n) ? null : n;
  }

  function formatTime(seconds) {
    if (seconds === null || seconds === undefined) return '';
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toFixed(1);
    const whole = parseFloat(s);
    const display = whole % 1 === 0 ? String(Math.floor(whole)) : whole.toFixed(1);
    return `${m}:${display.padStart(display.indexOf('.') !== -1 ? 4 : 2, '0')}`;
  }

  function startLoopMonitoring() {
    stopLoopMonitoring();
    loopInterval = setInterval(() => {
      if (!player || typeof player.getCurrentTime !== 'function') return;
      if (typeof player.getPlayerState === 'function' && player.getPlayerState() !== 1) return;
      const t = player.getCurrentTime();
      if (loopB !== null && t >= loopB) {
        if (loopA !== null) player.seekTo(loopA, true);
      }
    }, 150);
  }

  function stopLoopMonitoring() {
    if (loopInterval) { clearInterval(loopInterval); loopInterval = null; }
  }

  function setLoop() {
    const a = parseTime(loopAInput.value);
    const b = parseTime(loopBInput.value);
    if (a === null || b === null) {
      loopStatus.textContent = '⚠\uFE0F Enter valid timestamps (e.g. 0:45 and 1:30)';
      loopStatus.classList.remove('hidden');
      return;
    }
    if (a >= b) {
      loopStatus.textContent = '⚠\uFE0F Point A must be before Point B';
      loopStatus.classList.remove('hidden');
      return;
    }
    loopA = a; loopB = b;
    loopStatus.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:0.75rem;height:0.75rem;display:inline-block;vertical-align:middle;margin-right:2px"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Looping ${formatTime(a)} → ${formatTime(b)}`;
    loopStatus.classList.remove('hidden', 'text-red-400');
    loopStatus.classList.add('text-brand');
    loopToggle.textContent = 'Looping…';
    loopToggle.classList.add('loop-active');
    loopClearBtn.disabled = false;
    if (player && typeof player.getPlayerState === 'function' && player.getPlayerState() === 1) startLoopMonitoring();
  }

  function clearLoop() {
    loopA = null; loopB = null;
    stopLoopMonitoring();
    loopAInput.value = ''; loopBInput.value = '';
    loopStatus.textContent = ''; loopStatus.classList.add('hidden');
    loopStatus.classList.remove('text-brand');
    loopToggle.textContent = 'Set Loop';
    loopToggle.classList.remove('loop-active');
    loopClearBtn.disabled = true;
    updateLoopControls();
  }

  function updateLoopControls() {
    const hasPlayer = player && typeof player.setPlaybackRate === 'function';
    const hasInputs = loopAInput.value.trim() && loopBInput.value.trim();
    loopToggle.disabled = !hasPlayer || !hasInputs;
    if (!hasPlayer || !hasInputs) {
      loopToggle.classList.add('cursor-not-allowed', 'disabled:opacity-50');
    } else {
      loopToggle.classList.remove('cursor-not-allowed', 'disabled:opacity-50');
      if (loopA === null) { loopToggle.classList.remove('loop-active'); loopToggle.textContent = 'Set Loop'; }
    }
  }

  // ── Metronome ────────────────────────────────────────────
  let metroCtx = null;
  let metroIsPlaying = false;
  let metroBpm = 80;
  let metroBeatsPerBar = 4;
  let metroBeatCount = 0;
  let metroNextTime = 0;
  let metroInterval = null;
  let metroVolume = 0.6;
  let tapTimes = [];
  const MAX_TAP_INTERVAL = 2000;
  const MIN_TAP_INTERVAL = 200;

  const metroBpmSlider = document.getElementById('metro-bpm-slider');
  const metroBpmInput = document.getElementById('metro-bpm-input');
  const metroStartBtn = document.getElementById('metro-start-btn');
  const metroStartIcon = document.getElementById('metro-start-icon');
  const metroStartLabel = document.getElementById('metro-start-label');
  const metroTapBtn = document.getElementById('metro-tap-btn');
  const metroTs = document.getElementById('metro-ts');
  const metroVolumeSlider = document.getElementById('metro-volume');
  const metroBeatEl = document.getElementById('metronome-beat');

  function initMetronome() {
    if (!metroBpmSlider || !metroBpmInput || !metroStartBtn) return;

    // BPM slider ↔ input sync
    metroBpmSlider.addEventListener('input', function () {
      metroBpm = parseInt(this.value, 10);
      metroBpmInput.value = metroBpm;
    });
    metroBpmInput.addEventListener('change', function () {
      let val = parseInt(this.value, 10);
      if (isNaN(val)) val = 80;
      val = Math.max(30, Math.min(240, val));
      metroBpm = val;
      this.value = val;
      metroBpmSlider.value = val;
    });

    // Start / Stop
    metroStartBtn.addEventListener('click', function () {
      if (metroIsPlaying) {
        stopMetronome();
      } else {
        startMetronome();
      }
    });

    // Tap tempo
    if (metroTapBtn) {
      metroTapBtn.addEventListener('click', function () {
        const now = Date.now();
        // Clear old taps
        tapTimes = tapTimes.filter(t => now - t < MAX_TAP_INTERVAL);
        // Only count taps at least MIN_TAP_INTERVAL apart
        if (tapTimes.length === 0 || now - tapTimes[tapTimes.length - 1] > MIN_TAP_INTERVAL) {
          tapTimes.push(now);
        }
        if (tapTimes.length >= 2) {
          const intervals = [];
          for (let i = 1; i < tapTimes.length; i++) {
            intervals.push(tapTimes[i] - tapTimes[i - 1]);
          }
          const avg = intervals.reduce((s, v) => s + v, 0) / intervals.length;
          let bpm = Math.round(60000 / avg);
          bpm = Math.max(30, Math.min(240, bpm));
          metroBpm = bpm;
          metroBpmSlider.value = bpm;
          metroBpmInput.value = bpm;
          // Flash the tap button to give feedback
          this.classList.add('text-brand');
          setTimeout(() => this.classList.remove('text-brand'), 200);
        }
      });
    }

    // Time signature
    if (metroTs) {
      metroTs.addEventListener('change', function () {
        metroBeatsPerBar = parseInt(this.value, 10);
        metroBeatCount = 0;
      });
    }

    // Volume
    if (metroVolumeSlider) {
      metroVolumeSlider.addEventListener('input', function () {
        metroVolume = parseInt(this.value, 10) / 100;
      });
    }
  }

  function startMetronome() {
    try {
      if (!metroCtx) {
        metroCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (metroCtx.state === 'suspended') {
        metroCtx.resume();
      }
    } catch (e) {
      console.warn('Metronome: AudioContext not available');
      return;
    }

    metroIsPlaying = true;
    metroBeatCount = 0;
    metroNextTime = metroCtx.currentTime + 0.05;

    if (metroStartIcon) metroStartIcon.textContent = '⏸';
    if (metroStartLabel) metroStartLabel.textContent = 'Stop';
    metroStartBtn.classList.add('loop-active');

    // Schedule beats ahead
    scheduleMetronome();

    // Also use a visual timer as backup
    metroInterval = setInterval(scheduleMetronome, 50);
  }

  function stopMetronome() {
    metroIsPlaying = false;
    if (metroInterval) {
      clearInterval(metroInterval);
      metroInterval = null;
    }
    if (metroStartIcon) metroStartIcon.textContent = '▶';
    if (metroStartLabel) metroStartLabel.textContent = 'Start';
    metroStartBtn.classList.remove('loop-active');
    metroBeatEl.classList.remove('active', 'accent');
  }

  function scheduleMetronome() {
    if (!metroIsPlaying || !metroCtx) return;

    const lookAhead = 0.1; // seconds ahead to schedule
    const intervalSec = 60.0 / metroBpm;

    while (metroNextTime < metroCtx.currentTime + lookAhead) {
      const beatInBar = metroBeatCount % metroBeatsPerBar;
      const isAccent = beatInBar === 0;

      // Schedule click
      playClick(metroCtx, metroNextTime, metroVolume, isAccent);

      // Schedule visual flash
      scheduleBeatFlash(metroNextTime, isAccent);

      metroNextTime += intervalSec;
      metroBeatCount++;
    }
  }

  function playClick(ctx, time, volume, isAccent) {
    // Create a short click sound using an oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const freq = isAccent ? 1200 : 900;
    const clickVol = isAccent ? volume * 0.5 : volume * 0.35;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(clickVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.start(time);
    osc.stop(time + 0.04);
  }

  function scheduleBeatFlash(time, isAccent) {
    const delay = Math.max(0, (time - metroCtx.currentTime) * 1000);
    setTimeout(function () {
      if (!metroIsPlaying) return;
      metroBeatEl.classList.remove('active', 'accent');
      // Force reflow for re-animation
      void metroBeatEl.offsetWidth;
      metroBeatEl.classList.add(isAccent ? 'accent' : 'active');
    }, delay);
  }

  // ── Speed Controls ────────────────────────────────────────
  function setSpeed(speed) {
    currentSpeed = speed;
    if (player && typeof player.setPlaybackRate === 'function') player.setPlaybackRate(speed);
    updateSpeedButtons();
  }

  function updateSpeedButtons() {
    document.querySelectorAll('.speed-btn').forEach(btn => {
      const s = parseFloat(btn.dataset.speed);
      if (s === currentSpeed) btn.classList.add('active-speed');
      else btn.classList.remove('active-speed');
    });
  }

  // ── Mini Player (Picture-in-Picture) ─────────────────
  function enterPipMode() {
    if (!player || !currentLesson) return;
    pipActive = true;
    // Move the YouTube iframe from the main player container to the mini player
    const iframe = playerContainer.querySelector('iframe');
    if (iframe) {
      miniPlayerInner.innerHTML = '';
      miniPlayerInner.appendChild(iframe);
      iframe.style.width = '100%';
      iframe.style.height = '100%';
    }
    updateMiniPlayerTitle();
    updateMiniPlayButton();
    miniPlayer.classList.add('visible');
    stopWatchMonitoring();
  }

  function exitPipMode() {
    if (!pipActive) return;
    pipActive = false;
    stopMetronome();
    // Move the iframe back to the main player container
    const iframe = miniPlayerInner.querySelector('iframe');
    if (iframe) {
      playerContainer.innerHTML = '';
      playerContainer.appendChild(iframe);
      iframe.style.width = '';
      iframe.style.height = '';
    }
    miniPlayer.classList.remove('visible');
    if (currentLesson) {
      videoLessonTitle.textContent = currentLesson.title;
      videoModuleTitle.textContent = currentModule ? currentModule.title : '';
    }
    updateCompleteCheckbox();
    updateWatchBar();
    updateNavButtons();
    clearLoop();
  }

  function closePip() {
    saveCurrentNote();
    pipActive = false;
    miniPlayer.classList.remove('visible');
    if (player && typeof player.destroy === 'function') {
      player.destroy();
    }
    player = null;
    miniPlayerInner.innerHTML = '';
    playerContainer.innerHTML = '<div class="text-center empty-glow px-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;color:rgba(245,158,11,0.5);margin:0 auto 1rem" class="sm:w-14 sm:h-14"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 20V10"/><path d="M10 20V10"/><path d="M14 20V4"/><path d="M18 20V10"/></svg><p class="text-lg sm:text-xl font-semibold text-zinc-400 mb-1">Ready to Learn</p><p class="text-xs sm:text-sm text-zinc-600">Select a lesson card to start playing</p></div>';
    currentLesson = null;
    currentModule = null;
    stopWatchMonitoring();
    stopLoopMonitoring();
    stopMetronome();
  }

  function updateMiniPlayerTitle() {
    miniPlayerTitle.textContent = currentLesson ? currentLesson.title : '—';
  }

  function updateMiniPlayButton() {
    if (!player || typeof player.getPlayerState !== 'function') {
      miniPlayBtn.textContent = '▶';
      return;
    }
    miniPlayBtn.textContent = player.getPlayerState() === 1 ? '⏸' : '▶';
  }

  // ── Complete Checkbox ────────────────────────────────────
  function updateCompleteCheckbox() {
    if (!currentLesson) { markComplete.checked = false; return; }
    markComplete.checked = completedLessons.has(currentLesson.id);
  }

  // ── Progress UI ──────────────────────────────────────────
  const RING_CIRCUMFERENCE = 2 * Math.PI * 23;

  function updateProgressUI() {
    const total = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const done = completedLessons.size;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    progressStats.textContent = `${done} / ${total} lessons complete`;
    progressBar.style.width = `${pct}%`;
    if (hamburgerProgressText) hamburgerProgressText.textContent = `${done} / ${total} lessons complete`;
    if (hamburgerProgressBar) hamburgerProgressBar.style.width = `${pct}%`;

    if (ringFill) {
      ringFill.setAttribute('stroke-dasharray', RING_CIRCUMFERENCE);
      ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - pct / 100);
    }
    if (ringPct) {
      ringPct.textContent = `${pct}%`;
    }
    if (progressRing) {
      if (pct === 100) {
        progressRing.classList.add('complete');
      } else {
        progressRing.classList.remove('complete');
      }
    }
  }

  // ── Load & Render ────────────────────────────────────────
  async function loadModules() {
    try {
      const res = await fetch('/api/modules');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      modules = await res.json();
    } catch (err) {
      phaseGrid.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-16 text-red-400 text-sm gap-2"><span>⚠ Failed to load curriculum</span><span class="text-xs text-zinc-600">${err.message}</span></div>`;
      console.error('Failed to load modules:', err);
      return;
    }
    renderPhaseCards();
    updateProgressUI();
    renderHero();
  }

  // ── Event Bindings ───────────────────────────────────────
  function bindEvents() {
    // ── Global Search ───────────────────────────────
    let globalSearchDebounce = null;

    function closeGlobalSearch() {
      globalSearchDropdown.classList.add('hidden');
      globalSearchDropdown.innerHTML = '';
      globalSearchIdx = -1;
    }

    function navigateToSearchResult(lesson, mod) {
      closeGlobalSearch();
      globalSearchInput.value = '';
      globalSearchInput.blur();
      // Find which phase this module belongs to
      let phaseIdx = -1;
      for (let i = 0; i < PHASES.length; i++) {
        if (mod.sort_order >= PHASES[i].range[0] && mod.sort_order <= PHASES[i].range[1]) {
          phaseIdx = i;
          break;
        }
      }
      if (phaseIdx < 0) return;
      saveCurrentNote();
      currentPhaseIdx = phaseIdx;
      viewHistory = [{ view: 'phase', phaseIdx: -1 }];
      navigateToVideoView(lesson, mod);
    }

    function performGlobalSearch(query) {
      if (!modules.length) return;
      if (!query) { closeGlobalSearch(); return; }
      const q = query.toLowerCase();
      const results = [];
      modules.forEach(mod => {
        mod.lessons.forEach(lesson => {
          if (lesson.title.toLowerCase().includes(q) || (lesson.description && lesson.description.toLowerCase().includes(q))) {
            results.push({ lesson, module: mod });
          }
        });
      });
      // Limit to 20 results
      const limited = results.slice(0, 20);
      globalSearchIdx = -1;

      if (limited.length === 0) {
        globalSearchDropdown.innerHTML = '<div class="search-result-empty">No lessons match "' + escapeHtml(query) + '"</div>';
        globalSearchDropdown.classList.remove('hidden');
        return;
      }

      globalSearchDropdown.innerHTML = limited.map((r, i) => {
        const isComplete = completedLessons.has(r.lesson.id);
        const thumbUrl = 'https://img.youtube.com/vi/' + r.lesson.youtube_id + '/mqdefault.jpg';
        let phaseIdx = -1;
        for (let j = 0; j < PHASES.length; j++) {
          if (r.module.sort_order >= PHASES[j].range[0] && r.module.sort_order <= PHASES[j].range[1]) {
            phaseIdx = j;
            break;
          }
        }
        const phase = phaseIdx >= 0 ? PHASES[phaseIdx] : null;
        return `
        <div class="search-result-item" data-idx="${i}" data-lesson-id="${r.lesson.id}" data-module-id="${r.module.id}">
          <img src="${thumbUrl}" alt="" class="sr-thumb" loading="lazy" />
          <div class="sr-info">
            <div class="sr-title ${isComplete ? 'line-through opacity-50' : ''}">${escapeHtml(r.lesson.title)}</div>
            <div class="sr-meta">${escapeHtml(r.module.title)}${phase ? ' · ' + phase.icon + ' ' + phase.name : ''}</div>
          </div>
          ${phase ? '<span class="sr-phase-dot" style="background:' + phase.color + '" title="' + phase.name + '"></span>' : ''}
        </div>`;
      }).join('');

      globalSearchDropdown.classList.remove('hidden');

      // Bind click handlers
      globalSearchDropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function () {
          const lessonId = parseInt(this.dataset.lessonId, 10);
          const modId = parseInt(this.dataset.moduleId, 10);
          const mod = modules.find(m => m.id === modId);
          const lesson = mod ? mod.lessons.find(l => l.id === lessonId) : null;
          if (lesson && mod) navigateToSearchResult(lesson, mod);
        });
        item.addEventListener('mouseenter', function () {
          globalSearchDropdown.querySelectorAll('.search-result-item').forEach(el => el.classList.remove('active'));
          this.classList.add('active');
          globalSearchIdx = parseInt(this.dataset.idx, 10);
        });
      });
    }

    if (globalSearchInput && globalSearchDropdown) {
      globalSearchInput.addEventListener('input', function () {
        clearTimeout(globalSearchDebounce);
        globalSearchDebounce = setTimeout(() => performGlobalSearch(this.value.trim()), 120);
      });

      globalSearchInput.addEventListener('keydown', function (e) {
        const items = globalSearchDropdown.querySelectorAll('.search-result-item');
        if (e.key === 'Escape') {
          closeGlobalSearch();
          this.blur();
          this.value = '';
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (items.length === 0) return;
          globalSearchIdx = Math.min(globalSearchIdx + 1, items.length - 1);
          items.forEach(el => el.classList.remove('active'));
          items[globalSearchIdx].classList.add('active');
          items[globalSearchIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (items.length === 0) return;
          globalSearchIdx = Math.max(globalSearchIdx - 1, 0);
          items.forEach(el => el.classList.remove('active'));
          items[globalSearchIdx].classList.add('active');
          items[globalSearchIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (globalSearchIdx >= 0 && items[globalSearchIdx]) {
            const item = items[globalSearchIdx];
            const lessonId = parseInt(item.dataset.lessonId, 10);
            const modId = parseInt(item.dataset.moduleId, 10);
            const mod = modules.find(m => m.id === modId);
            const lesson = mod ? mod.lessons.find(l => l.id === lessonId) : null;
            if (lesson && mod) navigateToSearchResult(lesson, mod);
          }
        }
      });

      globalSearchInput.addEventListener('focus', function () {
        if (this.value.trim()) performGlobalSearch(this.value.trim());
      });

      // Click outside to close
      document.addEventListener('click', function (e) {
        if (!globalSearchInput || !globalSearchDropdown) return;
        if (!globalSearchInput.contains(e.target) && !globalSearchDropdown.contains(e.target)) {
          closeGlobalSearch();
        }
      });
    }

    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => setSpeed(parseFloat(btn.dataset.speed)));
    });

    // Clicking the label toggles completion manually
    completeLabel.addEventListener('click', function (e) {
      if (!currentLesson) return;
      if (completedLessons.has(currentLesson.id)) {
        // Un-complete: allow the user to uncheck
        completedLessons.delete(currentLesson.id);
        saveProgress();
        updateCompleteCheckbox();
        updateWatchBar();
        updateProgressUI();
        refreshLessonCards();
        refreshPhaseCards();
        renderHero();
      } else {
        markLessonComplete(currentLesson.id);
      }
    });

    loopAInput.addEventListener('input', updateLoopControls);
    loopBInput.addEventListener('input', updateLoopControls);
    loopToggle.addEventListener('click', function () {
      if (loopA !== null && loopB !== null) { stopLoopMonitoring(); loopA = null; loopB = null; loopToggle.classList.remove('loop-active'); }
      setLoop();
    });
    loopClearBtn.addEventListener('click', clearLoop);

    let notesDebounce = null;
    notesArea.addEventListener('input', function () {
      if (!currentLesson) return;
      clearTimeout(notesDebounce);
      notesDebounce = setTimeout(() => { saveCurrentNote(); flashNotesSaved(); }, 600);
    });

    resetBtn.addEventListener('click', function () {
      if (!confirm('Reset all progress?\n\nThis will clear all completed lessons and practice notes. This cannot be undone.')) return;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(NOTES_KEY);
      localStorage.removeItem(WATCH_KEY);
      localStorage.removeItem('gospel_piano_sections');
      localStorage.removeItem(ACHIEVEMENTS_KEY);
      completedLessons = new Set();
      notesData = {};
      watchProgress = {};
      sectionsData = {};
      achievements = new Set();
      updateBadgeCountUI();
      notesArea.value = '';
      markComplete.checked = false;
      progressStats.textContent = '✓ Progress reset';
      progressStats.classList.add('text-brand');
      setTimeout(() => progressStats.classList.remove('text-brand'), 2000);
      updateProgressUI();
      renderPhaseCards();
      if (currentPhaseIdx >= 0) renderLessonCards(currentPhaseIdx);
    });

    lessonBackBtn.addEventListener('click', goBack);
    videoBackBtn.addEventListener('click', goBack);

    if (progressRing) {
      progressRing.addEventListener('click', function () {
        saveCurrentNote();
        if (player && currentLesson && videoView.classList.contains('active')) {
          enterPipMode();
        } else {
          stopPlayback();
        }
        viewHistory = [];
        currentPhaseIdx = -1;
        showView('phase', 'back');
        updateBreadcrumb();
      });
    }

    if (addSectionBtn) {
      addSectionBtn.addEventListener('click', addSection);
    }

    // Badge gallery
    if (badgeGalleryBtn) {
      badgeGalleryBtn.addEventListener('click', openBadgeGallery);
    }
    if (badgeModalClose) {
      badgeModalClose.addEventListener('click', closeBadgeGallery);
    }
    if (badgeModal) {
      badgeModal.addEventListener('click', function (e) {
        if (e.target === badgeModal) closeBadgeGallery();
      });
    }

    // Video control tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        switchTab(this.dataset.tab);
      });
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', function (e) {
      // Only when video view is active and no input is focused
      if (!videoView.classList.contains('active')) return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (player && typeof player.getPlayerState === 'function') {
          if (player.getPlayerState() === 1) player.pauseVideo();
          else player.playVideo();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToAdjacentLesson(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToAdjacentLesson(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const speeds = [0.5, 0.75, 1];
        const idx = speeds.indexOf(currentSpeed);
        if (idx < speeds.length - 1) setSpeed(speeds[idx + 1]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const speeds = [0.5, 0.75, 1];
        const idx = speeds.indexOf(currentSpeed);
        if (idx > 0) setSpeed(speeds[idx - 1]);
      }
    });

    if (prevLessonBtn) {
      prevLessonBtn.addEventListener('click', () => navigateToAdjacentLesson(-1));
    }
    if (nextLessonBtn) {
      nextLessonBtn.addEventListener('click', () => navigateToAdjacentLesson(1));
    }

    // ── Mini Player Event Bindings ──────────────────
    if (miniPlayBtn) {
      miniPlayBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!player) return;
        if (typeof player.getPlayerState === 'function') {
          if (player.getPlayerState() === 1) player.pauseVideo();
          else player.playVideo();
        }
        updateMiniPlayButton();
      });
    }

    if (miniCloseBtn) {
      miniCloseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closePip();
      });
    }

    // Click the mini player body to expand back to full view
    if (miniPlayerInner) {
      miniPlayerInner.addEventListener('click', function () {
        if (!pipActive || !currentLesson) return;
        exitPipMode();
        // Navigate back to video view — push lesson entry so Back works
        viewHistory.push({ view: 'lesson', phaseIdx: currentPhaseIdx });
        if (viewHistory.length > 1 && viewHistory[viewHistory.length - 2].view === 'lesson') {
          viewHistory.splice(viewHistory.length - 2, 1);
        }
        showView('video', 'forward');
        updateBreadcrumb();
      });
    }

    // Drag to reposition the mini player
    if (miniPlayerHandle && miniPlayer) {
      let dragActive = false;
      let dragStartX, dragStartY, startLeft, startTop;

      miniPlayerHandle.addEventListener('mousedown', function (e) {
        if (e.target.closest('button')) return; // don't drag when clicking buttons
        dragActive = true;
        const rect = miniPlayer.getBoundingClientRect();
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startLeft = rect.left;
        startTop = rect.top;
        miniPlayer.style.transition = 'none';
        e.preventDefault();
      });

      window.addEventListener('mousemove', function (e) {
        if (!dragActive) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        miniPlayer.style.left = (startLeft + dx) + 'px';
        miniPlayer.style.top = (startTop + dy) + 'px';
        miniPlayer.style.right = 'auto';
        miniPlayer.style.bottom = 'auto';
      });

      window.addEventListener('mouseup', function () {
        if (!dragActive) return;
        dragActive = false;
        miniPlayer.style.transition = '';
      });
    }

    let searchDebounce = null;
    lessonSearch.addEventListener('input', function () {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        renderLessonCards(currentPhaseIdx);
      }, 150);
    });
    lessonSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        lessonSearch.value = '';
        lessonSearchClear.classList.add('hidden');
        renderLessonCards(currentPhaseIdx);
      }
    });
    lessonSearchClear.addEventListener('click', function () {
      lessonSearch.value = '';
      lessonSearchClear.classList.add('hidden');
      renderLessonCards(currentPhaseIdx);
    });

    // ── Hamburger Menu ────────────────────────────
    if (hamburgerBtn && hamburgerDropdown) {
      hamburgerBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = hamburgerDropdown.classList.contains('open');
        if (isOpen) {
          closeHamburger();
        } else {
          openHamburger();
        }
      });

      // Click outside to close
      document.addEventListener('click', function (e) {
        if (hamburgerDropdown.classList.contains('open') &&
            !hamburgerBtn.contains(e.target) &&
            !hamburgerDropdown.contains(e.target)) {
          closeHamburger();
        }
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && hamburgerDropdown.classList.contains('open')) {
          closeHamburger();
        }
      });

      // Reset button in hamburger
      if (hamburgerResetBtn) {
        hamburgerResetBtn.addEventListener('click', function () {
          closeHamburger();
          // Trigger the main reset logic
          resetBtn.click();
        });
      }
    }

    function openHamburger() {
      hamburgerDropdown.classList.add('open');
      hamburgerDropdown.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none');
      hamburgerDropdown.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      hamburgerIcon.classList.add('hidden');
      hamburgerCloseIcon.classList.remove('hidden');
    }

    function closeHamburger() {
      hamburgerDropdown.classList.remove('open', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
      hamburgerDropdown.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
      hamburgerIcon.classList.remove('hidden');
      hamburgerCloseIcon.classList.add('hidden');
    }
  }

  // ── YouTube API Ready ─────────────────────────────────────
  window.onYouTubeIframeAPIReady = function () {
    youtubeApiReady = true;
    if (pendingVideoId) { const vid = pendingVideoId; pendingVideoId = null; createPlayer(vid); }
  };

  // ── PWA Install Prompt ─────────────────────────────────
  let deferredPrompt = null;

  function initPwaInstall() {
    // Don't show if already running as installed app
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      return;
    }

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      if (installPwaBtn) {
        installPwaBtn.classList.remove('hidden');
      }
    });

    window.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      if (installPwaBtn) {
        installPwaBtn.classList.add('hidden');
      }
    });

    if (installPwaBtn) {
      installPwaBtn.addEventListener('click', async function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        deferredPrompt = null;
        // Hide the button regardless of choice
        installPwaBtn.classList.add('hidden');
      });
    }
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    initPwaInstall();
    loadProgress();
    loadNotes();
    loadWatchProgress();
    loadSections();
    loadAchievements();
    bindEvents();
    initMetronome();
    loadModules();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
