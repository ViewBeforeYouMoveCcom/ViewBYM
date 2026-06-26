"use client";

/**
 * VR360Player — renders a 360° video or photo using A-Frame (WebVR).
 * Loaded inside an isolated iframe so A-Frame doesn't interfere with React.
 * Works on desktop (mouse-drag), mobile (gyroscope), and VR headsets.
 */

interface Props {
  /** 360° equirectangular video URL (MP4 / WebM) */
  videoUrl?: string | null;
  /** 360° equirectangular photo URL (JPG / PNG / WebP) */
  imageUrl?: string | null;
  className?: string;
  autoHideControls?: boolean;
}

export default function VR360Player({ videoUrl, imageUrl, className = "", autoHideControls = false }: Props) {
  if (!videoUrl && !imageUrl) return null;

  const escapeAttr = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const rendererSettings = [
    "antialias: false",
    "colorManagement: true",
    "physicallyCorrectLights: false",
    "maxCanvasWidth: 1920",
    "maxCanvasHeight: 1080",
    "logarithmicDepthBuffer: false",
    "alpha: false",
    "precision: mediump",
    "pixelRatio: 1",
    "sortObjects: false",
  ].join("; ");

  const html = videoUrl
    ? `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>VR360</title>
  <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    a-scene { width: 100%; height: 100%; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }
    #loading {
      position: fixed;
      inset: 0;
      background: #080808;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      z-index: 9999;
      transition: opacity 0.5s;
    }
    #loading.fade { opacity: 0; pointer-events: none; }
    #loading p { font-family: sans-serif; margin: 0; }
    #video-status {
      position: fixed;
      bottom: 70px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 800;
      background: rgba(0,0,0,0.75);
      border-radius: 20px;
      padding: 7px 14px;
      display: none;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(8px);
      white-space: nowrap;
    }
    #video-status.show { display: flex; }
    #video-status span { color: #9ca3af; font-size: 11px; font-family: sans-serif; }
    #buf-bar-wrap { width: 80px; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px; }
    #buf-bar { height: 100%; background: #3b82f6; border-radius: 2px; width: 0%; transition: width 0.3s; }
    #buffering {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 500;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.5);
      border-radius: 50%;
      padding: 12px;
    }
    #buffering.active { display: flex; }
    #controls {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(0,0,0,0.85);
      padding: 6px 12px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      backdrop-filter: blur(10px);
      transition: opacity 0.3s;
    }
    #controls.hidden { opacity: 0; pointer-events: none; }
    #btn-row {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .a-enter-vr, .a-enter-ar, .a-enter-vr-button, .a-enter-ar-button,
    [data-aframe-default-button], .a-fullscreen-button, #a-fullscreen-button,
    .a-orientation-modal, .a-loader-title { display: none !important; }
    #controls button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #controls button:hover { background: rgba(255,255,255,0.1); }
    #timeline {
      width: 100%;
      height: 22px;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      touch-action: none;
    }
    #track {
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      position: relative;
      pointer-events: none;
    }
    #progress {
      height: 100%;
      background: #3b82f6;
      border-radius: 2px;
      width: 0%;
      position: relative;
    }
    #seek-thumb {
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      width: 13px;
      height: 13px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.6);
      opacity: 0;
      transition: opacity 0.15s;
      pointer-events: none;
    }
    #timeline:hover #seek-thumb, #timeline.dragging #seek-thumb { opacity: 1; }
    #time {
      color: white;
      font-size: 12px;
      font-family: monospace;
      white-space: nowrap;
      flex-shrink: 0;
      padding: 0 4px;
    }
  </style>
</head>
<body>
  <div id="loading">
    <svg class="spin" width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
      <path d="M4 22a18 18 0 0118-18" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/>
    </svg>
    <p style="color:#9ca3af;font-size:14px">Preparing VR experience…</p>
  </div>
  <div id="video-status">
    <svg class="spin" width="12" height="12" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.25)" stroke-width="6"/>
      <path d="M4 22a18 18 0 0118-18" stroke="#3b82f6" stroke-width="6" stroke-linecap="round"/>
    </svg>
    <span id="buf-text">Buffering video…</span>
    <div id="buf-bar-wrap"><div id="buf-bar"></div></div>
  </div>
  <div id="buffering">
    <svg class="spin" width="36" height="36" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
      <path d="M4 22a18 18 0 0118-18" stroke="white" stroke-width="4" stroke-linecap="round"/>
    </svg>
  </div>
  <a-scene
    embedded
    renderer="${rendererSettings}"
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false"
  >
    <a-assets timeout="3000">
      <video id="v360"
        src="${escapeAttr(videoUrl)}"
        loop muted playsinline preload="auto"
        crossorigin="anonymous"
        webkit-playsinline>
      </video>
    </a-assets>
    <a-videosphere
      id="videosphere"
      src="#v360"
      rotation="0 -90 0"
      segments-height="32"
      segments-width="32">
    </a-videosphere>
    <a-camera look-controls="pointerLockEnabled: false" wasd-controls="enabled: false"></a-camera>
  </a-scene>
  <div id="controls">
    <div id="timeline">
      <div id="track">
        <div id="progress"><div id="seek-thumb"></div></div>
      </div>
    </div>
    <div id="btn-row">
      <button id="playPause" title="Play/Pause">
        <svg id="playIcon" width="20" height="20" viewBox="0 0 24 24" fill="white" style="display:none">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg id="pauseIcon" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
        </svg>
      </button>
      <button id="skipBack" title="Back 10s">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          <text x="7.5" y="14.5" font-size="5.5" fill="white" font-family="sans-serif" font-weight="bold">10</text>
        </svg>
      </button>
      <button id="skipFwd" title="Forward 10s">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
          <text x="7.5" y="14.5" font-size="5.5" fill="white" font-family="sans-serif" font-weight="bold">10</text>
        </svg>
      </button>
      <div id="time">0:00 / 0:00</div>
      <button id="soundBtn" title="Unmute">
        <svg id="muteIcon" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
        <svg id="soundIcon" width="20" height="20" viewBox="0 0 24 24" fill="white" style="display:none">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      </button>
    </div>
  </div>
  <script>
    (function(){
      var v = document.getElementById('v360');
      var loadingEl = document.getElementById('loading');
      var videoStatusEl = document.getElementById('video-status');
      var bufText = document.getElementById('buf-text');
      var bufBar = document.getElementById('buf-bar');
      var bufferingEl = document.getElementById('buffering');
      var playPauseBtn = document.getElementById('playPause');
      var playIcon = document.getElementById('playIcon');
      var pauseIcon = document.getElementById('pauseIcon');
      var timeline = document.getElementById('timeline');
      var progress = document.getElementById('progress');
      var timeDisplay = document.getElementById('time');
      var loadingHidden = false;

      if (!v) return;

      function hideLoading() {
        if (loadingHidden) return;
        loadingHidden = true;
        loadingEl.classList.add('fade');
        setTimeout(function() { loadingEl.style.display = 'none'; }, 500);
        if (v.readyState < 3) {
          videoStatusEl.classList.add('show');
        }
      }

      function formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        var m = Math.floor(seconds / 60);
        var s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
      }

      function updateTime() {
        if (v.duration && isFinite(v.duration)) {
          var percent = (v.currentTime / v.duration) * 100;
          progress.style.width = percent + '%';
          timeDisplay.textContent = formatTime(v.currentTime) + ' / ' + formatTime(v.duration);
        }
      }

      function togglePlay() {
        if (v.paused) {
          v.play().then(function() {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
          }).catch(function() {});
        } else {
          v.pause();
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }
      }

      playPauseBtn.addEventListener('click', togglePlay);



      var soundBtn = document.getElementById('soundBtn');
      var muteIcon = document.getElementById('muteIcon');
      var soundIcon = document.getElementById('soundIcon');
      soundBtn.addEventListener('click', function() {
        v.muted = !v.muted;
        muteIcon.style.display = v.muted ? 'block' : 'none';
        soundIcon.style.display = v.muted ? 'none' : 'block';
        soundBtn.title = v.muted ? 'Unmute' : 'Mute';
      });

      if (${autoHideControls}) {
        var controls = document.getElementById('controls');
        var hideTimer;
        controls.classList.add('hidden');
        document.addEventListener('click', function() {
          controls.classList.remove('hidden');
          clearTimeout(hideTimer);
          hideTimer = setTimeout(function() { controls.classList.add('hidden'); }, 3000);
        });
      }

      // Skip buttons
      document.getElementById('skipBack').addEventListener('click', function() {
        v.currentTime = Math.max(0, v.currentTime - 10);
      });
      document.getElementById('skipFwd').addEventListener('click', function() {
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
      });

      // Timeline drag-to-seek (mouse + touch)
      var isDragging = false;

      function getSeekPercent(clientX) {
        var rect = timeline.getBoundingClientRect();
        return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      }

      function applySeek(clientX) {
        var pct = getSeekPercent(clientX);
        if (v.duration && isFinite(v.duration)) {
          v.currentTime = pct * v.duration;
          updateTime();
        }
      }

      timeline.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDragging = true;
        timeline.classList.add('dragging');
        applySeek(e.clientX);
      });
      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        applySeek(e.clientX);
      });
      document.addEventListener('mouseup', function() {
        if (isDragging) { isDragging = false; timeline.classList.remove('dragging'); }
      });

      timeline.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDragging = true;
        timeline.classList.add('dragging');
        applySeek(e.touches[0].clientX);
      }, { passive: false });
      document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        applySeek(e.touches[0].clientX);
      }, { passive: false });
      document.addEventListener('touchend', function() {
        isDragging = false;
        timeline.classList.remove('dragging');
      });

      v.addEventListener('timeupdate', updateTime);
      // Fallback: poll every 500ms for mobile where timeupdate is unreliable in A-Frame
      setInterval(updateTime, 500);
      v.addEventListener('play', function() {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        bufferingEl.classList.remove('active');
        videoStatusEl.classList.remove('show');
      });
      v.addEventListener('pause', function() {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      });
      v.addEventListener('waiting', function() { bufferingEl.classList.add('active'); });
      v.addEventListener('playing', function() { bufferingEl.classList.remove('active'); });
      v.addEventListener('loadedmetadata', updateTime);
      v.addEventListener('progress', function() {
        if (v.buffered.length > 0 && v.duration && isFinite(v.duration)) {
          var pct = Math.round((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
          bufBar.style.width = pct + '%';
          bufText.textContent = 'Buffering ' + pct + '%…';
        }
      });

      // Tap-to-play overlay (mobile fallback)
      var tapOverlay = document.createElement('div');
      tapOverlay.style.cssText = 'position:fixed;inset:0;z-index:600;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);cursor:pointer;';
      tapOverlay.innerHTML = '<div style="text-align:center;color:#fff;pointer-events:none;">' +
        '<svg width="64" height="64" viewBox="0 0 24 24" fill="white" style="opacity:0.9"><path d="M8 5v14l11-7z"/></svg>' +
        '<p style="font-family:sans-serif;font-size:15px;margin-top:10px;opacity:0.85">Tap to start VR tour</p>' +
        '</div>';
      document.body.appendChild(tapOverlay);

      function showTapOverlay() { tapOverlay.style.display = 'flex'; }
      function hideTapOverlay() { tapOverlay.style.display = 'none'; }

      tapOverlay.addEventListener('click', function() {
        v.muted = true;
        v.play().then(hideTapOverlay).catch(function() {});
      });

      function tryPlay() {
        v.muted = true;
        var p = v.play();
        if (p && p.then) {
          p.then(hideTapOverlay).catch(showTapOverlay);
        }
      }

      // Remove A-Frame built-in UI buttons (fullscreen, VR, AR)
      function removeAFrameUI() {
        var sel = '.a-enter-vr,.a-enter-ar,.a-enter-vr-button,.a-enter-ar-button,[data-aframe-default-button],.a-fullscreen-button,#a-fullscreen-button';
        document.querySelectorAll(sel).forEach(function(el) { el.parentNode && el.parentNode.removeChild(el); });
      }
      new MutationObserver(removeAFrameUI).observe(document.body, { childList: true, subtree: true });

      // Hide loading as soon as A-Frame scene is ready (not waiting on video)
      var scene = document.querySelector('a-scene');
      if (scene) {
        if (scene.hasLoaded) {
          hideLoading();
          tryPlay();
          removeAFrameUI();
        } else {
          scene.addEventListener('loaded', function() {
            hideLoading();
            tryPlay();
            removeAFrameUI();
          });
        }
      }

      // Safety fallback: hide loading after 6s no matter what
      setTimeout(function() {
        hideLoading();
        if (v.paused) showTapOverlay();
      }, 6000);

      // Also try on canplay
      v.addEventListener('canplay', function() {
        if (v.paused) tryPlay();
      }, { once: true });
    })();
  </script>
</body>
</html>`
    : `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>VR360</title>
  <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    a-scene { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <a-scene
    embedded
    renderer="${rendererSettings}"
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false"
  >
    <a-sky
      src="${escapeAttr(imageUrl ?? "")}"
      rotation="0 -90 0"
      segments-height="64"
      segments-width="64">
    </a-sky>
    <a-camera look-controls="pointerLockEnabled: false" wasd-controls="enabled: false"></a-camera>
  </a-scene>
</body>
</html>`;

  return (
    <iframe
      srcDoc={html}
      className={className}
      style={{ border: 0, display: "block" }}
      allow="autoplay; xr-spatial-tracking; gyroscope; accelerometer"
      title="360° VR tour"
    />
  );
}
