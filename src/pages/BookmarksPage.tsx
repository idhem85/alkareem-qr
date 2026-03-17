import { useApp } from "@/contexts/AppContext";
import { surahs } from "@/data/surahs";
import { ayahsBySurah, toArabicNumber } from "@/data/ayahs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";

const labels = {
  fr: {
    title: "Signets",
    empty: "Aucun signet enregistré",
    emptyHint: "Appuyez sur un verset pendant la lecture pour le sauvegarder ici",
    saved: "signets enregistrés",
    ayah: "Verset",
  },
  ar: {
    title: "العلامات المرجعية",
    empty: "لا توجد علامات محفوظة",
    emptyHint: "اضغط على أي آية أثناء القراءة لحفظها هنا",
    saved: "علامة محفوظة",
    ayah: "الآية",
  },
  en: {
    title: "Bookmarks",
    empty: "No bookmarks saved",
    emptyHint: "Tap any verse while reading to save it here",
    saved: "bookmarks saved",
    ayah: "Ayah",
  },
};

function getTranslation(ayah: { translationFr: string; translationEn?: string; translationAr?: string }, lang: string) {
  if (lang === "ar") return ayah.translationAr || ayah.translationFr;
  if (lang === "en") return ayah.translationEn || ayah.translationFr;
  return ayah.translationFr;
}

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, settings } = useApp();
  const lang = settings.language || "fr";
  const t = labels[lang as keyof typeof labels] || labels.fr;

  const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">{t.title}</h1>

      {sortedBookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground text-sm">{t.empty}</p>
          <p className="text-muted-foreground text-xs mt-2">{t.emptyHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{sortedBookmarks.length} {t.saved}</p>
          {sortedBookmarks.map(b => {
            const surah = surahs.find(s => s.id === b.surahId);
            const ayah = ayahsBySurah[b.surahId]?.find(a => a.numberInSurah === b.ayahNumber);
            return (
              <Card key={`${b.surahId}-${b.ayahNumber}`} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/surah/${b.surahId}?ayah=${b.ayahNumber}`} className="flex-1 hover-scale min-w-0">
                    <p className="text-xs text-accent mb-2 font-arabic">
                      {surah?.nameArabic} • {t.ayah} {toArabicNumber(b.ayahNumber)}
                    </p>
                    {ayah && (
                      <>
                        <p className="font-quran text-lg leading-[2.4] mb-2" dir="rtl">{ayah.textArabic}</p>
                        <p className="text-sm text-muted-foreground">{getTranslation(ayah, lang)}</p>
                      </>
                    )}
                    {!ayah && (
                      <p className="text-sm text-muted-foreground">
                        {surah?.nameTransliteration} — {t.ayah} {b.ayahNumber}
                      </p>
                    )}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeBookmark(b.surahId, b.ayahNumber)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
