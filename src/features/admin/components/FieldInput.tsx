import { FilterChip, Icon, TextField } from '@/ui';
import { PhotoListEditor } from './PhotoListEditor';
import type { Field } from '../schema';

interface Props { f: Field; value: any; onChange: (v: any) => void; onUpload: (files: File[]) => void; uploading: boolean }

/** Renders one schema field with the matching design-system control. */
export function FieldInput({ f, value: v, onChange, onUpload, uploading }: Props) {
  const upload = (file?: File) => file && onUpload([file]);
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
  const urls: string[] = multi ? v || [] : v ? [v] : [];
  return (
    <div className="flex flex-col gap-1.5">
      <span className="pl-1 text-xs text-on-surface-variant">{f.label}</span>
      <PhotoListEditor urls={urls} single={!multi} uploading={uploading} onUpload={onUpload} onChange={(next) => onChange(multi ? next : next[0] ?? '')} />
    </div>
  );
}
