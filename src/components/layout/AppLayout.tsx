import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";
import { AudioPlayer } from "@/components/audio/AudioPlayer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DesktopSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
