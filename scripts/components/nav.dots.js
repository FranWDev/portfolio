document.querySelectorAll(".nav-dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    const sectionId = dot.dataset.section;
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
  });
});
