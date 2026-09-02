
// ========================================
// MATRIX RAIN
// ========================================
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]\\|;:=+-*&^%$#@!~';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(10,10,10,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 45);

// ========================================
// BOOT SEQUENCE
// ========================================
const bootLines = [
    { text: 'BIOS v3.2.1 — System Check...', delay: 200 },
    { text: 'CPU: Intel Core i7 @ 3.6GHz ........... [OK]', delay: 400, cls: 'ok' },
    { text: 'RAM: 32768 MB DDR4 ..................... [OK]', delay: 400, cls: 'ok' },
    { text: 'GPU: NVIDIA RTX 4070 ................... [OK]', delay: 300, cls: 'ok' },
    { text: 'NET: eth0 — 192.168.1.42 .............. [OK]', delay: 300, cls: 'ok' },
    { text: 'TOR: Circuit established ................ [OK]', delay: 400, cls: 'ok' },
    { text: 'VPN: WireGuard tunnel active ........... [OK]', delay: 300, cls: 'ok' },
    { text: 'FIREWALL: iptables loaded .............. [OK]', delay: 250, cls: 'ok' },
    { text: '', delay: 100 },
    { text: 'WARNING: Unauthorized access will be traced.', delay: 300, cls: 'error' },
    { text: '', delay: 100 },
    { text: 'Loading user profile: JUAN_MENDOZA_SEC...', delay: 500 },
    { text: '>> Profile loaded. Welcome, operator.', delay: 300, cls: 'ok' },
    { text: '', delay: 100 },
    { text: '[ INITIALIZING INTERFACE... ]', delay: 400 },
];

function runBoot() {
    const bootScreen = document.getElementById('boot-screen');
    if (!bootScreen) return;

    let totalDelay = 0;

    bootLines.forEach((line, index) => {
        totalDelay += line.delay;
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'line' + (line.cls ? ' ' + line.cls : '');
            el.textContent = line.text;
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.1s';
            bootScreen.appendChild(el);

            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.classList.add('show');
            });

            if (index === bootLines.length - 1) {
                setTimeout(() => {
                    bootScreen.style.opacity = '0';
                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                        animateSkillBars();
                    }, 500);
                }, 600);
            }
        }, totalDelay);
    });
}

// ========================================
// TYPEWRITER
// ========================================
function typeWriter(el, text, speed, callback) {
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// ========================================
// SKILL BAR ANIMATION
// ========================================
function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const target = bar.getAttribute('data-level');
                setTimeout(() => {
                    bar.style.width = target + '%';
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
}

// ========================================
// INIT
// ========================================
window.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.getElementById('name-text');
    if (nameEl) {
        runBoot();
    } else {
        animateSkillBars();
    }
});
