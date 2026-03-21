// Recursive backtracker maze generation
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

const cellSize = 2;
const cols = ~~(c.width / cellSize);
const rows = ~~(c.height / cellSize);

const p = window.paletteConfig || { bg: '#0a0a0a', fg: '#f5f5f5', accent: '#6b6b6b', accent2: '#a8a8a8' };
const paletteColors = [p.accent, p.accent2, p.fg];
let colorIndex = 0;
let currentColor = paletteColors[0];

setInterval(() => {
  colorIndex = (colorIndex + 1) % paletteColors.length;
  currentColor = paletteColors[colorIndex];
}, 5000);

const grid = Array(cols).fill().map(() => Array(rows).fill(1));
const stack = [];
let current = { x: ~~(Math.random() * cols), y: ~~(Math.random() * rows) };
grid[current.x][current.y] = 0;

function getUnvisitedNeighbors(x, y) {
  const neighbors = [];
  if (x > 1 && grid[x - 2][y] === 1) neighbors.push({ x: x - 2, y, dir: 'w' });
  if (x < cols - 2 && grid[x + 2][y] === 1) neighbors.push({ x: x + 2, y, dir: 'e' });
  if (y > 1 && grid[x][y - 2] === 1) neighbors.push({ x, y: y - 2, dir: 'n' });
  if (y < rows - 2 && grid[x][y + 2] === 1) neighbors.push({ x, y: y + 2, dir: 's' });
  return neighbors;
}

function mixColors(c1, c2, ratio) {
  const r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
  const r = Math.round(r1 * ratio + r2 * (1 - ratio));
  const g = Math.round(g1 * ratio + g2 * (1 - ratio));
  const b = Math.round(b1 * ratio + b2 * (1 - ratio));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function drawPathWithGlow(x, y) {
  const glowColor = mixColors(currentColor, p.bg, 0.2);
  ctx.fillStyle = glowColor;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[nx][ny] === 1) {
        ctx.fillRect(nx * cellSize, ny * cellSize, cellSize, cellSize);
      }
    }
  }
  ctx.fillStyle = currentColor;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function step() {
  for (let i = 0; i < 10; i++) {
    const neighbors = getUnvisitedNeighbors(current.x, current.y);

    if (neighbors.length > 0) {
      const next = neighbors[~~(Math.random() * neighbors.length)];
      stack.push(current);

      if (next.dir === 'n') grid[current.x][current.y - 1] = 0;
      else if (next.dir === 's') grid[current.x][current.y + 1] = 0;
      else if (next.dir === 'w') grid[current.x - 1][current.y] = 0;
      else grid[current.x + 1][current.y] = 0;

      grid[next.x][next.y] = 0;
      current = next;
      drawPathWithGlow(current.x, current.y);
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      ctx.fillStyle = p.bg;
      ctx.fillRect(0, 0, c.width, c.height);
      for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) grid[x][y] = 1;
      current = { x: ~~(Math.random() * cols), y: ~~(Math.random() * rows) };
      grid[current.x][current.y] = 0;
      stack.length = 0;
    }
  }
}

setInterval(step, 30);
