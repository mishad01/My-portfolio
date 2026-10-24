import { cx } from './classes';
import { Icon } from './Icon';

/** M3 switch with label and supporting text; the whole row toggles. */
export function Switch({ checked, onChange, label, supporting }: { checked: boolean; onChange: (v: boolean) => void; label: string; supporting?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent px-1 py-3 text-left text-on-surface">
      <div className="flex flex-1 flex-col">
        <span className="font-medium">{label}</span>
        {supporting && <span className="text-sm text-on-surface-variant">{supporting}</span>}
      </div>
      <div className={cx('relative box-border h-8 w-[52px] flex-none rounded-2xl border-2 transition-colors duration-200', checked ? 'border-primary bg-primary' : 'border-outline bg-surface-highest')}>
        <div
          className={cx('absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full text-on-primary-container transition-all duration-200', checked ? 'bg-on-primary' : 'bg-outline')}
          style={{ left: checked ? 22 : 6, width: checked ? 24 : 16, height: checked ? 24 : 16 }}
        >
          {checked && <Icon name="check" size={16} className="font-bold" />}
        </div>
      </div>
    </button>
  );
}
