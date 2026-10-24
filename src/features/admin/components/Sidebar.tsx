import type { Section } from '@/domain/types';
import { Icon, cx, text } from '@/ui';
import { META } from '../schema';
import { type AdminVM, listOf } from '../useAdmin';
import { BrandMark } from './BrandMark';

const item = 'flex cursor-pointer items-center gap-3 border-0 px-4 text-left text-sm font-medium no-underline';
const state = (on: boolean) => (on ? 'bg-secondary-container text-on-secondary-container hover:text-on-secondary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-highest hover:text-on-surface-variant');

/** M3 navigation drawer: standard on large screens, modal below lg. */
export function Sidebar({ vm }: { vm: AdminVM }) {
  const c = vm.content!;
  const inSection = (k: Section) => (vm.screen === 'list' || vm.screen === 'edit') && vm.sec === k;
  return (
    <>
      <aside className={cx('box-border h-screen w-[280px] flex-none flex-col gap-1 overflow-y-auto bg-surface-low px-3 py-5', vm.menuOpen ? 'fixed inset-y-0 left-0 z-40 flex shadow-xl' : 'sticky top-0 hidden lg:flex')}>
        <div className="flex items-center gap-3 px-4 pb-4">
          <BrandMark />
          <div className="flex flex-col">
            <span className="h-title text-lg leading-[22px]">Portfolio</span>
            <span className="text-xs text-on-surface-variant">Admin{vm.demo ? ' · demo' : ''}</span>
          </div>
        </div>
        {([['dashboard', 'Dashboard', 'dashboard'], ['inline', 'Edit on page', 'edit_note']] as const).map(([id, label, icon]) => (
          <button key={id} type="button" onClick={() => vm.go(id)} className={cx(item, 'h-14 rounded-[28px]', state(vm.screen === id))}>
            <Icon name={icon} />{label}
          </button>
        ))}
        <span className={cx(text.label, 'px-4 pt-5 pb-2 text-on-surface-variant')}>Content</span>
        {META.map((x) => {
          const drafts = listOf(c, x.k)?.filter((i) => i.status === 'draft').length ?? 0;
          return (
            <button key={x.k} type="button" onClick={() => vm.openSection(x.k)} className={cx(item, 'h-12 rounded-3xl', state(inSection(x.k)))}>
              <Icon name={x.icon} size={22} />
              <span className="flex-1">{x.name}</span>
              {drafts > 0 && <span className="text-xs opacity-80">{drafts} draft</span>}
            </button>
          );
        })}
        <div className="flex-1" />
        <a href="/" target="_blank" rel="noopener" className={cx(item, 'h-12 rounded-3xl', state(false))}><Icon name="open_in_new" size={22} />View site</a>
        <button type="button" onClick={vm.signOut} className={cx(item, 'h-12 rounded-3xl', state(false))}><Icon name="logout" size={22} />Sign out</button>
      </aside>
      {vm.menuOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => vm.setMenuOpen(false)} />}
    </>
  );
}
