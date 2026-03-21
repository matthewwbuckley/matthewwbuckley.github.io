// Perlin noise - color based on noise value (gradient)
const c = document.getElementById('pixel-canvas');
const scale = 4;

function setCanvasSize() {
  const rect = c.getBoundingClientRect();
  c.width = Math.ceil(rect.width / scale);
  c.height = Math.ceil(rect.height / scale);
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

const ctx = c.getContext('2d');

const p = window.paletteConfig || { bg: '#0a0a0a', fg: '#f5f5f5', accent: '#6b6b6b', accent2: '#a8a8a8' };

function noise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x, y, s) {
  const X = Math.floor(x / s), Y = Math.floor(y / s);
  const fracX = (x / s) - X, fracY = (y / s) - Y;
  const v1 = noise(X, Y), v2 = noise(X + 1, Y), v3 = noise(X, Y + 1), v4 = noise(X + 1, Y + 1);
  const i1 = v1 * (1 - fracX) + v2 * fracX;
  const i2 = v3 * (1 - fracX) + v4 * fracX;
  return i1 * (1 - fracY) + i2 * fracY;
}

let offset = 0;

function draw() {
  offset += 0.001;

  for (let i = 0; i < 1000; i++) {
    const x = ~~(Math.random() * c.width);
    const y = ~~(Math.random() * c.height);

    const n = smoothNoise(x + offset * 50, y, 50) * 0.6 +
              smoothNoise(x + offset * 50, y, 25) * 0.4;

    if (n < 0.2) {
      ctx.fillStyle = p.bg; ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.35) {
      ctx.fillStyle = p.accent; ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.5) {
      ctx.fillStyle = p.accent2; ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.6) {
      ctx.fillStyle = p.fg; ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.7) {
      ctx.fillStyle = p.accent; ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.8) {
      ctx.fillStyle = p.accent2; ctx.fillRect(x, y, 1, 1);
    } else {
      ctx.fillStyle = p.fg; ctx.fillRect(x, y, 1, 1);
    }
  }
}

setInterval(draw, 30);
