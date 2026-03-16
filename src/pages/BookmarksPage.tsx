import { useApp } from "@/contexts/AppContext";
import { surahs } from "@/data/surahs";
import { ayahsBySurah, toArabicNumber } from "@/data/ayahs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useApp();

  const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">العلامات المرجعية</h1>

      {sortedBookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground text-sm font-arabic">لا توجد علامات محفوظة</p>
          <p className="text-muted-foreground text-xs mt-2">
            اضغط على أي آية أثناء القراءة لحفظها هنا
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{sortedBookmarks.length} علامة محفوظة</p>
          {sortedBookmarks.map(b => {
            const surah = surahs.find(s => s.id === b.surahId);
            const ayah = ayahsBySurah[b.surahId]?.find(a => a.numberInSurah === b.ayahNumber);
            return (
              <Card key={`${b.surahId}-${b.ayahNumber}`} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/surah/${b.surahId}`} className="flex-1 hover-scale min-w-0">
                    <p className="text-xs text-accent mb-2 font-arabic">
                      {surah?.nameArabic} • الآية {toArabicNumber(b.ayahNumber)}
                    </p>
                    {ayah && (
                      <>
                        <p className="font-quran text-lg leading-[2.4] mb-2" dir="rtl">{ayah.textArabic}</p>
                        <p className="text-sm text-muted-foreground">{ayah.translationFr}</p>
                      </>
                    )}
                    {!ayah && (
                      <p className="text-sm text-muted-foreground">
                        {surah?.nameTransliteration} — Ayah {b.ayahNumber}
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
