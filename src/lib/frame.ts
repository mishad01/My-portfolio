/**
 * When a page is shown inside the /canvas/ review board: report its full height
 * so the frame can grow to fit, and hand wheel gestures to the canvas for
 * pan/zoom. Pages with their own scrolling (data-frame="app") only hand over
 * pinch/ctrl-zoom.
 */
if (window.parent !== window) {
  const root = document.documentElement;
  const app = root.dataset.frame === 'app';
  let last = 0;
  const report = () => {
    const h = Math.ceil(document.body.scrollHeight);
    if (h !== last) { last = h; window.parent.postMessage({ pfHeight: h }, location.origin); }
  };
  if (!app) {
    new ResizeObserver(report).observe(document.body);
    report();
  }
  window.addEventListener(
    'wheel',
    (e) => {
      if (app && !e.ctrlKey) return;
      e.preventDefault();
      window.parent.postMessage({ pfWheel: { dx: e.deltaX, dy: e.deltaY, ctrl: e.ctrlKey || e.metaKey, x: e.clientX, y: e.clientY } }, location.origin);
    },
    { passive: false },
  );
}
