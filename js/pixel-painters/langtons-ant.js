// Langton's Ant
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
}, 10000);

const grid = Array(w).fill().map(() => Array(h).fill(0));

const ants = [];
for (let i = 0; i < 400; i++) {
  ants.push({ x: ~~(Math.random() * w), y: ~~(Math.random() * h), dir: ~~(Math.random() * 4) });
}

function step() {
  for (let ant of ants) {
    const state = grid[ant.x][ant.y];

    ant.dir = state === 0 ? (ant.dir + 1) % 4 : (ant.dir + 3) % 4;
    grid[ant.x][ant.y] = 1 - state;

    if (grid[ant.x][ant.y] === 1) {
      ctx.fillStyle = currentColor;
      ctx.fillRect(ant.x, ant.y, 1, 1);
    } else {
      ctx.fillStyle = p.bg;
      ctx.fillRect(ant.x, ant.y, 1, 1);
    }

    if (ant.dir === 0) ant.y = (ant.y - 1 + h) % h;
    else if (ant.dir === 1) ant.x = (ant.x + 1) % w;
    else if (ant.dir === 2) ant.y = (ant.y + 1) % h;
    else ant.x = (ant.x - 1 + w) % w;
  }
}

setInterval(step, 10);
