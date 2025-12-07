// Conway's Game of Life - dead cells colored by time of death
const c = document.getElementById('pixel-canvas');
const scale = 4;
const canvasWidth = Math.ceil(window.innerWidth / 2);
c.width = Math.ceil(canvasWidth / scale);
c.height = Math.ceil(window.innerHeight / scale);
c.style.width = canvasWidth + 'px';
c.style.height = window.innerHeight + 'px';
c.style.position = 'fixed';
c.style.top = '0';
c.style.right = '0';
c.style.zIndex = '-1';
c.style.imageRendering = 'pixelated';

const ctx = c.getContext('2d');
const w = c.width;
const h = c.height;

const colors = ['#264653', '#e9c46a', '#2a9d8f', '#f4a261', '#0d1b2a', '#e0e1dd', '#415a77', '#1a1a2e', '#f4d35e', '#e94560'];
let currentColor = colors[~~(Math.random() * colors.length)];

// Switch color every 5 seconds
setInterval(() => {
  currentColor = colors[~~(Math.random() * colors.length)];
}, 5000);

let grid = Array(w).fill().map(() => Array(h).fill(0));
let next = Array(w).fill().map(() => Array(h).fill(0));

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

      if (grid[x][y] === 1 && (neighbors === 2 || neighbors === 3)) {
        next[x][y] = 1;
      } else if (grid[x][y] === 0 && neighbors === 3) {
        next[x][y] = 1;
      } else {
        next[x][y] = 0;
      }
    }
  }

  // Render changes
  ctx.fillStyle = currentColor;
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (next[x][y] === 0 && grid[x][y] === 1) {
        // Cell just died - paint it with current color
        ctx.fillRect(x, y, 1, 1);
      } else if (next[x][y] === 1 && grid[x][y] === 0) {
        // Cell just became alive - erase it (show dead cells, hide alive ones)
        ctx.clearRect(x, y, 1, 1);
      }
    }
  }

  [grid, next] = [next, grid];
}

setInterval(step, 100);
