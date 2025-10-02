// Parallax scrolling
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;

  // Actualizar barra de progreso
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / scrollHeight) * 100;
  document.querySelector(".scroll-progress").style.width = progress + "%";

  // Efecto parallax en backgrounds
  document.querySelectorAll(".parallax-bg").forEach((bg) => {
    const speed = bg.dataset.speed || 0.5;
    const yPos = -(scrolled * speed);
    bg.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });

  // Efecto parallax en elementos flotantes
  document.querySelectorAll(".floating-code").forEach((code) => {
    const speed = code.dataset.speed || 0.3;
    const rect = code.getBoundingClientRect();
    const yPos = scrolled * speed;
    code.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });

  // Actualizar navegación por puntos
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

// Click en navegación por puntos
document.querySelectorAll(".nav-dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    const sectionId = dot.dataset.section;
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
  });
});

// Intersection Observer para animaciones
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

// Animar elementos al entrar en viewport
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

// Efecto de mouse en elementos interactivos
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
