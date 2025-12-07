// Conway's Game of Life - color based on neighbor count
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

// Colors for different neighbor counts (0-8 neighbors, but alive cells only have 2-3)
const colors = {
  0: '#0d1b2a',
  1: '#1a1a2e',
  2: '#264653',  // Survival color
  3: '#2a9d8f',  // Birth/survival color
  4: '#415a77',
  5: '#e9c46a',
  6: '#f4a261',
  7: '#e94560',
  8: '#f4d35e'
};

let grid = Array(w).fill().map(() => Array(h).fill(0));
let next = Array(w).fill().map(() => Array(h).fill(0));
let neighborCount = Array(w).fill().map(() => Array(h).fill(0));

// Random seed
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
          const nx = (x + dx + w) % w;
          const ny = (y + dy + h) % h;
          neighbors += grid[nx][ny];
        }
      }

      neighborCount[x][y] = neighbors;

      if (grid[x][y] === 1 && (neighbors === 2 || neighbors === 3)) {
        next[x][y] = 1;
      } else if (grid[x][y] === 0 && neighbors === 3) {
        next[x][y] = 1;
      } else {
        next[x][y] = 0;
      }
    }
  }

  // Render based on neighbor count
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (next[x][y] === 1) {
        // Cell alive - paint with neighbor-based color
        ctx.fillStyle = colors[neighborCount[x][y]];
        ctx.fillRect(x, y, 1, 1);
      } else if (grid[x][y] === 1) {
        // Cell just died - erase it
        ctx.clearRect(x, y, 1, 1);
      }
    }
  }

  [grid, next] = [next, grid];
}

setInterval(step, 100);
