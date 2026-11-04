'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

/** Opens the phone's native share sheet when available; otherwise copies the link. */
export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title, url }); } catch { /* sheet dismissed */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  return (
    <button onClick={onClick} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground active:scale-95">
      {copied ? <Check className="h-4 w-4" /> : typeof navigator !== 'undefined' && 'share' in navigator ? <Share2 className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}
