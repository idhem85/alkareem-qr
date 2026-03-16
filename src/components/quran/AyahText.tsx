import { Ayah } from "@/data/ayahs";
import { toArabicNumber } from "@/data/ayahs";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface AyahTextProps {
  ayah: Ayah;
  onTap?: (ayah: Ayah) => void;
  isActive?: boolean;
}

export function AyahText({ ayah, onTap, isActive }: AyahTextProps) {
  const { settings } = useApp();

  return (
    <span
      onClick={() => onTap?.(ayah)}
      className={cn(
        "cursor-pointer transition-colors duration-200 rounded-sm px-1",
        isActive && "bg-accent/20",
        "hover:bg-accent/10"
      )}
    >
      <span
        className="font-quran leading-[2.2]"
        style={{ fontSize: `${settings.fontSize}px` }}
      >
        {ayah.textArabic}
      </span>
      <span className="ayah-marker">{toArabicNumber(ayah.numberInSurah)}</span>
      {settings.showTranslation && (
        <span className="block text-sm text-muted-foreground mt-1 mb-4 font-sans text-left" dir="ltr">
          {ayah.translationFr}
        </span>
      )}
    </span>
  );
}
