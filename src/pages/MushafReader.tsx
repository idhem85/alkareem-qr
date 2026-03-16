import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { surahs } from "@/data/surahs";
import { ayahsBySurah } from "@/data/ayahs";
import { SurahHeader } from "@/components/quran/SurahHeader";
import { AyahText } from "@/components/quran/AyahText";
import { AyahDrawer } from "@/components/quran/AyahDrawer";
import { ReadingToolbar } from "@/components/quran/ReadingToolbar";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Ayah } from "@/data/ayahs";

export default function MushafReader() {
  const { id } = useParams<{ id: string }>();
  const surahId = parseInt(id || "1");
  const surah = surahs.find(s => s.id === surahId);
  const ayahs = ayahsBySurah[surahId] || [];

  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { updateReadingProgress } = useApp();

  useEffect(() => {
    if (surah && ayahs.length > 0) {
      updateReadingProgress(surahId, 1);
    }
    window.scrollTo(0, 0);
  }, [surahId]);

  if (!surah) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Sourate non trouvée.</p>
      </div>
    );
  }

  const prevSurah = surahId > 1 ? surahId - 1 : null;
  const nextSurah = surahId < 114 ? surahId + 1 : null;

  return (
    <div className="animate-fade-in">
      <ReadingToolbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <SurahHeader surah={surah} />

        {ayahs.length > 0 ? (
          <div dir="rtl" className="text-right space-y-1">
            {ayahs.map(ayah => (
              <AyahText
                key={ayah.id}
                ayah={ayah}
                isActive={selectedAyah?.id === ayah.id}
                onTap={(a) => {
                  setSelectedAyah(a);
                  setDrawerOpen(true);
                  updateReadingProgress(surahId, a.numberInSurah);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-arabic text-4xl text-accent mb-4">{surah.nameArabic}</p>
            <p className="text-muted-foreground text-sm">
              Le contenu de cette sourate sera disponible prochainement.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
          {prevSurah ? (
            <Link to={`/surah/${prevSurah}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {surahs[prevSurah - 1].nameTransliteration}
              </Button>
            </Link>
          ) : <div />}
          {nextSurah ? (
            <Link to={`/surah/${nextSurah}`}>
              <Button variant="outline" size="sm">
                {surahs[nextSurah - 1].nameTransliteration}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : <div />}
        </div>
      </div>

      <AyahDrawer ayah={selectedAyah} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
