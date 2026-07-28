/**
 * Juz / Hizb data for the Quran.
 * Each Juz (جزء) is 1/30 of the Quran. Each Hizb (حزب) is 1/60 (2 per Juz).
 * Provides: juzStartData, hizbStartData, juzData, hizbData, getJuzForAyah()
 */
import { surahs } from "./surahs";
import { toArabicNumber } from "./ayahs";

// ===== Juz start positions =====
export const juzStartData: Record<number, { surahId: number; ayah: number }> = {
  1: { surahId: 1, ayah: 1 },
  2: { surahId: 2, ayah: 142 },
  3: { surahId: 2, ayah: 253 },
  4: { surahId: 3, ayah: 93 },
  5: { surahId: 4, ayah: 24 },
  6: { surahId: 4, ayah: 148 },
  7: { surahId: 5, ayah: 82 },
  8: { surahId: 6, ayah: 111 },
  9: { surahId: 7, ayah: 88 },
  10: { surahId: 8, ayah: 41 },
  11: { surahId: 9, ayah: 93 },
  12: { surahId: 11, ayah: 6 },
  13: { surahId: 12, ayah: 53 },
  14: { surahId: 15, ayah: 1 },
  15: { surahId: 17, ayah: 1 },
  16: { surahId: 18, ayah: 75 },
  17: { surahId: 21, ayah: 1 },
  18: { surahId: 23, ayah: 1 },
  19: { surahId: 25, ayah: 21 },
  20: { surahId: 27, ayah: 56 },
  21: { surahId: 29, ayah: 46 },
  22: { surahId: 33, ayah: 31 },
  23: { surahId: 36, ayah: 28 },
  24: { surahId: 39, ayah: 32 },
  25: { surahId: 41, ayah: 47 },
  26: { surahId: 46, ayah: 1 },
  27: { surahId: 51, ayah: 31 },
  28: { surahId: 58, ayah: 1 },
  29: { surahId: 67, ayah: 1 },
  30: { surahId: 78, ayah: 1 },
};

// ===== Hizb start positions =====
export const hizbStartData: Record<number, { surahId: number; ayah: number }> = {
  1: { surahId: 1, ayah: 1 },
  2: { surahId: 2, ayah: 75 },
  3: { surahId: 2, ayah: 142 },
  4: { surahId: 2, ayah: 203 },
  5: { surahId: 2, ayah: 253 },
  6: { surahId: 3, ayah: 15 },
  7: { surahId: 3, ayah: 93 },
  8: { surahId: 3, ayah: 171 },
  9: { surahId: 4, ayah: 24 },
  10: { surahId: 4, ayah: 88 },
  11: { surahId: 4, ayah: 148 },
  12: { surahId: 5, ayah: 27 },
  13: { surahId: 5, ayah: 82 },
  14: { surahId: 6, ayah: 36 },
  15: { surahId: 6, ayah: 111 },
  16: { surahId: 7, ayah: 1 },
  17: { surahId: 7, ayah: 88 },
  18: { surahId: 7, ayah: 171 },
  19: { surahId: 8, ayah: 41 },
  20: { surahId: 9, ayah: 34 },
  21: { surahId: 9, ayah: 93 },
  22: { surahId: 10, ayah: 26 },
  23: { surahId: 11, ayah: 6 },
  24: { surahId: 11, ayah: 83 },
  25: { surahId: 12, ayah: 53 },
  26: { surahId: 13, ayah: 19 },
  27: { surahId: 15, ayah: 1 },
  28: { surahId: 16, ayah: 51 },
  29: { surahId: 17, ayah: 1 },
  30: { surahId: 17, ayah: 99 },
  31: { surahId: 18, ayah: 75 },
  32: { surahId: 19, ayah: 75 },
  33: { surahId: 21, ayah: 1 },
  34: { surahId: 22, ayah: 1 },
  35: { surahId: 23, ayah: 1 },
  36: { surahId: 24, ayah: 21 },
  37: { surahId: 25, ayah: 21 },
  38: { surahId: 26, ayah: 111 },
  39: { surahId: 27, ayah: 56 },
  40: { surahId: 28, ayah: 51 },
  41: { surahId: 29, ayah: 46 },
  42: { surahId: 31, ayah: 22 },
  43: { surahId: 33, ayah: 31 },
  44: { surahId: 34, ayah: 24 },
  45: { surahId: 36, ayah: 28 },
  46: { surahId: 37, ayah: 145 },
  47: { surahId: 39, ayah: 32 },
  48: { surahId: 40, ayah: 41 },
  49: { surahId: 41, ayah: 47 },
  50: { surahId: 43, ayah: 24 },
  51: { surahId: 46, ayah: 1 },
  52: { surahId: 48, ayah: 18 },
  53: { surahId: 51, ayah: 31 },
  54: { surahId: 54, ayah: 1 },
  55: { surahId: 58, ayah: 1 },
  56: { surahId: 60, ayah: 7 },
  57: { surahId: 67, ayah: 1 },
  58: { surahId: 72, ayah: 1 },
  59: { surahId: 78, ayah: 1 },
  60: { surahId: 89, ayah: 1 },
};

// ===== Derived arrays =====
export interface JuzInfo {
  number: number;
  nameArabic: string;
  startSurah: string;
  startSurahTranslit: string;
  startSurahId: number;
  startAyah: number;
}

export interface HizbInfo {
  number: number;
  nameArabic: string;
  juzNumber: number;
  startSurah: string;
  startSurahTranslit: string;
  startSurahId: number;
  startAyah: number;
}

export const juzData: JuzInfo[] = Array.from({ length: 30 }, (_, i) => {
  const juzNum = i + 1;
  const start = juzStartData[juzNum] || { surahId: 1, ayah: 1 };
  const surah = surahs.find((s) => s.id === start.surahId);
  return {
    number: juzNum,
    nameArabic: `الجزء ${toArabicNumber(juzNum)}`,
    startSurah: surah?.nameArabic || "",
    startSurahTranslit: surah?.nameTransliteration || "",
    startSurahId: start.surahId,
    startAyah: start.ayah,
  };
});

export const hizbData: HizbInfo[] = Array.from({ length: 60 }, (_, i) => {
  const hizbNum = i + 1;
  const start = hizbStartData[hizbNum] || { surahId: 1, ayah: 1 };
  const surah = surahs.find((s) => s.id === start.surahId);
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

/**
 * Determine which Juz a given ayah belongs to.
 * Iterates juzStartData in reverse to find the correct Juz.
 */
export function getJuzForAyah(surahId: number, ayahNumber: number): number {
  const sorted = Object.entries(juzStartData)
    .map(([juz, pos]) => ({ juz: Number(juz), ...pos }))
    .sort((a, b) => {
      if (a.surahId !== b.surahId) return b.surahId - a.surahId;
      return b.ayah - a.ayah;
    });

  for (const entry of sorted) {
    if (surahId > entry.surahId || (surahId === entry.surahId && ayahNumber >= entry.ayah)) {
      return entry.juz;
    }
  }
  return 1;
}

/**
 * Get Hizb number for a given ayah.
 */
export function getHizbForAyah(surahId: number, ayahNumber: number): number {
  const sorted = Object.entries(hizbStartData)
    .map(([hizb, pos]) => ({ hizb: Number(hizb), ...pos }))
    .sort((a, b) => {
      if (a.surahId !== b.surahId) return b.surahId - a.surahId;
      return b.ayah - a.ayah;
    });

  for (const entry of sorted) {
    if (surahId > entry.surahId || (surahId === entry.surahId && ayahNumber >= entry.ayah)) {
      return entry.hizb;
    }
  }
  return 1;
}
