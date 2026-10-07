/**
 * ANALOG HORROR SURVEILLANCE & OCCULT CORE
 * Drives pupil tracking trigonometry, procedural tape synthesis, and VHS glitch telemetry.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const body = document.getElementById('app-body');
  const occultEmblem = document.getElementById('occult-emblem');
  const pupilAssembly = document.getElementById('pupil-target');
  const eyeLabel = document.getElementById('eye-state-label');
  const vhsClock = document.getElementById('vhs-clock');
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioLabel = document.getElementById('audio-status-label');
  const invertBtn = document.getElementById('invert-mode-btn');
  const invertLabel = document.getElementById('invert-status-label');
  const scrambleBtn = document.getElementById('scramble-btn');
  const transmitBtn = document.getElementById('transmit-btn');
  const dossierBtn = document.getElementById('dossier-toggle-btn');
  const dossierPanel = document.getElementById('dossier-panel');
  const revealAllBtn = document.getElementById('reveal-all-btn');
  const terminalFeed = document.getElementById('terminal-feed');
  const mainHeadline = document.getElementById('main-headline');
  const vhsGlitchBar = document.getElementById('vhs-glitch-bar');
  const visualizerBars = document.querySelectorAll('.v-bar');

  // --- 1. Live VHS Clock with Milliseconds ---
  function updateVHSClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const frames = String(Math.floor(now.getMilliseconds() / 40)).padStart(2, '0');
    vhsClock.textContent = `${hours}:${minutes}:${seconds}:${frames} PM`;
  }
  setInterval(updateVHSClock, 40);
  updateVHSClock();

  // --- 2. Interactive Pupil Tracking (Mouse Trigonometry) ---
  // Calculates angle & distance so the stylized eye actually stares down the visitor.
  let isTargeting = true;
  let pupilOffset = { x: 0, y: 0 };
  const MAX_RADIUS = 15; // Don't let the pupil drift outside the drawn iris

  function handleMouseMove(e) {
    if (!occultEmblem || !pupilAssembly || !isTargeting) return;

    const rect = occultEmblem.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - eyeCenterX;
    const deltaY = e.clientY - eyeCenterY;
    const distance = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX);

    // Ease clamp so the pupil feels elastic rather than locked to a hard boundary
    const clampedDist = Math.min(distance * 0.05, MAX_RADIUS);
    pupilOffset.x = Math.cos(angle) * clampedDist;
    pupilOffset.y = Math.sin(angle) * clampedDist;

    pupilAssembly.style.transform = `translate(${pupilOffset.x.toFixed(1)}px, ${pupilOffset.y.toFixed(1)}px)`;

    // Random telemetry update when hovering close
    if (distance < 200) {
      eyeLabel.textContent = `TARGET LOCKED // AZM ${(angle * (180 / Math.PI)).toFixed(0)}°`;
    } else {
      eyeLabel.textContent = 'MONITORING PERIMETER';
    }
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Spontaneous eye twitch or dilation every few seconds to feel unnerving
  setInterval(() => {
    if (Math.random() > 0.65) {
      const twitchX = pupilOffset.x + (Math.random() - 0.5) * 4;
      const twitchY = pupilOffset.y + (Math.random() - 0.5) * 4;
      pupilAssembly.style.transform = `translate(${twitchX.toFixed(1)}px, ${twitchY.toFixed(1)}px)`;
      setTimeout(() => {
        pupilAssembly.style.transform = `translate(${pupilOffset.x.toFixed(1)}px, ${pupilOffset.y.toFixed(1)}px)`;
      }, 90);
    }
  }, 3200);

  // --- 3. Terminal Log Dispatcher ---
  function appendLog(message) {
    if (!terminalFeed) return;
    const now = new Date();
    const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
    
    const row = document.createElement('div');
    row.className = 'log-row';
    row.innerHTML = `<span class="log-time">${timeStr}</span> <span class="log-txt">${message}</span>`;
    
    terminalFeed.appendChild(row);
    terminalFeed.scrollTop = terminalFeed.scrollHeight;

    // Prune old logs to avoid unbounded DOM growth
    while (terminalFeed.children.length > 8) {
      terminalFeed.removeChild(terminalFeed.firstChild);
    }
  }

  // --- 4. Web Audio API Procedural Tape / Occult Drone ---
  // Browser auto-play policies will kill audio if we start unprompted, so user initiates it here.
  let audioCtx = null;
  let isAudioActive = false;
  let droneOsc = null;
  let droneGain = null;
  let noiseNode = null;
  let noiseGain = null;
  let lfoOsc = null;

  function initAudio() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      // Sub-bass 55Hz foundation drone
      droneOsc = audioCtx.createOscillator();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(54.2, audioCtx.currentTime); // Low resonant hum

      // Low-pass filter to make it sound like a subterranean generator through concrete
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, audioCtx.currentTime);

      // Low frequency oscillator to give the drone a breathing wobble
      lfoOsc = audioCtx.createOscillator();
      lfoOsc.frequency.setValueAtTime(0.2, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(4, audioCtx.currentTime);
      lfoOsc.connect(lfoGain);
      lfoGain.connect(droneOsc.frequency);
      lfoOsc.start();

      droneGain = audioCtx.createGain();
      droneGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(audioCtx.destination);
      droneOsc.start();

      // Procedural Tape Hiss & Static
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        // Pink noise filter curve
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, audioCtx.currentTime);
      noiseFilter.Q.setValueAtTime(0.6, audioCtx.currentTime);

      noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.035, audioCtx.currentTime);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noiseNode.start();

      isAudioActive = true;
      audioLabel.textContent = 'ACTIVE [54Hz]';
      audioBtn.setAttribute('aria-pressed', 'true');
      appendLog('ANALOG CARRIER SIGNAL ENGAGED (54.20 MHz).');
      startVisualizerJitter();
    } catch (err) {
      console.warn('Audio initiation prevented or unsupported:', err);
    }
  }

  function toggleAudio() {
    if (!audioCtx) {
      initAudio();
      return;
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      isAudioActive = true;
      audioLabel.textContent = 'ACTIVE [54Hz]';
      audioBtn.setAttribute('aria-pressed', 'true');
      appendLog('AUDIO INTERCEPT RESUMED.');
    } else if (audioCtx.state === 'running') {
      audioCtx.suspend();
      isAudioActive = false;
      audioLabel.textContent = 'OFF';
      audioBtn.setAttribute('aria-pressed', 'false');
      appendLog('AUDIO CARRIER DAMPENED.');
    }
  }

  audioBtn.addEventListener('click', toggleAudio);

  // Equalizer visualizer animation
  function startVisualizerJitter() {
    setInterval(() => {
      visualizerBars.forEach(bar => {
        if (isAudioActive) {
          const randHeight = Math.floor(Math.random() * 14) + 2;
          bar.style.height = `${randHeight}px`;
        } else {
          bar.style.height = '3px';
        }
      });
    }, 110);
  }
  startVisualizerJitter();

  // --- 5. Photocopied Invert Mode (Stark Xerox Paper Mode) ---
  invertBtn.addEventListener('click', () => {
    const isInverted = body.classList.toggle('mode-invert');
    invertLabel.textContent = isInverted ? 'XEROX' : 'VOID';
    appendLog(isInverted ? 'TONALITY INVERTED: PHOTOCOPIED REVERSAL.' : 'TONALITY RESTORED: OBSIDIAN VOID.');
  });

  // --- 6. Signal Distortion / Scramble Effect ---
  const originalHeadline = 'WE ARE WATCHING.\nWE ARE LISTENING.';
  const cipherChars = '01#%&Ωλ☿⨀█▓░▲▼×+§';

  function triggerSignalDistort() {
    // Fire a burst on the VHS glitch bar
    vhsGlitchBar.style.height = '48px';
    vhsGlitchBar.style.opacity = '1';
    setTimeout(() => {
      vhsGlitchBar.style.height = '';
      vhsGlitchBar.style.opacity = '';
    }, 300);

    // Text scramble
    let iterations = 0;
    const parts = mainHeadline.querySelectorAll('.headline-part');
    const orig1 = 'WE ARE WATCHING.';
    const orig2 = 'WE ARE LISTENING.';

    const scrambleInterval = setInterval(() => {
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
        clearInterval(scrambleInterval);
        if (parts[0]) parts[0].textContent = orig1;
        if (parts[1]) parts[1].textContent = orig2;
      }
    }, 45);

    appendLog('SIGNAL INTERFERENCE DETECTED. HORIZONTAL HOLD DESTABILIZED.');
  }

  scrambleBtn.addEventListener('click', triggerSignalDistort);

  // --- 7. Redacted Tape Blocks (Declassification on Click) ---
  const redactedBlocks = document.querySelectorAll('.redacted-box');

  redactedBlocks.forEach(box => {
    box.addEventListener('click', () => {
      const secret = box.getAttribute('data-secret');
      if (!box.classList.contains('revealed')) {
        box.classList.add('revealed');
        box.textContent = secret;
        appendLog(`CLASSIFIED STRING DISCLOSED: "${secret}"`);
      } else {
        box.classList.remove('revealed');
        box.textContent = '[REDACTED]';
        appendLog('STRING RESTORED TO OBFUSCATION.');
      }
    });
  });

  revealAllBtn.addEventListener('click', () => {
    redactedBlocks.forEach(box => {
      const secret = box.getAttribute('data-secret');
      box.classList.add('revealed');
      box.textContent = secret;
    });
    appendLog('FULL SYSTEM DECLASSIFICATION FORCED BY OPERATOR.');
  });

  // --- 8. Confirm Surveillance Interaction ---
  transmitBtn.addEventListener('click', () => {
    triggerSignalDistort();
    appendLog('SUBJECT CONFIRMATION PACKET BROADCASTED. DO NOT LEAVE.');
    
    // Quick flash of pupil dilation
    const pupilCircle = document.getElementById('pupil-circle');
    if (pupilCircle) {
      pupilCircle.setAttribute('r', '32');
      setTimeout(() => pupilCircle.setAttribute('r', '26'), 400);
    }
  });

  // --- 9. Toggle Surveillance Dossier Feed (Hooded Figures Panel) ---
  dossierBtn.addEventListener('click', () => {
    const isActive = dossierPanel.classList.toggle('active');
    dossierBtn.querySelector('.btn-bracket').nextSibling.nodeValue = isActive ? ' CONCEAL DOSSIER FEED ' : ' EXAMINE DOSSIER FEED ';
    appendLog(isActive ? 'SURVEILLANCE CAM FEED (REAR EXTERIOR) OPENED.' : 'MONITOR SHUT DOWN.');

    if (isActive) {
      dossierPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Background random ambient check-in log
  setInterval(() => {
    const ambientLogs = [
      'ACOUSTIC SENSORS REGISTER SHADOW MOVEMENT.',
      'MAGNETIC TAPE FLUX STEADY.',
      'NO ESCAPE CORRIDOR FOUND IN THIS SECTOR.',
      'THE WITNESSES HAVE NOT CHANGED POSITION.'
    ];
    if (Math.random() > 0.4) {
      const chosen = ambientLogs[Math.floor(Math.random() * ambientLogs.length)];
      appendLog(chosen);
    }
  }, 9000);
});
