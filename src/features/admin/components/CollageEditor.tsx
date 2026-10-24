import { useEffect, useState } from 'react';
import { COLLAGE_ROWS, type CollageStacks } from '@/domain/collage';
import type { CollageSlot } from '@/domain/types';
import { Button, Icon, IconButton, cx, text } from '@/ui';
import { COLLAGE_LABEL } from '../schema';
import { FocalPointPicker } from './FocalPointPicker';
import { PhotoListEditor } from './PhotoListEditor';

interface Props {
  stacks: CollageStacks;
  onChange: (slot: CollageSlot, urls: string[]) => void;
  onUpload: (slot: CollageSlot, files: File[]) => void;
  uploadingSlot: (slot: CollageSlot) => boolean;
  positions: Record<string, string>;
  onPositionChange: (src: string, pos: string) => void;
}

const imageFiles = (list?: FileList | null) => Array.from(list ?? []).filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
/** slot → tile height classes, so the focal-point preview matches the live tile's crop. */
const TILE_H = Object.fromEntries(COLLAGE_ROWS.flat().map(({ slot, h }) => [slot, h])) as Record<CollageSlot, string>;

/**
 * The hero collage as on the site, editable: click a tile to manage its photos
 * (add several, reorder, remove), or drop photos straight onto a tile.
 */
export function CollageEditor({ stacks, onChange, onUpload, uploadingSlot, positions, onPositionChange }: Props) {
  const [open, setOpen] = useState<CollageSlot | null>(null);
  const [over, setOver] = useState<CollageSlot | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  useEffect(() => { setActive(0); }, [open]);
  const openLen = open ? stacks[open].length : 0;
  useEffect(() => { if (active >= openLen) setActive(0); }, [openLen, active]);

  return (
    <>
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-4">
        {COLLAGE_ROWS.map((row, r) => (
          <div key={r} className="flex items-end gap-4">
            {row.map(({ slot, grow, h }) => {
              const urls = stacks[slot];
              const busy = uploadingSlot(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setOpen(slot)}
                  onDragOver={(e) => { e.preventDefault(); setOver(slot); }}
                  onDragLeave={() => setOver(null)}
                  onDrop={(e) => { e.preventDefault(); setOver(null); const f = imageFiles(e.dataTransfer.files); if (f.length) onUpload(slot, f); }}
                  aria-label={`${COLLAGE_LABEL[slot]} photos: ${urls.length}. Edit`}
                  className={cx(
                    'relative box-border flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-[20px] border border-dashed bg-surface-highest bg-cover p-3 text-center text-on-surface-variant shadow-[0_2px_10px_rgba(0,0,0,.08)] transition-shadow hover:shadow-[0_0_0_2px_var(--md-primary)]',
                    over === slot ? 'border-primary shadow-[0_0_0_2px_var(--md-primary)]' : 'border-outline',
                    h,
                  )}
                  style={{ flex: `${grow} 1 0`, ...(urls[0] ? { backgroundImage: `url(${urls[0]})`, backgroundPosition: positions[urls[0]] ?? '50% 50%' } : {}) }}
                >
                  {urls.length > 0 ? (
                    <span className="absolute right-2 bottom-2 flex h-7 items-center gap-1 rounded-full bg-surface/95 px-2.5 text-xs font-medium text-on-surface">
                      <Icon name="photo_library" size={16} />{urls.length}
                    </span>
                  ) : (
                    <>
                      <Icon name={busy ? 'hourglass_top' : 'image'} size={22} />
                      <span className="text-[13px] leading-[18px] font-medium text-on-surface">{COLLAGE_LABEL[slot]}</span>
                      <span className="text-xs">or <span className="underline">browse files</span></span>
                    </>
                  )}
                  {busy && urls.length > 0 && <span className="absolute top-2 left-2 rounded-full bg-surface/95 px-2 py-0.5 text-[11px] text-on-surface">Uploading…</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${COLLAGE_LABEL[open]} photos`} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(null)} />
          <div className="relative flex max-h-[85vh] w-full max-w-[560px] flex-col gap-4 overflow-y-auto rounded-[28px] bg-surface-high p-6 text-on-surface shadow-[0_12px_32px_rgba(0,0,0,.25)]">
            <div className="flex items-start gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <span className={cx(text.label, 'text-on-surface-variant')}>Hero collage</span>
                <h2 className="m-0 h-title text-2xl leading-8">{COLLAGE_LABEL[open]} photos</h2>
                <span className="text-sm text-on-surface-variant">Add as many as you like. With more than one, this tile rotates through them in this order.</span>
              </div>
              <IconButton icon="close" label="Close" onClick={() => setOpen(null)} />
            </div>
            <PhotoListEditor urls={stacks[open]} uploading={uploadingSlot(open)} onUpload={(files) => onUpload(open, files)} onChange={(urls) => onChange(open, urls)} />

            {stacks[open].length > 0 && (
              <div className="flex flex-col gap-3 border-t border-outline-variant pt-4">
                <span className={cx(text.label, 'text-on-surface-variant')}>
                  Focal point{stacks[open].length > 1 ? ` — photo ${active + 1} of ${stacks[open].length}` : ''}
                </span>
                {stacks[open].length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {stacks[open].map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`Set focal point for photo ${i + 1}`}
                        aria-current={i === active ? 'true' : undefined}
                        className={cx('h-14 w-14 flex-none overflow-hidden rounded-lg border-2 bg-cover', i === active ? 'border-primary' : 'border-transparent')}
                        style={{ backgroundImage: `url(${src})`, backgroundPosition: positions[src] ?? '50% 50%' }}
                      />
                    ))}
                  </div>
                )}
                <FocalPointPicker
                  key={stacks[open][active]}
                  src={stacks[open][active]}
                  pos={positions[stacks[open][active]] ?? '50% 50%'}
                  onChange={(pos) => onPositionChange(stacks[open][active], pos)}
                  h={TILE_H[open]}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button size="md" onClick={() => setOpen(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
