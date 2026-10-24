import { useState } from 'react';
import { cls } from '@/ui/classes';

export default function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button type="button" onClick={copy} className={cls.tonalBtn + ' pl-5'} aria-live="polite">
      <span className="ms text-xl">{copied ? 'check' : 'content_copy'}</span>
      {copied ? done : label}
    </button>
  );
}
