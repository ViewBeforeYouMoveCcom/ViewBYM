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

  const html = videoUrl
    ? /* 360° video */ `<!DOCTYPE html>
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
  <a-scene embedded renderer="antialias: true; colorManagement: true" vr-mode-ui="enabled: true" loading-screen="enabled: false">
    <a-assets>
      <video id="v360"
        src="${escapeAttr(videoUrl)}"
        autoplay loop muted playsinline preload="auto"
        crossorigin="anonymous"
        webkit-playsinline>
      </video>
    </a-assets>
    <a-videosphere src="#v360" rotation="0 -90 0"></a-videosphere>
    <a-camera look-controls="pointerLockEnabled: false" wasd-controls="enabled: false"></a-camera>
  </a-scene>
</body>
</html>`
    : /* 360° photo */ `<!DOCTYPE html>
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
  <a-scene embedded renderer="antialias: true; colorManagement: true" vr-mode-ui="enabled: true" loading-screen="enabled: false">
    <a-sky src="${escapeAttr(imageUrl ?? "")}" rotation="0 -90 0"></a-sky>
    <a-camera look-controls="pointerLockEnabled: false" wasd-controls="enabled: false"></a-camera>
  </a-scene>
</body>
</html>`;

  return (
    <iframe
      srcDoc={html}
      className={className}
      style={{ border: 0, display: "block" }}
      allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
      allowFullScreen
      title="360° VR tour"
    />
  );
}
