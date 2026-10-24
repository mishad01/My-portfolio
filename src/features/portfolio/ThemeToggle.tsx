import { useEffect, useState } from 'react';

/** Flips <html data-theme>. The choice is stored unless the URL forced a theme (?theme=). */
export function ThemeToggle({ label }: { label: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === 'dark'), []);
  const toggle = () => {
    const v = !dark;
    setDark(v);
    const root = document.documentElement;
    root.dataset.theme = v ? 'dark' : 'light';
    if (!root.dataset.forced) try { localStorage.setItem('pfDark', v ? '1' : '0'); } catch {}
  };
  return (
    <button type="button" onClick={toggle} aria-label={label} className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-highest">
      <span className="ms">{dark ? 'light_mode' : 'dark_mode'}</span>
    </button>
  );
}

export default ThemeToggle;
