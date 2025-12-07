// Conway's Game of Life - color based on cell age
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
const w = c.width;
const h = c.height;

// Colors for different ages (young to old)
const colors = ['#f4d35e', '#e94560', '#e9c46a', '#2a9d8f', '#415a77', '#264653', '#0d1b2a'];

let grid = Array(w).fill().map(() => Array(h).fill(0));
let age = Array(w).fill().map(() => Array(h).fill(0));
let next = Array(w).fill().map(() => Array(h).fill(0));
let nextAge = Array(w).fill().map(() => Array(h).fill(0));

// Random seed - higher density
for (let i = 0; i < w * h * 0.8; i++) {
  grid[~~(Math.random() * w)][~~(Math.random() * h)] = 1;
}

function step() {
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let neighbors = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + w) % w;
          const ny = (y + dy + h) % h;
          neighbors += grid[nx][ny];
        }
      }

      if (grid[x][y] === 1 && (neighbors === 2 || neighbors === 3)) {
        next[x][y] = 1;
        nextAge[x][y] = Math.min(age[x][y] + 1, colors.length - 1);
      } else if (grid[x][y] === 0 && neighbors === 3) {
        next[x][y] = 1;
        nextAge[x][y] = 0;
      } else {
        next[x][y] = 0;
        nextAge[x][y] = 0;
      }
    }
  }

  // Render changes
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (next[x][y] === 1 && (grid[x][y] === 0 || age[x][y] !== nextAge[x][y])) {
        // Cell alive - paint with age-based color
        ctx.fillStyle = colors[nextAge[x][y]];
        ctx.fillRect(x, y, 1, 1);
      } else if (next[x][y] === 0 && grid[x][y] === 1) {
        // Cell just died - erase it
        ctx.clearRect(x, y, 1, 1);
      }
    }
  }

  [grid, next] = [next, grid];
  [age, nextAge] = [nextAge, age];
}

setInterval(step, 100);
