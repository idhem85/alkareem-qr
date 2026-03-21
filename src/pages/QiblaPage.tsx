import { useQibla } from "@/hooks/useQibla";
import { useApp } from "@/contexts/AppContext";
import { Compass, MapPin, Navigation, Loader2, LocateOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

const labels = {
  fr: {
    title: "Direction de la Qibla",
    subtitle: "Trouvez la direction de la Mecque",
    loading: "Recherche de votre position…",
    bearing: "Direction de la Qibla",
    yourPos: "Votre position",
    compass: "Boussole",
    noCompass: "Boussole non disponible sur cet appareil",
    noLocation: "Impossible d'obtenir votre position",
    locationDenied: "Accès à la localisation refusé. Autorisez-la dans les paramètres.",
    enableCompass: "Activer la boussole",
    degrees: "degrés",
    north: "N",
    south: "S",
    east: "E",
    west: "O",
    kaaba: "Kaaba",
    pointPhone: "Pointez votre téléphone vers",
    manualInfo: "La Qibla est à",
    fromNorth: "depuis le Nord",
  },
  ar: {
    title: "اتجاه القبلة",
    subtitle: "اعثر على اتجاه مكة المكرمة",
    loading: "جارٍ تحديد موقعك…",
    bearing: "اتجاه القبلة",
    yourPos: "موقعك",
    compass: "البوصلة",
    noCompass: "البوصلة غير متوفرة على هذا الجهاز",
    noLocation: "تعذر تحديد موقعك",
    locationDenied: "تم رفض الوصول إلى الموقع. فعّله من الإعدادات.",
    enableCompass: "تفعيل البوصلة",
    degrees: "درجة",
    north: "ش",
    south: "ج",
    east: "شر",
    west: "غ",
    kaaba: "الكعبة",
    pointPhone: "وجّه هاتفك نحو",
    manualInfo: "القبلة على بُعد",
    fromNorth: "من الشمال",
  },
  en: {
    title: "Qibla Direction",
    subtitle: "Find the direction of Mecca",
    loading: "Finding your location…",
    bearing: "Qibla Direction",
    yourPos: "Your position",
    compass: "Compass",
    noCompass: "Compass not available on this device",
    noLocation: "Unable to get your location",
    locationDenied: "Location access denied. Enable it in your settings.",
    enableCompass: "Enable compass",
    degrees: "degrees",
    north: "N",
    south: "S",
    east: "E",
    west: "W",
    kaaba: "Kaaba",
    pointPhone: "Point your phone towards",
    manualInfo: "Qibla is at",
    fromNorth: "from North",
  },
};

function getCardinalDirection(bearing: number, t: typeof labels.fr) {
  if (bearing >= 337.5 || bearing < 22.5) return t.north;
  if (bearing >= 22.5 && bearing < 67.5) return `${t.north}${t.east}`;
  if (bearing >= 67.5 && bearing < 112.5) return t.east;
  if (bearing >= 112.5 && bearing < 157.5) return `${t.south}${t.east}`;
  if (bearing >= 157.5 && bearing < 202.5) return t.south;
  if (bearing >= 202.5 && bearing < 247.5) return `${t.south}${t.west}`;
  if (bearing >= 247.5 && bearing < 292.5) return t.west;
  return `${t.north}${t.west}`;
}

export default function QiblaPage() {
  const { settings } = useApp();
  const lang = settings.language || "fr";
  const t = labels[lang as keyof typeof labels] || labels.fr;
  const {
    qiblaBearing,
    compassHeading,
    qiblaRelative,
    loading,
    locationError,
    compassSupported,
    compassError,
    requestCompassPermission,
  } = useQibla();

  const [needsIOSPermission, setNeedsIOSPermission] = useState(false);

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      setNeedsIOSPermission(true);
    }
  }, []);

  const handleEnableCompass = async () => {
    const granted = await requestCompassPermission();
    if (granted) setNeedsIOSPermission(false);
  };

  // Smooth animation values
  const compassRotation = compassHeading !== null ? -compassHeading : 0;
  const qiblaRotation = qiblaRelative !== null ? qiblaRelative : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <LocateOff className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          {locationError === "location_denied" ? t.locationDenied : t.noLocation}
        </p>
      </div>
    );
  }

  const hasCompass = compassSupported && compassHeading !== null && !compassError;

  return (
    <div className="px-4 py-6 pb-24 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* iOS compass permission */}
      {needsIOSPermission && !hasCompass && (
        <Card className="p-4 border-accent/30 bg-accent/5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-accent shrink-0" />
            <div className="flex-1">
              <Button
                size="sm"
                variant="outline"
                className="w-full border-accent/40 text-accent hover:bg-accent/10"
                onClick={handleEnableCompass}
              >
                <Navigation className="h-4 w-4 mr-2" />
                {t.enableCompass}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main compass */}
      <div className="relative flex items-center justify-center">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
          {/* Compass dial */}
          {/* Compass dial - rotates with device heading */}
          <div
            className="absolute inset-0"
            style={{
              transform: hasCompass ? `rotate(${compassRotation}deg)` : undefined,
              transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Outer ring */}
              <circle cx="150" cy="150" r="145" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
              <circle cx="150" cy="150" r="130" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />

              {/* Degree ticks */}
              {Array.from({ length: 72 }, (_, i) => {
                const angle = i * 5;
                const isMajor = angle % 30 === 0;
                const r1 = isMajor ? 125 : 128;
                const r2 = 135;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={150 + r1 * Math.sin(rad)}
                    y1={150 - r1 * Math.cos(rad)}
                    x2={150 + r2 * Math.sin(rad)}
                    y2={150 - r2 * Math.cos(rad)}
                    stroke={isMajor ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.4)"}
                    strokeWidth={isMajor ? 2 : 1}
                  />
                );
              })}

              {/* Cardinal labels */}
              <text x="150" y="30" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="16" fontWeight="bold">
                {t.north}
              </text>
              <text x="275" y="155" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="600">
                {t.east}
              </text>
              <text x="150" y="280" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="600">
                {t.south}
              </text>
              <text x="25" y="155" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="600">
                {t.west}
              </text>
            </svg>
          </div>

          {/* Qibla indicator arrow — stays fixed pointing to Qibla */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: hasCompass
                ? `rotate(${qiblaRotation}deg)`
                : `rotate(${qiblaBearing ?? 0}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Arrow pointing up (to Qibla direction) */}
              <div className="absolute top-3 flex flex-col items-center gap-0.5">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-primary/20">
                  <span className="text-lg leading-none">🕋</span>
                </div>
                <div className="w-0.5 h-20 bg-gradient-to-b from-primary via-primary/40 to-transparent rounded-full" />
              </div>
              {/* Opposite tail */}
              <div className="absolute bottom-8 flex flex-col items-center">
                <div className="w-0.5 h-10 bg-gradient-to-t from-muted-foreground/20 to-transparent rounded-full" />
              </div>
            </div>
          </div>

          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-background border-2 border-primary/30 flex flex-col items-center justify-center shadow-md">
              <Compass className="h-5 w-5 text-primary mb-0.5" />
              <span className="text-[10px] font-semibold text-muted-foreground">Qibla</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bearing info */}
      {qiblaBearing !== null && (
        <Card className="p-4 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.bearing}</p>
                <p className="text-xs text-muted-foreground">
                  {t.manualInfo} {Math.round(qiblaBearing)}° {getCardinalDirection(qiblaBearing, t)} {t.fromNorth}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{Math.round(qiblaBearing)}°</span>
            </div>
          </div>
        </Card>
      )}

      {/* No compass fallback info */}
      {!hasCompass && qiblaBearing !== null && (
        <Card className="p-3 border-accent/20 bg-accent/5">
          <div className="flex items-start gap-2">
            <Navigation className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              {t.pointPhone} <strong>{Math.round(qiblaBearing)}° {getCardinalDirection(qiblaBearing, t)}</strong> {t.fromNorth}.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
