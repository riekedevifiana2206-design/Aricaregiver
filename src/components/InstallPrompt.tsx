import { useEffect, useState } from "react";

const DISMISS_KEY = "ari:installDismissedAt";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (installed) return;
    const last = Number(localStorage.getItem(DISMISS_KEY) || 0);
    const recent = Date.now() - last < SEVEN_DAYS;
    if (recent) return;
    const timer = setTimeout(() => {
      setShow(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [installed]);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !deferred;

  const handleInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setShow(false);
      }
      setDeferred(null);
    } else {
      setShow(false);
    }
  };

  const handleLater = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  if (installed) {
    return (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 surface px-4 py-3 animate-slide-up max-w-md w-[90%] text-center">
        <p className="text-sm font-medium">Ari Caregiver Invoice successfully installed.</p>
      </div>
    );
  }

  if (!show) return null;
  if (isStandalone) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 animate-fade-in" onClick={handleLater}>
      <div
        className="surface !rounded-t-3xl !rounded-b-none w-full max-w-md p-5 pb-safe animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold">Install Ari Caregiver Invoice</h3>
        <p className="text-sm mt-1" style={{ color: "var(--c-text-muted)" }}>
          Install this application for faster access directly from your Home Screen.
        </p>

        {isIOS && (
          <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: "color-mix(in srgb, var(--c-primary) 8%, transparent)" }}>
            On Safari, tap the Share button, then choose <strong>Add to Home Screen</strong>.
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="btn-ghost" onClick={handleLater}>Maybe Later</button>
          <button className="btn-primary" onClick={handleInstall}>Install Now</button>
        </div>
      </div>
    </div>
  );
}
