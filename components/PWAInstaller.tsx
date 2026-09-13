'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Lumina PWA ServiceWorker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Lumina PWA ServiceWorker registration failed:', error);
          });
      });
    } else if ('serviceWorker' in navigator) {
      // Register in dev mode too for PWA testing
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Lumina PWA SW Dev registered:', reg.scope))
        .catch((err) => console.warn('Lumina PWA SW Dev registration notice:', err));
    }

    // 2. Check if already installed / standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 3. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    // 4. Capture standard PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Detect App Installed Event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSTip((prev) => !prev);
      }
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* PWA Standard Install Toast / Banner */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-xl animate-fade-in flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/apple-touch-icon.png"
              alt="Lumina App Icon"
              className="w-12 h-12 rounded-xl border border-indigo-400/30 shadow-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-white truncate">Install Lumina App</h3>
              <p className="text-xs text-slate-300 truncate">Fast access & offline reading catalog</p>
            </div>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              aria-label="Close install prompt"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-semibold text-white shadow-md transition flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Install Application
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Installation Tooltip Banner */}
      {isIOS && !showInstallBanner && (
        <div className="fixed bottom-5 right-5 z-40">
          {!showIOSTip ? (
            <button
              onClick={() => setShowIOSTip(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold backdrop-blur-md shadow-xl flex items-center gap-2 transition"
            >
              <img src="/apple-touch-icon.png" alt="iOS App Icon" className="w-5 h-5 rounded-md" />
              Add to Home Screen
            </button>
          ) : (
            <div className="p-4 max-w-xs rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-white shadow-2xl backdrop-blur-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/apple-touch-icon.png" alt="iOS Icon" className="w-8 h-8 rounded-lg" />
                  <span className="font-semibold text-xs text-indigo-300">Install on iOS</span>
                </div>
                <button
                  onClick={() => setShowIOSTip(false)}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To install <strong className="text-white">Lumina</strong> on your iPhone / iPad:
              </p>
              <ol className="text-xs text-slate-400 list-decimal list-inside space-y-1">
                <li>Tap the <strong className="text-indigo-300">Share</strong> icon in Safari.</li>
                <li>Scroll down & select <strong className="text-indigo-300">Add to Home Screen</strong>.</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </>
  );
}
