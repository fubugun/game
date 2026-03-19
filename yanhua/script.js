const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clearBtn");

let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 60%)`;
}

function spawnFirework(x, y) {
  const baseColor = randomColor();
  const count = 70 + Math.floor(Math.random() * 60);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4.8;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60 + Math.floor(Math.random() * 28),
      maxLife: 88,
      size: 1.6 + Math.random() * 2.2,
      color: baseColor
    });
  }
}

function updateParticles() {
  particles = particles.filter((p) => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
    p.vx *= 0.992;
    p.vy *= 0.992;
    p.life -= 1;
  }
}

function drawParticles() {
  for (const p of particles) {
    const alpha = Math.max(p.life / p.maxLife, 0);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function animate() {
  ctx.fillStyle = "rgba(4, 9, 21, 0.24)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

canvas.addEventListener("click", (e) => {
  const x = e.clientX + (Math.random() * 30 - 15);
  const y = e.clientY + (Math.random() * 30 - 15);
  spawnFirework(x, y);
});

clearBtn.addEventListener("click", () => {
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

window.addEventListener("resize", resize);
resize();
animate();
