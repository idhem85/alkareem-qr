import { Surah } from "@/data/surahs";
import { bismillah } from "@/data/ayahs";
import { Play, Pause } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface SurahHeaderProps {
  surah: Surah;
  showBismillah?: boolean;
}

export function SurahHeader({ surah, showBismillah = true }: SurahHeaderProps) {
  const { audio, setAudio, togglePlayback } = useApp();
  const isPlayingThis = audio.currentSurahId === surah.id && audio.isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audio.currentSurahId === surah.id) {
      togglePlayback();
    } else {
      setAudio({ isPlaying: true, currentSurahId: surah.id, currentAyah: 1, reciter: audio.reciter });
    }
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="surah-header-ornament mb-6">
        <p className="font-arabic text-3xl mb-2">{surah.nameArabic}</p>
        <p className="text-sm opacity-90">
          {surah.nameTransliteration} • {surah.nameTranslation}
        </p>
        <p className="text-xs opacity-70 mt-1">
          {surah.ayahCount} versets • {surah.revelationType === "meccan" ? "Mecquoise" : "Médinoise"}
        </p>
        <button
          onClick={handlePlay}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors text-xs font-medium"
          aria-label={isPlayingThis ? "Pause" : "Écouter la sourate"}
        >
          {isPlayingThis ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isPlayingThis ? "Pause" : "Écouter"}
        </button>
      </div>
      {showBismillah && surah.id !== 9 && surah.id !== 1 && (
        <p className="bismillah-ornament animate-scale-in">{bismillah}</p>
      )}
    </div>
  );
}
