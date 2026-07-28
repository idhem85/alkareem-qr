import { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, X, Headphones, ChevronUp, ListMusic, BookOpen } from "lucide-react";
import { useAudio, useBookmarks, useSettings } from "@/contexts/AppContext";
import { surahs } from "@/data/surahs";
import { toArabicNumber } from "@/data/ayahs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAyahAudioUrl, RECITERS } from "@/lib/quranAudio";
import { Link, useLocation } from "react-router-dom";

/**
 * Mini floating audio player — TOUJOURS visible.
 *
 * États :
 *   idle    : pas de sourate en cours → affiche un prompt pour lire
 *   loading : chargement de l'audio en cours
 *   playing : lecture active avec contrôles (play/pause, prev/next, barre de progression)
 */
export function AudioPlayer() {
  const { audio, togglePlayback, setAudio } = useAudio();
  const { settings } = useSettings();
  const { readingProgress } = useBookmarks();
  const location = useLocation();
  const isMushafPage = location.pathname.startsWith("/surah/");
  const hasBottomNav = !isMushafPage;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  // ---- Audio engine (monté en permanence) ----
  useEffect(() => {
    const audioEl = new Audio();
    audioRef.current = audioEl;

    audioEl.addEventListener("ended", () => {
      setAudio((prev) => {
        if (!prev.currentSurahId || !prev.currentAyah) return prev;
        const surah = surahs.find((s) => s.id === prev.currentSurahId);
        if (surah && prev.currentAyah < surah.ayahCount) {
          return { ...prev, currentAyah: prev.currentAyah + 1 };
        }
        return { ...prev, isPlaying: false };
      });
    });

    audioEl.addEventListener("timeupdate", () => {
      if (audioEl.duration) {
        setProgress((audioEl.currentTime / audioEl.duration) * 100);
      }
    });



    return () => {
      audioEl.pause();
      audioEl.src = "";
      audioRef.current = null;
    };
  }, [setAudio]);

  // ---- Chargement de la source audio ----
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audio.currentSurahId || !audio.currentAyah) return;

    const reciterId =
      RECITERS.find((r) => r.name === settings.reciter)?.id || "ar.alafasy";
    const url = getAyahAudioUrl(audio.currentSurahId, audio.currentAyah, reciterId);

    if (el.src !== url) {
      el.src = url;
      setProgress(0);
    }

    if (audio.isPlaying) {
      el.play().catch(() => {});
    }
  }, [audio.currentSurahId, audio.currentAyah, settings.reciter]);

  // ---- Play / Pause ----
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audio.currentSurahId) return;
    if (audio.isPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [audio.isPlaying, audio.currentSurahId]);

  const isPlaying = audio.currentSurahId !== null && audio.isPlaying;
  const surah = audio.currentSurahId
    ? surahs.find((s) => s.id === audio.currentSurahId)
    : null;

  const lastSurah = readingProgress
    ? surahs.find((s) => s.id === readingProgress.surahId)
    : null;

  const popularStartSurahs = [1, 36, 55, 67, 112, 18];

  return (
      <div
        className={cn(
          "fixed z-50 transition-all duration-300 ease-out",
          // Mobile : au-dessus de la bottom nav (56px)
          hasBottomNav ? "bottom-14" : "bottom-0",
          "left-0 right-0",
          // Desktop : pas de bottom nav, tout en bas
          "md:bottom-0 md:left-0",
          // Desktop sidebar
          !isMushafPage && "md:left-56"
        )}
      >
        {/* ---- Barre de progression (visible seulement en lecture) ---- */}
        {isPlaying && (
          <div className="h-0.5 bg-border/50">
            <div
              className="h-full bg-accent transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* ---- Contenu du player ---- */}
        <div className="frosted-glass px-3 py-2.5 shadow-lg border-t border-border/50">
          <div className="flex items-center gap-2.5 max-w-screen-lg mx-auto">
            {/* ---- Icône ---- */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                isPlaying ? "bg-accent/10" : "bg-primary/10"
              )}
            >
              {isPlaying ? (
                <Headphones className="h-4 w-4 text-accent" />
              ) : (
                <ListMusic className="h-4 w-4 text-primary" />
              )}
            </div>

            {/* ---- Info / Prompt ---- */}
            <div className="flex-1 min-w-0">
              {isPlaying && surah ? (
                /* État PLAYING : infos sourate + verset */
                <div dir="rtl">
                  <p className="text-xs font-medium truncate font-arabic leading-tight">
                    {surah.nameArabic}
                    <span className="text-muted-foreground/60 text-[10px] mx-1.5 font-sans">
                      {surah.nameTransliteration}
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5 font-arabic">
                    الآية {toArabicNumber(audio.currentAyah || 1)}
                    <span className="text-muted-foreground/50 mx-1">•</span>
                    <span className="text-muted-foreground/70 font-sans">
                      {settings.reciter?.split(" ")[0]}
                    </span>
                  </p>
                </div>
              ) : (
                /* État IDLE : prompt de lecture */
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {settings.language === "ar"
                      ? "استمع إلى القرآن الكريم"
                      : settings.language === "en"
                      ? "Listen to the Holy Quran"
                      : "Écouter le Saint Coran"}
                  </p>
                </div>
              )}
            </div>

            {/* ---- Contrôles ---- */}
            <div className="flex items-center gap-0.5 shrink-0">
              {isPlaying ? (
                <>
                  {/* Prev */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setAudio((prev) => ({
                        ...prev,
                        currentAyah: Math.max(1, (prev.currentAyah || 1) - 1),
                      }));
                    }}
                  >
                    <SkipBack className="h-3.5 w-3.5" />
                  </Button>

                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
                    onClick={togglePlayback}
                  >
                    {audio.isPlaying ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5 ml-0.5" />
                    )}
                  </Button>

                  {/* Next */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setAudio((prev) => ({
                        ...prev,
                        currentAyah: (prev.currentAyah || 1) + 1,
                      }));
                    }}
                  >
                    <SkipForward className="h-3.5 w-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  {/* Bouton jouer la dernière sourate lue */}
                  {lastSurah ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 gap-1.5 text-xs px-3 rounded-full"
                      onClick={() => {
                        setAudio({
                          isPlaying: true,
                          currentSurahId: lastSurah.id,
                          currentAyah: readingProgress?.ayahNumber || 1,
                          reciter: audio.reciter,
                        });
                      }}
                    >
                      <Play className="h-3.5 w-3.5" />
                      <BookOpen className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 gap-1.5 text-xs px-3 rounded-full"
                      onClick={() => {
                        setAudio({
                          isPlaying: true,
                          currentSurahId: 1,
                          currentAyah: 1,
                          reciter: audio.reciter,
                        });
                      }}
                    >
                      <Play className="h-3.5 w-3.5" />
                      {settings.language === "ar"
                        ? "ابدأ"
                        : settings.language === "en"
                        ? "Start"
                        : "Lire"}
                    </Button>
                  )}

                  {/* Quick surah selector */}
                  <div className="hidden sm:flex items-center gap-1 ml-1">
                    {popularStartSurahs.slice(0, 3).map((sid) => {
                      const s = surahs.find((su) => su.id === sid);
                      if (!s) return null;
                      return (
                        <button
                          key={sid}
                          className="h-7 w-7 rounded-full bg-secondary/60 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all font-arabic"
                          onClick={() => {
                            setAudio({
                              isPlaying: true,
                              currentSurahId: sid,
                              currentAyah: 1,
                              reciter: audio.reciter,
                            });
                          }}
                          title={s.nameTransliteration}
                        >
                          {sid}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* ---- Close / Dismiss ---- */}
            {isPlaying ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground/50 hover:text-foreground shrink-0"
                onClick={() => {
                  audioRef.current?.pause();
                  setAudio((prev) => ({
                    ...prev,
                    isPlaying: false,
                    currentSurahId: null,
                    currentAyah: null,
                  }));
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Link
                to="/surahs"
                className="h-7 w-7 flex items-center justify-center text-muted-foreground/50 hover:text-foreground shrink-0 rounded-md hover:bg-secondary/50 transition-all"
                aria-label="Voir toutes les sourates"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
  );
}
