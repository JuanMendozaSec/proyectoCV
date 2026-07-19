const img = document.getElementById('profile-img');
img.addEventListener('error', () => { img.style.display = 'none'; });
if (!img.src || img.src === window.location.href) img.style.display = 'none';

const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffd700', '#ff6347', '#7b68ee', '#00ff7f', '#ff4500', '#ff00ff'];
const pieces = [];

for (let i = 0; i < 200; i++) {
    pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 12 + 5,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 2.5 + 0.5,
        angle: Math.random() * 360,
        spin: Math.random() * 6 - 3,
        swing: Math.random() * 2.5,
    });
}

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.angle += p.spin;
        p.x += Math.sin(p.y * 0.01) * p.swing;
        if (p.y > canvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
        }
    }
    requestAnimationFrame(drawConfetti);
}

drawConfetti();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
