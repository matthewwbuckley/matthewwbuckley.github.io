// Recursive backtracker maze generation
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

const cellSize = 2;
const cols = ~~(c.width / cellSize);
const rows = ~~(c.height / cellSize);

const colors = ['#264653', '#e9c46a', '#2a9d8f', '#f4a261', '#0d1b2a', '#e0e1dd', '#415a77', '#1a1a2e', '#f4d35e', '#e94560'];
let currentColor = colors[~~(Math.random() * colors.length)];

// Change color every 5 seconds
setInterval(() => {
  currentColor = colors[~~(Math.random() * colors.length)];
}, 5000);

const grid = Array(cols).fill().map(() => Array(rows).fill(1)); // 1 = wall
const stack = [];
let current = { x: ~~(Math.random() * cols), y: ~~(Math.random() * rows) };
grid[current.x][current.y] = 0; // Mark as visited

function getUnvisitedNeighbors(x, y) {
  const neighbors = [];
  if (x > 1 && grid[x - 2][y] === 1) neighbors.push({ x: x - 2, y, dir: 'w' });
  if (x < cols - 2 && grid[x + 2][y] === 1) neighbors.push({ x: x + 2, y, dir: 'e' });
  if (y > 1 && grid[x][y - 2] === 1) neighbors.push({ x, y: y - 2, dir: 'n' });
  if (y < rows - 2 && grid[x][y + 2] === 1) neighbors.push({ x, y: y + 2, dir: 's' });
  return neighbors;
}

// Helper to mix two colors (hex format)
function mixColors(color1, color2, ratio) {
  // ratio = 0 means all color2, ratio = 1 means all color1
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 * ratio + r2 * (1 - ratio));
  const g = Math.round(g1 * ratio + g2 * (1 - ratio));
  const b = Math.round(b1 * ratio + b2 * (1 - ratio));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function drawPathWithGlow(x, y) {
  // First draw glow on surrounding empty (black) cells
  // Mix 20% maze color with 80% background (black)
  const glowColor = mixColors(currentColor, '#000000', 0.2);
  ctx.fillStyle = glowColor;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip the center cell
      const nx = x + dx;
      const ny = y + dy;
      // Only draw glow on wall cells (grid === 1)
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[nx][ny] === 1) {
        ctx.fillRect(nx * cellSize, ny * cellSize, cellSize, cellSize);
      }
    }
  }

  // Then draw the main path cell on top (full opacity)
  ctx.fillStyle = currentColor;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function step() {
  for (let i = 0; i < 10; i++) { // Do multiple steps per frame
    const neighbors = getUnvisitedNeighbors(current.x, current.y);

    if (neighbors.length > 0) {
      const next = neighbors[~~(Math.random() * neighbors.length)];
      stack.push(current);

      // Remove wall between current and next
      if (next.dir === 'n') grid[current.x][current.y - 1] = 0;
      else if (next.dir === 's') grid[current.x][current.y + 1] = 0;
      else if (next.dir === 'w') grid[current.x - 1][current.y] = 0;
      else grid[current.x + 1][current.y] = 0;

      grid[next.x][next.y] = 0;
      current = next;

      // Draw current path with glow
      drawPathWithGlow(current.x, current.y);
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      // Maze complete, start a new one
      ctx.clearRect(0, 0, c.width, c.height);
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          grid[x][y] = 1;
        }
      }
      current = { x: ~~(Math.random() * cols), y: ~~(Math.random() * rows) };
      grid[current.x][current.y] = 0;
      stack.length = 0;
    }
  }
}

setInterval(step, 30);
