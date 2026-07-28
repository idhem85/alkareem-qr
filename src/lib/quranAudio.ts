import { surahs } from "@/data/surahs";

// Cumulative ayah counts for computing global ayah number
const cumulativeAyahs: number[] = [];
let total = 0;
for (const s of surahs) {
  cumulativeAyahs.push(total);
  total += s.ayahCount;
}

/**
 * Convert surahId + ayahNumberInSurah to global ayah number (1-6236)
 */
export function getGlobalAyahNumber(surahId: number, ayahInSurah: number): number {
  return cumulativeAyahs[surahId - 1] + ayahInSurah;
}

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy", cdn: "islamic" as const },
  { id: "Abdurrahmaan_As-Sudais_64kbps", name: "Abdur-Rahman as-Sudais", cdn: "everyayah" as const },
  { id: "Ghamadi_40kbps", name: "Saad Al-Ghamidi", cdn: "everyayah" as const },
] as const;

/**
 * Get audio URL for a specific ayah.
 * Supports both Islamic Network CDN (global ayah number) and EveryAyah CDN (SSSAAA format).
 */
export function getAyahAudioUrl(surahId: number, ayahInSurah: number, reciterId: string = "ar.alafasy"): string {
  const reciter = RECITERS.find(r => r.id === reciterId);

  if (reciter?.cdn === "everyayah") {
    const surahStr = String(surahId).padStart(3, "0");
    const ayahStr = String(ayahInSurah).padStart(3, "0");
    return `https://everyayah.com/data/${reciterId}/${surahStr}${ayahStr}.mp3`;
  }

  const globalNum = getGlobalAyahNumber(surahId, ayahInSurah);
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalNum}.mp3`;
}
