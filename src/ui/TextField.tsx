import { field } from './classes';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

/** M3 outlined text field (label inside the outline). */
export function TextField({ label, value, onChange, multiline, rows = 3, ...rest }: Props) {
  return (
    <label className={field.box}>
      <span className={field.label}>{label}</span>
      {multiline ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={field.input + ' resize-y'} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={field.input} {...rest} />
      )}
    </label>
  );
}
