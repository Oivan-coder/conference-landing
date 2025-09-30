// Ждём, пока страница полностью загрузится
document.addEventListener('DOMContentLoaded', function () {

  // === Скрываем обратный отсчет для завершенного мероприятия ===
  const countdown = document.getElementById('countdown');
  if (countdown) {
    countdown.style.display = 'none';
  }
  
  // Обновляем текст кнопки "Добавить в календарь"
  const calBtn = document.getElementById('addToCal');
  if (calBtn) {
    calBtn.textContent = '📅 Скачать материалы';
    calBtn.href = '#materials';
  }

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
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollTop / scrollHeight * 100;
      progressBar.style.width = progress + '%';
    });
  }

  // === 3. Кнопки "Спикер" в программе — показ/скрытие карточки ===
  document.querySelectorAll('.speaker-details').forEach(el => {
    // Проверяем, находится ли блок НЕ внутри пленарного заседания
    if (!el.closest('.slot[data-tags="пленарка"]')) {
      el.style.display = 'none';
    }
  });

  document.querySelectorAll('.speaker-toggle').forEach(button => {
    button.addEventListener('click', function () {
      const slot = this.closest('.slot');
      // Если это пленарка — ничего не делаем (кнопка будет неактивна)
      if (slot.hasAttribute('data-tags') && slot.getAttribute('data-tags').includes('пленарка')) {
        return;
      }
      const details = slot.querySelector('.speaker-details');
      const isVisible = details.style.display === 'block';
      details.style.display = isVisible ? 'none' : 'block';
      this.classList.toggle('active', !isVisible);
    });
  });

  // === 4. Анимация появления секций при скролле ===
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

  // === 5. Бургер-меню для мобильных ===
  const navBurger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');

  if (navBurger && navLinks) {
    navBurger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    
      // Блокировка прокрутки тела при открытом меню
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navBurger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = ''; // Разблокировка прокрутки
      });
    });
  }

  // === 6. ПРОВЕРКА НАЛИЧИЯ ПРЕЗЕНТАЦИЙ И ОТОБРАЖЕНИЕ ССЫЛОК ===
  const presentations = [
    { statusId: "pres-shchiblykina-status", url: "presentations/shchiblykina-centralization.pdf" },
    { statusId: "pres-vostrikova-status", url: "presentations/vostrikova-cytology.pdf" },
    { statusId: "pres-gisharova-status", url: "presentations/gisharova.pdf" },
    { statusId: "pres-izvekova-status", url: "presentations/izvekova-logistics.pdf" },
    { statusId: "pres-kosenko-status", url: "presentations/kosenko-standardization.pdf" },
    { statusId: "pres-radiionov-status", url: "presentations/radionov.pdf" },
    { statusId: "pres-lambakakhar-status", url: "presentations/lambakakhar-changes.pdf" },
    { statusId: "pres-kalacheva-status", url: "presentations/kalacheva.pdf" },
    { statusId: "pres-voronkov-status", url: "presentations/voronkov-tba.pdf" },
    { statusId: "pres-ten-status", url: "presentations/ten-quality.pdf" }
  ];

  presentations.forEach(pres => {
    const statusEl = document.getElementById(pres.statusId);
    if (!statusEl) return;
    
    const downloadLink = statusEl.previousElementSibling; // <a> перед span
    if (!downloadLink || downloadLink.tagName !== 'A') return;

    // Временно пишем "Проверка..." для обратной связи
    statusEl.textContent = "Проверка...";

    fetch(pres.url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          statusEl.textContent = "Презентация доступна";
          statusEl.style.color = "var(--accent)";
          downloadLink.style.display = "inline-flex";
        } else {
          statusEl.textContent = "Презентация будет доступна после конференции";
        }
      })
      .catch(() => {
        statusEl.textContent = "Презентация будет доступна после конференции";
      });
  });

});
