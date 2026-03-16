import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Type, Languages, BookOpen } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme, settings, updateSettings } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold mb-6">Réglages</h1>

      <div className="space-y-4">
        {/* Appearance */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Apparence
          </h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Mode sombre</Label>
            <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </Card>

        {/* Typography */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typographie
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Taille de la police coranique</Label>
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
            Traduction
          </h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-translation">Afficher la traduction</Label>
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
            Récitateur
          </h2>
          <p className="text-sm text-muted-foreground">{settings.reciter}</p>
        </Card>
      </div>
    </div>
  );
}
