function autoSurfaceTheme() {
  const nav = document.querySelector('nav');
  const bottomBar = document.querySelector('.bottom-nav-wrapper');
  const logo = document.querySelector('.logo'); // ← ЛОГОТИП
  if (!nav) return;

  // Карта "поверхность → тип фона"
  const surfaceConfig = [
    { selector: '.appstore-banner',  theme: 'dark'  },
    { selector: '.projects-container', theme: 'light' },
    { selector: '.nocontainer',      theme: 'light' },
    { selector: '.container',        theme: 'light' }
  ];

  const surfaces = surfaceConfig
    .map(cfg => {
      return Array.from(document.querySelectorAll(cfg.selector))
        .map(el => ({ el, theme: cfg.theme }));
    })
    .flat();

  if (!surfaces.length) return;

  let currentTheme = null;
  let ticking = false;

  function applyTheme(surfaceTheme) {
    if (surfaceTheme === currentTheme) return;
    currentTheme = surfaceTheme;

    // Инвертированная логика:
    const navShouldBeDark = surfaceTheme === 'light';

    // NAVBAR
    nav.classList.toggle('light-mode', navShouldBeDark);
    nav.classList.toggle('dark-mode', !navShouldBeDark);

    // BOTTOM-BAR
    if (bottomBar) {
      bottomBar.classList.toggle('light-mode', navShouldBeDark);
      bottomBar.classList.toggle('dark-mode', !navShouldBeDark);
    }

    // LOGO
    if (logo) {
      logo.classList.toggle('light-mode', navShouldBeDark);
      logo.classList.toggle('dark-mode', !navShouldBeDark);
    }
  }

  function updateTheme() {
    const navRect = nav.getBoundingClientRect();
    const probeX = navRect.left + navRect.width / 2;
    const probeY = navRect.top + navRect.height / 2;

    let activeSurface = null;
    let bestScore = -Infinity;

    surfaces.forEach(({ el, theme }) => {
      const r = el.getBoundingClientRect();

      const inside =
        probeX >= r.left && probeX <= r.right &&
        probeY >= r.top  && probeY <= r.bottom;

      if (!inside) return;

      const score = -Math.abs(r.top - navRect.top);

      if (score > bestScore) {
        bestScore = score;
        activeSurface = theme;
      }
    });

    applyTheme(activeSurface || 'light');
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateTheme();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('load', updateTheme);
  updateTheme();
}

document.addEventListener('DOMContentLoaded', autoSurfaceTheme);
