// Diffusion-Limited Aggregation
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

const colors = ['#264653', '#e9c46a', '#2a9d8f', '#f4a261', '#0d1b2a', '#e0e1dd', '#415a77', '#1a1a2e', '#f4d35e', '#e94560'];
let currentColor = colors[~~(Math.random() * colors.length)];

// Switch color every 5 seconds
setInterval(() => {
  currentColor = colors[~~(Math.random() * colors.length)];
}, 5000);

const grid = Array(c.width).fill().map(() => Array(c.height).fill(0));

// Multiple seeds scattered around
ctx.fillStyle = currentColor;
for (let i = 0; i < 100; i++) {
  const sx = ~~(Math.random() * c.width);
  const sy = ~~(Math.random() * c.height);
  grid[sx][sy] = 1;
  ctx.fillRect(sx, sy, 1, 1);
}

function addParticle() {
  let x = ~~(Math.random() * c.width);
  let y = ~~(Math.random() * c.height);

  for (let step = 0; step < 10000; step++) {
    const dir = ~~(Math.random() * 4);
    if (dir === 0) x = (x + 1) % c.width;
    else if (dir === 1) x = (x - 1 + c.width) % c.width;
    else if (dir === 2) y = (y + 1) % c.height;
    else y = (y - 1 + c.height) % c.height;

    // Check if adjacent to stuck particle
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = (x + dx + c.width) % c.width;
        const ny = (y + dy + c.height) % c.height;
        if (grid[nx][ny] === 1) {
          grid[x][y] = 1;
          ctx.fillStyle = currentColor;
          ctx.fillRect(x, y, 1, 1);
          return;
        }
      }
    }
  }
}

// Add multiple particles per frame for more activity
setInterval(() => {
  for (let i = 0; i < 10; i++) {
    addParticle();
  }
}, 50);
