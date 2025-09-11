// Ждём, пока страница полностью загрузится
document.addEventListener('DOMContentLoaded', function () {

  // === 1. Плавная прокрутка к якорям (#about, #program и т.д.) ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length < 2) return; // если просто "#"
      const targetElement = document.querySelector(id);
      if (!targetElement) return;

      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });


  // === 2. Прогресс-бар прокрутки (вверху экрана) ===
  const progressBar = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollTop / scrollHeight * 100;
    progressBar.style.width = progress + '%';
  });


  // === 3. Обратный отсчёт до события ===
  const targetDate = new Date('2025-09-25T08:00:00Z'); // 11:00 MSK

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('cd-d').textContent = '00';
      document.getElementById('cd-h').textContent = '00';
      document.getElementById('cd-m').textContent = '00';
      document.getElementById('cd-s').textContent = '00';
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('cd-d').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-h').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(seconds).padStart(2, '0');
  }

  // Запуск и обновление каждую секунду
  updateCountdown();
  setInterval(updateCountdown, 1000);


  // === 4. Кнопки "Спикер" в программе — показ/скрытие карточки ===
// Сначала скрываем все блоки с информацией
  document.querySelectorAll('.speaker-details').forEach(el => {
    el.style.display = 'none';
  });

// Обработка кликов по кнопкам "плюс"
  document.querySelectorAll('.speaker-toggle').forEach(button => {
    button.addEventListener('click', function () {
    // Находим ближайший родительский .slot, а внутри него ищем .speaker-details
      const details = this.closest('.slot').querySelector('.speaker-details');
    // Проверяем, виден ли блок сейчас
      const isVisible = details.style.display === 'block';

    // Показываем или скрываем
      details.style.display = isVisible ? 'none' : 'block';

    // Меняем состояние кнопки (для поворота плюса)
      this.classList.toggle('active', !isVisible);
    });
  });


  // === 5. Анимация появления секций при скролле ===
  // === Анимация появления секций при скролле ===
  const sections = document.querySelectorAll('section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 }); // Секция становится видимой при 10% в зоне просмотра

  sections.forEach(section => {
    observer.observe(section);
  });
  // === 6. Кнопка "Добавить в календарь" (.ics файл) ===
  const addCalendarButton = document.getElementById('addToCal');
  if (addCalendarButton) {
    addCalendarButton.addEventListener('click', function () {
      const eventStart = '20250925T080000Z'; // 11:00 MSK
      const eventEnd = '20250925T150000Z';   // 18:00 MSK

      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Conference//LabMed MO//RU
BEGIN:VEVENT
UID:${Date.now()}@labmed-mo
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${eventStart}
DTEND:${eventEnd}
SUMMARY:Лабораторная медицина Подмосковья: этапы, инновации, перспективы
LOCATION:Дом Правительства МО\\, г. Красногорск\\, БЦ «Новатор»\\, 7 эт.
DESCRIPTION:Официальная конференция Московской области
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'LabMed_MO_2025-09-25.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }


  // === 7. Эффект частиц (если есть canvas с id="heroCanvas") ===
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    let mouse = { x: 0, y: 0 };

    // Настройка размеров
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      w = canvas.width;
      h = canvas.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Создание частиц
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    }));

    // Отслеживание мыши
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    // Основной цикл анимации
    function animate() {
      ctx.fillStyle = '#0a142a';
      ctx.fillRect(0, 0, w, h);

      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy) + 0.001;
        const force = 40 / (dist * dist);
        p.vx += force * dx;
        p.vy += force * dy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        // Отражение от краёв
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.fillStyle = 'rgba(96,165,250,0.9)';
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

});
