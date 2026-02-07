const si = document.getElementById("btn-si");
const quizas = document.getElementById("btn-quizas");
const celebration = document.getElementById("celebration");
const recuerdos = document.getElementById("btn-recuerdos");
const confettiCanvas = document.getElementById("confetti");
const gallerySection = document.querySelector(".gallery-section");
const titleEl = document.querySelector(".hero .title");
const subtitleEl = document.querySelector(".hero .subtitle");
const annivInput = document.getElementById("anniv-date");
const annivSave = document.getElementById("anniv-save");
const yearsEl = document.getElementById("years");
const daysEl = document.getElementById("days");
const nextDaysEl = document.getElementById("next-days");

function showCelebration() {
  celebration.classList.remove("hidden");
  startConfetti();
}

function hideCelebration() {
  celebration.classList.add("hidden");
  stopConfetti();
}

si.addEventListener("click", showCelebration);
recuerdos.addEventListener("click", () => {
  hideCelebration();
  gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
});

let dodgeCount = 0;
quizas.addEventListener("mousemove", e => {
  dodgeCount++;
  const rect = quizas.getBoundingClientRect();
  const x = (Math.random() * 60 - 30);
  const y = (Math.random() * 40 - 20) - Math.min(dodgeCount * 2, 60);
  quizas.style.transform = `translate(${x}px, ${y}px)`;
});
quizas.addEventListener("mouseleave", () => {
  quizas.style.transform = "translate(0,0)";
});
quizas.addEventListener("click", () => {
  quizas.textContent = "Mejor sí 💕";
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

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function parseInput(val) {
  const [y, m, d] = val.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}
function diffYears(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  const anniversaryThisYear = new Date(from.getFullYear() + years, from.getMonth(), from.getDate(), 12);
  if (to < anniversaryThisYear) years--;
  return Math.max(0, years);
}
function daysBetween(from, to) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12);
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 12);
  return Math.max(0, Math.floor((b - a) / msPerDay));
}
function daysUntilNext(from, now) {
  const years = diffYears(from, now);
  let next = new Date(from.getFullYear() + years + 1, from.getMonth(), from.getDate(), 12);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((next - now) / msPerDay));
}
function updateAnniv() {
  const val = annivInput.value;
  if (!val) return;
  const start = parseInput(val);
  const now = new Date();
  yearsEl.textContent = diffYears(start, now).toLocaleString("es-ES");
  daysEl.textContent = daysBetween(start, now).toLocaleString("es-ES");
  nextDaysEl.textContent = daysUntilNext(start, now).toLocaleString("es-ES");
}
function initAnniv() {
  const stored = localStorage.getItem("anniversary");
  const defaultDate = "2023-05-01";
  annivInput.value = stored || defaultDate;
  updateAnniv();
}
annivSave.addEventListener("click", () => {
  if (!annivInput.value) return;
  localStorage.setItem("anniversary", annivInput.value);
  updateAnniv();
});
annivInput.addEventListener("change", updateAnniv);
document.addEventListener("DOMContentLoaded", initAnniv);

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
