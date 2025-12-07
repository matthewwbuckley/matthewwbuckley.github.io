// Voronoi diagram - incremental generation
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

// Generate random seed points with colors
let seeds = [];
let focusSeed = null;
let focusTimeLeft = 0;

for (let i = 0; i < 5; i++) {
  seeds.push({
    x: ~~(Math.random() * w),
    y: ~~(Math.random() * h),
    color: colors[~~(Math.random() * colors.length)]
  });
}

// Add new seed every few seconds
setInterval(() => {
  for (let i = 0; i < 1; i++) {
    const newSeed = {
      x: ~~(Math.random() * w),
      y: ~~(Math.random() * h),
      color: colors[~~(Math.random() * colors.length)]
    };
    seeds.push(newSeed);
    // Focus on the last new seed
    if (i === 1) {
      focusSeed = newSeed;
      focusTimeLeft = 100; // Focus for ~3 seconds
    }
  }
}, 5000);

function draw() {
  // Draw random pixels based on closest seed
  for (let i = 0; i < 1000; i++) {
    let x, y;

    // 70% of the time, focus on area around new seed if active
    if (focusSeed && focusTimeLeft > 0 && Math.random() < 0.7) {
      // Draw near the focused seed
      const radius = 30;
      x = ~~(focusSeed.x + (Math.random() - 0.5) * radius * 2);
      y = ~~(focusSeed.y + (Math.random() - 0.5) * radius * 2);
      // Clamp to canvas bounds
      x = Math.max(0, Math.min(w - 1, x));
      y = Math.max(0, Math.min(h - 1, y));
    } else {
      // Random position
      x = ~~(Math.random() * w);
      y = ~~(Math.random() * h);
    }

    let minDist = Infinity;
    let closestSeed = seeds[0];

    for (let seed of seeds) {
      const dist = (x - seed.x) ** 2 + (y - seed.y) ** 2;
      if (dist < minDist) {
        minDist = dist;
        closestSeed = seed;
      }
    }

    ctx.fillStyle = closestSeed.color;
    ctx.fillRect(x, y, 1, 1);
  }

  // Decrement focus timer
  if (focusTimeLeft > 0) {
    focusTimeLeft--;
  }
}

setInterval(draw, 30);
