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
      <main className={`flex-1 ${isMushaf ? "" : "pb-20 md:pb-0"}`}>
        {children}
      </main>
      <AudioPlayer />
      {!isMushaf && <BottomNav />}
    </div>
  );
}
