/**
 * ARCHIVE-09 // COGNITIVE REPOSITORY & ARG INTERACTION ENGINE
 * Strict analog horror mechanics: pupil tremor on proximity, ocular rage overload,
 * CRT cathode collapse on dwell, auto-distort interval, and cognitive ledger routing.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const body = document.getElementById('app-body');
  const occultEmblem = document.getElementById('occult-emblem');
  const occultSvg = document.querySelector('.occult-svg');
  const pupilAssembly = document.getElementById('pupil-target');
  const pupilCircle = document.getElementById('pupil-circle');
  const vhsClock = document.getElementById('vhs-clock');
  const mainHeadline = document.getElementById('main-headline');
  const vhsGlitchBar = document.getElementById('vhs-glitch-bar');
  const crtOverlay = document.getElementById('crt-off-overlay');
  const crtCue = document.getElementById('crt-reboot-cue');

  // --- 1. Real-time VHS Clock (with Milliseconds / Frames) ---
  function updateVHSClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const frames = String(Math.floor(now.getMilliseconds() / 40)).padStart(2, '0');
    if (vhsClock) {
      vhsClock.textContent = `${hours}:${minutes}:${seconds}:${frames} PM`;
    }
  }
  setInterval(updateVHSClock, 40);
  updateVHSClock();

  // --- 2. Telemetry Dispatcher ---
  function appendLog(message) {
    console.debug(`[ARCHIVE-09 TELEMETRY] ${message}`);
  }

  // --- 3. Interactive Pupil Tracking & Proximity Tremor ---
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let currentPupilX = 0;
  let currentPupilY = 0;
  const MAX_RADIUS = 14;

  // Dwell and Rage accumulator
  let eyeAnger = 0; // 0 to 1
  let isHoveringInsideEye = false;
  let isCrtShutDown = false;

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  }, { passive: true });

  // Main high-frequency render loop for smooth tracking & vibration
  function ocularLoop() {
    if (!occultEmblem || !pupilAssembly || isCrtShutDown) {
      requestAnimationFrame(ocularLoop);
      return;
    }

    const rect = occultEmblem.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const deltaX = cursorX - eyeCenterX;
    const deltaY = cursorY - eyeCenterY;
    const distance = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX);

    // Target clamped position
    const clampedDist = Math.min(distance * 0.05, MAX_RADIUS);
    const targetX = Math.cos(angle) * clampedDist;
    const targetY = Math.sin(angle) * clampedDist;

    // Proximity Tremor: Closer cursor = stronger tremor
    // When distance < 260px, tremor factor scales up
    const proximity = Math.max(0, (260 - distance) / 260);
    const trembleScale = Math.pow(proximity, 1.8) * 8.5; // Exponential agitation
    const jitterX = (Math.random() - 0.5) * trembleScale;
    const jitterY = (Math.random() - 0.5) * trembleScale;

    // Smooth lerp to target + tremor
    currentPupilX += (targetX - currentPupilX) * 0.22;
    currentPupilY += (targetY - currentPupilY) * 0.22;

    const finalX = currentPupilX + jitterX;
    const finalY = currentPupilY + jitterY;

    pupilAssembly.style.transform = `translate(${finalX.toFixed(1)}px, ${finalY.toFixed(1)}px)`;

    // Check if cursor is directly over the eye boundary (approx 65px radius)
    if (distance < 65) {
      isHoveringInsideEye = true;
      eyeAnger = Math.min(1.0, eyeAnger + 0.0055); // Reaches 1.0 in ~3-4 seconds of continuous hover
    } else {
      isHoveringInsideEye = false;
      eyeAnger = Math.max(0.0, eyeAnger - 0.007); // Cools down when leaving
    }

    // Apply anger stages
    updateEyeAngerVisuals();

    requestAnimationFrame(ocularLoop);
  }
  requestAnimationFrame(ocularLoop);

  function updateEyeAngerVisuals() {
    if (!occultSvg) return;

    if (eyeAnger >= 1.0) {
      // Overload reached -> crash the screen!
      triggerCRTShutdown();
      return;
    }

    if (eyeAnger > 0.65) {
      occultSvg.classList.add('rage-3');
      occultSvg.classList.remove('rage-2', 'rage-1');
      body.classList.add('screen-shake-violent');
      body.classList.remove('screen-shake-mild');
    } else if (eyeAnger > 0.35) {
      occultSvg.classList.add('rage-2');
      occultSvg.classList.remove('rage-3', 'rage-1');
      body.classList.add('screen-shake-mild');
      body.classList.remove('screen-shake-violent');
    } else if (eyeAnger > 0.12) {
      occultSvg.classList.add('rage-1');
      occultSvg.classList.remove('rage-3', 'rage-2');
      body.classList.remove('screen-shake-violent', 'screen-shake-mild');
    } else {
      occultSvg.classList.remove('rage-1', 'rage-2', 'rage-3');
      body.classList.remove('screen-shake-violent', 'screen-shake-mild');
    }
  }

  // --- 4. Old CRT TV Power-Off Crash Sequence ---
  function triggerCRTShutdown() {
    if (isCrtShutDown) return;
    isCrtShutDown = true;
    eyeAnger = 0;

    // Reset eye rage visuals
    if (occultSvg) occultSvg.classList.remove('rage-1', 'rage-2', 'rage-3');
    body.classList.remove('screen-shake-violent', 'screen-shake-mild');

    appendLog('ALERTA: SOBRECARGA OCULAR CRÍTICA. TUBO CATÓDICO COLAPSADO.');

    if (crtOverlay) {
      crtOverlay.classList.remove('dead');
      crtOverlay.classList.add('active', 'animating');

      // After collapse animation finishes, leave in complete blackout
      setTimeout(() => {
        crtOverlay.classList.remove('animating');
        crtOverlay.classList.add('dead');
      }, 750);
    }
  }

  // Reboot CRT on click anywhere while shut down
  if (crtOverlay) {
    crtOverlay.addEventListener('click', () => {
      if (!isCrtShutDown) return;
      
      // Reboot bloom
      crtOverlay.classList.remove('dead');
      crtOverlay.style.background = '#ffffff';
      setTimeout(() => {
        crtOverlay.style.background = '';
        crtOverlay.classList.remove('active');
        isCrtShutDown = false;
        appendLog('REINICIO DE FILAMENTO EFECTUADO. SEÑAL RESTABLECIDA.');
      }, 150);
    });
  }

  // --- 5. Automatic Signal Distort with Prolonged Randomized Interval ---
  const cipherChars = '01#%&Ωλ☿⨀█▓░▲▼×+§';
  const orig1 = 'WE ARE WATCHING.';
  const orig2 = 'WE ARE LISTENING.';

  function triggerSignalDistort() {
    if (isCrtShutDown) return;

    // Flash VHS glitch tracking bar
    if (vhsGlitchBar) {
      vhsGlitchBar.style.height = '42px';
      vhsGlitchBar.style.opacity = '1';
      setTimeout(() => {
        vhsGlitchBar.style.height = '';
        vhsGlitchBar.style.opacity = '';
      }, 350);
    }

    // Scramble headline characters briefly
    if (mainHeadline) {
      const parts = mainHeadline.querySelectorAll('.headline-part');
      let iterations = 0;

      const interval = setInterval(() => {
        if (parts[0]) {
          parts[0].textContent = orig1
            .split('')
            .map((ch, idx) => (idx < iterations ? ch : cipherChars[Math.floor(Math.random() * cipherChars.length)]))
            .join('');
        }
        if (parts[1]) {
          parts[1].textContent = orig2
            .split('')
            .map((ch, idx) => (idx < iterations ? ch : cipherChars[Math.floor(Math.random() * cipherChars.length)]))
            .join('');
        }

        iterations += 1;
        if (iterations >= orig1.length + 3) {
          clearInterval(interval);
          if (parts[0]) parts[0].textContent = orig1;
          if (parts[1]) parts[1].textContent = orig2;
        }
      }, 40);
    }

    appendLog('INTERFERENCIA AUTOMÁTICA EN BANDA BASE (PROLONGADA).');
    scheduleNextAutoDistort();
  }

  function scheduleNextAutoDistort() {
    // Random interval between 22 and 45 seconds (prolonged, unpredictable)
    const nextDelay = Math.floor(Math.random() * 23000) + 22000;
    setTimeout(triggerSignalDistort, nextDelay);
  }
  scheduleNextAutoDistort();

});
