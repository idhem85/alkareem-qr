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
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.abdurrahmaansudais", name: "Abdur-Rahman as-Sudais" },
] as const;

/**
 * Get audio URL for a specific ayah using a given reciter
 */
export function getAyahAudioUrl(surahId: number, ayahInSurah: number, reciterId: string = "ar.alafasy"): string {
  const globalNum = getGlobalAyahNumber(surahId, ayahInSurah);
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalNum}.mp3`;
}
