// Langton's Ant
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

const colors = ['#264653', '#e9c46a', '#2a9d8f', '#f4a261', '#0d1b2a', '#e0e1dd', '#415a77', '#1a1a2e', '#f4d35e', '#e94560'];
let currentColor = colors[~~(Math.random() * colors.length)];

// Switch color every 10 seconds
setInterval(() => {
  currentColor = colors[~~(Math.random() * colors.length)];
}, 10000);

const grid = Array(w).fill().map(() => Array(h).fill(0));

// Multiple ants
const ants = [];
for (let i = 0; i < 400; i++) {
  ants.push({
    x: ~~(Math.random() * w),
    y: ~~(Math.random() * h),
    dir: ~~(Math.random() * 4) // 0=up, 1=right, 2=down, 3=left
  });
}

function step() {
  for (let ant of ants) {
    // Get current cell state
    const state = grid[ant.x][ant.y];

    // Turn: right on white (0), left on black (1)
    if (state === 0) {
      ant.dir = (ant.dir + 1) % 4;
    } else {
      ant.dir = (ant.dir + 3) % 4;
    }

    // Flip cell color
    grid[ant.x][ant.y] = 1 - state;

    // Draw
    if (grid[ant.x][ant.y] === 1) {
      ctx.fillStyle = currentColor;
      ctx.fillRect(ant.x, ant.y, 1, 1);
    } else {
      ctx.clearRect(ant.x, ant.y, 1, 1);
    }

    // Move forward
    if (ant.dir === 0) ant.y = (ant.y - 1 + h) % h;
    else if (ant.dir === 1) ant.x = (ant.x + 1) % w;
    else if (ant.dir === 2) ant.y = (ant.y + 1) % h;
    else ant.x = (ant.x - 1 + w) % w;
  }
}

setInterval(step, 10);
