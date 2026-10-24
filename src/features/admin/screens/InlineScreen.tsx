import type { Content, I18n, NowCard } from '@/domain/types';
import { Icon, cx, iconTile, text, tone } from '@/ui';
import { setEn } from '../schema';
import { collageStacks } from '@/domain/collage';
import { CollageEditor } from '../components/CollageEditor';
import type { AdminVM } from '../useAdmin';

const editable = 'rounded-lg border-0 bg-transparent p-0 outline-0 hover:shadow-[0_0_0_2px_var(--md-primary)] focus:shadow-[0_0_0_2px_var(--md-primary)]';
const today = () => new Date().toISOString().slice(0, 10);

/** A live-looking copy of the hero and Now cards where every text is an input. */
export function InlineScreen({ vm }: { vm: AdminVM }) {
  const c = vm.content!;
  const P = c.profile;
  const setProfile = (k: 'avail' | 'displayName' | 'heroRole' | 'heroPos', v: string) => vm.commit({ ...c, profile: { ...P, [k]: setEn(P[k] as I18n, v) } });
  const setNow = (n: NowCard, k: 'label' | 'text', v: string): void =>
    vm.commit({ ...c, now: c.now.map((x) => (x.id === n.id ? { ...x, [k]: setEn(x[k], v) } : x)), profile: { ...P, nowUpdated: today() } } as Content);
  return (
    <div className="flex flex-col gap-5">
      <div className={'flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium ' + tone.tertiary}>
        <Icon name="ads_click" />Click any text to edit it, or a photo tile to set its photos. Changes are saved as unpublished edits until you press Publish.
      </div>
      <div className="overflow-hidden rounded-[28px] border border-outline-variant bg-surface">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-10 px-10 py-12">
        <div className="flex flex-col items-start gap-5">
          <div className={'flex h-8 items-center gap-2 rounded-lg pr-3 pl-2 text-sm font-medium ' + tone.tertiary}>
            <Icon name="flight_takeoff" size={18} />
            <input aria-label="Availability badge" value={P.avail.en} onChange={(e) => setProfile('avail', e.target.value)} className="border-0 bg-transparent p-0 text-sm font-medium text-inherit outline-0" style={{ width: Math.max(120, P.avail.en.length * 8) }} />
          </div>
          <input aria-label="Display name" value={P.displayName.en} onChange={(e) => setProfile('displayName', e.target.value)} className={cx(editable, 'w-full rounded-xl h-display text-[clamp(48px,8vw,88px)] leading-none text-on-surface')} />
          <input aria-label="Role line" value={P.heroRole.en} onChange={(e) => setProfile('heroRole', e.target.value)} className={cx(editable, 'w-full text-lg font-medium text-primary')} />
          <textarea aria-label="Positioning sentence" rows={3} value={P.heroPos.en} onChange={(e) => setProfile('heroPos', e.target.value)} className={cx(editable, 'w-full max-w-[720px] resize-none text-[22px] leading-8 text-on-surface')} />
        </div>
        <CollageEditor
          stacks={collageStacks(P)}
          onChange={vm.setCollageSlot}
          onUpload={vm.uploadToCollage}
          uploadingSlot={(slot) => vm.busy === 'upload:collage_' + slot}
          positions={P.collagePos ?? {}}
          onPositionChange={vm.setCollagePos}
        />
        </div>
        <div className="flex flex-col gap-6 bg-surface-low p-10">
          <span className="h-display text-4xl leading-[44px]">Right now</span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {c.now.map((n) => (
              <div key={n.id} className="flex flex-col gap-3 rounded-[28px] bg-surface-high p-6 text-on-surface" style={{ opacity: n.status === 'draft' ? 0.55 : 1 }}>
                <div className={cx(iconTile, tone.primary)}><Icon name={n.icon} size={26} /></div>
                <input aria-label="Label" value={n.label.en} onChange={(e) => setNow(n, 'label', e.target.value)} className={cx(text.label, editable, 'w-full text-on-surface-variant')} />
                <textarea aria-label="Text" rows={3} value={n.text.en} onChange={(e) => setNow(n, 'text', e.target.value)} className={cx(editable, 'w-full resize-none text-lg leading-[26px] text-on-surface')} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
