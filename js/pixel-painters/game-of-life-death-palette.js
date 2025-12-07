// Conway's Game of Life - dead cells colored by time of death, using palette colors
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

// Fetch palette data
let colors = [];
let currentColor = '#264653';

fetch('/palettes.toml')
  .then(response => response.text())
  .then(toml => {
    // Get all palette names
    const paletteNames = toml.match(/\[(\w+)\]/g).map(m => m.slice(1, -1));

    // Pick a random palette
    const randomPalette = paletteNames[~~(Math.random() * paletteNames.length)];

    // Parse TOML to extract that palette's colors
    const paletteSection = toml.split(`[${randomPalette}]`)[1].split('[')[0];
    const colorMatches = paletteSection.matchAll(/#[0-9a-fA-F]{6}/g);
    colors = Array.from(colorMatches, m => m[0]);

    if (colors.length > 0) {
      currentColor = colors[~~(Math.random() * colors.length)];
    }

    console.log(`Game of Life using palette: ${randomPalette}`, colors);

    // Start the simulation
    startSimulation();
  });

// Switch color every 5 seconds
setInterval(() => {
  if (colors.length > 0) {
    currentColor = colors[~~(Math.random() * colors.length)];
  }
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

function startSimulation() {
  setInterval(step, 100);
}
