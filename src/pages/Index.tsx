import { useApp } from "@/contexts/AppContext";
import { surahs } from "@/data/surahs";
import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const versesOfTheDay = [
  {
    text: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
    reference: "البقرة ٢:٢٨٦",
    surahId: 2,
  },
  {
    text: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation: "Car en vérité, avec la difficulté vient la facilité.",
    reference: "الشرح ٩٤:٥",
    surahId: 94,
  },
  {
    text: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُ",
    translation: "Et quiconque place sa confiance en Allah, Il lui suffit.",
    reference: "الطلاق ٦٥:٣",
    surahId: 65,
  },
  {
    text: "إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ",
    translation: "En vérité, Allah est avec les patients.",
    reference: "البقرة ٢:١٥٣",
    surahId: 2,
  },
  {
    text: "وَلَذِكْرُ ٱللَّهِ أَكْبَرُ",
    translation: "Et le rappel d'Allah est certes ce qu'il y a de plus grand.",
    reference: "العنكبوت ٢٩:٤٥",
    surahId: 29,
  },
];

const todayVerse = versesOfTheDay[new Date().getDay() % versesOfTheDay.length];

const popularSurahs = [
  { id: 1, reason: "الفاتحة" },
  { id: 36, reason: "قلب القرآن" },
  { id: 55, reason: "الرحمن" },
  { id: 67, reason: "الملك" },
  { id: 112, reason: "الإخلاص" },
];

export default function Index() {
  const { readingProgress } = useApp();

  const lastSurah = readingProgress
    ? surahs.find(s => s.id === readingProgress.surahId)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Logo */}
      <div className="text-center py-4">
        <img src="/logo.png" alt="تراتيل — Tarātīl" className="h-36 mx-auto" />
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
                  <p className="text-xs text-muted-foreground">متابعة القراءة</p>
                  <p className="font-semibold text-sm">{lastSurah.nameTransliteration}</p>
                  <p className="text-xs text-muted-foreground font-arabic">
                    الآية {readingProgress.ayahNumber}
                  </p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      )}

      {/* Verse of the Day */}
      <Link to={`/surah/${todayVerse.surahId}`}>
        <Card className="overflow-hidden border-0 hover-scale">
          <div className="gold-gradient p-6 text-center">
            <Star className="h-5 w-5 mx-auto mb-3 text-primary-foreground/80" />
            <p className="font-quran text-2xl leading-[2.2] mb-3 text-primary-foreground" dir="rtl">
              {todayVerse.text}
            </p>
            <p className="text-sm text-primary-foreground/90 mb-2">{todayVerse.translation}</p>
            <p className="font-arabic text-xs text-primary-foreground/70">{todayVerse.reference}</p>
          </div>
        </Card>
      </Link>

      {/* Popular Surahs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">سور مختارة</h2>
          <Link to="/surahs" className="text-xs text-accent hover:underline">عرض الكل</Link>
        </div>
        <div className="space-y-2">
          {popularSurahs.map(({ id }) => {
            const s = surahs.find(su => su.id === id)!;
            return (
              <Link key={s.id} to={`/surah/${s.id}`}>
                <Card className={cn("p-3 hover-scale flex items-center justify-between border-border/50")}>
                  <div className="flex items-center gap-3" dir="rtl">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <span className="font-arabic text-sm text-foreground">{s.id}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{s.nameTransliteration}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {s.nameTranslation} • {s.ayahCount} versets
                      </p>
                    </div>
                  </div>
                  <p className="font-arabic text-lg text-accent shrink-0">{s.nameArabic}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
