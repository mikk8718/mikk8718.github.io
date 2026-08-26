document.addEventListener("DOMContentLoaded", () => {
  const sections = [...document.querySelectorAll("[data-rail-section]")];
  const markers = [...document.querySelectorAll("[data-section-marker]")];
  if (!sections.length || !markers.length) return;

  let ticking = false;
  const updateActiveSection = () => {
    const checkpoint = scrollY + innerHeight * 0.48;
    const atEnd = scrollY >= document.documentElement.scrollHeight - innerHeight - 140;
    const activeId = atEnd
      ? sections.at(-1).id
      : sections.filter((section) => section.offsetTop <= checkpoint).at(-1)?.id ?? sections[0].id;

    markers.forEach((marker) => {
      if (marker.dataset.sectionMarker === activeId) marker.setAttribute("aria-current", "true");
      else marker.removeAttribute("aria-current");
    });
    ticking = false;
  };

  const queueUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateActiveSection);
  };

  updateActiveSection();
  addEventListener("scroll", queueUpdate, { passive: true });
  addEventListener("resize", queueUpdate);
});
