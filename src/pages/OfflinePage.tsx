import { WifiOff, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings, useBookmarks } from "@/contexts/AppContext";
import { surahs } from "@/data/surahs";
import { Link } from "react-router-dom";

const labels = {
  fr: {
    title: "Vous êtes hors ligne",
    subtitle: "Connectez-vous à Internet pour accéder au Coran",
    retry: "Réessayer",
    lastSurahs: "Dernières sourates lues",
    goHome: "Accueil",
    desc: "Certaines fonctionnalités nécessitent une connexion Internet.",
  },
  ar: {
    title: "أنت خارج الخط",
    subtitle: "اتصل بالإنترنت للوصول إلى القرآن الكريم",
    retry: "إعادة المحاولة",
    lastSurahs: "آخر السور المقروءة",
    goHome: "الرئيسية",
    desc: "بعض الميزات تتطلب اتصالاً بالإنترنت.",
  },
  en: {
    title: "You are offline",
    subtitle: "Connect to the internet to access the Quran",
    retry: "Retry",
    lastSurahs: "Last read surahs",
    goHome: "Home",
    desc: "Some features require an internet connection.",
  },
};

export default function OfflinePage() {
  const { settings } = useSettings();
  const { readingProgress } = useBookmarks();
  const lang = (settings.language || "fr") as keyof typeof labels;
  const t = labels[lang] || labels.fr;

  const lastSurah = readingProgress
    ? surahs.find((s) => s.id === readingProgress.surahId)
    : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-fade-in">
      {/* Decorative */}
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <WifiOff className="h-10 w-10 text-muted-foreground/40" />
      </div>

      {/* Title */}
      <p className="font-arabic text-2xl text-accent mb-2">خارج الخط</p>
      <h1 className="text-xl font-bold mb-1">{t.title}</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{t.subtitle}</p>

      {/* Retry button */}
      <Button
        variant="default"
        className="gap-2 mb-8"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="h-4 w-4" />
        {t.retry}
      </Button>

      {/* Last read surah — accessible from cache */}
      {lastSurah && (
        <div className="w-full max-w-sm mb-6">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            {t.lastSurahs}
          </p>
          <Link to={`/surah/${lastSurah.id}`}>
            <div className="p-3 rounded-xl border border-border/50 bg-card hover-scale flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">
                    {lastSurah.nameTransliteration}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar"
                      ? `الآية ${readingProgress.ayahNumber}`
                      : lang === "en"
                      ? `Ayah ${readingProgress.ayahNumber}`
                      : `Verset ${readingProgress.ayahNumber}`}
                  </p>
                </div>
              </div>
              <p className="font-arabic text-lg text-accent">
                {lastSurah.nameArabic}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-muted-foreground/60 max-w-xs">{t.desc}</p>
    </div>
  );
}
