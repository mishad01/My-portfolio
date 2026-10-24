import { Snackbar } from '@/ui';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardScreen } from './screens/DashboardScreen';
import { EditScreen } from './screens/EditScreen';
import { InlineScreen } from './screens/InlineScreen';
import { ListScreen } from './screens/ListScreen';
import { LoginScreen } from './screens/LoginScreen';
import { type Screen, useAdmin } from './useAdmin';

/** Admin shell: picks the screen for the view-model's state. */
export default function Admin() {
  const vm = useAdmin();

  if (vm.auth === 'loading' || !vm.backend) {
    return <div className="flex min-h-screen items-center justify-center text-on-surface-variant">{vm.backend ? 'Loading your content…' : 'Loading…'}</div>;
  }
  if (vm.auth === 'out' || !vm.content || vm.screen === 'login') return <LoginScreen vm={vm} />;

  const m = vm.meta;
  const titles: Record<Screen, string> = { login: '', dashboard: 'Dashboard', inline: 'Edit on page', list: m.name, edit: m.single ? m.name : vm.form?.id ? `Edit ${m.one}` : `New ${m.one}` };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar vm={vm} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar vm={vm} title={titles[vm.screen]} />
        <main className="flex flex-col gap-6 px-4 pt-2 pb-[120px] sm:px-8">
          {vm.screen === 'dashboard' && <DashboardScreen vm={vm} />}
          {vm.screen === 'list' && <ListScreen vm={vm} />}
          {vm.screen === 'edit' && vm.form && <EditScreen vm={vm} />}
          {vm.screen === 'inline' && <InlineScreen vm={vm} />}
        </main>
      </div>
      {vm.snack && <Snackbar message={vm.snack.message} action={vm.snack.undo && vm.deleted ? { label: 'Undo', onClick: vm.undoDelete } : undefined} />}
    </div>
  );
}
