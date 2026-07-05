/* tilt.js — IntersectionObserver para reveal + tilt 3D en cards */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── 1. REVEAL ON SCROLL ──────────────────────────────────────────────── */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.staggerDelay || 0);
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Esperamos a que termine la animación (700ms + delay) para limpiar el inline transition
        // de esta forma, las transiciones definidas en el CSS para :hover no son sobreescritas.
        setTimeout(() => {
          entry.target.style.transition = '';
        }, 750);
      }, delay);
      observer.unobserve(entry.target); /* solo una vez */
    }
  });
}, observerOptions);

/* Asigna stagger delay a cards dentro de un mismo grid/container */
function assignStagger(selector, delayStep = 100) {
  const groups = {};
  document.querySelectorAll(selector).forEach((el) => {
    const parentKey = el.parentElement ? el.parentElement.id || el.parentElement.className : 'root';
    if (!groups[parentKey]) groups[parentKey] = [];
    groups[parentKey].push(el);
  });
  Object.values(groups).forEach((group) => {
    group.forEach((el, idx) => {
      el.dataset.staggerDelay = idx * delayStep;
    });
  });
}

/* Elementos con reveal escalonado */
assignStagger('.project-card, .mod-card');
assignStagger('.metric-item', 80);
assignStagger('.flow-step', 70);

const revealSelectors = [
  '.timeline-content',
  '.skill-category',
  '.stat-card',
  '.project-card',
  '.mod-card',
  '.optimization-card',
  '.metric-item',
  '.flow-step',
].join(', ');

document.querySelectorAll(revealSelectors).forEach((el) => {
  if (!prefersReduced) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
  }
  observer.observe(el);
});

/* ─── 2. TILT 3D ON HOVER ──────────────────────────────────────────────── */
if (!prefersReduced) {
  document
    .querySelectorAll('.stat-card, .skill-category, .project-card, .mod-card')
    .forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 22;
        const rotateY = (centerX - x) / 22;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
      });
    });
}