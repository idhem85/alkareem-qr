import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Sunrise, Sun, CloudSun, Sunset, Moon, MoonStar, MapPin, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const labels = {
  fr: {
    title: "Horaires des prières",
    fajr: "Fajr",
    sunrise: "Shurûq",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    loading: "Chargement…",
    error: "Impossible de récupérer les horaires",
    locationDenied: "Activez la localisation",
  },
  ar: {
    title: "مواقيت الصلاة",
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    loading: "جارٍ التحميل…",
    error: "تعذّر تحميل المواقيت",
    locationDenied: "فعّل خدمة الموقع",
  },
  en: {
    title: "Prayer Times",
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    loading: "Loading…",
    error: "Could not fetch prayer times",
    locationDenied: "Enable location access",
  },
};

const prayerIcons = [
  { key: "Fajr", icon: MoonStar, nameKey: "fajr" as const },
  { key: "Sunrise", icon: Sunrise, nameKey: "sunrise" as const },
  { key: "Dhuhr", icon: Sun, nameKey: "dhuhr" as const },
  { key: "Asr", icon: CloudSun, nameKey: "asr" as const },
  { key: "Maghrib", icon: Sunset, nameKey: "maghrib" as const },
  { key: "Isha", icon: Moon, nameKey: "isha" as const },
];

const timezoneCoords: Record<string, { lat: number; lng: number; name: string }> = {
  "Europe/Paris": { lat: 48.8566, lng: 2.3522, name: "Paris" },
  "Europe/London": { lat: 51.5074, lng: -0.1278, name: "London" },
  "Europe/Istanbul": { lat: 41.0082, lng: 28.9784, name: "Istanbul" },
  "Asia/Riyadh": { lat: 24.7136, lng: 46.6753, name: "Riyadh" },
  "Asia/Dubai": { lat: 25.2048, lng: 55.2708, name: "Dubai" },
  "Africa/Cairo": { lat: 30.0444, lng: 31.2357, name: "Cairo" },
  "Africa/Casablanca": { lat: 33.5731, lng: -7.5898, name: "Casablanca" },
  "Africa/Algiers": { lat: 36.7538, lng: 3.0588, name: "Algiers" },
  "Africa/Tunis": { lat: 36.8065, lng: 10.1815, name: "Tunis" },
  "Asia/Karachi": { lat: 24.8607, lng: 67.0011, name: "Karachi" },
  "Asia/Dhaka": { lat: 23.8103, lng: 90.4125, name: "Dhaka" },
  "Asia/Jakarta": { lat: -6.2088, lng: 106.8456, name: "Jakarta" },
  "Asia/Kuala_Lumpur": { lat: 3.139, lng: 101.6869, name: "Kuala Lumpur" },
  "America/New_York": { lat: 40.7128, lng: -74.006, name: "New York" },
  "America/Toronto": { lat: 43.6532, lng: -79.3832, name: "Toronto" },
};

function getNextPrayer(timings: PrayerTimesData): string | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const p of prayerIcons) {
    const raw = timings[p.key as keyof PrayerTimesData];
    if (!raw) continue;
    const [h, m] = raw.split(":").map(Number);
    if (h * 60 + m > currentMinutes) return p.key;
  }
  return null;
}

export function PrayerTimes() {
  const { settings } = useApp();
  const lang = (settings.language || "fr") as keyof typeof labels;
  const t = labels[lang] || labels.fr;
  const prayerTimezone = settings.prayerTimezone || "auto";

  const [timings, setTimings] = useState<PrayerTimesData | null>(null);
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrayerTimes(lat: number, lng: number, cityName?: string) {
      try {
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=2`
        );
        const data = await res.json();

        if (!cancelled && data.code === 200) {
          setTimings(data.data.timings);
          setCity(cityName || data.data.meta?.timezone?.split("/").pop()?.replace(/_/g, " ") || "");
        }
      } catch {
        if (!cancelled) setError(t.error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    setError(null);

    if (prayerTimezone !== "auto" && timezoneCoords[prayerTimezone]) {
      const tz = timezoneCoords[prayerTimezone];
      fetchPrayerTimes(tz.lat, tz.lng, tz.name);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude),
        () => fetchPrayerTimes(48.8566, 2.3522, "Paris"),
        { timeout: 5000 }
      );
    } else {
      fetchPrayerTimes(48.8566, 2.3522, "Paris");
    }

    return () => { cancelled = true; };
  }, [t.error, prayerTimezone]);

  const nextPrayer = useMemo(() => (timings ? getNextPrayer(timings) : null), [timings]);

  if (loading) {
    return (
      <Card className="p-4 border-border/50 bg-card">
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t.loading}</span>
        </div>
      </Card>
    );
  }

  if (error || !timings) {
    return (
      <Card className="p-4 border-border/50 bg-card">
        <p className="text-sm text-muted-foreground text-center py-2">{error || t.error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-border/50 bg-card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">{t.title}</h2>
        {city && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{city}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-6 gap-1">
        {prayerIcons.map(({ key, icon: Icon, nameKey }) => {
          const time = timings[key as keyof PrayerTimesData];
          const isNext = key === nextPrayer;
          const cleanTime = time?.replace(/\s*\(.*\)/, "");

          return (
            <div
              key={key}
              className={`flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-1 transition-colors ${
                isNext
                  ? "bg-primary/10 ring-1 ring-primary/20"
                  : ""
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isNext ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  isNext ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t[nameKey]}
              </span>
              <span
                className={`text-xs font-semibold tabular-nums ${
                  isNext ? "text-foreground" : "text-foreground/80"
                }`}
              >
                {cleanTime}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
