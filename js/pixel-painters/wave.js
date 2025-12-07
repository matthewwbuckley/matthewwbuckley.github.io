// Expanding wave/ripple
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
ctx.fillStyle = '#264653';

const waves = [];

function addWave() {
  waves.push({
    x: ~~(Math.random() * c.width),
    y: ~~(Math.random() * c.height),
    r: 0
  });
}

function drawWaves() {
  for (let i = waves.length - 1; i >= 0; i--) {
    const w = waves[i];

    // Draw circle outline
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      const x = ~~(w.x + Math.cos(a) * w.r);
      const y = ~~(w.y + Math.sin(a) * w.r);
      if (x >= 0 && x < c.width && y >= 0 && y < c.height) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    w.r++;
    if (w.r > Math.max(c.width, c.height)) {
      waves.splice(i, 1);
    }
  }
}

setInterval(addWave, 2000);
setInterval(drawWaves, 50);
