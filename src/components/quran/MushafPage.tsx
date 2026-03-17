import { bismillah, toArabicNumber } from "@/data/ayahs";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { Play, Pause, Bookmark } from "lucide-react";
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
  highlightAyahId?: string | null;
}

export function MushafPage({ page, onAyahTap, selectedAyahId, highlightAyahId }: MushafPageProps) {
  const { settings, audio, setAudio, togglePlayback, isBookmarked } = useApp();

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
                  <div className="mushaf-surah-title-inner flex flex-col items-center gap-1 py-2">
                    <span className="font-arabic text-lg leading-relaxed">
                      سُورَةُ {segment.surah.nameArabic}
                    </span>
                    <div className="flex items-center gap-2.5 mt-1">
                      <span className="text-[10px] opacity-70">
                        {segment.surah.ayahCount} versets
                      </span>
                      <span className="text-[10px] opacity-40">•</span>
                      <button
                        onClick={handlePlay}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold shadow-sm transition-all",
                          isPlayingThis
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-background text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground"
                        )}
                        aria-label={isPlayingThis ? "Pause" : "Écouter la sourate"}
                      >
                        {isPlayingThis ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        {isPlayingThis ? "Pause" : "Écouter"}
                      </button>
                    </div>
                  </div>
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
