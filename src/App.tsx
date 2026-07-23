import { useEffect, useState } from "react";
import { SettingsProvider } from "./context/SettingsContext";
import { Header } from "./components/ui/Header";
import { BottomNav, type TabId } from "./components/ui/BottomNav";
import { InstallPrompt } from "./components/InstallPrompt";
import { HomeScreen } from "./screens/HomeScreen";
import { BookingScreen } from "./screens/BookingScreen";
import { DpScreen } from "./screens/DpScreen";
import { InvoiceScreen } from "./screens/InvoiceScreen";
import { RefundScreen } from "./screens/RefundScreen";
import { ThankYouScreen } from "./screens/ThankYouScreen";

const TITLES: Record<TabId, string> = {
  home: "Ari Caregiver Invoice",
  booking: "Booking",
  dp: "Kalkulator DP",
  invoice: "Invoice",
  refund: "Refund",
  thanks: "Kartu Terima Kasih",
};

function App() {
  const [tab, setTab] = useState<TabId>("home");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    }
  }, []);

  return (
    <SettingsProvider>
      <div className="min-h-full flex flex-col" style={{ background: "var(--c-bg)" }}>
        <Header title={TITLES[tab]} />
        <main className="flex-1 mx-auto w-full max-w-md px-4 pt-3 pb-32">
          {tab === "home" && <HomeScreen onNavigate={setTab} />}
          {tab === "booking" && <BookingScreen />}
          {tab === "dp" && <DpScreen />}
          {tab === "invoice" && <InvoiceScreen />}
          {tab === "refund" && <RefundScreen />}
          {tab === "thanks" && <ThankYouScreen />}
        </main>
        <footer className="text-center text-xs pb-24" style={{ color: "var(--c-text-muted)" }}>
          © 2026 Ari Caregiver. All Rights Reserved.
        </footer>
        <BottomNav active={tab} onChange={setTab} />
        <InstallPrompt />
      </div>
    </SettingsProvider>
  );
}

export default App;
