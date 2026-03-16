import { Surah } from "@/data/surahs";
import { bismillah } from "@/data/ayahs";

interface SurahHeaderProps {
  surah: Surah;
  showBismillah?: boolean;
}

export function SurahHeader({ surah, showBismillah = true }: SurahHeaderProps) {
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
      </div>
      {showBismillah && surah.id !== 9 && surah.id !== 1 && (
        <p className="bismillah-ornament animate-scale-in">{bismillah}</p>
      )}
    </div>
  );
}
