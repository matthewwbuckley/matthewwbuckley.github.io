// Conway's Game of Life - dead cells colored by time of death
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
const w = c.width;
const h = c.height;

const p = window.paletteConfig || { bg: '#0a0a0a', fg: '#f5f5f5', accent: '#6b6b6b', accent2: '#a8a8a8' };
const paletteColors = [p.fg, p.accent, p.accent2];
let colorIndex = 0;
let currentColor = paletteColors[0];

setInterval(() => {
  colorIndex = (colorIndex + 1) % paletteColors.length;
  currentColor = paletteColors[colorIndex];
}, 5000);

let grid = Array(w).fill().map(() => Array(h).fill(0));
let next = Array(w).fill().map(() => Array(h).fill(0));

for (let i = 0; i < w * h * 0.3; i++) {
  grid[~~(Math.random() * w)][~~(Math.random() * h)] = 1;
}

function step() {
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let neighbors = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          neighbors += grid[(x + dx + w) % w][(y + dy + h) % h];
        }
      }

      if (grid[x][y] === 1 && (neighbors === 2 || neighbors === 3)) {
        next[x][y] = 1;
      } else if (grid[x][y] === 0 && neighbors === 3) {
        next[x][y] = 1;
      } else {
        next[x][y] = 0;
      }
    }
  }

  ctx.fillStyle = currentColor;
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (next[x][y] === 0 && grid[x][y] === 1) {
        ctx.fillRect(x, y, 1, 1);
      } else if (next[x][y] === 1 && grid[x][y] === 0) {
        ctx.fillStyle = p.bg;
        ctx.fillRect(x, y, 1, 1);
        ctx.fillStyle = currentColor;
      }
    }
  }

  [grid, next] = [next, grid];
}

setInterval(step, 100);
