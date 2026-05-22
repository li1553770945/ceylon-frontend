import * as THREE from "three";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function configureTexture(texture: THREE.CanvasTexture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

export function createTextTexture(
  text: string,
  options: {
    bgColor?: string;
    textColor?: string;
    fontSize?: number;
    padding?: number;
    borderRadius?: number;
    width?: number;
    height?: number;
    bold?: boolean;
  } = {}
) {
  const {
    bgColor = "#c85c1b",
    textColor = "#ffffff",
    fontSize = 24,
    padding = 12,
    borderRadius = 6,
    width: fixedWidth,
    height: fixedHeight,
    bold = true,
  } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${bold ? "bold " : ""}${fontSize}px sans-serif`;
  const metrics = ctx.measureText(text);
  const w = fixedWidth || Math.ceil(metrics.width + padding * 2);
  const h = fixedHeight || Math.ceil(fontSize + padding * 2);

  // High DPI scaling for sharper text
  const scale = 4;
  canvas.width = w * scale;
  canvas.height = h * scale;
  ctx.scale(scale, scale);
  ctx.font = `${bold ? "bold " : ""}${fontSize}px sans-serif`;

  if (bgColor) {
    ctx.fillStyle = bgColor;
    roundRect(ctx, 0, 0, w, h, borderRadius);
    ctx.fill();
  }

  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);

  const texture = new THREE.CanvasTexture(canvas);
  return configureTexture(texture);
}

export function createPatternTexture(
  options: {
    size?: number;
    color?: string;
    bgColor?: string;
    rings?: number;
  } = {}
) {
  const {
    size = 256,
    color = "#d8d8e0",
    bgColor = "transparent",
    rings = 4,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  if (bgColor !== "transparent") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
  }

  const center = size / 2;
  for (let i = rings; i > 0; i--) {
    ctx.beginPath();
    ctx.arc(center, center, (center * i) / rings, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.15 + (rings - i) * 0.08;
    ctx.stroke();
  }

  // Center dot
  ctx.beginPath();
  ctx.arc(center, center, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.3;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createSymbolTexture(
  symbol: string,
  options: {
    size?: number;
    bgColor?: string;
    symbolColor?: string;
    borderRadius?: number;
  } = {}
) {
  const {
    size = 128,
    bgColor = "#ffffff",
    symbolColor = "#c85c1b",
    borderRadius = 16,
  } = options;

  const canvas = document.createElement("canvas");
  const scale = 4;
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = bgColor;
  roundRect(ctx, 0, 0, size, size, borderRadius);
  ctx.fill();

  ctx.fillStyle = symbolColor;
  ctx.font = `bold ${Math.floor(size * 0.45)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(symbol, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  return configureTexture(texture);
}
