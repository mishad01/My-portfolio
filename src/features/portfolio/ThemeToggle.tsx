import { useEffect, useState } from 'react';
import { isDark, toggleTheme } from '@/platform/theme';
import { IconButton } from '@/ui';

export function ThemeToggle({ label }: { label: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(isDark());
    const sync = () => setDark(isDark());
    window.addEventListener('pf-theme', sync);
    return () => window.removeEventListener('pf-theme', sync);
  }, []);
  return <IconButton icon={dark ? 'light_mode' : 'dark_mode'} label={label} onClick={toggleTheme} />;
}

export default ThemeToggle;
