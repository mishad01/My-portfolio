/** Send returning visitors to their saved language — once per session, never inside a frame. */
const langs = ['en', 'bn', 'de'];
try {
  if (window.parent === window && !/^\/(admin|canvas)\//.test(location.pathname) && !sessionStorage.getItem('pfSeen')) {
    sessionStorage.setItem('pfSeen', '1');
    const saved = localStorage.getItem('pfLang');
    const cur = document.documentElement.lang;
    if (saved && langs.includes(saved) && saved !== cur) {
      const rest = location.pathname.replace(/^\/(bn|de)(?=\/)/, '');
      location.replace((saved === 'en' ? '' : `/${saved}`) + rest + location.search + location.hash);
    }
  }
} catch {}
