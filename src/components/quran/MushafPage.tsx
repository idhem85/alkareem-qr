import { bismillah, toArabicNumber } from "@/data/ayahs";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";
import type { Ayah } from "@/data/ayahs";
import type { Surah } from "@/data/surahs";

interface PageSegment {
  type: "surah-header" | "bismillah" | "ayahs";
  surahId?: number;
  surah?: Surah;
  ayahs?: Ayah[];
}

interface PageContent {
  pageNumber: number;
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  juzNumber: number;
  hizbInfo: string;
  segments: PageSegment[];
}

interface MushafPageProps {
  page: PageContent;
  onAyahTap: (ayah: Ayah) => void;
  selectedAyahId?: number;
}

export function MushafPage({ page, onAyahTap, selectedAyahId }: MushafPageProps) {
  const { settings, audio, setAudio, togglePlayback } = useApp();

  return (
    <div className="mushaf-page" dir="rtl">
      {/* Page header */}
      <div className="mushaf-page-header">
        <span className="font-arabic text-xs text-muted-foreground leading-none">
          {page.surahNameArabic}
        </span>
        <span className="font-arabic text-xs text-muted-foreground leading-none">
          الجزء {toArabicNumber(page.juzNumber)}
        </span>
      </div>

      {/* Page content */}
      <div className="mushaf-page-content">
        {page.segments.map((segment, segIdx) => {
          if (segment.type === "surah-header" && segment.surah) {
            const isPlayingThis = audio.currentSurahId === segment.surah.id && audio.isPlaying;
            const handlePlay = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (audio.currentSurahId === segment.surah!.id) {
                togglePlayback();
              } else {
                setAudio({ isPlaying: true, currentSurahId: segment.surah!.id, currentAyah: 1, reciter: audio.reciter });
              }
            };
            return (
              <div key={`header-${segIdx}`} className="mushaf-surah-header-block">
                <div className="mushaf-surah-title-frame">
                  <div className="mushaf-surah-title-inner">
                    <span className="font-arabic text-lg leading-relaxed">
                      سُورَةُ {segment.surah.nameArabic}
                    </span>
                    <span className="text-[10px] opacity-70 mt-0.5 block">
                      {segment.surah.ayahCount} versets
                    </span>
                  </div>
                  <button
                    onClick={handlePlay}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
                    aria-label={isPlayingThis ? "Pause" : "Écouter la sourate"}
                  >
                    {isPlayingThis ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                  </button>
                </div>
              </div>
            );
          }

          if (segment.type === "bismillah") {
            return (
              <div key={`bismillah-${segIdx}`} className="mushaf-bismillah">
                {bismillah}
              </div>
            );
          }

          if (segment.type === "ayahs" && segment.ayahs) {
            return (
              <div key={`ayahs-${segIdx}`} className="mushaf-ayah-block">
                {segment.ayahs.map((ayah) => (
                  <span
                    key={ayah.id}
                    onClick={(e) => { e.stopPropagation(); onAyahTap(ayah); }}
                    className={cn(
                      "mushaf-ayah-inline cursor-pointer transition-colors duration-200",
                      selectedAyahId === ayah.id && "mushaf-ayah-highlight"
                    )}
                  >
                    <span
                      className="font-quran"
                      style={{ fontSize: `${settings.fontSize}px` }}
                    >
                      {ayah.textArabic}
                    </span>
                    <span className="mushaf-ayah-number">
                      {toArabicNumber(ayah.numberInSurah)}
                    </span>
                  </span>
                ))}
                {settings.showTranslation && segment.ayahs.length > 0 && (
                  <div className="mushaf-translation-block" dir="ltr">
                    {segment.ayahs.map((ayah) => (
                      <p key={`tr-${ayah.id}`} className="mushaf-translation-line">
                        <span className="mushaf-translation-num">{ayah.numberInSurah}.</span>
                        {ayah.translationFr}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Page footer */}
      <div className="mushaf-page-footer">
        <span className="mushaf-page-number font-arabic">
          {toArabicNumber(page.pageNumber)}
        </span>
        <span className="font-arabic text-[10px] text-muted-foreground">
          {page.hizbInfo}
        </span>
      </div>
    </div>
  );
}
