"use client";

const MAX_DIMENSION = 1600;
const MAX_SIZE_BYTES = 300 * 1024;

export interface ImageConversionResult {
  file: File;
  previewUrl: string;
}

export async function convertImageToWebP(file: File): Promise<ImageConversionResult> {
  if (typeof window === "undefined") {
    throw new Error("Image conversion is only available in the browser.");
  }

  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to acquire 2D context for image conversion.");
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.9;
  let blob = await toWebPBlob(canvas, quality);

  while (blob && blob.size > MAX_SIZE_BYTES && quality > 0.4) {
    quality -= 0.1;
    blob = await toWebPBlob(canvas, quality);
  }

  if (blob && blob.size > MAX_SIZE_BYTES) {
    blob = await toWebPBlob(canvas, 0.3);
  }

  if (!blob) {
    throw new Error("Failed to generate image blob.");
  }

  const optimizedFile = new File([blob], replaceExtension(file.name, "webp"), {
    type: "image/webp",
  });

  return {
    file: optimizedFile,
    previewUrl: canvas.toDataURL("image/webp", 0.8),
  };
}

export function getImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image preview"));
    reader.readAsDataURL(file);
  });
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const src = await getImagePreview(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function replaceExtension(name: string, ext: string) {
  const base = name.includes(".") ? name.substring(0, name.lastIndexOf(".")) : name;
  return `${base}.${ext}`;
}

function toWebPBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/webp",
      Math.max(0.2, Math.min(1, quality))
    );
  });
}
