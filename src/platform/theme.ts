/** Light/dark on <html data-theme>. Stored unless the URL forced a theme (?theme=). Emits `pf-theme`. */
export const isDark = () => document.documentElement.dataset.theme === 'dark';

export function setTheme(dark: boolean) {
  const root = document.documentElement;
  root.dataset.theme = dark ? 'dark' : 'light';
  if (!root.dataset.forced) try { localStorage.setItem('pfDark', dark ? '1' : '0'); } catch {}
  window.dispatchEvent(new CustomEvent('pf-theme', { detail: dark }));
}

export const toggleTheme = () => setTheme(!isDark());
