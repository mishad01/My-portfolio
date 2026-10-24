import { useState } from 'react';
import type { ListSection } from '@/domain/types';
import { Icon, IconButton, cx, filterChip, tone } from '@/ui';
import { subOf, titleOf } from '../schema';
import type { AdminVM } from '../useAdmin';

/** Reorderable list with draft/publish toggles. Drag state is view-local. */
export function ListScreen({ vm }: { vm: AdminVM }) {
  const [drag, setDrag] = useState<{ id: string | null; over: string | null }>({ id: null, over: null });
  const sec = vm.sec as ListSection;
  const items = vm.list as ({ id: string; status: string; icon?: string } & Record<string, any>)[];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex min-w-[220px] flex-1 items-center gap-2 text-on-surface-variant"><Icon name="drag_indicator" size={20} />Drag rows to reorder · tap a status to switch Draft / Published</span>
        {/* M3 extended FAB */}
        <button type="button" onClick={vm.addItem} className={'flex h-14 cursor-pointer items-center gap-3 rounded-2xl border-0 pr-6 pl-4 text-sm font-medium shadow-[0_2px_6px_rgba(0,0,0,.2)] hover:opacity-[.94] ' + tone.primary}>
          <Icon name="add" /><span>Add {vm.meta.one}</span>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((it) => {
          const pub = it.status === 'published';
          const over = drag.over === it.id && drag.id && drag.id !== it.id;
          const title = titleOf(sec, it);
          return (
            <div
              key={it.id}
              draggable
              onDragStart={(e) => { try { e.dataTransfer.setData('text/plain', it.id); } catch {} setDrag({ id: it.id, over: null }); }}
              onDragOver={(e) => { e.preventDefault(); if (drag.over !== it.id) setDrag((d) => ({ ...d, over: it.id })); }}
              onDrop={(e) => { e.preventDefault(); if (drag.id) vm.reorder(drag.id, it.id); setDrag({ id: null, over: null }); }}
              onDragEnd={() => setDrag({ id: null, over: null })}
              onKeyDown={(e) => { if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); vm.move(it.id, e.key === 'ArrowUp' ? -1 : 1); } }}
              className={cx('flex items-center gap-4 rounded-[20px] border-2 py-3 pr-4 pl-2', over ? 'border-primary bg-primary-container' : 'border-transparent bg-surface-low')}
              style={{ opacity: drag.id === it.id ? 0.4 : 1 }}
            >
              <span title="Drag (or Alt+↑/↓) to reorder" className="cursor-grab text-on-surface-variant"><Icon name="drag_indicator" /></span>
              <div className={'flex h-11 w-11 flex-none items-center justify-center rounded-[14px] ' + tone.secondary}><Icon name={sec === 'now' ? it.icon! : vm.meta.icon} /></div>
              <button type="button" onClick={() => vm.editItem(it.id)} className="flex min-w-0 flex-1 cursor-pointer flex-col border-0 bg-transparent p-0 text-left text-on-surface">
                <span className="overflow-hidden text-base font-medium text-ellipsis whitespace-nowrap">{title || '(untitled)'}</span>
                <span className="overflow-hidden text-sm text-ellipsis whitespace-nowrap text-on-surface-variant">{subOf(sec, it)}</span>
              </button>
              <button type="button" onClick={() => vm.toggleStatus(it.id)} className={cx(filterChip(pub), 'h-8 text-[13px]')}>
                <Icon name={pub ? 'public' : 'edit_off'} size={16} />{pub ? 'Published' : 'Draft'}
              </button>
              <IconButton icon="edit" label="Edit" onClick={() => vm.editItem(it.id)} />
              <button type="button" aria-label="Delete" title="Delete" onClick={() => vm.deleteItem(it.id, title)} className="flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-error hover:bg-error-container">
                <Icon name="delete" />
              </button>
            </div>
          );
        })}
        {items.length === 0 && <div className="rounded-3xl bg-surface-low p-12 text-center text-on-surface-variant">Nothing here yet. Add the first one.</div>}
      </div>
    </div>
  );
}
