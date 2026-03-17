import { useApp } from "@/contexts/AppContext";
import { surahs } from "@/data/surahs";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Sparkles, CalendarDays, Play, Pause, SkipBack, SkipForward, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import { PrayerTimes } from "@/components/home/PrayerTimes";
import { toArabicNumber } from "@/data/ayahs";

function useHijriDate() {
  return useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-latn", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(now);
  }, []);
}

const versesOfTheDay = [
  {
    text: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translationFr: "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
    translationEn: "Allah does not burden a soul beyond that it can bear.",
    translationAr: "لا يكلّف الله نفساً إلا وسعها",
    reference: "البقرة ٢:٢٨٦",
    surahId: 2,
  },
  {
    text: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translationFr: "Car en vérité, avec la difficulté vient la facilité.",
    translationEn: "For indeed, with hardship comes ease.",
    translationAr: "فإنّ مع العسر يسراً",
    reference: "الشرح ٩٤:٥",
    surahId: 94,
  },
  {
    text: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُ",
    translationFr: "Et quiconque place sa confiance en Allah, Il lui suffit.",
    translationEn: "And whoever relies upon Allah – then He is sufficient for him.",
    translationAr: "ومن يتوكّل على الله فهو حسبه",
    reference: "الطلاق ٦٥:٣",
    surahId: 65,
  },
  {
    text: "إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ",
    translationFr: "En vérité, Allah est avec les patients.",
    translationEn: "Indeed, Allah is with the patient.",
    translationAr: "إنّ الله مع الصابرين",
    reference: "البقرة ٢:١٥٣",
    surahId: 2,
  },
  {
    text: "وَلَذِكْرُ ٱللَّهِ أَكْبَرُ",
    translationFr: "Et le rappel d'Allah est certes ce qu'il y a de plus grand.",
    translationEn: "And the remembrance of Allah is greater.",
    translationAr: "ولذكر الله أكبر",
    reference: "العنكبوت ٢٩:٤٥",
    surahId: 29,
  },
];

const todayVerse = versesOfTheDay[new Date().getDay() % versesOfTheDay.length];

const popularSurahs = [1, 36, 55, 67, 112];

const labels = {
  fr: {
    continueReading: "Poursuivre la lecture",
    ayah: "Ayah",
    verseOfDay: "Verset du jour",
    selectedSurahs: "Sourates recommandées",
    viewAll: "Voir tout",
    versets: "versets",
    nowPlaying: "En cours d'écoute",
    ayahLabel: "Verset",
  },
  ar: {
    continueReading: "متابعة القراءة",
    ayah: "الآية",
    verseOfDay: "آية اليوم",
    selectedSurahs: "سور مختارة",
    viewAll: "عرض الكل",
    versets: "آيات",
    nowPlaying: "قيد الاستماع",
    ayahLabel: "الآية",
  },
  en: {
    continueReading: "Continue reading",
    ayah: "Ayah",
    verseOfDay: "Verse of the day",
    selectedSurahs: "Recommended Surahs",
    viewAll: "View all",
    versets: "verses",
    nowPlaying: "Now playing",
    ayahLabel: "Ayah",
  },
};

function getVerseTranslation(verse: typeof versesOfTheDay[0], lang: string) {
  if (lang === "ar") return verse.translationAr;
  if (lang === "en") return verse.translationEn;
  return verse.translationFr;
}

export default function Index() {
  const { readingProgress, settings, audio, togglePlayback, setAudio } = useApp();
  const hijriDate = useHijriDate();
  const lang = settings.language || "fr";
  const t = labels[lang as keyof typeof labels] || labels.fr;
  const audioSurah = audio.currentSurahId ? surahs.find(s => s.id === audio.currentSurahId) : null;

  const lastSurah = readingProgress
    ? surahs.find(s => s.id === readingProgress.surahId)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <img src="/logo.png" alt="تراتيل — Tarātīl" className="h-24" />
        <div className="flex items-center gap-2 bg-card border border-border/60 rounded-xl px-3 py-2">
          <CalendarDays className="h-4 w-4 text-accent shrink-0" />
          <span className="font-arabic text-sm text-foreground" dir="rtl">{hijriDate}</span>
        </div>
      </div>

      {/* Continue Reading */}
      {lastSurah && readingProgress && (
        <Link to={`/surah/${lastSurah.id}`}>
          <Card className="p-4 hover-scale border-border/50 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{t.continueReading}</p>
                <p className="font-semibold text-sm truncate">
                  {lastSurah.nameTransliteration}
                  <span className="font-arabic text-muted-foreground mx-1.5">—</span>
                  <span className="font-arabic text-accent">{lastSurah.nameArabic}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground font-arabic">
                  {t.ayah} {readingProgress.ayahNumber}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </Link>
      )}

      {/* Now Playing */}
      {audioSurah && audio.currentSurahId && (
        <Card className="p-4 border-border/50 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Headphones className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{t.nowPlaying}</p>
              <p className="font-semibold text-sm truncate">
                {audioSurah.nameTransliteration}
                <span className="font-arabic text-muted-foreground mx-1.5">—</span>
                <span className="font-arabic text-accent">{audioSurah.nameArabic}</span>
              </p>
              <p className="text-xs text-muted-foreground font-arabic">
                {t.ayahLabel} {toArabicNumber(audio.currentAyah || 1)}
              </p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button onClick={() => setAudio(prev => ({ ...prev, currentSurahId: Math.max(1, (prev.currentSurahId || 1) - 1), currentAyah: 1 }))} className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              <button onClick={togglePlayback} className="h-9 w-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                {audio.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-px" />}
              </button>
              <button onClick={() => setAudio(prev => ({ ...prev, currentSurahId: Math.min(114, (prev.currentSurahId || 1) + 1), currentAyah: 1 }))} className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Card>
      )}

      <Link to={`/surah/${todayVerse.surahId}`} className="block mt-4">
        <Card className="overflow-hidden border-border/50 hover-scale">
          <div className="px-5 py-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                {t.verseOfDay}
              </span>
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </div>
            <p className="font-quran text-2xl leading-[2.4] mb-3 text-foreground" dir="rtl">
              {todayVerse.text}
            </p>
            <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
              {getVerseTranslation(todayVerse, lang)}
            </p>
            <p className="font-arabic text-xs text-accent/70">{todayVerse.reference}</p>
          </div>
        </Card>
      </Link>

      {/* Popular Surahs — matching SearchPage surah layout */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">{t.selectedSurahs}</h2>
          <Link to="/surahs" className="text-xs text-accent hover:underline">{t.viewAll}</Link>
        </div>
        <div className="space-y-2">
          {popularSurahs.map(id => {
            const s = surahs.find(su => su.id === id)!;
            return (
              <Link key={s.id} to={`/surah/${s.id}`}>
                <Card className="p-3 hover-scale flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-foreground">{s.id}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{s.nameTransliteration}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {s.nameTranslation} • {s.ayahCount} {t.versets}
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
