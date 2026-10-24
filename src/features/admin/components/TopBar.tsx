import { Button, Icon, IconButton, cx, tone } from '@/ui';
import type { AdminVM } from '../useAdmin';

/** M3 top app bar: title, publish status, theme, Publish. */
export function TopBar({ vm, title }: { vm: AdminVM; title: string }) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center gap-4 bg-surface px-4 py-4 sm:px-8">
      <IconButton icon="menu" label="Menu" onClick={() => vm.setMenuOpen(true)} className="lg:hidden" />
      {vm.screen !== 'dashboard' && <IconButton icon="arrow_back" label="Back" onClick={vm.back} />}
      <h1 className="m-0 min-w-[200px] flex-1 h-title text-[28px] leading-9">{title}</h1>
      <div className={cx('flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium', vm.changed ? tone.tertiary : tone.secondary)}>
        <Icon name={vm.changed ? 'pending' : 'check_circle'} size={18} />
        {vm.changed ? 'Unpublished changes' : 'All changes published'}
      </div>
      <IconButton icon={vm.dark ? 'light_mode' : 'dark_mode'} label="Theme" onClick={vm.toggleDark} />
      <Button size="md" icon="rocket_launch" onClick={vm.publish} disabled={!vm.changed || !!vm.busy}>
        {vm.busy === 'publish' ? 'Publishing…' : 'Publish'}
      </Button>
    </header>
  );
}
