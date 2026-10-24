import { useState } from 'react';
import { Button } from '@/ui';

export default function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <Button variant="tonal" icon={copied ? 'check' : 'content_copy'} onClick={copy} aria-live="polite">
      {copied ? done : label}
    </Button>
  );
}
