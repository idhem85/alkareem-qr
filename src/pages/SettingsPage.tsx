import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Type, Languages, BookOpen, Globe, MapPin, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const languages = [
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "ar", label: "ع", flag: "🇸🇦" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

const timezones = [
  { value: "auto", label: { fr: "Automatique (GPS)", ar: "تلقائي (GPS)", en: "Automatic (GPS)" } },
  { value: "Europe/Paris", label: { fr: "Paris", ar: "باريس", en: "Paris" } },
  { value: "Europe/London", label: { fr: "Londres", ar: "لندن", en: "London" } },
  { value: "Europe/Istanbul", label: { fr: "Istanbul", ar: "إسطنبول", en: "Istanbul" } },
  { value: "Asia/Riyadh", label: { fr: "Riyad", ar: "الرياض", en: "Riyadh" } },
  { value: "Asia/Dubai", label: { fr: "Dubaï", ar: "دبي", en: "Dubai" } },
  { value: "Africa/Cairo", label: { fr: "Le Caire", ar: "القاهرة", en: "Cairo" } },
  { value: "Africa/Casablanca", label: { fr: "Casablanca", ar: "الدار البيضاء", en: "Casablanca" } },
  { value: "Africa/Algiers", label: { fr: "Alger", ar: "الجزائر", en: "Algiers" } },
  { value: "Africa/Tunis", label: { fr: "Tunis", ar: "تونس", en: "Tunis" } },
  { value: "Asia/Karachi", label: { fr: "Karachi", ar: "كراتشي", en: "Karachi" } },
  { value: "Asia/Dhaka", label: { fr: "Dacca", ar: "دكا", en: "Dhaka" } },
  { value: "Asia/Jakarta", label: { fr: "Jakarta", ar: "جاكرتا", en: "Jakarta" } },
  { value: "Asia/Kuala_Lumpur", label: { fr: "Kuala Lumpur", ar: "كوالالمبور", en: "Kuala Lumpur" } },
  { value: "America/New_York", label: { fr: "New York", ar: "نيويورك", en: "New York" } },
  { value: "America/Toronto", label: { fr: "Toronto", ar: "تورونتو", en: "Toronto" } },
];

export default function SettingsPage() {
  const { theme, toggleTheme, settings, updateSettings } = useApp();
  const lang = settings.language || "fr";

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const labels = {
    fr: { title: "Réglages", language: "Langue", appearance: "Apparence", typography: "Typographie", fontSize: "Taille du texte", translation: "Traduction", showTranslation: "Afficher la traduction", reciter: "Récitateur", prayerZone: "Fuseau horaire des prières", installApp: "Enregistrer sur mon écran d'accueil", installed: "Application installée", iosHint: "Appuie sur le bouton Partager puis « Sur l'écran d'accueil »" },
    ar: { title: "الإعدادات", language: "اللغة", appearance: "المظهر", typography: "الخط", fontSize: "حجم الخط", translation: "الترجمة", showTranslation: "إظهار الترجمة", reciter: "القارئ", prayerZone: "المنطقة الزمنية للصلاة", installApp: "حفظ على الشاشة الرئيسية", installed: "التطبيق مثبّت", iosHint: "اضغط على زر المشاركة ثم « إضافة إلى الشاشة الرئيسية »" },
    en: { title: "Settings", language: "Language", appearance: "Appearance", typography: "Typography", fontSize: "Font size", translation: "Translation", showTranslation: "Show translation", reciter: "Reciter", prayerZone: "Prayer timezone", installApp: "Add to Home Screen", installed: "App installed", iosHint: "Tap the Share button then 'Add to Home Screen'" },
  };
  const t = labels[lang as keyof typeof labels] || labels.fr;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold mb-5">{t.title}</h1>

      <div className="space-y-3">
        {/* Language — compact inline */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              {t.language}
            </span>
            <div className="flex gap-1">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => updateSettings({ language: l.code })}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs font-medium",
                    lang === l.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-sm">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Appearance — two icon buttons */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.appearance}</span>
            <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium",
                  theme === "light"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium",
                  theme === "dark"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Typography — compact */}
        <Card className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Type className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">{t.fontSize}</span>
            <span className="text-[10px] text-muted-foreground ml-auto">{settings.fontSize}px</span>
          </div>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([v]) => updateSettings({ fontSize: v })}
            min={18}
            max={48}
            step={2}
          />
          <p className="font-quran text-center mt-2 leading-relaxed" style={{ fontSize: `${settings.fontSize}px` }}>
            بِسْمِ ٱللَّهِ
          </p>
        </Card>

        {/* Translation */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <Languages className="h-3.5 w-3.5 text-muted-foreground" />
              {t.showTranslation}
            </span>
            <Switch
              checked={settings.showTranslation}
              onCheckedChange={(checked) => updateSettings({ showTranslation: checked })}
            />
          </div>
        </Card>

        {/* Prayer timezone */}
        <Card className="p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium flex items-center gap-1.5 shrink-0">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {t.prayerZone}
            </span>
            <Select
              value={settings.prayerTimezone || "auto"}
              onValueChange={(v) => updateSettings({ prayerTimezone: v })}
            >
              <SelectTrigger className="h-8 text-xs w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(tz => (
                  <SelectItem key={tz.value} value={tz.value} className="text-xs">
                    {tz.label[lang as keyof typeof tz.label] || tz.label.fr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Reciter */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              {t.reciter}
            </span>
            <span className="text-xs text-muted-foreground">{settings.reciter}</span>
          </div>
        </Card>

        {/* Install PWA */}
        <Card className="p-3">
          {isInstalled ? (
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <Check className="h-4 w-4" />
              {t.installed}
            </div>
          ) : isIOS ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t.installApp}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.iosHint}</p>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleInstall}
              disabled={!deferredPrompt}
            >
              <Download className="h-4 w-4" />
              {t.installApp}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
