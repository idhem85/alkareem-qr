import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Hash, Layers, BookMarked } from "lucide-react";
import { surahs } from "@/data/surahs";
import { ayahsBySurah, type Ayah, toArabicNumber } from "@/data/ayahs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

type SearchTab = "surah" | "juz" | "hizb" | "text";

const tabs: { id: SearchTab; label: string; labelAr: string; labelEn: string; icon: typeof Search }[] = [
  { id: "text", label: "Texte", labelAr: "نص", labelEn: "Text", icon: Search },
  { id: "surah", label: "Sourate", labelAr: "سورة", labelEn: "Surah", icon: BookOpen },
  { id: "juz", label: "Juz", labelAr: "جزء", labelEn: "Juz", icon: Layers },
  { id: "hizb", label: "Hizb", labelAr: "حزب", labelEn: "Hizb", icon: BookMarked },
];

// Juz data (30 juz)
const juzData = Array.from({ length: 30 }, (_, i) => {
  const juzNum = i + 1;
  const startSurahs: Record<number, { surahId: number; ayah: number }> = {
    1: { surahId: 1, ayah: 1 }, 2: { surahId: 2, ayah: 142 }, 3: { surahId: 2, ayah: 253 },
    4: { surahId: 3, ayah: 93 }, 5: { surahId: 4, ayah: 24 }, 6: { surahId: 4, ayah: 148 },
    7: { surahId: 5, ayah: 82 }, 8: { surahId: 6, ayah: 111 }, 9: { surahId: 7, ayah: 88 },
    10: { surahId: 8, ayah: 41 }, 11: { surahId: 9, ayah: 93 }, 12: { surahId: 11, ayah: 6 },
    13: { surahId: 12, ayah: 53 }, 14: { surahId: 15, ayah: 1 }, 15: { surahId: 17, ayah: 1 },
    16: { surahId: 18, ayah: 75 }, 17: { surahId: 21, ayah: 1 }, 18: { surahId: 23, ayah: 1 },
    19: { surahId: 25, ayah: 21 }, 20: { surahId: 27, ayah: 56 }, 21: { surahId: 29, ayah: 46 },
    22: { surahId: 33, ayah: 31 }, 23: { surahId: 36, ayah: 28 }, 24: { surahId: 39, ayah: 32 },
    25: { surahId: 41, ayah: 47 }, 26: { surahId: 46, ayah: 1 }, 27: { surahId: 51, ayah: 31 },
    28: { surahId: 58, ayah: 1 }, 29: { surahId: 67, ayah: 1 }, 30: { surahId: 78, ayah: 1 },
  };
  const start = startSurahs[juzNum] || { surahId: 1, ayah: 1 };
  const surah = surahs.find(s => s.id === start.surahId);
  return {
    number: juzNum,
    nameArabic: `الجزء ${toArabicNumber(juzNum)}`,
    startSurah: surah?.nameArabic || "",
    startSurahTranslit: surah?.nameTransliteration || "",
    startSurahId: start.surahId,
    startAyah: start.ayah,
  };
});

// Hizb data (60 hizbs, 2 per juz)
const hizbStartData: Record<number, { surahId: number; ayah: number }> = {
  1: { surahId: 1, ayah: 1 }, 2: { surahId: 2, ayah: 75 },
  3: { surahId: 2, ayah: 142 }, 4: { surahId: 2, ayah: 203 },
  5: { surahId: 2, ayah: 253 }, 6: { surahId: 3, ayah: 15 },
  7: { surahId: 3, ayah: 93 }, 8: { surahId: 3, ayah: 171 },
  9: { surahId: 4, ayah: 24 }, 10: { surahId: 4, ayah: 88 },
  11: { surahId: 4, ayah: 148 }, 12: { surahId: 5, ayah: 27 },
  13: { surahId: 5, ayah: 82 }, 14: { surahId: 6, ayah: 36 },
  15: { surahId: 6, ayah: 111 }, 16: { surahId: 7, ayah: 1 },
  17: { surahId: 7, ayah: 88 }, 18: { surahId: 7, ayah: 171 },
  19: { surahId: 8, ayah: 41 }, 20: { surahId: 9, ayah: 34 },
  21: { surahId: 9, ayah: 93 }, 22: { surahId: 10, ayah: 26 },
  23: { surahId: 11, ayah: 6 }, 24: { surahId: 11, ayah: 83 },
  25: { surahId: 12, ayah: 53 }, 26: { surahId: 13, ayah: 19 },
  27: { surahId: 15, ayah: 1 }, 28: { surahId: 16, ayah: 51 },
  29: { surahId: 17, ayah: 1 }, 30: { surahId: 17, ayah: 99 },
  31: { surahId: 18, ayah: 75 }, 32: { surahId: 19, ayah: 75 },
  33: { surahId: 21, ayah: 1 }, 34: { surahId: 22, ayah: 1 },
  35: { surahId: 23, ayah: 1 }, 36: { surahId: 24, ayah: 21 },
  37: { surahId: 25, ayah: 21 }, 38: { surahId: 26, ayah: 111 },
  39: { surahId: 27, ayah: 56 }, 40: { surahId: 28, ayah: 51 },
  41: { surahId: 29, ayah: 46 }, 42: { surahId: 31, ayah: 22 },
  43: { surahId: 33, ayah: 31 }, 44: { surahId: 34, ayah: 24 },
  45: { surahId: 36, ayah: 28 }, 46: { surahId: 37, ayah: 145 },
  47: { surahId: 39, ayah: 32 }, 48: { surahId: 40, ayah: 41 },
  49: { surahId: 41, ayah: 47 }, 50: { surahId: 43, ayah: 24 },
  51: { surahId: 46, ayah: 1 }, 52: { surahId: 48, ayah: 18 },
  53: { surahId: 51, ayah: 31 }, 54: { surahId: 54, ayah: 1 },
  55: { surahId: 58, ayah: 1 }, 56: { surahId: 60, ayah: 7 },
  57: { surahId: 67, ayah: 1 }, 58: { surahId: 72, ayah: 1 },
  59: { surahId: 78, ayah: 1 }, 60: { surahId: 89, ayah: 1 },
};

