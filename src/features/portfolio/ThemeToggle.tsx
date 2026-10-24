import { useEffect, useState } from 'react';
import { IconButton } from '@/ui';

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
  return <IconButton icon={dark ? 'light_mode' : 'dark_mode'} label={label} onClick={toggle} />;
}

export default ThemeToggle;
