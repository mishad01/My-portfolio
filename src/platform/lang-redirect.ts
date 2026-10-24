/** Send returning visitors to their saved language — once per session, never inside a frame. */
import { VISIBLE_LANGS } from '@/domain/types';

try {
  if (window.parent === window && !/^\/(admin|canvas)\//.test(location.pathname) && !sessionStorage.getItem('pfSeen')) {
    sessionStorage.setItem('pfSeen', '1');
    const saved = localStorage.getItem('pfLang');
    const cur = document.documentElement.lang;
    if (saved && (VISIBLE_LANGS as string[]).includes(saved) && saved !== cur) {
      // 'de' is hidden for now — see VISIBLE_LANGS in domain/types.ts.
      const rest = location.pathname.replace(/^\/(bn|de)(?=\/)/, '');
      location.replace((saved === 'en' ? '' : `/${saved}`) + rest + location.search + location.hash);
    }
  }
} catch {}
