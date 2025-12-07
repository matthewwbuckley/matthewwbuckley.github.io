// Reaction-Diffusion (Gray-Scott model)
const c = document.getElementById('pixel-canvas');
const scale = 4;
c.width = Math.ceil(window.innerWidth / scale);
c.height = Math.ceil(window.innerHeight / scale);
c.style.width = window.innerWidth + 'px';
c.style.height = window.innerHeight + 'px';
c.style.position = 'fixed';
c.style.top = '0';
c.style.left = '0';
c.style.zIndex = '-1';
c.style.imageRendering = 'pixelated';

const ctx = c.getContext('2d');
const w = c.width;
const h = c.height;

// Two chemical grids
let a = Array(w).fill().map(() => Array(h).fill(1));
let b = Array(w).fill().map(() => Array(h).fill(0));
let na = Array(w).fill().map(() => Array(h).fill(0));
let nb = Array(w).fill().map(() => Array(h).fill(0));

// Random seed
for (let i = 0; i < 100; i++) {
  const x = ~~(Math.random() * w);
  const y = ~~(Math.random() * h);
  b[x][y] = 1;
}

// Parameters for spot patterns
const dA = 1.0;
const dB = 0.5;
const f = 0.095;  // feed rate
const k = 0.060;  // kill rate

function laplacian(grid, x, y) {
  let sum = 0;
  sum += grid[x][y] * -1;
  sum += grid[(x-1+w)%w][y] * 0.2;
  sum += grid[(x+1)%w][y] * 0.2;
  sum += grid[x][(y-1+h)%h] * 0.2;
  sum += grid[x][(y+1)%h] * 0.2;
  sum += grid[(x-1+w)%w][(y-1+h)%h] * 0.05;
  sum += grid[(x+1)%w][(y-1+h)%h] * 0.05;
  sum += grid[(x-1+w)%w][(y+1)%h] * 0.05;
  sum += grid[(x+1)%w][(y+1)%h] * 0.05;
  return sum;
}

function step() {
  // Add random seeds continuously to keep reaction alive
  for (let i = 0; i < 5; i++) {
    const x = ~~(Math.random() * w);
    const y = ~~(Math.random() * h);
    b[x][y] = 1;
  }

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const A = a[x][y];
      const B = b[x][y];
      const reaction = A * B * B;

      na[x][y] = A + (dA * laplacian(a, x, y) - reaction + f * (1 - A));
      nb[x][y] = B + (dB * laplacian(b, x, y) + reaction - (k + f) * B);

      na[x][y] = Math.max(0, Math.min(1, na[x][y]));
      nb[x][y] = Math.max(0, Math.min(1, nb[x][y]));
    }
  }

  [a, na] = [na, a];
  [b, nb] = [nb, b];

  // Render
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const val = ~~(b[x][y] * 255);
      if (val > 16) {
        ctx.fillStyle = '#264653';
        ctx.fillRect(x, y, 1, 1);
      } else {
        ctx.clearRect(x, y, 1, 1);
      }
    }
  }
}

setInterval(step, 100);
