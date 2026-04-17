document.addEventListener('DOMContentLoaded', () => {
  /* ===== NAV (верхнее) ===== */
  const navElements = document.querySelectorAll('nav ul');

  navElements.forEach(nav => {
    nav.addEventListener('mousemove', (e) => {
      const rect = nav.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      nav.style.setProperty('--mouse-x', `${x}%`);
      nav.style.setProperty('--mouse-y', `${y}%`);
    }, { passive: true });

    // внутренние блики
    if (!nav.querySelector('.glass-shine')) {
      const shineElement = document.createElement('div');
      shineElement.className = 'glass-shine';
      nav.appendChild(shineElement);
    }
  });

  /* ===== Нижняя панель ===== */
  const bottomNav = document.querySelector('.bottom-nav ul');
  if (bottomNav) {
    bottomNav.addEventListener('mousemove', (e) => {
      const rect = bottomNav.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      bottomNav.style.setProperty('--mouse-x', `${x}%`);
      bottomNav.style.setProperty('--mouse-y', `${y}%`);
    }, { passive: true });

    bottomNav.addEventListener('mouseleave', () => {
      bottomNav.style.setProperty('--mouse-x', '50%');
      bottomNav.style.setProperty('--mouse-y', '50%');
    });
  }

  // Активная ссылка (если нужно)
  const navLinks = document.querySelectorAll('.bottom-nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ===== Переключение темы (как было) ===== */
  window.toggleDarkMode = function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  };

  /* ===== Логотип ===== */
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('mousemove', (e) => {
      const rect = logo.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      logo.style.setProperty('--mouse-x', `${x}%`);
      logo.style.setProperty('--mouse-y', `${y}%`);
    }, { passive: true });

    logo.addEventListener('mouseleave', () => {
      logo.style.setProperty('--mouse-x', '50%');
      logo.style.setProperty('--mouse-y', '50%');
    });
  }

  /* ===== Мобильное стекло (#mobileGlassNav) ===== */
  const mobileNav = document.getElementById('mobileGlassNav');
  if (mobileNav) {
    const setSpot = (e) => {
      const rect = mobileNav.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mobileNav.style.setProperty('--mouse-x', x + 'px');
      mobileNav.style.setProperty('--mouse-y', y + 'px');
    };

    ['mousemove', 'touchstart', 'touchmove'].forEach(evt => {
      mobileNav.addEventListener(evt, setSpot, { passive: true });
    });

    mobileNav.addEventListener('touchstart', () => mobileNav.classList.add('touched'), { passive: true });
    mobileNav.addEventListener('touchend', () => mobileNav.classList.remove('touched'), { passive: true });
  }

  /* ===== Карточки проектов: преломление ===== */
  const cards = document.querySelectorAll('.project-card');

  // добавить блик-полоску, если её нет
  cards.forEach(card => {
    if (!card.querySelector('.glass-shine')) {
      const shine = document.createElement('div');
      shine.className = 'glass-shine';
      shine.style.pointerEvents = 'none';
      card.appendChild(shine);
    }
  });

  // rAF-троттлинг для плавности
  let ticking = false;
  const pending = new Map();

  function flush() {
    pending.forEach((pos, el) => {
      el.style.setProperty('--mouse-x', pos.x);
      el.style.setProperty('--mouse-y', pos.y);
    });
    pending.clear();
    ticking = false;
  }

  function queue(el, x, y) {
    pending.set(el, { x, y });
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(flush);
    }
  }

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      queue(card, x.toFixed(2) + '%', y.toFixed(2) + '%');
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      queue(card, '50%', '50%');
    });

    card.addEventListener('touchstart', e => {
      const t = e.touches[0], r = card.getBoundingClientRect();
      const x = ((t.clientX - r.left) / r.width) * 100;
      const y = ((t.clientY - r.top) / r.height) * 100;
      card.classList.add('touched');
      queue(card, x.toFixed(2) + '%', y.toFixed(2) + '%');
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      const t = e.touches[0], r = card.getBoundingClientRect();
      const x = ((t.clientX - r.left) / r.width) * 100;
      const y = ((t.clientY - r.top) / r.height) * 100;
      queue(card, x.toFixed(2) + '%', y.toFixed(2) + '%');
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.classList.remove('touched');
      queue(card, '50%', '50%');
    }, { passive: true });
  });

  /* ===== Диалоговые кнопки: шарик-преломление ===== */
  const dialogButtons = document.querySelectorAll('.dialog-btn');

  dialogButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // координаты для блика в CSS (::after)
      btn.style.setProperty('--mx', `${x}px`);
      btn.style.setProperty('--my', `${y}px`);
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      // тут он уже невидим (нет :hover),
      // просто возвращаем в центр "за кадром"
      btn.style.setProperty('--mx', '50%');
      btn.style.setProperty('--my', '50%');
    });
  });
});
