import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Hash, Layers, BookMarked } from "lucide-react";
import { surahs } from "@/data/surahs";
import { ayahsBySurah, type Ayah, toArabicNumber } from "@/data/ayahs";
import { juzData, hizbData } from "@/data/juz";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/AppContext";

type SearchTab = "surah" | "juz" | "hizb" | "text";

const tabs: { id: SearchTab; label: string; labelAr: string; labelEn: string; icon: typeof Search }[] = [
  { id: "text", label: "Texte", labelAr: "نص", labelEn: "Text", icon: Search },
  { id: "surah", label: "Sourate", labelAr: "سورة", labelEn: "Surah", icon: BookOpen },
  { id: "juz", label: "Juz", labelAr: "جزء", labelEn: "Juz", icon: Layers },
  { id: "hizb", label: "Hizb", labelAr: "حزب", labelEn: "Hizb", icon: BookMarked },
];

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
  const { settings } = useSettings();
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
                <Link key={r.id} to={`/surah/${r.surahId}?ayah=${r.numberInSurah}`}>
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

      {/* SURAH LISTING + VERSE LOOKUP */}
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

          {/* Verse lookup section */}
          <div className="mb-4 p-3 rounded-xl bg-secondary/50 border border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Hash className="h-3 w-3" />
              {t.goToVerse}
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={t.verseSurah}
                value={surahInput}
                onChange={e => setSurahInput(e.target.value)}
                min={1}
                max={114}
                className="flex-1 h-8 text-xs"
              />
              <Input
                type="number"
                placeholder={t.verseAyah}
                value={verseInput}
                onChange={e => setVerseInput(e.target.value)}
                min={1}
                className="flex-1 h-8 text-xs"
              />
            </div>
            {verseSurahId > 0 && verseNum > 0 && verseSurah && verseNum <= verseSurah.ayahCount && (
              <Link to={`/surah/${verseSurahId}?ayah=${verseNum}`} className="block mt-2">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <p className="text-xs font-semibold text-primary">{verseSurah.nameTransliteration} {verseSurahId}:{verseNum}</p>
                </div>
              </Link>
            )}
            {verseSurahId > 0 && verseNum > 0 && verseSurah && verseNum > verseSurah.ayahCount && (
              <p className="text-center text-destructive mt-2 text-xs">{t.invalidVerse}</p>
            )}
          </div>

          {/* Surah list */}
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
