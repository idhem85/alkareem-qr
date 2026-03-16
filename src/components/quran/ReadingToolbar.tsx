import { Minus, Plus, Moon, Sun, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ReadingToolbarProps {
  surahName?: string;
  juzNumber?: number;
  pageNumber?: number;
  totalPages?: number;
}

export function ReadingToolbar({ surahName, pageNumber, totalPages }: ReadingToolbarProps) {
  const { settings, updateSettings, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  return (
    <div className="frosted-glass px-4 py-2 shadow-sm">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {/* Left: Back + info */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/surahs")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          {surahName && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {surahName}
              {pageNumber && totalPages ? ` — ${pageNumber}/${totalPages}` : ""}
            </span>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateSettings({ fontSize: Math.max(18, settings.fontSize - 2) })}>
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground w-6 text-center">{settings.fontSize}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateSettings({ fontSize: Math.min(48, settings.fontSize + 2) })}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}>
            {settings.showTranslation ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
