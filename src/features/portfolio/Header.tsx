import { useEffect, useMemo, useState } from 'react';
import type { Lang } from '@/domain/types';
import { VISIBLE_LANGS } from '@/domain/types';
import { NAV_ICON, NAV_IDS } from '@/features/portfolio/icons';
import { scrollToId } from '@/platform/scroll';
import { toggleTheme } from '@/platform/theme';
import { Icon, IconButton, cx } from '@/ui';
import { type Command, CommandPalette } from './CommandPalette';
import { ScrollProgressLogo } from './ScrollProgressLogo';
import { ThemeToggle } from './ThemeToggle';

type NavId = (typeof NAV_IDS)[number];
type Page = 'experience' | 'projects' | 'research' | 'teaching';

interface Props {
  lang: Lang;
  brand: string;
  nav: Record<NavId, string>;
  /** Same page in each language. */
  langHref: Record<Lang, string>;
  /** Full pages, language-prefixed. */
  pageHref: Record<Page, string>;
  labels: {
    theme: string; menu: string; language: string; sections: string; admin: string;
    jumpTo: string; jumpPlaceholder: string; noResults: string; groupSections: string; groupPages: string; groupSettings: string;
    allExperience: string; allProjects: string; allResearch: string; allClasses: string; switchTheme: string;
  };
}

// 'de' is hidden for now — see VISIBLE_LANGS in domain/types.ts to bring it back.
const LANG_LABEL: [Lang, string][] = ([['en', 'EN'], ['bn', 'বাং'], ['de', 'DE']] as [Lang, string][])
  .filter(([k]) => VISIBLE_LANGS.includes(k));
/** "Now" sits right under the hero, so the bar starts at Experience; the menu and palette list everything. */
const BAR_IDS = NAV_IDS.filter((id) => id !== 'now');

