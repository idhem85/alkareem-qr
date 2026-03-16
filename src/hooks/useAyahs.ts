import { useState, useEffect } from "react";
import { ayahsBySurah, type Ayah } from "@/data/ayahs";

const cache: Record<number, Ayah[]> = {};

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
      `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,fr.hamidullah`,
      { signal: controller.signal }
    )
      .then(res => res.json())
      .then(data => {
        if (data.code === 200 && data.data?.length >= 2) {
          const arabicAyahs = data.data[0].ayahs;
          const frAyahs = data.data[1].ayahs;
          
          const mapped: Ayah[] = arabicAyahs.map((a: any, i: number) => ({
            id: a.number,
            surahId,
            numberInSurah: a.numberInSurah,
            textArabic: a.text,
            translationFr: frAyahs[i]?.text || "",
            tafsir: "",
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
  fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,fr.hamidullah`)
    .then(res => res.json())
    .then(data => {
      if (data.code === 200 && data.data?.length >= 2) {
        const arabicAyahs = data.data[0].ayahs;
        const frAyahs = data.data[1].ayahs;
        cache[surahId] = arabicAyahs.map((a: any, i: number) => ({
          id: a.number,
          surahId,
          numberInSurah: a.numberInSurah,
          textArabic: a.text,
          translationFr: frAyahs[i]?.text || "",
          tafsir: "",
        }));
      }
    })
    .catch(() => {});
}
