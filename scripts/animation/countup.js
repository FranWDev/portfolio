/* countup.js — Animación numérica en métricas y stats al entrar en viewport */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Parsea el texto de un elemento de métrica.
   * Devuelve { negative, value, suffix, decimals } o null si no es numérico.
   */
  function parseMetric(text) {
    const raw = text.trim();
    /* Excluir rangos (100-150ms), notación Big-O, y comparadores */
    if (/ms|O\(|<|>/.test(raw)) return null;

    /* Detectar prefijo negativo (hyphen-minus o minus sign U+2212) */
    const negative = raw.startsWith('-') || raw.startsWith('\u2212');
    const stripped = raw.replace(/^[\-\u2212]/, '').replace('%', '').trim();
    const value = parseFloat(stripped);

    if (isNaN(value)) return null;

    const decimals = stripped.includes('.') ? (stripped.split('.')[1]?.length ?? 0) : 0;
    const suffix = raw.includes('%') ? '%' : '';

    return { negative, value, suffix, decimals };
  }

  /**
   * Anima un contador de 0 → target en ~900ms con easing.
   */
  function animateCount(el, parsed) {
    const { negative, value, suffix, decimals } = parsed;
    const duration = 900;
    const start = performance.now();
    const prefix = negative ? '\u2212' : '';

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease-out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (value * eased).toFixed(decimals);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Si prefiere reducción de movimiento, hacer sólo fade */
  function fadeIn(el) {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => { el.style.opacity = '1'; });
  }

  const targets = document.querySelectorAll('.metric-value, .stat-number');

  if (targets.length === 0) return;

  /* Guardar el texto original antes de que tilt.js lo oculte */
  targets.forEach((el) => {
    el.dataset.originalText = el.textContent.trim();
  });

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const originalText = el.dataset.originalText;
      if (!originalText) return;

      if (prefersReduced) {
        fadeIn(el);
      } else {
        const parsed = parseMetric(originalText);
        if (parsed) {
          animateCount(el, parsed);
        } else {
          /* Texto no numérico: sólo fade */
          fadeIn(el);
        }
      }
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  targets.forEach((el) => countObserver.observe(el));
})();
