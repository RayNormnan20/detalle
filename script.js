const si = document.getElementById("btn-si");
const quizas = document.getElementById("btn-quizas");
const celebration = document.getElementById("celebration");
const recuerdos = document.getElementById("btn-recuerdos");
const confettiCanvas = document.getElementById("confetti");
const gallerySection = document.querySelector(".gallery-section");
const titleEl = document.querySelector(".hero .title");
const subtitleEl = document.querySelector(".hero .subtitle");
const noHint = document.getElementById("no-hint");
let noClickCount = 0;
let galleryUnlocked = false;
const funnyMessages = [
  "¿Segura? Piensa otra vez 😉",
  "Uy… con 'No' no vale 😜",
  "Mi corazón dice Sí 💘",
  "Te invito a sonreír conmigo 😊",
  "Hoy es día de decir Sí ✨",
  "El destino ya eligió: Sí 💖",
  "Si pones Sí, hay sorpresa 🎁",
  "Prometo mil risas si dices Sí 😄",
  "¿Y si probamos con Sí? 🌟"
];

function showCelebration() {
  celebration.classList.remove("hidden");
  startConfetti();
}

function hideCelebration() {
  celebration.classList.add("hidden");
  stopConfetti();
}

si.addEventListener("click", () => {
  startConfetti();
  
  // Hide buttons and show message
  const cta = document.querySelector('.cta');
  cta.style.display = 'none';
  
  const msgDiv = document.createElement('div');
  msgDiv.innerHTML = `
    <h3 class="celebration-title" style="margin-top: 20px;">¡Eres lo mejor!</h3>
    <p class="celebration-text">Prometo hacer de cada día un recuerdo bonito a tu lado. Te amo infinitamente ❤️</p>
    <button id="btn-recuerdos-inline" class="btn secondary" style="margin-top: 10px;">Ver nuestros momentos</button>
  `;
  cta.parentNode.insertBefore(msgDiv, cta.nextSibling);

  // Add listener to the new button
  document.getElementById("btn-recuerdos-inline").addEventListener("click", () => {
    galleryUnlocked = true;
    gallerySection.classList.remove("hidden");
    gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
recuerdos.addEventListener("click", () => {
  gallerySection.classList.remove("hidden");
  hideCelebration();
  gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
});

let dodgeCount = 0;
quizas.addEventListener("mousemove", e => {
  dodgeCount++;
  const rect = quizas.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const intensity = Math.min(1 + dodgeCount * 0.15, 3);
  const moveX = -Math.sign(dx) * (20 + Math.random() * 30) * intensity;
  const moveY = -Math.sign(dy) * (15 + Math.random() * 25) * intensity;
  quizas.style.transform = `translate(${moveX}px, ${moveY}px)`;
});
quizas.addEventListener("mouseleave", () => {
  quizas.style.transform = "translate(0,0)";
});
quizas.addEventListener("click", () => {
  noClickCount++;
  const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  if (noHint) {
    noHint.style.opacity = "0";
    noHint.textContent = msg;
    requestAnimationFrame(() => {
      noHint.style.transition = "opacity 0.25s ease";
      noHint.style.opacity = "1";
    });
  }
  quizas.style.animation = "none";
  setTimeout(() => { quizas.style.animation = "pulse 0.6s ease"; }, 10);
});

function parallax(eX, eY) {
  const factor = 1.5;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (eX - cx) / cx;
  const dy = (eY - cy) / cy;
  titleEl.style.transform = `translate(${dx * -factor * 6}px, ${dy * -factor * 4}px)`;
  subtitleEl.style.transform = `translate(${dx * -factor * 3}px, ${dy * -factor * 2}px)`;
}
window.addEventListener("mousemove", (e) => parallax(e.clientX, e.clientY), { passive: true });
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) parallax(t.clientX, t.clientY);
}, { passive: true });

let running = false;
let ctx, particles, rafId, lastTime;

function startConfetti() {
  if (running) return;
  running = true;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  ctx = confettiCanvas.getContext("2d");
  particles = Array.from({ length: 180 }).map(() => makeParticle());
  lastTime = performance.now();
  loop(lastTime);
}

function stopConfetti() {
  running = false;
  cancelAnimationFrame(rafId);
  ctx && ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
}

function makeParticle() {
  const colors = ["#ff4d6d", "#ff8fa3", "#ffd166", "#06d6a0", "#118ab2", "#e76f51"];
  return {
    x: Math.random() * confettiCanvas.width,
    y: -10,
    vx: (Math.random() - 0.5) * 1.2,
    vy: Math.random() * 1.5 + 0.8,
    size: Math.random() * 6 + 3,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.04,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.random() < 0.5 ? "rect" : "circle"
  };
}

function draw(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = p.color;
  if (p.shape === "rect") {
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
  } else {
    ctx.beginPath();
    ctx.arc(0,0,p.size/2,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

function loop(ts) {
  if (!running) return;
  const dt = Math.min(32, ts - lastTime) * 0.06;
  lastTime = ts;
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  particles.forEach(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    p.vx += Math.sin(p.rot) * 0.02;
    if (p.y > confettiCanvas.height + 20) {
      p.x = Math.random() * confettiCanvas.width;
      p.y = -10;
      p.vx = (Math.random() - 0.5) * 1.2;
      p.vy = Math.random() * 1.5 + 0.8;
      p.size = Math.random() * 6 + 3;
      p.rot = Math.random() * Math.PI * 2;
    }
    draw(p);
  });
  rafId = requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

 

 

 

 

 

 

 

 

 

 

 

function initReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));
}
document.addEventListener("DOMContentLoaded", initReveal);
