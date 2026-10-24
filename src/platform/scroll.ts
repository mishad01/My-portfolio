const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth-scroll so the element sits `offset` px below the viewport top. */
export function scrollToId(id: string, offset = 100) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: reduced() ? 'auto' : 'smooth' });
}
