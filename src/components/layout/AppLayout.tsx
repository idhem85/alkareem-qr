import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { useLocation } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMushaf = location.pathname.startsWith("/surah/");

  return (
    <div className="flex min-h-screen w-full bg-background">
      {!isMushaf && <DesktopSidebar />}
      <main
        className={`flex-1 ${
          // Sur mobile : bottom nav (56px) + player (56px)
          // Sur desktop : player seul (56px) ou 0 si sidebar
          "pb-28 md:pb-14"
        }`}
      >
        {children}
      </main>
      {/* Audio player — toujours visible en bas */}
      <AudioPlayer />
      {/* Bottom nav — seulement sur les pages non-Mushaf, au-dessus du player */}
      {!isMushaf && <BottomNav />}
    </div>
  );
}
