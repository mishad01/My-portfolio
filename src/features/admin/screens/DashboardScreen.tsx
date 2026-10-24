import { Button, Icon, tone } from '@/ui';
import { META } from '../schema';
import { type AdminVM, listOf } from '../useAdmin';

export function DashboardScreen({ vm }: { vm: AdminVM }) {
  const c = vm.content!;
  const loadBuiltIn = () => {
    if (confirm('Replace your whole draft with the built-in content? Your unpublished edits will be lost; the live site stays as it is until you Publish.')) vm.loadBuiltIn();
  };
  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={() => vm.go('inline')} className={'flex cursor-pointer flex-wrap items-center gap-5 rounded-[28px] border-0 p-7 text-left hover:opacity-95 ' + tone.primary}>
        <Icon name="edit_note" size={40} />
        <div className="flex min-w-[240px] flex-1 flex-col gap-1">
          <span className="h-title text-2xl leading-8">Edit on page</span>
          <span>Click any text on a live copy of the page — hero, name, Now cards — and type.</span>
        </div>
        <Icon name="arrow_forward" />
      </button>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {META.map((x) => {
          const a = listOf(c, x.k);
          const pub = a ? a.filter((i) => i.status === 'published').length : 1;
          const drafts = a ? a.length - pub : 0;
          return (
            <button key={x.k} type="button" onClick={() => vm.openSection(x.k)} className="flex cursor-pointer flex-col gap-4 rounded-3xl border-0 bg-surface-high p-5 text-left text-on-surface hover:bg-surface-highest">
              <div className="flex items-center gap-3">
                <div className={'flex h-11 w-11 items-center justify-center rounded-[14px] ' + tone.secondary}><Icon name={x.icon} /></div>
                <span className="text-base font-medium">{x.name}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="h-title text-4xl leading-10">{a ? a.length : 1}</span>
                <span className="text-[13px] text-on-surface-variant">{a ? `${pub} published${drafts ? ` · ${drafts} draft` : ''}` : 'single record'}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-outline-variant p-5">
        <Icon name="restore_page" className="text-on-surface-variant" />
        <div className="flex min-w-[240px] flex-1 flex-col">
          <span className="font-medium">Load content from code</span>
          <span className="text-sm text-on-surface-variant">Replace your draft with the content built into the site (from your CV). Nothing goes live until you press Publish.</span>
        </div>
        <Button variant="outlined" size="md" onClick={loadBuiltIn}>Load into draft</Button>
      </div>
    </div>
  );
}
