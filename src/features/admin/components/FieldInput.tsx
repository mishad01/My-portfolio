import { FilterChip, Icon, TextField, cx } from '@/ui';
import type { Field } from '../schema';

interface Props { f: Field; value: any; onChange: (v: any) => void; onUpload: (file: File) => void; uploading: boolean }

/** Renders one schema field with the matching design-system control. */
export function FieldInput({ f, value: v, onChange, onUpload, uploading }: Props) {
  const upload = (file?: File) => file && onUpload(file);
  switch (f.type) {
    case 'text':
    case 'tags':
      return <TextField label={f.label + (f.type === 'tags' ? ' · comma-separated' : '')} value={v ?? ''} placeholder={f.hint} onChange={onChange} />;
    case 'area':
    case 'lines':
      return <TextField multiline rows={f.type === 'lines' ? 4 : 3} label={f.label + (f.type === 'lines' ? ' · one per line' : '')} value={v ?? ''} onChange={onChange} />;
    case 'select':
      return (
        <div className="flex flex-col gap-1.5">
          <span className="pl-1 text-xs text-on-surface-variant">{f.label}</span>
          <div className="flex flex-wrap gap-2">
            {f.options!.map((o) => (
              <FilterChip key={o} selected={v === o} onClick={() => onChange(o)}>
                {f.k === 'icon' ? <Icon name={o} size={18} /> : o}
              </FilterChip>
            ))}
          </div>
        </div>
      );
    case 'file':
      return (
        <div className="flex flex-col gap-1.5">
          <TextField label={f.label + ' · path or uploaded URL'} value={v ?? ''} onChange={onChange} />
          <label className="flex h-8 cursor-pointer items-center gap-1.5 self-start rounded-lg px-3 text-[13px] font-medium text-primary hover:bg-surface-mid">
            <Icon name="upload_file" size={18} />{uploading ? 'Uploading…' : 'Upload file'}
            <input type="file" accept={f.accept} className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
        </div>
      );
  }
  // image / images
  const multi = f.type === 'images';
  const imgs: string[] = multi ? v || [] : v ? [v] : [];
  return (
    <div className="flex flex-col gap-1.5">
      <span className="pl-1 text-xs text-on-surface-variant">{f.label}</span>
      {multi && imgs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imgs.map((src, i) => (
            <div key={src + i} className={cx('relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-surface-highest bg-cover bg-center font-mono text-[10px] text-on-surface-variant', !src && 'stripes')} style={src ? { backgroundImage: `url(${src})` } : undefined}>
              {!src && 'placeholder'}
              <button type="button" aria-label="Remove image" onClick={() => onChange(imgs.filter((_, j) => j !== i))} className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border-0 bg-surface text-error"><Icon name="close" size={16} /></button>
            </div>
          ))}
        </div>
      )}
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files?.[0]); }}
        className="relative flex h-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-[20px] border-2 border-dashed border-outline bg-cover bg-center text-on-surface-variant hover:bg-surface-mid"
        style={!multi && v ? { backgroundImage: `url(${v})` } : undefined}
      >
        {(multi || !v) && (
          <>
            <Icon name={uploading ? 'hourglass_top' : 'upload'} size={32} />
            <span className="text-sm">{uploading ? 'Uploading…' : 'Drop an image or click to browse'}</span>
          </>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      </label>
      {!multi && v && (
        <button type="button" onClick={() => onChange('')} className="flex h-8 items-center gap-1.5 self-start rounded-lg border-0 bg-transparent px-3 text-[13px] font-medium text-error">
          <Icon name="delete" size={18} />Remove image
        </button>
      )}
    </div>
  );
}
