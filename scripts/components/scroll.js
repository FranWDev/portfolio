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