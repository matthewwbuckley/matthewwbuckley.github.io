// Random walk (drunkard's walk)
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
ctx.fillStyle = '#264653';

let x = ~~(c.width / 2);
let y = ~~(c.height / 2);

setInterval(() => {
  const dir = ~~(Math.random() * 4);
  if (dir === 0) x++;
  else if (dir === 1) x--;
  else if (dir === 2) y++;
  else y--;

  x = (x + c.width) % c.width;
  y = (y + c.height) % c.height;

  ctx.fillRect(x, y, 1, 1);
}, 10);