const hizbData = Array.from({ length: 60 }, (_, i) => {
  const hizbNum = i + 1;
  const start = hizbStartData[hizbNum] || { surahId: 1, ayah: 1 };
  const surah = surahs.find(s => s.id === start.surahId);
  const juzNum = Math.ceil(hizbNum / 2);
  return {
    number: hizbNum,
    nameArabic: `الحزب ${toArabicNumber(hizbNum)}`,
    juzNumber: juzNum,
    startSurah: surah?.nameArabic || "",
    startSurahTranslit: surah?.nameTransliteration || "",
    startSurahId: start.surahId,
    startAyah: start.ayah,
  };
});

function getTabLabel(tab: typeof tabs[0], lang: string) {
  if (lang === "ar") return tab.labelAr;
  if (lang === "en") return tab.labelEn;
  return tab.label;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("text");
  const [surahInput, setSurahInput] = useState("");
  const [verseInput, setVerseInput] = useState("");
  const { settings } = useApp();
  const lang = settings.language || "fr";

  // Text search results
  const textResults: (Ayah & { surahName: string })[] = [];
  if (activeTab === "text" && query.length >= 2) {
    const q = query.toLowerCase();
    for (const [surahId, ayahs] of Object.entries(ayahsBySurah)) {
      const surah = surahs.find(s => s.id === Number(surahId));
      for (const ayah of ayahs) {
        if (ayah.textArabic.includes(query) || ayah.translationFr.toLowerCase().includes(q)) {
          textResults.push({ ...ayah, surahName: surah?.nameTransliteration || "" });
        }
      }
    }
  }

  // Surah filter
  const surahQuery = surahInput.toLowerCase();
  const filteredSurahs = surahInput.length > 0
    ? surahs.filter(s =>
        s.nameArabic.includes(surahInput) ||
        s.nameTransliteration.toLowerCase().includes(surahQuery) ||
        s.nameTranslation.toLowerCase().includes(surahQuery) ||
        s.id.toString() === surahInput
      )
    : surahs;

  // Verse lookup
  const verseSurahId = parseInt(surahInput) || 0;
  const verseNum = parseInt(verseInput) || 0;
  const verseSurah = surahs.find(s => s.id === verseSurahId);

  // Juz filter
  const juzQuery = query.toLowerCase();
  const filteredJuz = query.length > 0
    ? juzData.filter(j => j.number.toString().includes(query) || j.nameArabic.includes(query))
    : juzData;

  // Hizb filter
  const filteredHizb = query.length > 0
    ? hizbData.filter(h => h.number.toString().includes(query) || h.nameArabic.includes(query))
    : hizbData;

  const labels = {
    fr: { title: "Recherche", placeholder: "Rechercher dans le Coran...", min2: "Tapez au moins 2 caractères pour rechercher.", noResult: "Aucun résultat pour", results: "résultat(s)", surahPlaceholder: "Nom ou numéro de sourate...", verseSurah: "N° de sourate", verseAyah: "N° de verset", goToVerse: "Aller au verset", invalidVerse: "Verset introuvable. Vérifiez le numéro de sourate et d'ayah.", juzPlaceholder: "Numéro de Juz...", hizbPlaceholder: "Numéro de Hizb...", ayah: "Ayah", versets: "versets", juz: "Juz" },
    ar: { title: "البحث", placeholder: "ابحث في القرآن...", min2: "اكتب حرفين على الأقل للبحث.", noResult: "لا توجد نتائج لـ", results: "نتيجة", surahPlaceholder: "اسم أو رقم السورة...", verseSurah: "رقم السورة", verseAyah: "رقم الآية", goToVerse: "الذهاب إلى الآية", invalidVerse: "الآية غير موجودة. تحقق من الرقم.", juzPlaceholder: "رقم الجزء...", hizbPlaceholder: "رقم الحزب...", ayah: "آية", versets: "آيات", juz: "جزء" },
    en: { title: "Search", placeholder: "Search in the Quran...", min2: "Type at least 2 characters to search.", noResult: "No results for", results: "result(s)", surahPlaceholder: "Surah name or number...", verseSurah: "Surah number", verseAyah: "Verse number", goToVerse: "Go to verse", invalidVerse: "Verse not found. Check surah and ayah number.", juzPlaceholder: "Juz number...", hizbPlaceholder: "Hizb number...", ayah: "Ayah", versets: "verses", juz: "Juz" },
  };
  const t = labels[lang as keyof typeof labels] || labels.fr;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">{t.title}</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3 w-3" />
            {getTabLabel(tab, lang)}
          </button>
        ))}
      </div>

      {/* TEXT SEARCH */}
      {activeTab === "text" && (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.placeholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          {query.length < 2 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">{t.min2}</p>
          ) : textResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">{t.noResult} « {query} ».</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">{textResults.length} {t.results}</p>
              {textResults.map(r => (
                <Link key={r.id} to={`/surah/${r.surahId}`}>
                  <Card className="p-4 hover-scale">
                    <p className="text-xs text-accent mb-2">{r.surahName} • {t.ayah} {toArabicNumber(r.numberInSurah)}</p>
                    <p className="font-quran text-lg leading-relaxed mb-2" dir="rtl">{r.textArabic}</p>
                    <p className="text-sm text-muted-foreground">{r.translationFr}</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* SURAH LISTING */}
      {activeTab === "surah" && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.surahPlaceholder}
              value={surahInput}
              onChange={e => setSurahInput(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            {filteredSurahs.map(s => (
              <Link key={s.id} to={`/surah/${s.id}`}>
                <Card className="p-3 hover-scale flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <span className="text-sm font-semibold text-foreground">{s.id}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{s.nameTransliteration}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.nameTranslation} • {s.ayahCount} {t.versets}
                      </p>
                    </div>
                  </div>
                  <p className="font-arabic text-lg text-accent">{s.nameArabic}</p>
                </Card>
              </Link>
            ))}
            {filteredSurahs.length === 0 && (
              <p className="text-center text-muted-foreground py-12 text-sm">{t.noResult} « {surahInput} ».</p>
            )}
          </div>
        </>
      )}

      {/* VERSE LOOKUP */}
      {activeTab === "verse" && (
        <>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder={t.verseSurah}
                value={surahInput}
                onChange={e => setSurahInput(e.target.value)}
                min={1}
                max={114}
              />
            </div>
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder={t.verseAyah}
                value={verseInput}
                onChange={e => setVerseInput(e.target.value)}
                min={1}
              />
            </div>
          </div>
          {verseSurahId > 0 && verseSurah && (
            <Card className="p-4 mb-3">
              <p className="text-sm text-muted-foreground mb-1">{verseSurah.nameTransliteration} ({verseSurah.nameArabic})</p>
              <p className="text-xs text-muted-foreground">{verseSurah.ayahCount} {t.versets}</p>
            </Card>
          )}
          {verseSurahId > 0 && verseNum > 0 && verseSurah && verseNum <= verseSurah.ayahCount && (
            <Link to={`/surah/${verseSurahId}`}>
              <Card className="p-4 hover-scale bg-primary/5 border-primary/20">
                <p className="text-sm font-semibold text-primary">{t.goToVerse}: {verseSurah.nameTransliteration} {verseSurahId}:{verseNum}</p>
              </Card>
            </Link>
          )}
          {verseSurahId > 0 && verseNum > 0 && verseSurah && verseNum > verseSurah.ayahCount && (
            <p className="text-center text-destructive py-4 text-sm">{t.invalidVerse}</p>
          )}
        </>
      )}

      {/* JUZ */}
      {activeTab === "juz" && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.juzPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            {filteredJuz.map(j => (
              <Link key={j.number} to={`/surah/${j.startSurahId}`}>
                <Card className="p-3 hover-scale flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{j.number}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{j.nameArabic}</p>
                      <p className="text-xs text-muted-foreground">
                        {j.startSurahTranslit} • {t.ayah} {toArabicNumber(j.startAyah)}
                      </p>
                    </div>
                  </div>
                  <p className="font-arabic text-base text-accent">{j.startSurah}</p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* HIZB */}
      {activeTab === "hizb" && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.hizbPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            {filteredHizb.map(h => (
              <Link key={h.number} to={`/surah/${h.startSurahId}`}>
                <Card className="p-3 hover-scale flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent">{h.number}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{h.nameArabic}</p>
                      <p className="text-xs text-muted-foreground">
                        {h.startSurahTranslit} • {t.ayah} {toArabicNumber(h.startAyah)} • {t.juz} {h.juzNumber}
                      </p>
                    </div>
                  </div>
                  <p className="font-arabic text-base text-accent">{h.startSurah}</p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
