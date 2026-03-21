// Voronoi diagram - incremental generation
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
const seedColors = [p.fg, p.accent, p.accent2];

let seeds = [];

for (let i = 0; i < 5; i++) {
  seeds.push({ x: ~~(Math.random() * w), y: ~~(Math.random() * h), color: seedColors[i % seedColors.length] });
}

setInterval(() => {
  seeds.push({ x: ~~(Math.random() * w), y: ~~(Math.random() * h), color: seedColors[seeds.length % seedColors.length] });
}, 5000);

function draw() {
  for (let i = 0; i < 1000; i++) {
    const x = ~~(Math.random() * w);
    const y = ~~(Math.random() * h);

    let minDist = Infinity;
    let closestSeed = seeds[0];

    for (let seed of seeds) {
      const dist = (x - seed.x) ** 2 + (y - seed.y) ** 2;
      if (dist < minDist) { minDist = dist; closestSeed = seed; }
    }

    ctx.fillStyle = closestSeed.color;
    ctx.fillRect(x, y, 1, 1);
  }

}

setInterval(draw, 30);
