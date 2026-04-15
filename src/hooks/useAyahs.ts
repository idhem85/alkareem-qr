import { useState, useEffect } from "react";
import { ayahsBySurah, type Ayah } from "@/data/ayahs";

const cache: Record<number, Ayah[]> = {};

// Remove Quranic annotation marks that render as black dots with some fonts
// U+06D6-U+06DC (waqf signs), U+06DE (rub el hizb), U+06DF-U+06E0, U+06ED
function cleanQuranicText(text: string): string {
  return text.replace(/[\u06D6-\u06DC\u06DE-\u06E0\u06ED]/g, '');
}

export function useAyahs(surahId: number) {
  const [ayahs, setAyahs] = useState<Ayah[]>(cache[surahId] || ayahsBySurah[surahId] || []);
  const [loading, setLoading] = useState(!cache[surahId] && !ayahsBySurah[surahId]);

  useEffect(() => {
    // If already cached or local data is complete, use it
    if (cache[surahId]) {
      setAyahs(cache[surahId]);
      setLoading(false);
      return;
    }

    // Always fetch from API to get full surah
    setLoading(true);
    const controller = new AbortController();

    fetch(
      `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,fr.hamidullah,en.sahih,ar.muyassar`,
      { signal: controller.signal }
    )
      .then(res => res.json())
      .then(data => {
        if (data.code === 200 && data.data?.length >= 2) {
          const arabicAyahs = data.data[0].ayahs;
          const frAyahs = data.data[1].ayahs;
          const enAyahs = data.data[2]?.ayahs || [];
          const tafsirArAyahs = data.data[3]?.ayahs || [];
          
          const mapped: Ayah[] = arabicAyahs.map((a: any, i: number) => ({
            id: a.number,
            surahId,
            numberInSurah: a.numberInSurah,
            textArabic: a.text,
            translationFr: frAyahs[i]?.text || "",
            translationEn: enAyahs[i]?.text || "",
            tafsir: tafsirArAyahs[i]?.text || "",
            tafsirAr: tafsirArAyahs[i]?.text || "",
            tafsirFr: "",
            tafsirEn: "",
          }));

          cache[surahId] = mapped;
          setAyahs(mapped);
        }
      })
      .catch(() => {
        // Fallback to local data
        if (ayahsBySurah[surahId]) {
          setAyahs(ayahsBySurah[surahId]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [surahId]);

  return { ayahs, loading };
}

/**
 * Prefetch next surah
 */
export function prefetchSurah(surahId: number) {
  if (cache[surahId] || surahId < 1 || surahId > 114) return;
  fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,fr.hamidullah,en.sahih,ar.muyassar`)
    .then(res => res.json())
    .then(data => {
      if (data.code === 200 && data.data?.length >= 2) {
        const arabicAyahs = data.data[0].ayahs;
        const frAyahs = data.data[1].ayahs;
        const enAyahs = data.data[2]?.ayahs || [];
        const tafsirArAyahs = data.data[3]?.ayahs || [];
        cache[surahId] = arabicAyahs.map((a: any, i: number) => ({
          id: a.number,
          surahId,
          numberInSurah: a.numberInSurah,
          textArabic: a.text,
          translationFr: frAyahs[i]?.text || "",
          translationEn: enAyahs[i]?.text || "",
          tafsir: tafsirArAyahs[i]?.text || "",
          tafsirAr: tafsirArAyahs[i]?.text || "",
          tafsirFr: "",
          tafsirEn: "",
        }));
      }
    })
    .catch(() => {});
}
