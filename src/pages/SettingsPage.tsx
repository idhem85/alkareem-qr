import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Type, Languages, BookOpen, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function SettingsPage() {
  const { theme, toggleTheme, settings, updateSettings } = useApp();
  const lang = settings.language || "fr";

  const labels = {
    fr: { title: "Réglages", appearance: "Apparence", darkMode: "Mode sombre", typography: "Typographie", fontSize: "Taille de la police coranique", translation: "Traduction", showTranslation: "Afficher la traduction", reciter: "Récitateur", language: "Langue de l'interface" },
    ar: { title: "الإعدادات", appearance: "المظهر", darkMode: "الوضع الداكن", typography: "الخط", fontSize: "حجم الخط القرآني", translation: "الترجمة", showTranslation: "إظهار الترجمة", reciter: "القارئ", language: "لغة التطبيق" },
    en: { title: "Settings", appearance: "Appearance", darkMode: "Dark mode", typography: "Typography", fontSize: "Quranic font size", translation: "Translation", showTranslation: "Show translation", reciter: "Reciter", language: "App language" },
  };
  const t = labels[lang as keyof typeof labels] || labels.fr;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold mb-6">{t.title}</h1>

      <div className="space-y-4">
        {/* Language */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t.language}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => updateSettings({ language: l.code })}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-sm",
                  lang === l.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="text-lg">{l.flag}</span>
                <span className="font-medium text-xs">{l.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {t.appearance}
          </h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">{t.darkMode}</Label>
            <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </Card>

        {/* Typography */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Type className="h-4 w-4" />
            {t.typography}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>{t.fontSize}</Label>
                <span className="text-xs text-muted-foreground">{settings.fontSize}px</span>
              </div>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([v]) => updateSettings({ fontSize: v })}
                min={18}
                max={48}
                step={2}
              />
              <p className="font-quran text-center mt-3" style={{ fontSize: `${settings.fontSize}px` }}>
                بِسْمِ ٱللَّهِ
              </p>
            </div>
          </div>
        </Card>

        {/* Translation */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {t.translation}
          </h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-translation">{t.showTranslation}</Label>
            <Switch
              id="show-translation"
              checked={settings.showTranslation}
              onCheckedChange={(checked) => updateSettings({ showTranslation: checked })}
            />
          </div>
        </Card>

        {/* Reciter */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t.reciter}
          </h2>
          <p className="text-sm text-muted-foreground">{settings.reciter}</p>
        </Card>
      </div>
    </div>
  );
}
