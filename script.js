const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Footer year
(() => {
  const yearEl = $("#year");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
})();

// Mobile nav toggle
(() => {
  const header = $(".site-header");
  const toggle = $(".nav-toggle");
  const navLinks = $$(".nav a");
  if (!header || !toggle) return;

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    header.classList.toggle("nav-open", expanded);
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!expanded);
  });

  navLinks.forEach((a) => {
    a.addEventListener("click", () => setExpanded(false));
  });
})();

// Smooth scroll for in-page links + active link highlighting
(() => {
  const header = $(".site-header");
  const links = $$(".nav a[href^='#']");
  const sections = $$("section[id]");
  if (!links.length || !sections.length) return;

  // Smooth scrolling (respects reduced-motion via CSS media query)
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY;
      const headerOffset = header ? header.getBoundingClientRect().height : 0;
      window.scrollTo({
        top: Math.max(0, y - headerOffset - 12),
        behavior: "smooth",
      });
    });
  });

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
      if (!visible?.target) return;
      setActive(visible.target.id);
    },
    { root: null, threshold: [0.15, 0.35, 0.6], rootMargin: "-20% 0px -65% 0px" }
  );

  sections.forEach((sec) => io.observe(sec));
})();

