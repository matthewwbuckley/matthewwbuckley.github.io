// Perlin noise - color based on noise value (gradient)
const c = document.getElementById('pixel-canvas');
const scale = 4;

// Set canvas resolution based on its display size
function setCanvasSize() {
  const rect = c.getBoundingClientRect();
  c.width = Math.ceil(rect.width / scale);
  c.height = Math.ceil(rect.height / scale);
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

const ctx = c.getContext('2d');

// Pick 6 colors for different noise levels
const colors = ['#264653', '#e9c46a', '#2a9d8f', '#f4a261', '#0d1b2a', '#e0e1dd', '#415a77', '#1a1a2e', '#f4d35e', '#e94560'];
const color1 = colors[~~(Math.random() * colors.length)];
const color2 = colors[~~(Math.random() * colors.length)];
const color3 = colors[~~(Math.random() * colors.length)];
const color4 = colors[~~(Math.random() * colors.length)];
const color5 = colors[~~(Math.random() * colors.length)];
const color6 = colors[~~(Math.random() * colors.length)];

function noise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x, y, scale) {
  const X = Math.floor(x / scale);
  const Y = Math.floor(y / scale);
  const fracX = (x / scale) - X;
  const fracY = (y / scale) - Y;

  const v1 = noise(X, Y);
  const v2 = noise(X + 1, Y);
  const v3 = noise(X, Y + 1);
  const v4 = noise(X + 1, Y + 1);

  const i1 = v1 * (1 - fracX) + v2 * fracX;
  const i2 = v3 * (1 - fracX) + v4 * fracX;

  return i1 * (1 - fracY) + i2 * fracY;
}

let offset = 0;

function draw() {
  offset += 0.001;

  for (let i = 0; i < 1000; i++) { // 10x fewer pixels
    const x = ~~(Math.random() * c.width);
    const y = ~~(Math.random() * c.height);

    const n = smoothNoise(x + offset * 50, y, 50) * 0.6 +    // 2 octaves instead of 3
              smoothNoise(x + offset * 50, y, 25) * 0.4;

    // Color based on noise value - more bands
    if (n < 0.2) {
      ctx.clearRect(x, y, 1, 1);
    } else if (n < 0.35) {
      ctx.fillStyle = color1;
      ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.5) {
      ctx.fillStyle = color2;
      ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.6) {
      ctx.fillStyle = color3;
      ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.7) {
      ctx.fillStyle = color4;
      ctx.fillRect(x, y, 1, 1);
    } else if (n < 0.8) {
      ctx.fillStyle = color5;
      ctx.fillRect(x, y, 1, 1);
    } else {
      ctx.fillStyle = color6;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

setInterval(draw, 30); // Slower update rate
