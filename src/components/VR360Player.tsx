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
  /** Show a full-screen button in the transport bar; posts "vr-fullscreen-request" to the parent window on click (this player has no direct access to the DOM outside its iframe). */
  showFullscreenButton?: boolean;
}

export default function VR360Player({ videoUrl, imageUrl, className = "", autoHideControls = false, showFullscreenButton = false }: Props) {
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
    "maxCanvasWidth: 3840",
    "maxCanvasHeight: 2160",
    "logarithmicDepthBuffer: false",
    "alpha: false",
    "precision: mediump",
    "pixelRatio: 1",
    "sortObjects: false",
  ].join("; ");
  const videoSrcJson = JSON.stringify(videoUrl ?? "");

  const html = videoUrl
    ? `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>VR360</title>
  <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@1.6.7/dist/hls.min.js"></script>
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
      min-width: 0;
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
    #volume-wrap {
      display: flex;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
      margin-left: auto;
    }
    #vol-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 64px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255,255,255,0.3);
      cursor: pointer;
      outline: none;
      flex-shrink: 0;
    }
    #vol-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }
    #vol-slider::-moz-range-thumb {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      border: none;
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }
    #quality-wrap {
      position: relative;
      flex-shrink: 0;
    }
    #qualityBtn {
      border-radius: 14px !important;
      padding: 6px 9px !important;
      min-width: 52px;
      font: 700 11px/1 sans-serif;
    }
    #qualityBtn.active { background: rgba(255,255,255,0.14); }
    #quality-menu {
      position: absolute;
      right: 0;
      bottom: 34px;
      width: 118px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 8px;
      background: rgba(12,12,12,0.96);
      box-shadow: 0 12px 30px rgba(0,0,0,0.42);
      backdrop-filter: blur(12px);
    }
    #quality-menu.open { display: flex; }
    #quality-menu button {
      width: 100%;
      justify-content: space-between;
      border-radius: 0 !important;
      padding: 9px 10px !important;
      color: #e5e7eb;
      font: 600 12px/1 sans-serif;
    }
    #quality-menu button.selected {
      color: #fff;
      background: rgba(59,130,246,0.28);
    }
    #quality-menu button span:last-child {
      color: #93c5fd;
      font-size: 10px;
    }
    #enterVRBtn {
      flex-shrink: 0;
      border-radius: 16px !important;
      padding: 8px 11px !important;
      gap: 4px;
      background: rgba(0,0,0,0.72) !important;
      border: 1px solid rgba(255,255,255,0.18) !important;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    #enterVRBtn:hover { background: rgba(20,20,20,0.88) !important; }
    @media (max-width: 560px) {
      #controls {
        padding: 6px 8px 9px;
      }
      #btn-row {
        gap: 1px;
      }
      #controls button {
        padding: 6px;
      }
      #time {
        font-size: 11px;
        padding: 0 2px;
      }
      #volume-wrap {
        margin-left: 0;
      }
      #vol-slider {
        width: 44px;
      }
      #qualityBtn {
        min-width: 44px;
        padding: 6px 7px !important;
        font-size: 10px;
      }
      #quality-menu {
        right: -8px;
      }
      #enterVRBtn {
        padding: 7px 9px !important;
      }
      #enterVRBtn span {
        font-size: 10px !important;
      }
    }
    @media (max-width: 420px) {
      #skipBack,
      #skipFwd {
        display: none !important;
      }
      #time {
        font-size: 10px;
      }
      #vol-slider {
        width: 34px;
      }
      #qualityBtn {
        min-width: 40px;
      }
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
    webxr="optionalFeatures: local-floor, bounded-floor, hand-tracking"
    cursor="rayOrigin: mouse; fuse: false"
    raycaster="objects: .vr-btn; far: 10"
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false"
  >
    <a-assets timeout="3000">
      <video id="v360"
        data-src="${escapeAttr(videoUrl)}"
        autoplay loop muted playsinline preload="auto"
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
    <a-camera id="vrCamera" look-controls="enabled: true; pointerLockEnabled: false; magicWindowTrackingEnabled: true" wasd-controls="enabled: false">
      <a-cursor fuse="true" fuse-timeout="1200"
        geometry="primitive: ring; radiusInner: 0.008; radiusOuter: 0.012"
        material="color: white; shader: flat; opacity: 0.85"
        animation__fuse="property: scale; startEvents: fusing; from: 1 1 1; to: 0.2 0.2 0.2; dur: 1200">
      </a-cursor>
      <a-entity id="vrHud" position="0 -0.38 -1.1" visible="false">
        <a-entity id="vrPlayPauseBtn" class="vr-btn"
          geometry="primitive: circle; radius: 0.09" material="color: #08519A; shader: flat; opacity: 0.9"
          text="value: ||; align: center; color: #fff; width: 0.6">
        </a-entity>
        <a-entity id="vrSkipBackBtn" class="vr-btn" position="-0.24 0 0"
          geometry="primitive: circle; radius: 0.065" material="color: #000; shader: flat; opacity: 0.65"
          text="value: -10s; align: center; color: #fff; width: 0.9">
        </a-entity>
        <a-entity id="vrSkipFwdBtn" class="vr-btn" position="0.24 0 0"
          geometry="primitive: circle; radius: 0.065" material="color: #000; shader: flat; opacity: 0.65"
          text="value: +10s; align: center; color: #fff; width: 0.9">
        </a-entity>
        <a-entity id="vrVolumeDownBtn" class="vr-btn" position="-0.24 -0.18 0"
          geometry="primitive: circle; radius: 0.065" material="color: #000; shader: flat; opacity: 0.65"
          text="value: Vol -; align: center; color: #fff; width: 0.8">
        </a-entity>
        <a-entity id="vrMuteBtn" class="vr-btn" position="0 -0.18 0"
          geometry="primitive: circle; radius: 0.065" material="color: #000; shader: flat; opacity: 0.65"
          text="value: Mute; align: center; color: #fff; width: 0.8">
        </a-entity>
        <a-entity id="vrVolumeUpBtn" class="vr-btn" position="0.24 -0.18 0"
          geometry="primitive: circle; radius: 0.065" material="color: #000; shader: flat; opacity: 0.65"
          text="value: Vol +; align: center; color: #fff; width: 0.8">
        </a-entity>
        <a-entity id="vrQualityBtn" class="vr-btn" position="-0.18 -0.36 0"
          geometry="primitive: plane; width: 0.28; height: 0.1" material="color: #173f70; shader: flat; opacity: 0.9"
          text="value: Quality: Auto; align: center; color: #fff; width: 0.68">
        </a-entity>
        <a-entity id="vrQualityMenu" position="0 0.3 0.01" visible="false"
          geometry="primitive: plane; width: 0.66; height: 0.42"
          material="color: #080f1c; shader: flat; opacity: 0.94">
          <a-entity class="vr-btn vr-quality-option" data-vr-quality="auto" position="-0.16 0.13 0.01"
            geometry="primitive: plane; width: 0.27; height: 0.09" material="color: #2563eb; shader: flat"
            text="value: Auto; align: center; color: #fff; width: 0.75"></a-entity>
          <a-entity class="vr-btn vr-quality-option" data-vr-quality="1440" position="0.16 0.13 0.01"
            geometry="primitive: plane; width: 0.27; height: 0.09" material="color: #1f2937; shader: flat"
            text="value: 2K / 1440p; align: center; color: #fff; width: 0.75"></a-entity>
          <a-entity class="vr-btn vr-quality-option" data-vr-quality="1080" position="0.16 0.02 0.01"
            geometry="primitive: plane; width: 0.27; height: 0.09" material="color: #1f2937; shader: flat"
            text="value: 1080p; align: center; color: #fff; width: 0.75"></a-entity>
          <a-entity class="vr-btn vr-quality-option" data-vr-quality="720" position="-0.16 -0.09 0.01"
            geometry="primitive: plane; width: 0.27; height: 0.09" material="color: #1f2937; shader: flat"
            text="value: 720p; align: center; color: #fff; width: 0.75"></a-entity>
          <a-entity class="vr-btn vr-quality-option" data-vr-quality="360" position="0.16 -0.09 0.01"
            geometry="primitive: plane; width: 0.27; height: 0.09" material="color: #1f2937; shader: flat"
            text="value: 360p; align: center; color: #fff; width: 0.75"></a-entity>
        </a-entity>
        <a-entity id="vrExitBtn" class="vr-btn" position="0.18 -0.36 0"
          geometry="primitive: plane; width: 0.28; height: 0.1" material="color: #991b1b; shader: flat; opacity: 0.9"
          text="value: Exit VR; align: center; color: #fff; width: 0.75">
        </a-entity>
      </a-entity>
    </a-camera>
    <a-entity id="leftHandController" laser-controls="hand: left" vr-btn-trigger raycaster="objects: .vr-btn; far: 10" line="color: #3b82f6; opacity: 0.85"></a-entity>
    <a-entity id="rightHandController" laser-controls="hand: right" vr-btn-trigger raycaster="objects: .vr-btn; far: 10" line="color: #3b82f6; opacity: 0.85"></a-entity>
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
      <div id="volume-wrap">
        <button id="soundBtn" title="Unmute">
          <svg id="muteIcon" width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
          <svg id="soundIcon" width="20" height="20" viewBox="0 0 24 24" fill="white" style="display:none">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </button>
        <input id="vol-slider" type="range" min="0" max="1" step="0.05" value="0" />
      </div>
      <div id="quality-wrap">
        <button id="qualityBtn" title="Video quality" type="button">Auto</button>
        <div id="quality-menu" aria-label="Video quality">
          <button type="button" data-quality="auto" class="selected"><span>Auto</span><span></span></button>
          <button type="button" data-quality="1440"><span>2K</span><span>1440p</span></button>
          <button type="button" data-quality="1080"><span>1080p</span><span>HD</span></button>
          <button type="button" data-quality="720"><span>720p</span><span>HD</span></button>
          <button type="button" data-quality="360"><span>360p</span><span>Low</span></button>
        </div>
      </div>
      <button id="enterVRBtn" title="Enter VR headset" style="display:none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="10" rx="4"/>
          <circle cx="8" cy="12" r="1.6" fill="white" stroke="none"/>
          <circle cx="16" cy="12" r="1.6" fill="white" stroke="none"/>
        </svg>
        <span style="font:700 11px/1 sans-serif;margin-left:2px">VR</span>
      </button>
      ${showFullscreenButton ? `
      <button id="fullscreenBtn" title="Full screen" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>` : ""}
    </div>
  </div>
  <script>
    (function(){
      // ── Reliable trigger-click for VR hand controllers ─────────────
      // The HUD buttons used to depend on A-Frame's built-in "cursor"
      // component (paired with oculus-touch-controls) to turn a raycaster
      // hit + trigger press into a synthetic "click" on the button. That
      // chain works in the desktop WebXR emulator but was reported to not
      // register a single button press on a real Quest 3 headset — likely
      // a controller-input-mapping mismatch between oculus-touch-controls
      // and current Quest firmware. This component skips that abstraction
      // entirely: it listens to the controller's own low-level
      // "triggerdown" event (emitted directly by A-Frame's tracked-controls
      // from the WebXR input source, independent of the cursor component)
      // and manually checks what the hand's raycaster is currently hitting.
      if (window.AFRAME && !AFRAME.components['vr-btn-trigger']) {
        AFRAME.registerComponent('vr-btn-trigger', {
          init: function () {
            this.onTriggerDown = this.onTriggerDown.bind(this);
            this.el.addEventListener('triggerdown', this.onTriggerDown);
          },
          onTriggerDown: function () {
            var raycasterComp = this.el.components.raycaster;
            if (!raycasterComp || !raycasterComp.intersections.length) return;
            var targetEl = raycasterComp.intersections[0].object.el;
            if (targetEl && targetEl.classList.contains('vr-btn')) {
              targetEl.emit('click', {}, false);
            }
          }
        });
      }

      // ── WebGL / VR support detection ──────────────────────────────
      function isWebGLSupported() {
        try {
          var canvas = document.createElement('canvas');
          var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          return !!(gl && gl instanceof WebGLRenderingContext);
        } catch(e) { return false; }
      }

      var unsupportedShown = false;
      function reportLoadFailure() {
        // Lets the host page (VRTourPanel) know the 360° experience itself
        // failed — not just a headset-entry issue — so it can fall back to
        // the MP4 walkthrough or photo gallery instead of a dead player.
        try { window.parent.postMessage({ type: 'vr-error' }, '*'); } catch(e) {}
      }
      function showUnsupportedPopup(title, message, isLoadFailure) {
        if (unsupportedShown) return;
        unsupportedShown = true;
        if (isLoadFailure !== false) reportLoadFailure();
        var errEl = document.createElement('div');
        errEl.style.cssText = [
          'position:fixed','inset:0','z-index:99999','background:#0d0d0d',
          'display:flex','flex-direction:column','align-items:center',
          'justify-content:center','gap:14px','padding:24px','text-align:center'
        ].join(';');
        errEl.innerHTML =
          '<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round">' +
            '<circle cx="12" cy="12" r="10"/>' +
            '<line x1="12" y1="8" x2="12" y2="12"/>' +
            '<circle cx="12" cy="16" r="0.5" fill="#ef4444"/>' +
          '</svg>' +
          '<p style="color:#fff;font-size:16px;font-weight:700;margin:0;font-family:sans-serif">' + title + '</p>' +
          '<p style="color:#9ca3af;font-size:13px;margin:0;font-family:sans-serif;max-width:280px;line-height:1.6">' +
            message +
          '</p>';
        document.body.appendChild(errEl);
        var loadingScreen = document.getElementById('loading');
        if (loadingScreen) loadingScreen.style.display = 'none';
      }

      if (!isWebGLSupported()) {
        showUnsupportedPopup(
          'VR Not Supported',
          'Your device does not support the VR tour. Please try on a modern smartphone or a different browser.'
        );
        return;
      }
      // ─────────────────────────────────────────────────────────────

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
      var sourceUrl = ${videoSrcJson};
      var hls = null;
      var qualityLevels = [];
      var selectedQuality = 'auto';
      var lastKnownHeight = 0;
      var qualityBtn = document.getElementById('qualityBtn');
      var qualityMenu = document.getElementById('quality-menu');
      var hlsAutoStartedLow = false;
      var plainVideoMode = false;
      var inImmersiveVr = false;

      if (!v) return;

      function getCloudflareHlsUrl(url) {
        try {
          var parsed = new URL(url, window.location.href);
          var host = parsed.hostname.toLowerCase();
          var parts = parsed.pathname.split('/').filter(Boolean);
          var fileLike = /\\.(mp4|m4v|mov|webm)(?:$|\\?)/i.test(parsed.pathname);
          if (/\\.m3u8(?:$|\\?)/i.test(parsed.pathname) || fileLike) return url;
          if (host === 'iframe.videodelivery.net' && parts[0]) {
            return 'https://videodelivery.net/' + parts[0] + '/manifest/video.m3u8';
          }
          if ((host.indexOf('cloudflarestream.com') !== -1 || host.indexOf('videodelivery.net') !== -1) && parts[0]) {
            if (parts.indexOf('manifest') !== -1) return url;
            return parsed.origin + '/' + parts[0] + '/manifest/video.m3u8';
          }
        } catch(e) {}
        return url;
      }

      function isHlsUrl(url) {
        return /\\.m3u8(?:$|\\?)/i.test(url);
      }

      function qualityLabel(height) {
        if (!height) return 'Auto';
        if (height >= 2160) return '4K';
        if (height >= 1440) return '2K';
        return height + 'p';
      }

      function setQualityButtonText(text) {
        if (qualityBtn) qualityBtn.textContent = text;
      }

      function currentQualityText() {
        if (selectedQuality === 'auto') {
          return 'Auto';
        }
        return qualityLabel(Number(selectedQuality));
      }

      function updateQualityButton() {
        setQualityButtonText(currentQualityText());
        updateVrQualityLabel();
        if (!qualityMenu) return;
        qualityMenu.querySelectorAll('button').forEach(function(btn) {
          btn.classList.toggle('selected', btn.getAttribute('data-quality') === selectedQuality);
        });
      }

      function renderProfileFor(height) {
        // Sharpness on screen is controlled by pixelRatio (how many real
        // device pixels the canvas draws to), not by the video's bitrate
        // tier — throttling it below the device's own pixel ratio made every
        // quality under 4K look soft/blurry regardless of how sharp the
        // video itself was. Track the real device instead (capped at 2x,
        // standard practice to avoid pointless GPU cost on very high-DPI
        // screens with no visible sharpness gain).
        var deviceRatio = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
        var pixelRatio = Math.min(deviceRatio, 2);

        // Sphere segment count only affects how round the 360° sphere shape
        // itself is (geometry), not the video texture's sharpness — a light
        // taper here is still fine for very low bitrates to save GPU.
        if (!height || height >= 1080) return { pixelRatio: pixelRatio, width: 32, height: 32 };
        if (height >= 720) return { pixelRatio: pixelRatio, width: 26, height: 26 };
        return { pixelRatio: pixelRatio, width: 20, height: 20 };
      }

      function applyRenderQuality(height) {
        var profile = renderProfileFor(height);
        var sceneEl = document.querySelector('a-scene');
        var sphereEl = document.getElementById('videosphere');

        if (sphereEl) {
          sphereEl.setAttribute('segments-width', String(profile.width));
          sphereEl.setAttribute('segments-height', String(profile.height));
        }

        if (sceneEl && sceneEl.renderer) {
          try {
            sceneEl.renderer.setPixelRatio(profile.pixelRatio);
            sceneEl.resize();
          } catch(e) {}
        }
      }

      function renderQualityMenu() {
        if (!qualityBtn || !qualityMenu) return;
        qualityMenu.querySelectorAll('button[data-quality]').forEach(function(btn) {
          if (btn.getAttribute('data-bound') === 'true') return;
          btn.setAttribute('data-bound', 'true');
          btn.addEventListener('click', function() {
            selectedQuality = btn.getAttribute('data-quality') || 'auto';
            applyQualitySelection();
            qualityMenu.classList.remove('open');
            qualityBtn.classList.remove('active');
          });
        });
        updateQualityButton();
      }

      function findBestLevel(targetHeight) {
        if (!qualityLevels.length) return null;
        var sorted = qualityLevels.slice().sort(function(a, b) { return b.height - a.height; });
        var notHigherThanTarget = sorted.find(function(level) { return level.height <= targetHeight; });
        if (notHigherThanTarget) return notHigherThanTarget;
        return sorted
          .slice()
          .sort(function(a, b) {
            return Math.abs(a.height - targetHeight) - Math.abs(b.height - targetHeight);
          })[0] || null;
      }

      function flushForwardBuffer() {
        if (!hls || !window.Hls || !window.Hls.Events) return;
        try {
          hls.trigger(window.Hls.Events.BUFFER_FLUSHING, {
            startOffset: Math.max(0, (v.currentTime || 0) + 0.25),
            endOffset: Number.POSITIVE_INFINITY,
            type: 'video'
          });
        } catch(e) {}
      }

      function restartHlsAtCurrentTime() {
        if (!hls) return;
        try { hls.stopLoad(); } catch(e) {}
        try { hls.startLoad(Math.max(0, (v.currentTime || 0) - 0.1)); } catch(e) {}
      }

      function tuneBufferForSelection(height) {
        if (!hls || !hls.config) return;
        if (height && height <= 360) {
          hls.config.maxBufferLength = 6;
          hls.config.maxMaxBufferLength = 10;
          hls.config.backBufferLength = 6;
        } else if (height && height <= 720) {
          hls.config.maxBufferLength = 10;
          hls.config.maxMaxBufferLength = 16;
          hls.config.backBufferLength = 10;
        } else {
          hls.config.maxBufferLength = 18;
          hls.config.maxMaxBufferLength = 30;
          hls.config.backBufferLength = 20;
        }
      }

      function applyQualitySelection() {
        var wanted = selectedQuality === 'auto' ? 0 : Number(selectedQuality);
        applyRenderQuality(wanted);

        if (!hls) {
          updateQualityButton();
          return;
        }
        if (selectedQuality === 'auto') {
          hls.currentLevel = -1;
          hls.autoLevelCapping = -1;
          // 0 is falsy, so passing it here previously fell through to the
          // largest buffer profile (18-30s target) instead of the tight
          // one meant for starting at low quality — the opposite of what
          // "auto" should do, and the direct cause of buffering even at 360p.
          tuneBufferForSelection(360);
          if (!hlsAutoStartedLow && qualityLevels.length) {
            hlsAutoStartedLow = true;
            hls.loadLevel = 0;
            hls.nextLevel = 0;
            applyRenderQuality(360);
            setTimeout(function() {
              if (selectedQuality === 'auto' && hls) {
                hls.loadLevel = -1;
                hls.nextLevel = -1;
              }
            }, 4000);
          } else {
            hls.loadLevel = -1;
            hls.nextLevel = -1;
          }
        } else {
          var match = findBestLevel(wanted);
          if (match) {
            tuneBufferForSelection(wanted);
            hls.autoLevelCapping = match.index;
            hls.firstLevel = match.index;
            hls.startLevel = match.index;
            hls.currentLevel = match.index;
            hls.loadLevel = match.index;
            hls.nextLevel = match.index;
            lastKnownHeight = wanted;
            flushForwardBuffer();
            restartHlsAtCurrentTime();
          }
        }
        updateQualityButton();
      }

      if (qualityBtn && qualityMenu) {
        qualityBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          qualityMenu.classList.toggle('open');
          qualityBtn.classList.toggle('active', qualityMenu.classList.contains('open'));
        });
        document.addEventListener('click', function(e) {
          if (!qualityMenu.contains(e.target) && e.target !== qualityBtn) {
            qualityMenu.classList.remove('open');
            qualityBtn.classList.remove('active');
          }
        });
      }

      function setupVideoSource() {
        var normalizedUrl = getCloudflareHlsUrl(sourceUrl);
        if (isHlsUrl(normalizedUrl) && window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            capLevelToPlayerSize: false,
            startLevel: 0,
            autoStartLoad: true,
            abrEwmaDefaultEstimate: 500000,
            maxStarvationDelay: 2,
            maxLoadingDelay: 2,
            maxBufferHole: 0.5,
            maxBufferLength: 10,
            maxMaxBufferLength: 18,
            backBufferLength: 10
          });
          hls.loadSource(normalizedUrl);
          hls.attachMedia(v);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
            var seen = {};
            qualityLevels = hls.levels
              .map(function(level, index) {
                return { index: index, height: level.height || 0, bitrate: level.bitrate || 0 };
              })
              .filter(function(level) {
                if (!level.height || seen[level.height]) return false;
                seen[level.height] = true;
                return true;
              });
            renderQualityMenu();
            if (selectedQuality === 'auto') {
              hls.nextLevel = 0;
              applyRenderQuality(360);
            }
            applyQualitySelection();
          });
          hls.on(window.Hls.Events.LEVEL_SWITCHED, function(_, data) {
            var level = hls.levels[data.level];
            if (level && level.height) {
              lastKnownHeight = level.height;
              if (selectedQuality === 'auto') applyRenderQuality(level.height);
              renderQualityMenu();
            }
          });
          hls.on(window.Hls.Events.ERROR, function(_, data) {
            if (data && data.fatal) {
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
              else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
              else showUnsupportedPopup('VR Tour Unavailable', 'This adaptive VR tour could not be loaded. Please try again.');
            }
          });
          return;
        }

        if (isHlsUrl(normalizedUrl) && !v.canPlayType('application/vnd.apple.mpegurl')) {
          // Neither hls.js nor native HLS is available — a plain <video>
          // tag can never parse an .m3u8 manifest, so this would just
          // hang until the backup timeout. Fail immediately instead,
          // the same way YouTube shows "not supported" right away on
          // old Safari/Chrome rather than making you wait.
          showUnsupportedPopup(
            'VR Not Supported',
            'Your browser does not support this VR tour format. Please try on a modern smartphone or a different browser.'
          );
          return;
        }

        plainVideoMode = true;
        v.src = normalizedUrl;
        if (isHlsUrl(normalizedUrl) && v.canPlayType('application/vnd.apple.mpegurl')) {
          selectedQuality = 'auto';
          renderQualityMenu();
          setQualityButtonText('Auto');
        } else {
          qualityLevels = [];
          renderQualityMenu();
          setQualityButtonText('Source');
        }
      }

      renderQualityMenu();
      setupVideoSource();

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

      function setPlayButtonState(isPlaying) {
        if (!playIcon || !pauseIcon) return;
        playIcon.style.display = isPlaying ? 'none' : 'block';
        pauseIcon.style.display = isPlaying ? 'block' : 'none';
      }

      function togglePlay() {
        if (v.paused) {
          v.play().then(function() {
            setPlayButtonState(true);
          }).catch(function() {});
        } else {
          v.pause();
          setPlayButtonState(false);
        }
      }

      if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);

      // Full-screen lives in the transport bar like any video player's, but
      // this iframe has its own isolated WebGL/video canvas — putting THIS
      // document into fullscreen forces a canvas resize that can drop the
      // video texture and freeze the sphere on a single frame. So instead,
      // ask the host page to open the dedicated full-viewport overlay, which
      // mounts a fresh player instance at full size instead of resizing this one.
      var fullscreenBtn = document.getElementById('fullscreenBtn');
      if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
          try { window.parent.postMessage({ type: 'vr-fullscreen-request' }, '*'); } catch(e) {}
        });
      }



      var soundBtn = document.getElementById('soundBtn');
      var muteIcon = document.getElementById('muteIcon');
      var soundIcon = document.getElementById('soundIcon');
      var volSlider = document.getElementById('vol-slider');
      var lastVolume = 0.8;

      function updateVolumeUI() {
        var silent = v.muted || v.volume === 0;
        muteIcon.style.display = silent ? 'block' : 'none';
        soundIcon.style.display = silent ? 'none' : 'block';
        soundBtn.title = silent ? 'Unmute' : 'Mute';
        volSlider.value = silent ? '0' : String(v.volume);
      }

      soundBtn.addEventListener('click', function() {
        if (v.muted || v.volume === 0) {
          v.muted = false;
          v.volume = lastVolume;
        } else {
          lastVolume = v.volume;
          v.muted = true;
        }
        updateVolumeUI();
      });

      volSlider.addEventListener('input', function() {
        var val = parseFloat(volSlider.value);
        v.volume = val;
        v.muted = val === 0;
        if (val > 0) lastVolume = val;
        updateVolumeUI();
      });

      if (${autoHideControls}) {
        var controls = document.getElementById('controls');
        var hideTimer;
        controls.classList.add('hidden');
        function showControls() {
          controls.classList.remove('hidden');
          clearTimeout(hideTimer);
          hideTimer = setTimeout(function() { controls.classList.add('hidden'); }, 2000);
          try { window.parent.postMessage({ type: 'vr-activity' }, '*'); } catch(e) {}
        }
        document.addEventListener('click', showControls);
        document.addEventListener('touchstart', showControls);
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
        setPlayButtonState(true);
        bufferingEl.classList.remove('active');
        videoStatusEl.classList.remove('show');
      });
      v.addEventListener('pause', function() {
        setPlayButtonState(false);
      });
      v.addEventListener('waiting', function() {
        bufferingEl.classList.add('active');
        if (hls && selectedQuality === 'auto' && qualityLevels.length) {
          var lowLevel = findBestLevel(360) || qualityLevels.slice().sort(function(a, b) { return a.height - b.height; })[0];
          if (lowLevel) {
            tuneBufferForSelection(360);
            hls.autoLevelCapping = lowLevel.index;
            hls.currentLevel = lowLevel.index;
            hls.loadLevel = lowLevel.index;
            hls.nextLevel = lowLevel.index;
            flushForwardBuffer();
            restartHlsAtCurrentTime();
            applyRenderQuality(lowLevel.height || 360);
          }
        } else if (plainVideoMode) {
          applyRenderQuality(selectedQuality === 'auto' ? 360 : Number(selectedQuality));
        }
      });
      v.addEventListener('playing', function() { bufferingEl.classList.remove('active'); });
      v.addEventListener('loadedmetadata', updateTime);
      v.addEventListener('loadedmetadata', function() {
        if (v.videoHeight) {
          lastKnownHeight = v.videoHeight;
          if (!hls) updateQualityButton();
          else renderQualityMenu();
        }
      });
      v.addEventListener('progress', function() {
        if (v.buffered.length > 0 && v.duration && isFinite(v.duration)) {
          var pct = Math.round((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
          bufBar.style.width = pct + '%';
          bufText.textContent = 'Buffering ' + pct + '%…';
        }
      });

      // Tap-to-play overlay (mobile fallback)
      var tapOverlay = document.createElement('div');
      tapOverlay.style.cssText = 'position:fixed;inset:0;z-index:600;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);cursor:pointer;user-select:none;-webkit-user-select:none;';
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

      // ── WebXR headset entry ─────────────────────────────────────
      // Shows the headset button only when the browser + device actually
      // support an immersive-vr WebXR session (e.g. Quest Browser), and
      // launches a real stereoscopic/head-tracked session via A-Frame.
      var enterVRBtn = document.getElementById('enterVRBtn');
      function showEnterVRButton() {
        if (!enterVRBtn) return;
        enterVRBtn.style.display = 'flex';
        enterVRBtn.style.borderRadius = '14px';
        enterVRBtn.style.gap = '2px';
      }

      if (enterVRBtn) {
        var isLocalTest =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          document.referrer.indexOf('localhost') !== -1 ||
          document.referrer.indexOf('127.0.0.1') !== -1;
        var isQuestBrowser = /Quest|Oculus/i.test(navigator.userAgent);
        if (navigator.xr || isLocalTest || isQuestBrowser) showEnterVRButton();

        if (navigator.xr && navigator.xr.isSessionSupported) {
          navigator.xr.isSessionSupported('immersive-vr').then(function(supported) {
          if (supported) {
            showEnterVRButton();
          } else if (!isLocalTest && !isQuestBrowser) {
            enterVRBtn.style.display = 'none';
          }
          }).catch(function() {
            if (!isLocalTest && !isQuestBrowser) enterVRBtn.style.display = 'none';
          });
        }

        enterVRBtn.addEventListener('click', function() {
          var sceneEl = document.querySelector('a-scene');
          tryPlay();
          applyRenderQuality(selectedQuality === 'auto' ? 720 : Number(selectedQuality));
          if (sceneEl && sceneEl.enterVR) {
            var vrAttempt = sceneEl.enterVR();
            if (vrAttempt && vrAttempt.catch) {
              vrAttempt.catch(function() {
                showUnsupportedPopup(
                  'VR Mode Not Available',
                  'Turn on the WebXR emulator polyfill, reload the page, then try the VR button again.',
                  false
                );
              });
            }
          } else {
            showUnsupportedPopup(
              'VR Mode Not Available',
              'This browser does not expose WebXR for the VR tour. Enable the WebXR emulator polyfill or test in a headset browser.',
              false
            );
          }
        });
      }

      var sceneForVrEvents = document.querySelector('a-scene');
      if (sceneForVrEvents) {
        // Standalone Quest hardware renders the real headset framebuffer at
        // full native per-eye resolution by default — the pixelRatio
        // throttling in applyRenderQuality() above only affects the flat 2D
        // canvas, never the actual XR session. Combined with simultaneous
        // video decode, that's enough GPU load to drop frames, which shows
        // up as the controller/laser visibly lagging behind hand movement.
        // Fixed foveated rendering + a lower XR framebuffer scale is the
        // standard fix — but framebufferScaleFactor only takes effect if
        // it's set *before* the XR session is created, so this needs to run
        // as early as possible, not from inside the enter-vr handler (by
        // then the session's layer already exists at full resolution).
        function primeXrPerformance() {
          try {
            var xrManager = sceneForVrEvents.renderer && sceneForVrEvents.renderer.xr;
            if (!xrManager) return false;
            if (typeof xrManager.setFoveation === 'function') xrManager.setFoveation(0.7);
            if (typeof xrManager.setFramebufferScaleFactor === 'function') xrManager.setFramebufferScaleFactor(0.9);
            return true;
          } catch(e) { return false; }
        }
        if (!primeXrPerformance()) {
          sceneForVrEvents.addEventListener('loaded', primeXrPerformance, { once: true });
        }

        sceneForVrEvents.addEventListener('enter-vr', function() {
          inImmersiveVr = true;
          tryPlay();
          // Keep whatever quality was already playing instead of forcing a
          // drop to 720p / the lowest HLS level on every headset entry —
          // that forced downgrade was the direct cause of "much blurrier in
          // the headset than on desktop" for the same video.
          applyRenderQuality(selectedQuality === 'auto' ? lastKnownHeight : Number(selectedQuality));
          primeXrPerformance(); // harmless no-op if already primed; safety net otherwise
          showVrHud();
        });
        sceneForVrEvents.addEventListener('exit-vr', function() {
          inImmersiveVr = false;
          applyRenderQuality(selectedQuality === 'auto' ? lastKnownHeight : Number(selectedQuality));
          hideVrHud();
        });
      }

      // In-headset controls — normal 2D HTML controls aren't visible inside
      // an actual WebXR session (the headset only sees the WebGL scene), so
      // these are real 3D buttons floating in front of the camera, clickable
      // via gaze (a-cursor, works with no controllers) or Quest controllers
      // (laser-controls, added on the scene above).
      var vrPlayPauseBtn = document.getElementById('vrPlayPauseBtn');
      var vrSkipBackBtn = document.getElementById('vrSkipBackBtn');
      var vrSkipFwdBtn = document.getElementById('vrSkipFwdBtn');
      var vrVolumeDownBtn = document.getElementById('vrVolumeDownBtn');
      var vrMuteBtn = document.getElementById('vrMuteBtn');
      var vrVolumeUpBtn = document.getElementById('vrVolumeUpBtn');
      var vrQualityBtn = document.getElementById('vrQualityBtn');
      var vrQualityMenu = document.getElementById('vrQualityMenu');
      var vrExitBtn = document.getElementById('vrExitBtn');
      var vrHud = document.getElementById('vrHud');
      var vrHudHideTimer = null;

      function hideVrHud() {
        if (vrHudHideTimer) clearTimeout(vrHudHideTimer);
        vrHudHideTimer = null;
        setVrQualityMenuVisible(false);
        if (vrHud) {
          vrHud.setAttribute('visible', false);
          if (vrHud.object3D) vrHud.object3D.visible = false;
        }
      }

      function showVrHud() {
        if (!inImmersiveVr || !vrHud) return;
        vrHud.setAttribute('visible', true);
        if (vrHud.object3D) vrHud.object3D.visible = true;
        if (vrHudHideTimer) clearTimeout(vrHudHideTimer);
        vrHudHideTimer = setTimeout(hideVrHud, 8000);
      }

      // Desktop emulators dispatch pointer/click events rather than Quest's
      // triggerdown event. Keep both paths working so the in-headset HUD can
      // always be revealed during testing and on controller reconnects.
      if (sceneForVrEvents) {
        ['click', 'pointerdown', 'touchstart'].forEach(function(eventName) {
          sceneForVrEvents.addEventListener(eventName, showVrHud);
        });
      }

      function updateVrPlayPauseIcon() {
        if (vrPlayPauseBtn) vrPlayPauseBtn.setAttribute('text', 'value', v.paused ? '\\u25B6' : '\\u23F8');
      }

      function updateVrMuteLabel() {
        if (vrMuteBtn) vrMuteBtn.setAttribute('text', 'value', v.muted || v.volume === 0 ? 'Unmute' : 'Mute');
      }

      function updateVrQualityLabel() {
        if (vrQualityBtn) vrQualityBtn.setAttribute('text', 'value', 'Quality: ' + currentQualityText());
      }

      function setVrQualityMenuVisible(visible) {
        if (!vrQualityMenu) return;
        vrQualityMenu.setAttribute('visible', visible);
        if (vrQualityMenu.object3D) vrQualityMenu.object3D.visible = visible;
      }

      function updateVrQualityOptions() {
        if (!vrQualityMenu) return;
        vrQualityMenu.querySelectorAll('.vr-quality-option').forEach(function(option) {
          var active = option.getAttribute('data-vr-quality') === selectedQuality;
          option.setAttribute('material', 'color', active ? '#2563eb' : '#1f2937');
        });
      }

      function toggleVrQualityMenu() {
        if (!vrQualityMenu) return;
        var isVisible = !!(vrQualityMenu.object3D && vrQualityMenu.object3D.visible);
        setVrQualityMenuVisible(!isVisible);
        updateVrQualityOptions();
        showVrHud();
      }

      function changeVrVolume(amount) {
        var nextVolume = Math.max(0, Math.min(1, v.volume + amount));
        v.volume = nextVolume;
        v.muted = nextVolume === 0;
        if (nextVolume > 0) lastVolume = nextVolume;
        updateVolumeUI();
        updateVrMuteLabel();
      }

      function exitImmersiveVr() {
        var activeScene = document.querySelector('a-scene');
        if (activeScene && activeScene.exitVR) {
          activeScene.exitVR();
          return;
        }
        try {
          var session = activeScene && activeScene.renderer && activeScene.renderer.xr.getSession();
          if (session) session.end();
        } catch(e) {}
      }

      if (vrPlayPauseBtn) {
        vrPlayPauseBtn.addEventListener('click', function() {
          togglePlay();
          updateVrPlayPauseIcon();
        });
      }
      if (vrSkipBackBtn) {
        vrSkipBackBtn.addEventListener('click', function() {
          v.currentTime = Math.max(0, v.currentTime - 10);
        });
      }
      if (vrSkipFwdBtn) {
        vrSkipFwdBtn.addEventListener('click', function() {
          v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
        });
      }
      if (vrVolumeDownBtn) vrVolumeDownBtn.addEventListener('click', function() { changeVrVolume(-0.1); });
      if (vrVolumeUpBtn) vrVolumeUpBtn.addEventListener('click', function() { changeVrVolume(0.1); });
      if (vrMuteBtn) {
        vrMuteBtn.addEventListener('click', function() {
          if (v.muted || v.volume === 0) {
            v.volume = lastVolume || 0.8;
            v.muted = false;
          } else {
            lastVolume = v.volume;
            v.muted = true;
          }
          updateVolumeUI();
          updateVrMuteLabel();
        });
      }
      if (vrQualityBtn) vrQualityBtn.addEventListener('click', toggleVrQualityMenu);
      if (vrQualityMenu) {
        vrQualityMenu.querySelectorAll('.vr-quality-option').forEach(function(option) {
          option.addEventListener('click', function() {
            selectedQuality = option.getAttribute('data-vr-quality') || 'auto';
            applyQualitySelection();
            updateVrQualityLabel();
            updateVrQualityOptions();
            setVrQualityMenuVisible(false);
            showVrHud();
          });
        });
      }
      if (vrExitBtn) vrExitBtn.addEventListener('click', exitImmersiveVr);
      if (vrHud) {
        vrHud.querySelectorAll('.vr-btn').forEach(function(button) {
          button.addEventListener('click', showVrHud);
        });
      }

      // Quest controls: trigger reveals/selects the HUD, the left stick seeks
      // and changes volume, while the right stick turns the 360 view.
      var lastThumbstickAction = 0;
      function bindVrController(controller, hand) {
        if (!controller) return;
        controller.addEventListener('controllerconnected', function() {
          if (controller.object3D) controller.object3D.visible = true;
          showVrHud();
        });
        ['triggerdown', 'gripdown', 'abuttondown', 'xbuttondown'].forEach(function(eventName) {
          controller.addEventListener(eventName, showVrHud);
        });
        controller.addEventListener('xbuttondown', function() {
          togglePlay();
          updateVrPlayPauseIcon();
        });
        controller.addEventListener('bbuttondown', exitImmersiveVr);
        controller.addEventListener('ybuttondown', exitImmersiveVr);
        controller.addEventListener('thumbstickmoved', function(event) {
          showVrHud();
          var now = Date.now();
          if (now - lastThumbstickAction < 350) return;
          var x = Number(event.detail && event.detail.x) || 0;
          var y = Number(event.detail && event.detail.y) || 0;
          if (hand === 'right' && Math.abs(x) > 0.75) {
            var sphere = document.getElementById('videosphere');
            if (sphere && sphere.object3D) sphere.object3D.rotation.y += x > 0 ? -Math.PI / 6 : Math.PI / 6;
          } else if (hand === 'left' && Math.abs(x) > 0.75) {
            v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + (x > 0 ? 10 : -10)));
          } else if (hand === 'left' && Math.abs(y) > 0.75) {
            changeVrVolume(y < 0 ? 0.1 : -0.1);
          } else {
            return;
          }
          lastThumbstickAction = now;
        });
      }
      bindVrController(document.getElementById('leftHandController'), 'left');
      bindVrController(document.getElementById('rightHandController'), 'right');
      v.addEventListener('play', updateVrPlayPauseIcon);
      v.addEventListener('pause', updateVrPlayPauseIcon);
      updateVrPlayPauseIcon();
      updateVrMuteLabel();
      updateVrQualityLabel();
      // ─────────────────────────────────────────────────────────────

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

      // ── Real failure detection ───────────────────────────────────
      // The checks above only confirm WebGL exists — they say nothing
      // about whether THIS video can actually play (unsupported codec,
      // broken/missing file, blocked network request, etc). Without
      // this, a failure just leaves the loading spinner running forever
      // with no feedback. Surface it instead.
      var MEDIA_ERROR_MESSAGES = {
        1: 'Loading was aborted. Please try again.',
        2: 'A network error interrupted the video. Check your connection and try again.',
        3: 'This video could not be decoded — the format may not be supported by your browser.',
        4: 'This video format or source is not supported by your browser.'
      };

      v.addEventListener('error', function() {
        var code = v.error && v.error.code;
        showUnsupportedPopup(
          'VR Tour Unavailable',
          MEDIA_ERROR_MESSAGES[code] || 'This VR tour could not be loaded on your device or browser.'
        );
      });

      // Backup safety net only — real incompatibility is already caught
      // immediately above (WebGL check, HLS-support check, video error
      // event). This just covers a genuinely stuck network (not a
      // compatibility signal), so it's deliberately long — 3 minutes —
      // to avoid misdiagnosing "slow" as "unsupported".
      setTimeout(function() {
        if (unsupportedShown) return;
        if (v.readyState === 0) {
          showUnsupportedPopup(
            'VR Tour Unavailable',
            'This VR tour is taking too long to load. Please check your connection and try again.'
          );
        }
      }, 180000);
      // ─────────────────────────────────────────────────────────────
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
    webxr="optionalFeatures: local-floor, bounded-floor, hand-tracking"
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
      allow="autoplay; fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
      allowFullScreen
      title="360° VR tour"
    />
  );
}
