import { Icon, IconButton, cx } from '@/ui';

interface Props {
  urls: string[];
  onChange: (urls: string[]) => void;
  /** Called with every file picked or dropped (several at once). */
  onUpload: (files: File[]) => void;
  uploading: boolean;
  /** Compact = one image only (single image fields). */
  single?: boolean;
}

/** Ordered photo list: thumbnails with move/remove, and a multi-file drop zone. */
export function PhotoListEditor({ urls, onChange, onUpload, uploading, single = false }: Props) {
  const files = (list: FileList | null | undefined) => {
    const picked = Array.from(list ?? []).filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
    if (picked.length) onUpload(single ? picked.slice(0, 1) : picked);
  };
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= urls.length) return;
    const a = [...urls];
    [a[i], a[j]] = [a[j], a[i]];
    onChange(a);
  };
  return (
    <div className="flex flex-col gap-2">
      {urls.length > 0 && (
        <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
          {urls.map((src, i) => (
            <li key={src + i} className={cx('relative h-24 w-24 overflow-hidden rounded-xl bg-surface-highest bg-cover bg-center', !src && 'stripes')} style={src ? { backgroundImage: `url(${src})` } : undefined}>
              {!single && <span className="absolute top-1 left-1 rounded-md bg-surface/90 px-1.5 text-[11px] font-medium text-on-surface">{i + 1}</span>}
              <div className="absolute inset-x-1 bottom-1 flex justify-between gap-0.5 rounded-full bg-surface/90">
                {!single && <IconButton icon="chevron_left" label="Move earlier" onClick={() => move(i, -1)} disabled={i === 0} className="!h-7 !w-7 disabled:opacity-30" />}
                <IconButton icon="close" label="Remove photo" onClick={() => onChange(urls.filter((_, j) => j !== i))} className="!h-7 !w-7 !text-error" />
                {!single && <IconButton icon="chevron_right" label="Move later" onClick={() => move(i, 1)} disabled={i === urls.length - 1} className="!h-7 !w-7 disabled:opacity-30" />}
              </div>
            </li>
          ))}
        </ol>
      )}
      {(!single || urls.length === 0) && (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); files(e.dataTransfer.files); }}
          className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-[20px] border-2 border-dashed border-outline text-center text-on-surface-variant hover:bg-surface-mid"
        >
          <Icon name={uploading ? 'hourglass_top' : 'add_photo_alternate'} size={28} />
          <span className="text-sm">{uploading ? 'Uploading…' : single ? 'Drop an image or click to browse' : 'Drop photos or click to browse · several at once'}</span>
          <input type="file" accept="image/*,.heic,.heif" multiple={!single} className="hidden" onChange={(e) => { files(e.target.files); e.target.value = ''; }} />
        </label>
      )}
    </div>
  );
}
