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
}

export default function VR360Player({ videoUrl, imageUrl, className = "" }: Props) {
  if (!videoUrl && !imageUrl) return null;

  const escapeAttr = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const rendererSettings = [
    "antialias: true",
    "colorManagement: true",
    "physicallyCorrectLights: false",
    "maxCanvasWidth: 4096",
    "maxCanvasHeight: 2048",
    "logarithmicDepthBuffer: false",
    "alpha: false",
    "precision: highp",
    "sortObjects: false",
  ].join("; ");

  const html = videoUrl
    ? `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>VR360</title>
  <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    body { visibility: hidden; }
    body.ready { visibility: visible; }
    a-scene { width: 100%; height: 100%; }
    #controls {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      background: rgba(0,0,0,0.8);
      padding: 12px 16px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 12px;
      backdrop-filter: blur(10px);
    }
    #controls button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }
    #controls button:hover { background: rgba(255,255,255,0.1); }
    #timeline {
      flex: 1;
      min-width: 200px;
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      cursor: pointer;
      position: relative;
    }
    #progress {
      height: 100%;
      background: #3b82f6;
      border-radius: 2px;
      width: 0%;
    }
    #time {
      color: white;
      font-size: 12px;
      font-family: monospace;
      min-width: 80px;
      text-align: center;
    }
  </style>
</head>
<body>
  <a-scene
    embedded
    renderer="${rendererSettings}"
    vr-mode-ui="enabled: true"
    loading-screen="enabled: false"
  >
    <a-assets timeout="60000">
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
      segments-height="64"
      segments-width="64">
    </a-videosphere>
    <a-camera look-controls="pointerLockEnabled: false" wasd-controls="enabled: false"></a-camera>
  </a-scene>
  <div id="controls">
    <button id="playPause" title="Play/Pause">
      <svg id="playIcon" width="20" height="20" viewBox="0 0 24 24" fill="white" style="display:none">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <svg id="pauseIcon" width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
      </svg>
    </button>
    <div id="time">0:00 / 0:00</div>
    <div id="timeline">
      <div id="progress"></div>
    </div>
  </div>
  <script>
    (function(){
      var v = document.getElementById('v360');
      var playPauseBtn = document.getElementById('playPause');
      var playIcon = document.getElementById('playIcon');
      var pauseIcon = document.getElementById('pauseIcon');
      var timeline = document.getElementById('timeline');
      var progress = document.getElementById('progress');
      var timeDisplay = document.getElementById('time');
      
      if (!v) {
        console.error('Video element not found');
        return;
      }
      
      console.log('Video src:', v.src);
      console.log('Video readyState:', v.readyState);
      
      v.addEventListener('error', function(e) {
        console.error('Video error:', e, v.error);
        if (v.error) {
          console.error('Error code:', v.error.code, 'Message:', v.error.message);
        }
      });
      
      v.addEventListener('loadstart', function() {
        console.log('Video loadstart');
      });
      
      v.addEventListener('loadeddata', function() {
        console.log('Video loadeddata, duration:', v.duration);
      });
      
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
          }).catch(function(err) {
            console.error('Play failed:', err);
          });
        } else {
          v.pause();
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }
      }
      
      playPauseBtn.addEventListener('click', togglePlay);
      
      timeline.addEventListener('click', function(e) {
        var rect = timeline.getBoundingClientRect();
        var percent = (e.clientX - rect.left) / rect.width;
        if (v.duration && isFinite(v.duration)) {
          v.currentTime = percent * v.duration;
        }
      });
      
      v.addEventListener('timeupdate', updateTime);
      v.addEventListener('play', function() {
        console.log('Video playing');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      });
      v.addEventListener('pause', function() {
        console.log('Video paused');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      });
      
      function show() { document.body.classList.add('ready'); }
      
      function tryPlay() {
        try { 
          v.muted = true;
          console.log('Attempting to play...');
          var p = v.play(); 
          if (p && p.then) {
            p.then(function() {
              console.log('Playback started successfully');
              show();
            }).catch(function(err){
              console.error('Autoplay failed:', err);
              show();
            });
          } else {
            show();
          }
        } catch(e) { 
          console.error('Play error:', e);
          show();
        }
      }
      
      // Force video texture to update every frame on the 360 sphere
      var scene = document.querySelector('a-scene');
      if (scene) {
        scene.addEventListener('loaded', function() {
          console.log('A-Frame scene loaded');
          
          var videosphereEl = document.getElementById('videosphere');
          if (videosphereEl && videosphereEl.object3D) {
            var mesh = videosphereEl.getObject3D('mesh');
            if (mesh && mesh.material) {
              console.log('Videosphere material found, setting up texture update');
              var mat = mesh.material;
              
              // Replace with a proper Three.js VideoTexture that auto-updates
              try {
                var THREE = AFRAME.THREE;
                var vt = new THREE.VideoTexture(v);
                vt.minFilter = THREE.LinearFilter;
                vt.magFilter = THREE.LinearFilter;
                // Set on both properties for ShaderMaterial (uniforms) and standard material (.map)
                if (mat.uniforms && mat.uniforms.map) {
                  mat.uniforms.map.value = vt;
                }
                mat.map = vt;
                mat.needsUpdate = true;
                console.log('VideoTexture assigned successfully');
              } catch(e) {
                console.warn('Could not create VideoTexture, using fallback:', e);
              }
              
              // RAF loop to force texture re-upload every frame
              function updateVideoTexture() {
                var tex = mat.map;
                if (!tex && mat.uniforms && mat.uniforms.map) {
                  tex = mat.uniforms.map.value;
                }
                if (tex && !v.paused && !v.ended) {
                  tex.needsUpdate = true;
                }
                requestAnimationFrame(updateVideoTexture);
              }
              updateVideoTexture();
            } else {
              console.warn('Could not find videosphere mesh or material');
            }
          }
        });
      }
      
      if (v.readyState >= 2) { 
        tryPlay(); 
      } else { 
        v.addEventListener('canplay', tryPlay, { once: true }); 
      }
      
      v.addEventListener('loadedmetadata', function() {
        console.log('Metadata loaded, duration:', v.duration);
        updateTime();
      });
      
      setTimeout(show, 8000);
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
    vr-mode-ui="enabled: true"
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
      allow="autoplay; xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
      allowFullScreen
      title="360° VR tour"
    />
  );
}
