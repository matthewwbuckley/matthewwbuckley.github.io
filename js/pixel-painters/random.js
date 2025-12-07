// Random pixel painting
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

setInterval(() => {
  ctx.fillRect(~~(Math.random() * c.width), ~~(Math.random() * c.height), 1, 1);
}, 100);
