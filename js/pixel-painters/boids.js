// Boids - flocking behavior
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
const boidColors = [p.fg, p.accent, p.accent2];

const boids = [];
for (let i = 0; i < 1000; i++) {
  boids.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    color: boidColors[i % boidColors.length]
  });
}

function step() {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);

  for (let boid of boids) {
    let avgX = 0, avgY = 0, avgVX = 0, avgVY = 0, count = 0;
    let closeX = 0, closeY = 0;

    for (let other of boids) {
      if (other === boid) continue;
      const dx = other.x - boid.x;
      const dy = other.y - boid.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20) { closeX -= dx; closeY -= dy; }
      if (dist < 40) { avgVX += other.vx; avgVY += other.vy; avgX += other.x; avgY += other.y; count++; }
    }

    if (count > 0) {
      avgX /= count; avgY /= count; avgVX /= count; avgVY /= count;
      boid.vx += (avgX - boid.x) * 0.01;
      boid.vy += (avgY - boid.y) * 0.01;
      boid.vx += avgVX * 0.05;
      boid.vy += avgVY * 0.05;
    }

    boid.vx += closeX * 0.05;
    boid.vy += closeY * 0.05;

    const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
    if (speed > 2) { boid.vx = (boid.vx / speed) * 2; boid.vy = (boid.vy / speed) * 2; }

    boid.x += boid.vx; boid.y += boid.vy;
    if (boid.x < 0) boid.x += w; if (boid.x >= w) boid.x -= w;
    if (boid.y < 0) boid.y += h; if (boid.y >= h) boid.y -= h;

    ctx.fillStyle = boid.color;
    ctx.fillRect(~~boid.x, ~~boid.y, 1, 1);
  }
}

setInterval(step, 50);
