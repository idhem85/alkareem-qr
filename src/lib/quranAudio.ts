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

/**
 * Get audio URL for a specific ayah using Alafasy recitation
 */
export function getAyahAudioUrl(surahId: number, ayahInSurah: number): string {
  const globalNum = getGlobalAyahNumber(surahId, ayahInSurah);
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNum}.mp3`;
}
