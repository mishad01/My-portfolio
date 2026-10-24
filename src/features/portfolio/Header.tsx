import { useEffect, useState } from 'react';
import type { Lang } from '@/domain/types';
import { NAV_ICON, NAV_IDS } from '@/features/portfolio/icons';
import { scrollToId } from '@/platform/scroll';
import { IconButton } from '@/ui';
import { ThemeToggle } from './ThemeToggle';

type NavId = (typeof NAV_IDS)[number];

interface Props {
  lang: Lang;
  brand: string;
  nav: Record<NavId, string>;
  /** Same page in each language. */
  langHref: Record<Lang, string>;
  labels: { theme: string; menu: string; language: string; sections: string; signIn: string; admin: string };
}

const LANG_LABEL: [Lang, string][] = [['en', 'EN'], ['bn', 'বাং'], ['de', 'DE']];

export default function Header({ lang, brand, nav, langHref, labels }: Props) {
  const [active, setActive] = useState('');
  const [menu, setMenu] = useState(false);
  // Set by /admin/ while you're signed in there; only changes the label — the admin itself checks auth.
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => { try { setIsAdmin(localStorage.getItem('pfAdmin') === '1'); } catch {} }, []);

  useEffect(() => {
    const onScroll = () => {
      let a = '';
      NAV_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) a = id;
      });
      setActive(a);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    scrollToId(id, 100);
    history.replaceState(null, '', `#${id}`);
  };

  const items = NAV_IDS.map((id) => ({ id, label: nav[id], on: active === id }));

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface-mid">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 wide:px-6 wide:py-3">
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }}
          className="order-1 flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-on-surface no-underline hover:text-on-surface wide:flex-none"
        >
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary font-[Inter_Tight] text-xl font-bold tracking-[-.03em] text-on-primary">M</span>
          <span className="h-title text-xl leading-7 transition-opacity duration-200" style={{ opacity: active ? 1 : 0 }}>{brand}</span>
        </a>

        <nav aria-label={labels.sections} className="no-scrollbar order-2 hidden min-w-0 flex-1 justify-center gap-0.5 overflow-x-auto nav:flex">
          {items.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              aria-current={n.on ? 'true' : undefined}
              className={
                'flex h-9 flex-none items-center rounded-[18px] px-3.5 text-sm font-medium tracking-[.1px] no-underline transition-colors duration-200 hover:bg-surface-highest ' +
                (n.on ? 'bg-secondary-container text-on-secondary-container hover:text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface-variant')
              }
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="order-2 flex flex-none items-center gap-2">
          <div role="group" aria-label={labels.language} className="flex h-9 flex-none">
            {LANG_LABEL.map(([k, label], i) => {
              const on = k === lang;
              return (
                <a
                  key={k}
                  href={langHref[k]}
                  hrefLang={k}
                  aria-current={on ? 'true' : undefined}
                  onClick={() => { try { localStorage.setItem('pfLang', k); } catch {} }}
                  className={
                    '-ml-px box-border flex min-w-11 items-center justify-center border border-outline px-2.5 text-[13px] font-semibold tracking-[.3px] no-underline ' +
                    (i === 0 ? 'rounded-l-[18px] ' : i === 2 ? 'rounded-r-[18px] ' : '') +
                    (on ? 'bg-secondary-container text-on-secondary-container hover:text-on-secondary-container' : 'bg-transparent text-on-surface hover:text-on-surface')
                  }
                >
                  <span style={k === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14 } : undefined}>{label}</span>
                </a>
              );
            })}
          </div>
          <ThemeToggle label={labels.theme} />
          <a
            href="/admin/"
            rel="nofollow"
            title={isAdmin ? labels.admin : labels.signIn}
            aria-label={isAdmin ? labels.admin : labels.signIn}
            className="flex h-10 flex-none items-center justify-center gap-2 rounded-full text-sm xl:border xl:border-outline font-medium text-on-surface-variant no-underline hover:bg-surface-highest hover:text-on-surface-variant w-10 xl:w-auto xl:pr-4 xl:pl-3"
          >
            <span className="ms text-xl">{isAdmin ? 'admin_panel_settings' : 'login'}</span>
            <span className="hidden xl:inline">{isAdmin ? labels.admin : labels.signIn}</span>
          </a>
          <IconButton variant="tonal" icon={menu ? 'close' : 'menu'} label={labels.menu} aria-expanded={menu} onClick={() => setMenu(!menu)} className="nav:hidden" />
        </div>
      </div>

      {menu && (
        <div className="absolute top-full right-3 left-3 mt-1 flex flex-col rounded-[28px] bg-surface-high p-2 shadow-[0_8px_24px_rgba(0,0,0,.2)] nav:hidden">
          {items.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              className={
                'flex h-[52px] items-center gap-4 rounded-[26px] px-5 text-base font-medium no-underline ' +
                (n.on ? 'bg-secondary-container text-on-secondary-container hover:text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface-variant')
              }
            >
              <span className="ms text-[22px]">{NAV_ICON[n.id]}</span>
              {n.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
