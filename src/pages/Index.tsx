import { useApp } from "@/contexts/AppContext";
import { surahs } from "@/data/surahs";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const verseDuJour = {
  surahId: 2,
  ayah: 286,
  text: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
  translation: "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
  reference: "Al-Baqara 2:286",
};

const recentSurahs = [1, 36, 112, 113, 114];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "صباح الخير";
  if (hour < 17) return "مساء الخير";
  return "مساء النور";
}

export default function Index() {
  const { readingProgress } = useApp();

  const lastSurah = readingProgress
    ? surahs.find(s => s.id === readingProgress.surahId)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="text-center py-4">
        <p className="font-arabic text-2xl text-accent mb-1">{getGreeting()}</p>
        <h1 className="text-2xl font-bold font-sans">السلام عليكم</h1>
        <p className="text-sm text-muted-foreground mt-1">Bienvenue sur Al-Mushaf</p>
      </div>

      {/* Continue Reading */}
      {lastSurah && readingProgress && (
        <Link to={`/surah/${lastSurah.id}`}>
          <Card className="p-4 hover-scale border-accent/20 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Continuer la lecture</p>
                  <p className="font-semibold text-sm">{lastSurah.nameTransliteration}</p>
                  <p className="text-xs text-muted-foreground">Ayah {readingProgress.ayahNumber}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      )}

      {/* Verse of the Day */}
      <Card className="overflow-hidden border-0">
        <div className="gold-gradient p-6 text-center">
          <Star className="h-5 w-5 mx-auto mb-3 text-primary-foreground/80" />
          <p className="font-quran text-2xl leading-relaxed mb-3 text-primary-foreground">{verseDuJour.text}</p>
          <p className="text-sm text-primary-foreground/90 mb-2">{verseDuJour.translation}</p>
          <p className="text-xs text-primary-foreground/70">{verseDuJour.reference}</p>
        </div>
      </Card>

      {/* Recent / Favorites */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Sourates Populaires</h2>
          <Link to="/surahs" className="text-xs text-accent hover:underline">Voir tout</Link>
        </div>
        <div className="space-y-2">
          {recentSurahs.map(id => {
            const s = surahs.find(su => su.id === id)!;
            return (
              <Link key={s.id} to={`/surah/${s.id}`}>
                <Card className={cn("p-3 hover-scale flex items-center justify-between border-border/50")}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <span className="font-arabic text-sm text-foreground">{s.id}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{s.nameTransliteration}</p>
                      <p className="text-xs text-muted-foreground">{s.nameTranslation} • {s.ayahCount} versets</p>
                    </div>
                  </div>
                  <p className="font-arabic text-lg text-accent">{s.nameArabic}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
