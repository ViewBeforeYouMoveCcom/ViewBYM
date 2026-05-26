export async function videoFrameToJpeg(file: File): Promise<File> {
  const videoUrl = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "auto";
    video.playsInline = true;
    video.src = videoUrl;
    video.load();

    await waitForVideoMetadata(video);

    const canvas = document.createElement("canvas");
    const size = getContainedSize(video.videoWidth, video.videoHeight);
    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext("2d");
    if (!ctx || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Could not prepare the selected video frame.");
    }

    const candidateTimes = getCandidateTimes(video.duration);
    let captured = false;

    for (const time of candidateTimes) {
      await seekToFrame(video, time);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (!isMostlyBlankFrame(ctx, canvas.width, canvas.height)) {
        captured = true;
        break;
      }
    }

    if (!captured) {
      await seekToFrame(video, candidateTimes[0] ?? 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    const blob = await canvasToJpegBlob(canvas, "Could not convert the selected video to JPEG.");

    const baseName = file.name.replace(/\.[^.]+$/, "") || "video-frame";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(videoUrl);
  }
}

export function isVideoFile(file: File) {
  return file.type.startsWith("video/") || /\.(mp4|mov|m4v|webm)$/i.test(file.name);
}

export async function preparePhotoFile(file: File): Promise<File> {
  if (isVideoFile(file)) return videoFrameToJpeg(file);
  if (!isImageFile(file)) return file;

  return imageToJpeg(file);
}

function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name);
}

function getCandidateTimes(duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return [0];

  const lastSafeFrame = Math.max(duration - 0.1, 0);
  return [0.5, 1, 2, duration * 0.1, duration * 0.25, 0]
    .map((time) => Math.min(Math.max(time, 0), lastSafeFrame))
    .filter((time, index, times) => times.findIndex((candidate) => Math.abs(candidate - time) < 0.05) === index);
}

async function imageToJpeg(file: File): Promise<File> {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not read the selected image."));
    });

    const size = getContainedSize(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext("2d");
    if (!ctx || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Could not prepare the selected image.");
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToJpegBlob(canvas, "Could not prepare the selected image for upload.");
    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";

    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function getContainedSize(width: number, height: number) {
  const maxDimension = 2000;
  const scale = Math.min(1, maxDimension / Math.max(width, height));

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function canvasToJpegBlob(canvas: HTMLCanvasElement, errorMessage: string) {
  const qualities = [0.82, 0.72, 0.62];
  const maxBytes = 9 * 1024 * 1024;

  for (const quality of qualities) {
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error(errorMessage));
        },
        "image/jpeg",
        quality
      );
    });

    if (blob.size <= maxBytes || quality === qualities[qualities.length - 1]) return blob;
  }

  throw new Error(errorMessage);
}

async function seekToFrame(video: HTMLVideoElement, time: number) {
  if (Math.abs(video.currentTime - time) < 0.001 && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    await waitForPresentedFrame(video);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    let timeout = 0;
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Could not capture a frame from the selected video."));
    };

    video.addEventListener("seeked", onSeeked, { once: true });
    video.addEventListener("error", onError, { once: true });
    timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Could not capture a frame from the selected video."));
    }, 6000);
    video.currentTime = time;
  });

  await waitForPresentedFrame(video);
}

async function waitForPresentedFrame(video: HTMLVideoElement) {
  type VideoWithFrameCallback = HTMLVideoElement & {
    requestVideoFrameCallback?: (callback: () => void) => number;
  };

  const videoWithFrameCallback = video as VideoWithFrameCallback;
  if (videoWithFrameCallback.requestVideoFrameCallback) {
    await Promise.race([
      new Promise<void>((resolve) => videoWithFrameCallback.requestVideoFrameCallback?.(() => resolve())),
      delay(1200),
    ]);
    return;
  }

  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

async function waitForVideoMetadata(video: HTMLVideoElement) {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA && video.videoWidth > 0 && video.videoHeight > 0) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    let timeout = 0;
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("canplay", onLoaded);
      video.removeEventListener("error", onError);
    };
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Could not read the selected video."));
    };

    video.addEventListener("loadedmetadata", onLoaded, { once: true });
    video.addEventListener("loadeddata", onLoaded, { once: true });
    video.addEventListener("canplay", onLoaded, { once: true });
    video.addEventListener("error", onError, { once: true });
    timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Could not read the selected video. Try a different MP4 export."));
    }, 12000);
  });
}

function delay(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function isMostlyBlankFrame(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const sampleWidth = Math.min(80, width);
  const sampleHeight = Math.min(80, height);
  const sample = ctx.getImageData(
    Math.floor((width - sampleWidth) / 2),
    Math.floor((height - sampleHeight) / 2),
    sampleWidth,
    sampleHeight
  ).data;

  let darkPixels = 0;
  let lightPixels = 0;
  let brightnessTotal = 0;
  let brightnessSquaredTotal = 0;

  for (let i = 0; i < sample.length; i += 4) {
    const brightness = (sample[i] + sample[i + 1] + sample[i + 2]) / 3;
    if (brightness < 12) darkPixels++;
    if (brightness > 245) lightPixels++;
    brightnessTotal += brightness;
    brightnessSquaredTotal += brightness * brightness;
  }

  const pixels = sample.length / 4;
  const averageBrightness = brightnessTotal / pixels;
  const variance = brightnessSquaredTotal / pixels - averageBrightness * averageBrightness;
  const nearlyUniform = variance < 18;

  return darkPixels / pixels > 0.98 || (lightPixels / pixels > 0.98 && nearlyUniform);
}
