import { Minus, Plus, Moon, Sun, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toArabicNumber } from "@/data/ayahs";

interface ReadingToolbarProps {
  surahName?: string;
  surahNameArabic?: string;
  juzNumber?: number;
  pageNumber?: number;
  totalPages?: number;
}

export function ReadingToolbar({ surahName, surahNameArabic, pageNumber, totalPages }: ReadingToolbarProps) {
  const { settings, updateSettings, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  return (
    <div className="frosted-glass px-3 py-3 md:py-2 shadow-sm">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {/* Right side (RTL): Back + surah info */}
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="default"
            size="sm"
            className="shrink-0 gap-1.5 h-10 md:h-8 px-3 md:px-2 text-sm md:text-xs"
            onClick={() => navigate("/surahs")}
          >
            <ArrowRight className="h-5 w-5 md:h-4 md:w-4" />
            <span className="font-arabic">رجوع</span>
          </Button>
          <div className="min-w-0 flex items-center gap-1.5">
            {surahNameArabic && (
              <span className="font-arabic text-sm md:text-xs text-foreground truncate">{surahNameArabic}</span>
            )}
            {pageNumber && totalPages && (
              <span className="text-xs md:text-[10px] text-muted-foreground shrink-0">
                {pageNumber}/{totalPages}
              </span>
            )}
          </div>
        </div>

        {/* Left side: Controls */}
        <div className="flex items-center gap-1 md:gap-0.5">
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8" onClick={() => updateSettings({ fontSize: Math.max(18, settings.fontSize - 2) })}>
            <Minus className="h-4 w-4 md:h-3.5 md:w-3.5" />
          </Button>
          <span className="text-xs md:text-[10px] text-muted-foreground w-6 md:w-5 text-center">{settings.fontSize}</span>
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8" onClick={() => updateSettings({ fontSize: Math.min(48, settings.fontSize + 2) })}>
            <Plus className="h-4 w-4 md:h-3.5 md:w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8" onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}>
            {settings.showTranslation ? <Eye className="h-4 w-4 md:h-3.5 md:w-3.5" /> : <EyeOff className="h-4 w-4 md:h-3.5 md:w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4 md:h-3.5 md:w-3.5" /> : <Moon className="h-4 w-4 md:h-3.5 md:w-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