export default function Header({ lang, brand, nav, langHref, pageHref, labels: L }: Props) {
  const [active, setActive] = useState('');
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onScroll = () => {
      let a = '';
      NAV_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) a = id;
      });
      setActive(a);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); };
  }, []);

  const jump = (id: string) => {
    setMenu(false);
    scrollToId(id, 100);
    history.replaceState(null, '', `#${id}`);
  };
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); jump(id); };

  const commands = useMemo<Command[]>(() => [
    ...NAV_IDS.map((id) => ({ id: `s-${id}`, group: L.groupSections, label: nav[id], icon: NAV_ICON[id], run: () => jump(id) })),
    { id: 'p-exp', group: L.groupPages, label: L.allExperience, icon: 'work_history', href: pageHref.experience },
    { id: 'p-proj', group: L.groupPages, label: L.allProjects, icon: 'apps', href: pageHref.projects },
    { id: 'p-res', group: L.groupPages, label: L.allResearch, icon: 'science', href: pageHref.research },
    { id: 'p-cls', group: L.groupPages, label: L.allClasses, icon: 'school', href: pageHref.teaching },
    { id: 'x-theme', group: L.groupSettings, label: L.switchTheme, icon: 'contrast', run: toggleTheme },
    ...LANG_LABEL.filter(([k]) => k !== lang).map(([k, label]) => ({
      id: `x-lang-${k}`, group: L.groupSettings, label: `${L.language}: ${label}`, icon: 'translate', href: langHref[k],
      run: () => { try { localStorage.setItem('pfLang', k); } catch {} location.href = langHref[k]; },
    })),
    { id: 'x-admin', group: L.groupSettings, label: L.admin, icon: 'admin_panel_settings', href: '/admin/' },
  ], [lang]);

  const navLink = (on: boolean) =>
    cx('flex h-9 flex-none items-center rounded-[18px] px-3 text-sm font-medium tracking-[.1px] no-underline transition-colors duration-200 hover:bg-surface-highest',
      on ? 'bg-secondary-container text-on-secondary-container hover:text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface-variant');

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 wide:px-6">
      {/* Floating M3 app bar */}
      <div className="relative mx-auto flex max-w-[1120px] items-center gap-3 rounded-[28px] border border-outline-variant bg-surface-mid/90 py-2 pr-2 pl-2 shadow-[0_4px_18px_rgba(0,0,0,.08)] backdrop-blur-md wide:pl-3">
        <div className="flex min-w-0 flex-1 nav:flex-none">
          <ScrollProgressLogo label={brand} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }} />
        </div>

        <nav aria-label={L.sections} className="no-scrollbar hidden min-w-0 flex-1 justify-center-safe gap-0.5 overflow-x-auto nav:flex">
          {BAR_IDS.map((id) => (
            <a key={id} href={`#${id}`} onClick={go(id)} aria-current={active === id ? 'true' : undefined} className={navLink(active === id)}>{nav[id]}</a>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={() => setPalette(true)}
            aria-label={L.jumpTo}
            className="flex h-10 flex-none cursor-pointer items-center gap-2 rounded-[20px] border border-outline-variant bg-surface px-2.5 text-sm text-on-surface-variant hover:bg-surface-highest wide:px-3"
          >
            <Icon name="search" size={20} />
            <span className="hidden xl:inline">{L.jumpTo}</span>
            <kbd className="hidden rounded-md bg-surface-highest px-1.5 py-0.5 font-body text-[11px] font-medium text-on-surface-variant wide:inline">{mac ? '⌘' : 'Ctrl'} K</kbd>
          </button>

          <div role="group" aria-label={L.language} className="hidden h-9 flex-none wide:flex">
            {LANG_LABEL.map(([k, label], i) => {
              const on = k === lang;
              return (
                <a
                  key={k}
                  href={langHref[k]}
                  hrefLang={k}
                  aria-current={on ? 'true' : undefined}
                  onClick={() => { try { localStorage.setItem('pfLang', k); } catch {} }}
                  className={cx(
                    '-ml-px box-border flex min-w-11 items-center justify-center border border-outline px-2.5 text-[13px] font-semibold tracking-[.3px] no-underline',
                    i === 0 && 'rounded-l-[18px]', i === LANG_LABEL.length - 1 && 'rounded-r-[18px]',
                    on ? 'bg-secondary-container text-on-secondary-container hover:text-on-secondary-container' : 'bg-transparent text-on-surface hover:text-on-surface',
                  )}
                >
                  <span style={k === 'bn' ? { fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14 } : undefined}>{label}</span>
                </a>
              );
            })}
          </div>

          <ThemeToggle label={L.theme} />

          <a
            href="/admin/"
            rel="nofollow"
            aria-label={L.admin}
            title={L.admin}
            className="flex h-10 w-10 flex-none items-center justify-center gap-2 rounded-[20px] text-sm font-medium text-on-surface no-underline hover:bg-surface-highest hover:text-on-surface wide:w-auto wide:border wide:border-outline wide:pr-4 wide:pl-3"
          >
            <Icon name="admin_panel_settings" size={20} />
            <span className="hidden wide:inline">{L.admin}</span>
          </a>

          <IconButton variant="tonal" icon={menu ? 'close' : 'menu'} label={L.menu} aria-expanded={menu} onClick={() => setMenu(!menu)} className="nav:hidden" />
        </div>

        {menu && (
          <div className="absolute top-full right-0 left-0 mt-2 flex flex-col rounded-[28px] bg-surface-high p-2 shadow-[0_8px_24px_rgba(0,0,0,.2)] nav:hidden">
            {NAV_IDS.map((id) => (
              <a key={id} href={`#${id}`} onClick={go(id)} className={cx('flex h-[52px] items-center gap-4 rounded-[26px] px-5 text-base font-medium no-underline', active === id ? 'bg-secondary-container text-on-secondary-container hover:text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface-variant')}>
                <Icon name={NAV_ICON[id]} size={22} />{nav[id]}
              </a>
            ))}
            <div role="group" aria-label={L.language} className="flex gap-2 px-3 pt-2 pb-1 wide:hidden">
              {LANG_LABEL.map(([k, label]) => (
                <a key={k} href={langHref[k]} hrefLang={k} onClick={() => { try { localStorage.setItem('pfLang', k); } catch {} }} className={cx('flex h-9 flex-1 items-center justify-center rounded-[18px] border text-[13px] font-semibold no-underline', k === lang ? 'border-transparent bg-secondary-container text-on-secondary-container' : 'border-outline text-on-surface hover:text-on-surface')}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <CommandPalette open={palette} onClose={() => setPalette(false)} commands={commands} labels={{ placeholder: L.jumpPlaceholder, noResults: L.noResults }} />
    </header>
  );
}
