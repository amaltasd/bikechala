'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'bikechala:install-dismissed';
const DISMISS_DAYS = 14;

function recentlyDismissed() {
  try {
    const t = Number(localStorage.getItem(DISMISS_KEY));
    return !!t && Date.now() - t < DISMISS_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

/** Registers the service worker and shows a small, dismissible "Add to Home Screen" prompt on phones. */
export default function PwaClient() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone || recentlyDismissed()) return;

    // Hold the browser's install event and only surface our prompt after a few seconds,
    // so it never covers the first screen a visitor sees.
    let promptTimer: ReturnType<typeof setTimeout> | undefined;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      promptTimer = setTimeout(() => setDeferred(e as InstallEvent), 12000);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    // iOS Safari never fires beforeinstallprompt, so show manual instructions instead.
    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isIos && isSafari) timer = setTimeout(() => setIosHint(true), 8000);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      if (timer) clearTimeout(timer);
      if (promptTimer) clearTimeout(promptTimer);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setDeferred(null);
    setIosHint(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  if (!deferred && !iosHint) return null;

  return (
    <div
      role="dialog"
      aria-label="Install BikeChala app"
      className="lg:hidden fixed inset-x-3 z-40 flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-md bottom-[calc(4.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        {iosHint ? <Share className="h-5 w-5" /> : <Download className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-tight">Get the BikeChala app</p>
        <p className="text-xs text-muted-foreground leading-snug">
          {iosHint ? 'Tap Share, then “Add to Home Screen”.' : 'Faster, full-screen, works like a real app.'}
        </p>
      </div>
      {deferred && (
        <button onClick={install} className="min-h-10 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
          Install
        </button>
      )}
      <button onClick={dismiss} aria-label="Dismiss" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground active:bg-muted">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
