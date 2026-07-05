(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const titleEl = document.querySelector('.hero-title');
  const subEl = document.querySelector('.hero-subtitle');
  const descEl = document.querySelector('.hero-description');
  const socials = document.querySelectorAll('.social-links .social-link');

  if (!titleEl) return;

  const originalTitle = titleEl.textContent.trim();
  const originalSub = subEl ? subEl.textContent.trim() : '';
  const originalDesc = descEl ? descEl.textContent.trim() : '';

  function setInstant() {
    titleEl.textContent = originalTitle;
    if (subEl) { subEl.classList.add('reveal'); subEl.textContent = originalSub; }
    if (descEl) { descEl.classList.add('reveal'); descEl.textContent = originalDesc; }
    socials.forEach((s) => s.classList.add('reveal'));
  }

  if (prefersReduced) {
    setInstant();
    return;
  }

  titleEl.textContent = '';
  titleEl.classList.add('typing');

  function typeText(el, text, speed = 60) {
    return new Promise((resolve) => {
      let i = 0;
      const t = setInterval(() => {
        el.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
          clearInterval(t);
          resolve();
        }
      }, speed + Math.floor(Math.random() * 20) - 8);
    });
  }

  (async function run() {
    await typeText(titleEl, originalTitle, 55);
    titleEl.classList.remove('typing');

    if (subEl) {
      subEl.textContent = '';
      subEl.classList.add('reveal');
      await typeText(subEl, originalSub, 28);
    }

    /* La descripción aparece con fade-in en lugar de tipeo
       para no hacer esperar demasiado al recruiter */
    if (descEl) {
      descEl.classList.add('reveal');
    }

    socials.forEach((s, idx) => {
      setTimeout(() => s.classList.add('reveal'), idx * 110);
    });
  })();
})();
