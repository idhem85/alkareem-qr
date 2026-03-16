import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { surahs } from "@/data/surahs";
import { ayahsBySurah, type Ayah } from "@/data/ayahs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toArabicNumber } from "@/data/ayahs";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results: (Ayah & { surahName: string })[] = [];
  if (query.length >= 2) {
    const q = query.toLowerCase();
    for (const [surahId, ayahs] of Object.entries(ayahsBySurah)) {
      const surah = surahs.find(s => s.id === Number(surahId));
      for (const ayah of ayahs) {
        if (
          ayah.textArabic.includes(query) ||
          ayah.translationFr.toLowerCase().includes(q)
        ) {
          results.push({ ...ayah, surahName: surah?.nameTransliteration || "" });
        }
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Recherche</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans le Coran..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-10"
          autoFocus
        />
      </div>

      {query.length < 2 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          Tapez au moins 2 caractères pour rechercher.
        </p>
      ) : results.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          Aucun résultat pour « {query} ».
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{results.length} résultat(s)</p>
          {results.map(r => (
            <Link key={r.id} to={`/surah/${r.surahId}`}>
              <Card className="p-4 hover-scale">
                <p className="text-xs text-accent mb-2">
                  {r.surahName} • Ayah {toArabicNumber(r.numberInSurah)}
                </p>
                <p className="font-quran text-lg leading-relaxed mb-2" dir="rtl">
                  {r.textArabic}
                </p>
                <p className="text-sm text-muted-foreground">{r.translationFr}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
