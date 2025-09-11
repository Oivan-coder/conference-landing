document.addEventListener('DOMContentLoaded', function() {

  // === 1. Плавная прокрутка к якорям ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // === 2. Прогресс-бар прокрутки ===
  const bar = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrollTop = h.scrollTop;
    const maxScroll = h.scrollHeight - h.clientHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    bar.style.width = progress + '%';
  });

  // === 3. Таймер до события ===
  const target = new Date('2025-09-25T08:00:00Z'); // 11:00 MSK (UTC+3)
  function tick() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      ['cd-d', 'cd-h', 'cd-m', 'cd-s'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
    document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(sec).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);

// === 4. Фильтрация программы по трекам ===
const tabs = document.querySelectorAll('.tab');
const slots = [...document.querySelectorAll('.slot')];

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const tag = tab.dataset.tag;
    slots.forEach(slot => {
      if (tag === 'all') {
        slot.style.display = 'block';
      } else {
        const tags = slot.dataset.tags.split(' ');
        slot.style.display = tags.includes(tag) ? 'block' : 'none';
      }
    });
  });
});

// === 5. Анимация появления секций при скролле ===
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  observer.observe(section);
});

// === 6. Добавить в календарь (.ics) ===
document.getElementById('addToCal')?.addEventListener('click', () => {
  const dtStart = '20250925T080000Z';
  const dtEnd = '20250925T150000Z';
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Conference//LabMed MO//RU
BEGIN:VEVENT
UID:${Date.now()}@labmed-mo
DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:Лабораторная медицина Подмосковья: этапы, инновации, перспективы
LOCATION:Дом Правительства МО, Красногорск, БЦ «Новатор», 7 эт.
DESCRIPTION:Официальная конференция Московской области
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'LabMed_MO_2025-09-25.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// === 7. Эффект частиц на heroCanvas ===
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w = canvas.width, h = canvas.height;
  let mouse = { x: w / 2, y: h / 2 };

  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
  }));

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  function step() {
    ctx.fillStyle = '#0a142a';
    ctx.fillRect(0, 0, w, h);
    particles.forEach(p => {
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d = Math.hypot(dx, dy) + 0.001;
      const force = 40 / (d * d);
      p.vx += force * dx;
      p.vy += force * dy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.x += p.vx * 0.02;
      p.y += p.vy * 0.02;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.fillStyle = 'rgba(96,165,250,0.9)';
      ctx.fillRect(p.x, p.y, 1.5, 1.5);
    });
    requestAnimationFrame(step);
  }
  step();

  window.addEventListener('resize', () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    w = canvas.width;
    h = canvas.height;
  });
}

