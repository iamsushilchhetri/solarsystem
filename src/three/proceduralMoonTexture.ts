import * as THREE from 'three';

/** Small deterministic PRNG so each body's generated surface is stable across renders/reloads. */
function mulberry32(seed: number) {
  let a = seed | 0;
  return function random() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return h;
}

type SurfaceStyle = 'cratered' | 'icy' | 'volcanic' | 'hazy';

/** A handful of real moons get a surface style that matches their actual appearance;
 * everything else (dwarf planets, generic moons) falls back to a plain cratered look. */
const STYLE_BY_ID: Record<string, SurfaceStyle> = {
  io: 'volcanic',
  europa: 'icy',
  enceladus: 'icy',
  triton: 'icy',
  titan: 'hazy',
};

const SIZE = 256;

function craterField(ctx: CanvasRenderingContext2D, base: THREE.Color, baseHex: string, rand: () => number) {
  for (let i = 0; i < 10; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 20 + rand() * 50;
    const shade = base.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.12);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `#${shade.getHexString()}`);
    grad.addColorStop(1, `${baseHex}00`);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawCratered(ctx: CanvasRenderingContext2D, bctx: CanvasRenderingContext2D, base: THREE.Color, baseHex: string, rand: () => number) {
  craterField(ctx, base, baseHex, rand);
  for (let i = 0; i < 70; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 2 + rand() * rand() * 18;
    const dark = base.clone().offsetHSL(0, 0, -0.18 - rand() * 0.15);
    const rim = base.clone().offsetHSL(0, 0, 0.12 + rand() * 0.1);

    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `#${dark.getHexString()}`);
    grad.addColorStop(0.7, `#${dark.getHexString()}`);
    grad.addColorStop(0.85, `#${rim.getHexString()}`);
    grad.addColorStop(1, `${baseHex}00`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    const bgrad = bctx.createRadialGradient(x, y, 0, x, y, r);
    bgrad.addColorStop(0, '#303030');
    bgrad.addColorStop(0.75, '#606060');
    bgrad.addColorStop(0.9, '#c0c0c0');
    bgrad.addColorStop(1, '#80808000');
    bctx.fillStyle = bgrad;
    bctx.beginPath();
    bctx.arc(x, y, r, 0, Math.PI * 2);
    bctx.fill();
  }
}

function drawIcy(ctx: CanvasRenderingContext2D, bctx: CanvasRenderingContext2D, base: THREE.Color, baseHex: string, rand: () => number) {
  for (let i = 0; i < 14; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 15 + rand() * 40;
    const shade = base.clone().offsetHSL(0, -0.05, (rand() - 0.3) * 0.15);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `#${shade.getHexString()}`);
    grad.addColorStop(1, `${baseHex}00`);
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const crack = base.clone().offsetHSL(0, 0, -0.25);
  ctx.strokeStyle = `#${crack.getHexString()}`;
  for (let i = 0; i < 18; i++) {
    ctx.lineWidth = 0.6 + rand() * 1.4;
    ctx.globalAlpha = 0.35 + rand() * 0.3;
    let x = rand() * SIZE;
    let y = rand() * SIZE;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const segs = 4 + Math.floor(rand() * 5);
    for (let s = 0; s < segs; s++) {
      x += (rand() - 0.5) * 60;
      y += (rand() - 0.5) * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  bctx.fillStyle = '#909090';
  bctx.fillRect(0, 0, SIZE, SIZE);
}

function drawVolcanic(ctx: CanvasRenderingContext2D, bctx: CanvasRenderingContext2D, base: THREE.Color, baseHex: string, rand: () => number) {
  for (let i = 0; i < 24; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 8 + rand() * 30;
    const shade = base.clone().offsetHSL((rand() - 0.5) * 0.08, (rand() - 0.5) * 0.2, (rand() - 0.5) * 0.25);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `#${shade.getHexString()}`);
    grad.addColorStop(1, `${baseHex}00`);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#2a1a10';
  for (let i = 0; i < 10; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 3 + rand() * 8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  bctx.fillStyle = '#707070';
  bctx.fillRect(0, 0, SIZE, SIZE);
}

function drawHazy(ctx: CanvasRenderingContext2D, bctx: CanvasRenderingContext2D, base: THREE.Color, rand: () => number) {
  for (let i = 0; i < 6; i++) {
    const y = rand() * SIZE;
    const h = 20 + rand() * 40;
    const shade = base.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.1);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = `#${shade.getHexString()}`;
    ctx.fillRect(0, y, SIZE, h);
  }
  ctx.globalAlpha = 1;
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, SIZE, SIZE);
}

const cache = new Map<string, { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture }>();

/** Generates (and caches) a stable, code-only surface texture + bump map for moons and dwarf
 * planets that have no real photographic texture, so they read as detailed 3D worlds up close
 * instead of flat single-color balls. */
export function getProceduralMoonTextures(id: string, baseColorHex: string) {
  const cached = cache.get(id);
  if (cached) return cached;

  const rand = mulberry32(hashId(id));
  const base = new THREE.Color(baseColorHex);
  const style = STYLE_BY_ID[id] ?? 'cratered';

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = SIZE;
  colorCanvas.height = SIZE;
  const ctx = colorCanvas.getContext('2d')!;
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = SIZE;
  bumpCanvas.height = SIZE;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, SIZE, SIZE);

  if (style === 'icy') drawIcy(ctx, bctx, base, baseColorHex, rand);
  else if (style === 'volcanic') drawVolcanic(ctx, bctx, base, baseColorHex, rand);
  else if (style === 'hazy') drawHazy(ctx, bctx, base, rand);
  else drawCratered(ctx, bctx, base, baseColorHex, rand);

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);

  const result = { map, bumpMap };
  cache.set(id, result);
  return result;
}
