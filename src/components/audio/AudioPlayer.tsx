import { useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { surahs } from "@/data/surahs";
import { toArabicNumber } from "@/data/ayahs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAyahAudioUrl } from "@/lib/quranAudio";

export function AudioPlayer({ hideUI = false }: { hideUI?: boolean }) {
  const { audio, togglePlayback, setAudio } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("ended", () => {
      setAudio(prev => {
        if (!prev.currentSurahId || !prev.currentAyah) return prev;
        const surah = surahs.find(s => s.id === prev.currentSurahId);
        if (surah && prev.currentAyah < surah.ayahCount) {
          return { ...prev, currentAyah: prev.currentAyah + 1 };
        }
        return { ...prev, isPlaying: false };
      });
    });
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [setAudio]);

  useEffect(() => {
    if (!audioRef.current || !audio.currentSurahId || !audio.currentAyah) return;
    const url = getAyahAudioUrl(audio.currentSurahId, audio.currentAyah);
    audioRef.current.src = url;
    if (audio.isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [audio.currentSurahId, audio.currentAyah]);

  useEffect(() => {
    if (!audioRef.current || !audio.currentSurahId) return;
    if (audio.isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [audio.isPlaying, audio.currentSurahId]);

  if (!audio.currentSurahId) return null;

  const surah = surahs.find(s => s.id === audio.currentSurahId);

  return (
    <div className={cn(
      "fixed z-40 frosted-glass animate-slide-up",
      "bottom-14 left-0 right-0",
      "md:bottom-0 md:left-56"
    )}>
      <div className="flex items-center gap-3 px-4 py-2.5 max-w-screen-lg mx-auto">
        {/* Info */}
        <div className="flex-1 min-w-0" dir="rtl">
          <p className="text-sm font-medium truncate font-arabic">{surah?.nameArabic}</p>
          <p className="text-xs text-muted-foreground truncate font-arabic">
            الآية {toArabicNumber(audio.currentAyah || 1)}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
            setAudio(prev => ({
              ...prev,
              currentAyah: Math.max(1, (prev.currentAyah || 1) - 1)
            }));
          }}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={togglePlayback}
          >
            {audio.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
            setAudio(prev => ({
              ...prev,
              currentAyah: (prev.currentAyah || 1) + 1
            }));
          }}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Close */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground shrink-0" onClick={() => {
          audioRef.current?.pause();
          setAudio(prev => ({ ...prev, isPlaying: false, currentSurahId: null, currentAyah: null }));
        }}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
