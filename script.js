/**
 * Y2K / Frutiger Aero Windows XP Portfolio Engine
 * Built for Iván Ismael Cardozo (@ismaelUML)
 *
 * Real window manager, polyphonic audio synthesis, XP Start Menu,
 * full localization (ES/EN/Y2K), and zero placeholder fluff.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Persistent State ---
  let soundEnabled = localStorage.getItem('y2k_sound') !== 'false';
  let isPlayingMusic = false;
  let currentTrackIndex = 0;
  let audioContext = null;
  let synthInterval = null;
  let currentWallpaper = parseInt(localStorage.getItem('y2k_wallpaper') || '0', 10);
  let currentLang = localStorage.getItem('y2k_portfolio_lang') || 'es';
  let currentTheme = localStorage.getItem('y2k_portfolio_theme') || 'luna';
  let highestZIndex = 80;

  const wallpapers = [
    'assets/wallpaper.jpg',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80'
  ];

  // --- Element Selectors ---
  const messengerWin = document.getElementById('messenger-window');
  const projectsWin = document.getElementById('window-projects');
  const syspropWin = document.getElementById('window-sysproperties');
  const recyclebinWin = document.getElementById('window-recyclebin');
  const allWindows = [messengerWin, projectsWin, syspropWin, recyclebinWin];

  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('xp-start-menu');
  const taskbarTasks = document.querySelector('.taskbar-tasks');
  const trayTime = document.getElementById('tray-time');
  const traySoundIcon = document.getElementById('tray-sound-icon');
  const toastEl = document.getElementById('retro-toast');
  const toastText = document.getElementById('toast-text');
  const toastIcon = document.getElementById('toast-icon');

  const shutdownModal = document.getElementById('modal-shutdown');
  const crtOverlay = document.getElementById('crt-off-overlay');

  const langSwitcher = document.getElementById('language-switcher');
  const categoryFilter = document.getElementById('category-filter');
  const quickSearch = document.getElementById('quick-search');
  const btnSearchGo = document.getElementById('btn-search-go');
  const dbContentArea = document.getElementById('db-content-area');

  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessagesBox = document.getElementById('chat-messages-box');
  const starBadge = document.getElementById('star-badge');

  // --- Localization Dictionary ---
  const i18n = {
    es: {
      shortcut_mycomputer: "Mi PC",
      shortcut_messenger: "小蓝道",
      shortcut_projects: "Proyectos",
      shortcut_recyclebin: "Papelera",
      menu_file: "Archivo(F)",
      menu_friends: "Contactos(C)",
      menu_tools: "Herramientas(H)",
      menu_settings: "Opciones(O)",
      tab_notes: "Notas",
      tab_chat: "Chat",
      tab_info: "Info",
      tab_media: "Proyectos",
      db_myaccount: "Mi Perfil",
      btn_follow: "Seguir en GitHub",
      btn_explore: "Abrir Proyectos",
      feed_title: "Mis Novedades",
      music_nowplaying: "Sonando Ahora",
      music_recommend: "Recomendado",
      chat_send: "Enviar",
      btn_done: "Listo",
      projects_title: "C:\\Proyectos\\ismaelUML",
      address_label: "Dirección:",
      sysprop_title: "Propiedades del Sistema",
      recyclebin_title: "Papelera de reciclaje",
      start_projects: "Explorador de Proyectos",
      start_mycomputer: "Mi PC (Propiedades)",
      start_messenger: "小蓝道 Messenger",
      start_music: "City Pop Synthesizer",
      start_allprograms: "Todos los programas",
      start_mydocs: "Mis Documentos (CV)",
      start_wallpaper: "Cambiar Fondo",
      start_recycle: "Papelera de reciclaje",
      start_controlpanel: "Panel de Control (Temas)",
      start_help: "Ayuda y Soporte",
      start_logoff: "Cerrar sesión",
      start_shutdown: "Apagar equipo"
    },
    en: {
      shortcut_mycomputer: "My Computer",
      shortcut_messenger: "Messenger",
      shortcut_projects: "Projects",
      shortcut_recyclebin: "Recycle Bin",
      menu_file: "File(F)",
      menu_friends: "Contacts(C)",
      menu_tools: "Tools(T)",
      menu_settings: "Options(O)",
      tab_notes: "Notes",
      tab_chat: "Chat",
      tab_info: "Specs",
      tab_media: "Projects",
      db_myaccount: "My Profile",
      btn_follow: "Follow on GitHub",
      btn_explore: "Browse Projects",
      feed_title: "Live Feed",
      music_nowplaying: "Now Playing",
      music_recommend: "Recommended",
      chat_send: "Send",
      btn_done: "Done",
      projects_title: "C:\\Projects\\ismaelUML",
      address_label: "Address:",
      sysprop_title: "System Properties",
      recyclebin_title: "Recycle Bin",
      start_projects: "Project Explorer",
      start_mycomputer: "My Computer",
      start_messenger: "Portfolio Messenger",
      start_music: "City Pop Synth",
      start_allprograms: "All Programs",
      start_mydocs: "My Documents (CV)",
      start_wallpaper: "Change Wallpaper",
      start_recycle: "Recycle Bin",
      start_controlpanel: "Control Panel (Themes)",
      start_help: "Help and Support",
      start_logoff: "Log Off",
      start_shutdown: "Turn Off Computer"
    },
    y2k: {
      shortcut_mycomputer: "我的电脑",
      shortcut_messenger: "小蓝道",
      shortcut_projects: "项目库",
      shortcut_recyclebin: "回收站",
      menu_file: "文件(F)",
      menu_friends: "朋友(B)",
      menu_tools: "功能(A)",
      menu_settings: "设置(T)",
      tab_notes: "笔记",
      tab_chat: "对话",
      tab_info: "信息",
      tab_media: "媒体",
      db_myaccount: "我的账户!",
      btn_follow: "加好友",
      btn_explore: "搜索好友",
      feed_title: "我的订阅源",
      music_nowplaying: "最近播放...",
      music_recommend: "你的推荐..",
      chat_send: "发送",
      btn_done: "完成",
      projects_title: "C:\\Proyectos\\小蓝道",
      address_label: "地址:",
      sysprop_title: "系统属性 (Properties)",
      recyclebin_title: "回收站 (Trash)",
      start_projects: "项目库 (Projects)",
      start_mycomputer: "我的电脑 (My PC)",
      start_messenger: "小蓝道 Messenger",
      start_music: "音乐 (City Pop)",
      start_allprograms: "所有程序 (All)",
      start_mydocs: "我的文档 (Docs)",
      start_wallpaper: "切换壁纸",
      start_recycle: "回收站 (Bin)",
      start_controlpanel: "控制面板 (Themes)",
      start_help: "帮助与支持",
      start_logoff: "注销 (Log Off)",
      start_shutdown: "关闭计算机"
    }
  };

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('y2k_portfolio_lang', lang);
    if (langSwitcher) langSwitcher.value = lang;

    const dict = i18n[lang] || i18n.es;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Keep tabs content in sync with active language
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
      renderTabContent(activeTab.getAttribute('data-tab'));
    }
  }

  if (langSwitcher) {
    langSwitcher.addEventListener('change', () => {
      playClickSound();
      applyLanguage(langSwitcher.value);
      showToast(`Idioma cambiado: ${langSwitcher.options[langSwitcher.selectedIndex].text}`);
    });
  }

  // --- Themes System ---
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('y2k_portfolio_theme', theme);
    document.body.classList.remove('theme-royale', 'theme-classic');
    if (theme === 'royale') {
      document.body.classList.add('theme-royale');
    } else if (theme === 'classic') {
      document.body.classList.add('theme-classic');
    }
  }

  document.getElementById('theme-luna')?.addEventListener('click', () => {
    applyTheme('luna');
    showToast('🎨 Tema aplicado: Windows XP Luna Blue');
  });
  document.getElementById('theme-royale')?.addEventListener('click', () => {
    applyTheme('royale');
    showToast('🌌 Tema aplicado: Royale Noir (Energy Blue)');
  });
  document.getElementById('theme-classic')?.addEventListener('click', () => {
    applyTheme('classic');
    showToast('🪟 Tema aplicado: Windows Classic (2000)');
  });

  // Apply saved theme & language
  applyTheme(currentTheme);

  // --- Sound Effects using Web Audio API ---
  // Chrome and iOS hate audio before a user gesture. We lazily unlock it on first click.
  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function playClickSound() {
    if (!soundEnabled) return;
    initAudioContext();
    if (!audioContext) return;

    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, audioContext.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Audio fallback
    }
  }

  function playNotificationChime() {
    if (!soundEnabled) return;
    initAudioContext();
    if (!audioContext) return;

    try {
      const now = audioContext.currentTime;
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Classic MSN-style four note ascending bell
      osc1.frequency.setValueAtTime(523.25, now);        // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.07); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.14); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.22); // C6

      osc2.frequency.setValueAtTime(523.25 / 2, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {}
  }

  function playStartupChime() {
    if (!soundEnabled) return;
    initAudioContext();
    if (!audioContext) return;

    try {
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99]; // C4, G4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const start = audioContext.currentTime + (idx * 0.12);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(start);
        osc.stop(start + 0.75);
      });
    } catch (e) {}
  }

  function playTrashSound() {
    if (!soundEnabled) return;
    initAudioContext();
    if (!audioContext) return;

    try {
      // Noise burst for trash crunch
      const bufferSize = audioContext.sampleRate * 0.15;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;

      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);

      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.12, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);

      noise.start();
    } catch (e) {}
  }

  // --- Polyphonic City Pop Synth Melodies ---
  // Using rich chord voices (root + third + seventh) so it doesn't sound like a microwave
  const cityPopTracks = [
    {
      title: "角松敏生 - Secret Lover (Synth Groove)",
      bpm: 110,
      chords: [
        [349.23, 440.00, 523.25, 659.25], // Fmaj7
        [329.63, 392.00, 493.88, 587.33], // Em7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [293.66, 369.99, 440.00, 523.25], // D7
        [392.00, 493.88, 587.33, 698.46]  // G7
      ]
    },
    {
      title: "山下達郎 - Sparkle / Kokoro (City Pop Groove)",
      bpm: 118,
      chords: [
        [440.00, 554.37, 659.25, 830.61], // Amaj7
        [369.99, 440.00, 554.37, 659.25], // F#m7
        [293.66, 369.99, 440.00, 554.37], // Dmaj7
        [329.63, 415.30, 493.88, 587.33]  // E7
      ]
    }
  ];

  let currentChordIndex = 0;

  function playPolyChord(frequencies, duration = 0.5) {
    if (!soundEnabled || !isPlayingMusic) return;
    initAudioContext();
    if (!audioContext) return;

    try {
      const now = audioContext.currentTime;
      frequencies.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        // Stagger slightly for an acoustic strum feel
        const noteStart = now + (idx * 0.025);
        osc.type = currentTrackIndex === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        // Soft ADSR envelope
        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.035, noteStart + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0005, noteStart + duration);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(noteStart);
        osc.stop(noteStart + duration + 0.05);
      });
    } catch (e) {}
  }

  const track1Row = document.getElementById('track-1');
  const track2Row = document.getElementById('track-2');
  const trackRows = [track1Row, track2Row];

  function startMusicPlayback(trackIndex) {
    initAudioContext();
    isPlayingMusic = true;
    currentTrackIndex = trackIndex;
    currentChordIndex = 0;

    trackRows.forEach((row, idx) => {
      if (!row) return;
      if (idx === trackIndex) {
        row.classList.add('playing');
        const btn = row.querySelector('.play-circle-btn');
        if (btn) btn.textContent = '⏸';
      } else {
        row.classList.remove('playing');
        const btn = row.querySelector('.play-circle-btn');
        if (btn) btn.textContent = '▶';
      }
    });

    if (synthInterval) clearInterval(synthInterval);

    const track = cityPopTracks[currentTrackIndex];
    playPolyChord(track.chords[currentChordIndex], 0.7);

    synthInterval = setInterval(() => {
      if (!isPlayingMusic) return;
      currentChordIndex = (currentChordIndex + 1) % track.chords.length;
      playPolyChord(track.chords[currentChordIndex], 0.65);
    }, 550);

    showToast(`🎵 Reproduciendo: ${track.title}`);
  }

  function stopMusicPlayback() {
    isPlayingMusic = false;
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    trackRows.forEach(row => {
      if (!row) return;
      row.classList.remove('playing');
      const btn = row.querySelector('.play-circle-btn');
      if (btn) btn.textContent = '▶';
    });
    showToast('⏸ Música en pausa');
  }

  function toggleMusicPlayback(trackIndex) {
    if (isPlayingMusic && currentTrackIndex === trackIndex) {
      stopMusicPlayback();
    } else {
      startMusicPlayback(trackIndex);
    }
  }

  trackRows.forEach((row, idx) => {
    if (!row) return;
    row.addEventListener('click', () => {
      playClickSound();
      toggleMusicPlayback(idx);
    });
  });

  document.getElementById('btn-recent-play')?.addEventListener('click', () => {
    playClickSound();
    document.getElementById('btn-recent-play').classList.add('active');
    document.getElementById('btn-recommend').classList.remove('active');
    toggleMusicPlayback(0);
  });

  document.getElementById('btn-recommend')?.addEventListener('click', () => {
    playClickSound();
    document.getElementById('btn-recommend').classList.add('active');
    document.getElementById('btn-recent-play').classList.remove('active');
    toggleMusicPlayback(1);
  });

  // --- Toast Notification ---
  let toastTimer = null;
  function showToast(message, icon = 'ℹ️') {
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = message;
    toastIcon.textContent = icon;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  // --- Clock in Taskbar ---
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    trayTime.textContent = `${hours}:${minutes} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --- Multi-Window Manager & Taskbar Tracking ---
  function bringToFront(win) {
    if (!win) return;
    highestZIndex += 2;
    win.style.zIndex = highestZIndex;
    updateTaskbar();
  }

  function openWindow(win) {
    if (!win) return;
    playClickSound();
    win.classList.remove('minimized');
    bringToFront(win);
  }

  function closeWindow(win) {
    if (!win) return;
    playClickSound();
    win.classList.add('minimized');
    updateTaskbar();
  }

  function toggleMaximize(win, maxBtn) {
    if (!win) return;
    playClickSound();
    const isMax = win.classList.toggle('maximized');
    if (maxBtn) {
      maxBtn.textContent = isMax ? '❐' : '🗖';
    }
    if (isMax) {
      win.dataset.preLeft = win.style.left;
      win.dataset.preTop = win.style.top;
      win.style.left = '';
      win.style.top = '';
      win.style.transform = '';
    } else if (win.dataset.preLeft) {
      win.style.left = win.dataset.preLeft;
      win.style.top = win.dataset.preTop;
    }
  }

  // Make windows draggable with mouse and touch, clamped to viewport bounds
  function setupDraggable(win, titlebar, maxBtn, closeBtn, minBtn) {
    if (!win || !titlebar) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    function onPointerDown(e) {
      if (e.target.closest('.titlebar-controls')) return;
      if (win.classList.contains('maximized')) return;

      bringToFront(win);
      isDragging = true;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;

      const rect = win.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      win.style.position = 'fixed';
      win.style.left = `${initialLeft}px`;
      win.style.top = `${initialTop}px`;
      win.style.margin = '0';
      win.style.transform = 'none';

      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let newX = initialLeft + (clientX - startX);
      let newY = initialTop + (clientY - startY);

      // Clamping so windows never escape the viewport
      const rect = win.getBoundingClientRect();
      const minX = -rect.width + 120;
      const maxX = window.innerWidth - 120;
      const minY = 0;
      const maxY = window.innerHeight - 50;

      if (newX < minX) newX = minX;
      if (newX > maxX) newX = maxX;
      if (newY < minY) newY = minY;
      if (newY > maxY) newY = maxY;

      win.style.left = `${newX}px`;
      win.style.top = `${newY}px`;
    }

    function onPointerUp() {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = '';
      }
    }

    titlebar.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);

    titlebar.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('touchmove', onPointerMove, { passive: true });
    document.addEventListener('touchend', onPointerUp);

    titlebar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.titlebar-controls')) return;
      if (maxBtn) toggleMaximize(win, maxBtn);
    });

    win.addEventListener('mousedown', () => bringToFront(win));
    win.addEventListener('touchstart', () => bringToFront(win), { passive: true });

    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMaximize(win, maxBtn);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWindow(win);
      });
    }

    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playClickSound();
        win.classList.add('minimized');
        updateTaskbar();
      });
    }
  }

  // Setup dragging for all windows
  setupDraggable(
    messengerWin,
    document.getElementById('window-titlebar'),
    document.getElementById('btn-maximize'),
    document.getElementById('btn-close'),
    document.getElementById('btn-minimize')
  );

  setupDraggable(
    projectsWin,
    document.getElementById('projects-titlebar'),
    document.getElementById('btn-projects-max'),
    document.getElementById('btn-projects-close'),
    document.getElementById('btn-projects-min')
  );

  setupDraggable(
    syspropWin,
    document.getElementById('sysproperties-titlebar'),
    null,
    document.getElementById('btn-sysprop-close'),
    null
  );

  setupDraggable(
    recyclebinWin,
    document.getElementById('recyclebin-titlebar'),
    null,
    document.getElementById('btn-recyclebin-close'),
    null
  );

  // --- Dynamic Taskbar Items Sync ---
  const winRegistry = [
    { el: messengerWin, name: "小蓝道 - ismaelUML", icon: "i" },
    { el: projectsWin, name: "C:\\Proyectos", icon: "📁" },
    { el: syspropWin, name: "Propiedades PC", icon: "💻" },
    { el: recyclebinWin, name: "Papelera", icon: "🗑️" }
  ];

  function updateTaskbar() {
    if (!taskbarTasks) return;
    taskbarTasks.innerHTML = '';

    winRegistry.forEach(item => {
      const isVisible = !item.el.classList.contains('minimized');
      const isFocused = isVisible && parseInt(item.el.style.zIndex || '0', 10) === highestZIndex;

      const btn = document.createElement('div');
      btn.className = `taskbar-item ${isFocused ? 'active' : ''}`;
      btn.innerHTML = `
        <span style="font-size: 11px;">${item.icon}</span>
        <span>${item.name}</span>
      `;

      btn.addEventListener('click', () => {
        playClickSound();
        if (item.el.classList.contains('minimized')) {
          openWindow(item.el);
        } else if (isFocused) {
          item.el.classList.add('minimized');
          updateTaskbar();
        } else {
          bringToFront(item.el);
        }
      });

      taskbarTasks.appendChild(btn);
    });
  }

  // Reset coordinates if window resizes to mobile
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 780) {
      allWindows.forEach(win => {
        if (!win.classList.contains('maximized')) {
          win.style.left = '';
          win.style.top = '';
          win.style.position = '';
        }
      });
    }
  });

  // --- Windows XP Start Menu & Launchers ---
  function toggleStartMenu() {
    playClickSound();
    startMenu.classList.toggle('open');
  }

  function closeStartMenu() {
    startMenu.classList.remove('open');
  }

  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStartMenu();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#xp-start-menu') && !e.target.closest('#start-btn')) {
      closeStartMenu();
    }
    // Also close dropdown menus
    document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.menu-item-btn').forEach(b => b.classList.remove('active'));
  });

  // Start menu items
  document.getElementById('start-item-projects')?.addEventListener('click', () => {
    closeStartMenu();
    openWindow(projectsWin);
  });
  document.getElementById('start-item-sysprop')?.addEventListener('click', () => {
    closeStartMenu();
    openWindow(syspropWin);
  });
  document.getElementById('start-item-messenger')?.addEventListener('click', () => {
    closeStartMenu();
    openWindow(messengerWin);
  });
  document.getElementById('start-item-music')?.addEventListener('click', () => {
    closeStartMenu();
    toggleMusicPlayback(0);
  });
  document.getElementById('start-item-docs')?.addEventListener('click', () => {
    closeStartMenu();
    openWindow(messengerWin);
    document.querySelector('[data-tab="tab-info"]')?.click();
  });
  document.getElementById('start-item-wallpapers')?.addEventListener('click', () => {
    closeStartMenu();
    toggleWallpaper();
  });
  document.getElementById('start-item-recycle')?.addEventListener('click', () => {
    closeStartMenu();
    openWindow(recyclebinWin);
  });
  document.getElementById('start-item-controlpanel')?.addEventListener('click', () => {
    closeStartMenu();
    openWindow(syspropWin);
    document.querySelector('[data-systab="hardware"]')?.click();
  });
  document.getElementById('start-item-help')?.addEventListener('click', () => {
    closeStartMenu();
    showToast('Tip: ¡Prueba arrastrar las ventanas, cambiar temas o explorar C:\\Proyectos!');
  });
  document.getElementById('btn-start-logoff')?.addEventListener('click', () => {
    closeStartMenu();
    playNotificationChime();
    showToast('Sesión de Iván Cardozo finalizada. ¡Hasta luego!');
  });
  document.getElementById('btn-start-shutdown')?.addEventListener('click', () => {
    closeStartMenu();
    playClickSound();
    shutdownModal.classList.add('open');
  });

  // --- Shutdown Dialog Actions ---
  document.getElementById('btn-shutdown-close')?.addEventListener('click', () => {
    shutdownModal.classList.remove('open');
  });
  document.getElementById('btn-shutdown-cancel')?.addEventListener('click', () => {
    shutdownModal.classList.remove('open');
  });
  document.getElementById('action-standby')?.addEventListener('click', () => {
    shutdownModal.classList.remove('open');
    stopMusicPlayback();
    showToast('Modo de suspensión activado.');
  });
  document.getElementById('action-turnoff')?.addEventListener('click', () => {
    shutdownModal.classList.remove('open');
    stopMusicPlayback();
    crtOverlay.classList.add('active');
  });
  document.getElementById('action-restart')?.addEventListener('click', () => {
    shutdownModal.classList.remove('open');
    showToast('Reiniciando sistema...');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  });
  document.getElementById('btn-turn-on-pc')?.addEventListener('click', () => {
    crtOverlay.classList.remove('active');
    playStartupChime();
    showToast('¡Bienvenido de nuevo a Windows XP Portfolio!');
  });

  // --- Desktop Shortcuts ---
  document.getElementById('icon-portfolio')?.addEventListener('click', () => openWindow(messengerWin));
  document.getElementById('icon-projects')?.addEventListener('click', () => openWindow(projectsWin));
  document.getElementById('icon-mycomputer')?.addEventListener('click', () => openWindow(syspropWin));
  document.getElementById('icon-recyclebin')?.addEventListener('click', () => openWindow(recyclebinWin));

  // --- Menubar Dropdown Logic ---
  document.querySelectorAll('.menu-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound();
      const parent = btn.closest('.menu-item-wrapper');
      const dropdown = parent.querySelector('.dropdown-menu');
      const isOpen = dropdown.classList.contains('show');

      document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
      document.querySelectorAll('.menu-item-btn').forEach(b => b.classList.remove('active'));

      if (!isOpen) {
        dropdown.classList.add('show');
        btn.classList.add('active');
      }
    });
  });

  document.getElementById('menu-open-projects')?.addEventListener('click', () => openWindow(projectsWin));
  document.getElementById('menu-open-sysprop')?.addEventListener('click', () => openWindow(syspropWin));
  document.getElementById('menu-play-music')?.addEventListener('click', () => toggleMusicPlayback(currentTrackIndex));
  document.getElementById('menu-next-track')?.addEventListener('click', () => {
    startMusicPlayback((currentTrackIndex + 1) % 2);
  });
  document.getElementById('menu-exit')?.addEventListener('click', () => closeWindow(messengerWin));

  function toggleWallpaper() {
    currentWallpaper = (currentWallpaper + 1) % wallpapers.length;
    localStorage.setItem('y2k_wallpaper', currentWallpaper);
    document.body.style.backgroundImage = `url('${wallpapers[currentWallpaper]}')`;
    showToast(`🖼️ Fondo cambiado (#${currentWallpaper + 1})`);
  }
  document.getElementById('menu-toggle-wallpaper')?.addEventListener('click', toggleWallpaper);

  // Sound toggle button
  const soundToggleBtn = document.getElementById('menu-sound-toggle');
  const soundKbd = document.getElementById('menu-sound-kbd');
  function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('y2k_sound', soundEnabled);
    if (soundKbd) soundKbd.textContent = soundEnabled ? 'ON' : 'OFF';
    if (traySoundIcon) traySoundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    showToast(`Sonido: ${soundEnabled ? 'Activado' : 'Silenciado'}`);
    if (!soundEnabled && isPlayingMusic) stopMusicPlayback();
  }
  soundToggleBtn?.addEventListener('click', toggleSound);
  traySoundIcon?.addEventListener('click', toggleSound);

  document.getElementById('menu-save-profile')?.addEventListener('click', () => {
    showToast('Presiona Ctrl + D en tu navegador para guardar en favoritos ⭐');
  });
  document.getElementById('menu-add-friend-action')?.addEventListener('click', () => {
    copyGitHubLink();
  });
  document.getElementById('menu-quick-shout')?.addEventListener('click', () => {
    chatInput?.focus();
    chatInput?.scrollIntoView({ behavior: 'smooth' });
  });

  // --- Project Explorer Filter Buttons ---
  const filterQml = document.getElementById('btn-filter-qml');
  const filterWeb = document.getElementById('btn-filter-web');
  const filterAll = document.getElementById('btn-filter-all');
  const projectCards = document.querySelectorAll('.project-explorer-card');

  function filterProjects(tag, activeBtn) {
    playClickSound();
    [filterQml, filterWeb, filterAll].forEach(b => b?.classList.remove('active'));
    activeBtn?.classList.add('active');

    projectCards.forEach(card => {
      const tags = card.getAttribute('data-tags') || '';
      if (tag === 'all' || tags.includes(tag)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterQml?.addEventListener('click', () => filterProjects('qml', filterQml));
  filterWeb?.addEventListener('click', () => filterProjects('web', filterWeb));
  filterAll?.addEventListener('click', () => filterProjects('all', filterAll));

  document.getElementById('btn-projects-go')?.addEventListener('click', () => {
    playNotificationChime();
    showToast('Actualizando C:\\Proyectos\\ismaelUML...');
  });

  // --- System Properties Tab Switching ---
  const sysTabs = document.querySelectorAll('.sysprop-tab');
  sysTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playClickSound();
      sysTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = `systab-pane-${tab.getAttribute('data-systab')}`;
      document.querySelectorAll('.sysprop-tab-pane').forEach(pane => {
        pane.style.display = pane.id === targetId ? 'block' : 'none';
      });
    });
  });

  document.getElementById('btn-sysprop-ok')?.addEventListener('click', () => closeWindow(syspropWin));
  document.getElementById('btn-sysprop-cancel')?.addEventListener('click', () => closeWindow(syspropWin));

  // --- Recycle Bin Actions ---
  const trashFileList = document.getElementById('recyclebin-file-list');
  const trashStatusText = document.getElementById('recyclebin-status-text');

  document.getElementById('btn-empty-recyclebin')?.addEventListener('click', () => {
    playTrashSound();
    trashFileList.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #888888; font-style: italic;">
        Papelera vacía. No hay archivos eliminados.
      </div>
    `;
    if (trashStatusText) trashStatusText.textContent = '0 objetos en la papelera';
    showToast('🗑️ Papelera de reciclaje vaciada.');
  });

  document.getElementById('btn-restore-recyclebin')?.addEventListener('click', () => {
    playNotificationChime();
    trashFileList.innerHTML = `
      <div class="trash-item">
        <span>📄 ie6_quirks_mode_fixes.css</span>
        <span class="trash-size">14 KB</span>
      </div>
      <div class="trash-item">
        <span>⚙️ monolithic_spaghetti_2020.js</span>
        <span class="trash-size">890 KB</span>
      </div>
      <div class="trash-item">
        <span>📦 heavy_framework_runtime.dll</span>
        <span class="trash-size">124 MB</span>
      </div>
      <div class="trash-item">
        <span>🐛 forgotten_null_pointer.log</span>
        <span class="trash-size">2 KB</span>
      </div>
    `;
    if (trashStatusText) trashStatusText.textContent = '4 objetos en la papelera';
    showToast('♻️ Elementos restaurados a su ubicación original.');
  });

  // --- Profile Card Tab Switching Logic ---
  const tabContentMap = {
    'tab-notes': {
      es: `
        <div class="db-bio-text">
          <strong>Iván Ismael Cardozo</strong> — Desarrollador en Argentina 🇦🇷.
          Especializado en interfaces de escritorio en QML/Qt, desarrollo web moderno, utilidades de sistemas y estética nostálgica Y2K/Frutiger Aero.
        </div>
        <div class="linked-webs-section">
          <div class="linked-webs-title"><span>🌐</span><span>@enlaces y repositorios...</span></div>
          <div class="tree-links">
            <a href="https://github.com/ismaelUML" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>github.com/ismaelUML</span></a>
            <a href="https://github.com/ismaelUML/Pocket-AntiGravityIDE" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>Pocket-AntiGravityIDE</span></a>
            <a href="https://github.com/ismaelUML/RathonWare" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>RathonWare (QML)</span></a>
            <a href="https://github.com/ismaelUML/RobosMDP-Remix" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>RobosMDP-Remix (JS)</span></a>
            <a href="https://github.com/ismaelUML/AdvancedMonitor" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>AdvancedMonitor & ERP</span></a>
          </div>
        </div>
      `,
      en: `
        <div class="db-bio-text">
          <strong>Iván Ismael Cardozo</strong> — Developer based in Argentina 🇦🇷.
          Specialized in high-performance desktop interfaces with QML/Qt, modern web engineering, systems tooling, and Y2K aesthetic craft.
        </div>
        <div class="linked-webs-section">
          <div class="linked-webs-title"><span>🌐</span><span>@linked repositories...</span></div>
          <div class="tree-links">
            <a href="https://github.com/ismaelUML" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>github.com/ismaelUML</span></a>
            <a href="https://github.com/ismaelUML/Pocket-AntiGravityIDE" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>Pocket-AntiGravityIDE</span></a>
            <a href="https://github.com/ismaelUML/RathonWare" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>RathonWare (QML)</span></a>
            <a href="https://github.com/ismaelUML/RobosMDP-Remix" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>RobosMDP-Remix (JS)</span></a>
            <a href="https://github.com/ismaelUML/AdvancedMonitor" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>AdvancedMonitor & ERP</span></a>
          </div>
        </div>
      `,
      y2k: `
        <div class="db-bio-text">
          <strong>Iván Ismael Cardozo</strong> — Developer based in Argentina 🇦🇷.
          Specialized in web development, QML desktop interfaces, and nostalgic Y2K/Frutiger Aero aesthetic craft.
        </div>
        <div class="linked-webs-section">
          <div class="linked-webs-title"><span>🌐</span><span>@linked webs...</span></div>
          <div class="tree-links">
            <a href="https://github.com/ismaelUML" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>github.com/ismaelUML</span></a>
            <a href="https://github.com/ismaelUML/Pocket-AntiGravityIDE" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>Pocket-AntiGravityIDE</span></a>
            <a href="https://github.com/ismaelUML/RathonWare" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>RathonWare (QML)</span></a>
            <a href="https://github.com/ismaelUML/RobosMDP-Remix" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>RobosMDP-Remix (JS)</span></a>
            <a href="https://github.com/ismaelUML/AdvancedMonitor" target="_blank" rel="noopener" class="tree-link-item"><span class="tree-branch">↳</span><span>AdvancedMonitor & ERP</span></a>
          </div>
        </div>
      `
    },
    'tab-chat': {
      es: `
        <div class="db-bio-text">
          <strong>Estado y Conexión</strong>:<br>
          Disponible para proyectos freelance, consultoría en arquitectura frontend/desktop y código abierto.
        </div>
        <div style="font-size: 11px; color: #164885; margin-top: 8px;">
          💬 Puedes probar el shoutbox escribiendo en la caja de chat de la derecha 👉
        </div>
        <div style="margin-top: 10px;">
          <button class="retro-btn" style="width: 100%; height: 26px;" id="tab-chat-focus-btn">💬 Escribir en el Chat</button>
        </div>
      `,
      en: `
        <div class="db-bio-text">
          <strong>Direct Status & Contact</strong>:<br>
          Available for engineering contracts, desktop/frontend architecture, and open source collaboration.
        </div>
        <div style="font-size: 11px; color: #164885; margin-top: 8px;">
          💬 Feel free to leave a note in the shoutbox on the right 👉
        </div>
        <div style="margin-top: 10px;">
          <button class="retro-btn" style="width: 100%; height: 26px;" id="tab-chat-focus-btn">💬 Focus Shoutbox</button>
        </div>
      `,
      y2k: `
        <div class="db-bio-text">
          <strong>Direct Chat & Status</strong>:<br>
          Actualmente disponible para proyectos de desarrollo y colaboración open source.
        </div>
        <div style="font-size: 11px; color: #164885; margin-top: 8px;">
          💡 Puedes enviar mensajes en tiempo real en la caja de chat a la derecha 👉
        </div>
        <div style="margin-top: 10px;">
          <button class="retro-btn" style="width: 100%; height: 26px;" id="tab-chat-focus-btn">💬 去写信 (Chat)</button>
        </div>
      `
    },
    'tab-info': {
      es: `
        <div class="db-bio-text"><strong>Skills Técnicos & Tecnologías:</strong></div>
        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 5px; margin-top: 6px;">
          <div>⚡ <strong>Lenguajes:</strong> TypeScript, JavaScript, Python, QML, C++, HTML5, CSS3</div>
          <div>🛠️ <strong>Herramientas:</strong> Git, GitHub Actions, Linux, VS Code, Qt Creator</div>
          <div>🌐 <strong>Especialidad:</strong> Desktop UI (QML), Frontend Reactivo, Estética Y2K</div>
          <div>📍 <strong>Ubicación:</strong> Mar del Plata, Argentina (UTC-3)</div>
        </div>
      `,
      en: `
        <div class="db-bio-text"><strong>Core Skills & Stack:</strong></div>
        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 5px; margin-top: 6px;">
          <div>⚡ <strong>Languages:</strong> TypeScript, JavaScript, Python, QML, C++, HTML5, CSS3</div>
          <div>🛠️ <strong>Tooling:</strong> Git, GitHub Actions, Linux, VS Code, Antigravity IDE</div>
          <div>🌐 <strong>Focus:</strong> Desktop UI (Qt/QML), Reactive Web Apps, Y2K Aesthetics</div>
          <div>📍 <strong>Location:</strong> Mar del Plata, Argentina (UTC-3)</div>
        </div>
      `,
      y2k: `
        <div class="db-bio-text"><strong>Skills & Tecnologías:</strong></div>
        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
          <div>⚡ <strong>Lenguajes:</strong> JavaScript, TypeScript, Python, QML, C++, HTML5, CSS3</div>
          <div>🛠️ <strong>Herramientas:</strong> Git, GitHub, Linux, VS Code, Antigravity</div>
          <div>🌐 <strong>Enfoque:</strong> Frontend Aesthetics, Desktop UI, Web Apps</div>
          <div>📍 <strong>Ubicación:</strong> Argentina (UTC-3)</div>
        </div>
      `
    },
    'tab-media': {
      es: `
        <div class="db-bio-text"><strong>Proyectos Destacados:</strong></div>
        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
          <div style="padding: 6px; background: #eef5fc; border: 1px solid #c2d8ee; border-radius: 3px;">
            💻 <strong>Pocket-AntiGravityIDE</strong><br>
            <span style="color: #4a6c9e;">Tooling para agentes de desarrollo e IDEs.</span>
          </div>
          <div style="padding: 6px; background: #eef5fc; border: 1px solid #c2d8ee; border-radius: 3px;">
            ⚡ <strong>RathonWare</strong><br>
            <span style="color: #4a6c9e;">Interfaz de escritorio nativa en Qt/QML y C++.</span>
          </div>
          <button class="retro-btn primary" id="btn-open-full-explorer" style="margin-top: 4px;">📂 Abrir Explorador Completo</button>
        </div>
      `,
      en: `
        <div class="db-bio-text"><strong>Featured Repositories:</strong></div>
        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
          <div style="padding: 6px; background: #eef5fc; border: 1px solid #c2d8ee; border-radius: 3px;">
            💻 <strong>Pocket-AntiGravityIDE</strong><br>
            <span style="color: #4a6c9e;">Agent workflow tooling and IDE configurations.</span>
          </div>
          <div style="padding: 6px; background: #eef5fc; border: 1px solid #c2d8ee; border-radius: 3px;">
            ⚡ <strong>RathonWare</strong><br>
            <span style="color: #4a6c9e;">High performance desktop interface in Qt/QML.</span>
          </div>
          <button class="retro-btn primary" id="btn-open-full-explorer" style="margin-top: 4px;">📂 Open Project Explorer</button>
        </div>
      `,
      y2k: `
        <div class="db-bio-text"><strong>Media & Proyectos:</strong></div>
        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
          <div style="padding: 4px; background: #eef5fc; border: 1px solid #c2d8ee; border-radius: 2px;">
            🎮 <strong>RobosMDP-Remix</strong><br>
            <span style="color: #6481a1;">Remix interactivo desarrollado en JavaScript.</span>
          </div>
          <div style="padding: 4px; background: #eef5fc; border: 1px solid #c2d8ee; border-radius: 2px;">
            💻 <strong>Pocket-AntiGravityIDE</strong><br>
            <span style="color: #6481a1;">Configuraciones y utilidades de entorno.</span>
          </div>
          <button class="retro-btn primary" id="btn-open-full-explorer" style="margin-top: 4px;">📂 打开项目 (Explorer)</button>
        </div>
      `
    }
  };

  function renderTabContent(tabId) {
    if (!dbContentArea) return;
    const tabData = tabContentMap[tabId] || tabContentMap['tab-notes'];
    const html = tabData[currentLang] || tabData['es'];
    dbContentArea.innerHTML = html;

    document.getElementById('tab-chat-focus-btn')?.addEventListener('click', () => {
      chatInput?.focus();
    });
    document.getElementById('btn-open-full-explorer')?.addEventListener('click', () => {
      openWindow(projectsWin);
    });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTabContent(btn.getAttribute('data-tab'));
    });
  });

  // Vertical toolbar quick shortcuts
  document.getElementById('tool-globe')?.addEventListener('click', () => {
    playClickSound();
    document.querySelector('[data-tab="tab-notes"]')?.click();
  });
  document.getElementById('tool-ipod')?.addEventListener('click', () => {
    playClickSound();
    toggleMusicPlayback(currentTrackIndex);
  });
  document.getElementById('tool-calendar')?.addEventListener('click', () => {
    playClickSound();
    document.querySelector('[data-tab="tab-info"]')?.click();
    showToast('📅 Repositorios y actividad actualizada en GitHub.');
  });
  document.getElementById('tool-trash')?.addEventListener('click', () => {
    openWindow(recyclebinWin);
  });

  // --- Copy GitHub Link / Follow ---
  function copyGitHubLink() {
    playNotificationChime();
    const url = 'https://github.com/ismaelUML';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('⭐ ¡Enlace copiado! Sígueme en GitHub @ismaelUML');
      }).catch(() => {
        window.open(url, '_blank');
      });
    } else {
      window.open(url, '_blank');
    }
  }

  document.getElementById('btn-add-friend')?.addEventListener('click', copyGitHubLink);
  document.getElementById('btn-search-friend')?.addEventListener('click', () => {
    openWindow(projectsWin);
  });

  // Star badge favorite toggle
  let isStarred = false;
  starBadge?.addEventListener('click', () => {
    playClickSound();
    isStarred = !isStarred;
    starBadge.textContent = isStarred ? '★' : '☆';
    starBadge.style.color = isStarred ? '#ff9900' : 'var(--xp-star-gold)';
    showToast(isStarred ? '★ ¡Has añadido a Iván a tus favoritos!' : '☆ Favorito removido.');
  });

  // --- Interactive Guestbook / Shoutbox with Kaomojis ---
  const kaomojis = [
    "٩( 'ω' )و",
    "(*^▽^*)",
    "(◕‿◕) ✨",
    "(づ｡◕‿‿◕｡)づ",
    "(-ω-、)",
    "(｡♥‿♥｡)",
    "ヾ(＾∇＾)"
  ];

  function loadSavedMessages() {
    const saved = localStorage.getItem('y2k_guestbook_msgs');
    if (saved) {
      try {
        const msgs = JSON.parse(saved);
        msgs.forEach(msg => appendMessageDOM(msg.name, msg.text, msg.time, msg.kaomoji, false));
      } catch (e) {}
    }
  }

  function appendMessageDOM(name, text, time, kaomoji, save = true) {
    if (!chatMessagesBox) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble-row';
    bubble.innerHTML = `
      <img src="pfp/2967b03acaab18c50c1518d110d6b7a1.gif" class="chat-bubble-avatar" alt="Avatar">
      <div class="chat-bubble-content">
        <div class="chat-bubble-meta">
          <span>${name}</span>
          <span class="chat-bubble-time">${time}</span>
        </div>
        <div class="chat-bubble-text">
          <span class="kaomoji">${kaomoji}</span>
          <span>${text}</span>
        </div>
      </div>
    `;
    chatMessagesBox.appendChild(bubble);
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;

    if (save) {
      let msgs = [];
      try {
        msgs = JSON.parse(localStorage.getItem('y2k_guestbook_msgs') || '[]');
      } catch (e) {
        msgs = [];
      }
      msgs.push({ name, text, time, kaomoji });
      localStorage.setItem('y2k_guestbook_msgs', JSON.stringify(msgs));
    }
  }

  function handleSendMessage() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    playNotificationChime();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const randomKaomoji = kaomojis[Math.floor(Math.random() * kaomojis.length)];

    appendMessageDOM('Invitado', text, timeStr, randomKaomoji, true);
    chatInput.value = '';
    showToast('💬 Mensaje enviado al shoutbox!');
  }

  chatSendBtn?.addEventListener('click', handleSendMessage);
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });

  loadSavedMessages();

  // Clear chat option in Tools menu
  document.getElementById('menu-clear-chat')?.addEventListener('click', () => {
    localStorage.removeItem('y2k_guestbook_msgs');
    if (chatMessagesBox) {
      chatMessagesBox.innerHTML = `
        <div class="chat-bubble-row">
          <img src="pfp/2967b03acaab18c50c1518d110d6b7a1.gif" class="chat-bubble-avatar" alt="Avatar">
          <div class="chat-bubble-content">
            <div class="chat-bubble-meta">
              <span>ismaelUML</span>
              <span class="chat-bubble-time">18:00</span>
            </div>
            <div class="chat-bubble-text">
              <span class="kaomoji">٩( 'ω' )و</span>
              <span>Chat reiniciado. ¡Deja tu mensaje aquí!</span>
            </div>
          </div>
        </div>
      `;
    }
    showToast('🧹 Mensajes locales eliminados.');
  });

  // --- Category Filter & Search Handler ---
  categoryFilter?.addEventListener('change', () => {
    playClickSound();
    const val = categoryFilter.value;
    if (val === 'bio') {
      document.querySelector('[data-tab="tab-notes"]')?.click();
    } else if (val === 'projects') {
      openWindow(projectsWin);
    } else if (val === 'shoutbox') {
      document.querySelector('[data-tab="tab-chat"]')?.click();
      chatInput?.focus();
    } else if (val === 'music') {
      toggleMusicPlayback(0);
    } else {
      document.querySelector('[data-tab="tab-notes"]')?.click();
    }
  });

  function performSearch() {
    const query = quickSearch.value.trim().toLowerCase();
    if (!query) return;
    playClickSound();

    if (query.includes('music') || query.includes('song') || query.includes('audio') || query.includes('pop')) {
      toggleMusicPlayback(0);
      showToast('🎵 Reproductor activado.');
    } else if (query.includes('project') || query.includes('repo') || query.includes('qml') || query.includes('js')) {
      openWindow(projectsWin);
      showToast('📂 Abriendo Explorador de Proyectos.');
    } else if (query.includes('pc') || query.includes('spec') || query.includes('hardware')) {
      openWindow(syspropWin);
    } else {
      showToast(`Búsqueda: "${query}" - Revisa el Explorador de Proyectos.`);
      openWindow(projectsWin);
    }
  }

  btnSearchGo?.addEventListener('click', performSearch);
  quickSearch?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  document.getElementById('statusbar-done-btn')?.addEventListener('click', () => {
    playClickSound();
    showToast('Estado: Listo / Ready (小蓝道 v2.5)');
  });

  // Status badges quick handlers
  document.getElementById('badge-pc')?.addEventListener('click', () => {
    openWindow(syspropWin);
  });
  document.getElementById('badge-chat')?.addEventListener('click', () => {
    showToast('Actividad: Desarrollando herramientas y frontends modernos');
  });
  document.getElementById('badge-globe')?.addEventListener('click', () => {
    showToast('Ubicación: Mar del Plata, Argentina 🇦🇷 (UTC-3)');
  });

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeStartMenu();
      shutdownModal?.classList.remove('open');
      document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
    } else if (e.altKey && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      openWindow(projectsWin);
    } else if (e.altKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      openWindow(syspropWin);
    } else if (e.altKey && (e.key === 'g' || e.key === 'G')) {
      e.preventDefault();
      window.open('https://github.com/ismaelUML', '_blank');
    }
  });

  // Initialize UI language & initial Taskbar
  applyLanguage(currentLang);
  updateTaskbar();
});
