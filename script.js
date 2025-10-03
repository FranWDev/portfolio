window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;

  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / scrollHeight) * 100;
  document.querySelector(".scroll-progress").style.width = progress + "%";

  const sections = document.querySelectorAll(".section");
  const navDots = document.querySelectorAll(".nav-dot");

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      navDots.forEach((dot) => dot.classList.remove("active"));
      navDots[index].classList.add("active");
    }
  });
});

document.querySelectorAll(".nav-dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    const sectionId = dot.dataset.section;
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
  });
});

const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".timeline-content, .project-card, .skill-category, .stat-card"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(el);
  });

document
  .querySelectorAll(".project-card, .stat-card, .skill-category")
  .forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });

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
      if (subEl) subEl.classList.add('reveal'), subEl.textContent = originalSub;
      if (descEl) descEl.classList.add('reveal'), descEl.textContent = originalDesc;
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
        }, speed + Math.floor(Math.random() * 30) - 10);
      });
    }

    (async function run() {
      await typeText(titleEl, originalTitle, 60);

      titleEl.classList.remove('typing');

      if (subEl) {
        subEl.textContent = '';
        subEl.classList.add('reveal');
        await typeText(subEl, originalSub, 35);
      }

      if (descEl) {
        descEl.textContent = '';
        descEl.classList.add('reveal');
        await typeText(descEl, originalDesc, 18);
      }

      socials.forEach((s, idx) => {
        setTimeout(() => s.classList.add('reveal'), idx * 110);
      });
    })();
  })();
