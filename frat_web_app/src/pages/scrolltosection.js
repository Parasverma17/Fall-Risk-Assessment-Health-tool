// src/pages/scrolltosection.js
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  // If you use position: sticky for the navbar, this is usually enough:
  el.scrollIntoView({ behavior: "smooth", block: "start" });

  // If you need an extra offset (e.g., a fixed navbar), use:
  // const y = el.getBoundingClientRect().top + window.pageYOffset - 80; // 80px header
  // window.scrollTo({ top: y, behavior: "smooth" });
}
