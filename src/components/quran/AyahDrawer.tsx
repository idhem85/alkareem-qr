import { Ayah, toArabicNumber } from "@/data/ayahs";
import { surahs } from "@/data/surahs";
import { useApp } from "@/contexts/AppContext";
import { useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Copy, Share2, Play, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AyahDrawerProps {
  ayah: Ayah | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AyahDrawer({ ayah, open, onOpenChange }: AyahDrawerProps) {
  const { isBookmarked, addBookmark, removeBookmark, setAudio, settings } = useApp();

  if (!ayah) return null;

  const surah = surahs.find(s => s.id === ayah.surahId);
  const bookmarked = isBookmarked(ayah.surahId, ayah.numberInSurah);
  const lang = settings.language || "fr";

  const translation = useMemo(() => {
    if (lang === "en") return ayah.translationEn || ayah.translationFr;
    if (lang === "ar") return ayah.translationAr || ayah.translationFr;
    return ayah.translationFr;
  }, [ayah, lang]);

  const tafsirText = useMemo(() => {
    // Arabic tafsir is always available from API (ar.muyassar)
    if (lang === "ar") return ayah.tafsirAr || ayah.tafsir || "";
    if (lang === "en") return ayah.tafsirEn || ayah.tafsirAr || ayah.tafsir || "";
    if (lang === "fr") return ayah.tafsirFr || ayah.tafsirAr || ayah.tafsir || "";
    return ayah.tafsir || "";
  }, [ayah, lang]);

  const tafsirLabel = lang === "ar" ? "التفسير الميسر" : lang === "en" ? "Tafsir (Al-Muyassar)" : "Tafsir (Al-Muyassar)";
  const noTafsirMsg = lang === "ar" ? "التفسير غير متوفر حالياً" : lang === "en" ? "Tafsir not available yet." : "Tafsir non disponible pour le moment.";

  const handleCopy = () => {
    navigator.clipboard.writeText(ayah.textArabic);
    toast({ title: "تم النسخ", description: "تم نسخ الآية إلى الحافظة." });
  };

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(ayah.surahId, ayah.numberInSurah);
      toast({ title: "تم إزالة العلامة" });
    } else {
      addBookmark(ayah.surahId, ayah.numberInSurah);
      toast({ title: "تم حفظ العلامة" });
    }
  };

  const handlePlay = () => {
    setAudio(prev => ({
      ...prev,
      isPlaying: true,
      currentSurahId: ayah.surahId,
      currentAyah: ayah.numberInSurah,
    }));
    onOpenChange(false);
  };

  const handleShare = async () => {
    const text = `${ayah.textArabic}\n\n${ayah.translationFr}\n\n— ${surah?.nameTransliteration} ${ayah.surahId}:${ayah.numberInSurah}`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "تم النسخ للمشاركة" });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center pb-2">
          <div className="flex items-center justify-between">
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-sm text-muted-foreground font-arabic">
              {surah?.nameArabic} • الآية {toArabicNumber(ayah.numberInSurah)}
            </DrawerTitle>
          </div>
          <p className="font-quran text-xl mt-3 leading-[2.4]" dir="rtl">{ayah.textArabic}</p>
        </DrawerHeader>

        <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-border">
          <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-[10px]" onClick={handlePlay}>
            <Play className="h-4 w-4" />
            استماع
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-[10px]" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            نسخ
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-[10px]" onClick={handleBookmark}>
            {bookmarked ? <BookmarkCheck className="h-4 w-4 text-accent" /> : <Bookmark className="h-4 w-4" />}
            {bookmarked ? "محفوظ" : "حفظ"}
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-[10px]" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            مشاركة
          </Button>
        </div>

        <Tabs defaultValue="translation" className="p-4 overflow-y-auto">
          <TabsList className="w-full">
            <TabsTrigger value="translation" className="flex-1">الترجمة</TabsTrigger>
            <TabsTrigger value="tafsir" className="flex-1">التفسير</TabsTrigger>
          </TabsList>
          <TabsContent value="translation" className="mt-4">
            <p className="text-sm leading-relaxed text-foreground">{ayah.translationFr}</p>
          </TabsContent>
          <TabsContent value="tafsir" className="mt-4">
            {ayah.tafsir ? (
              <p className="text-sm leading-relaxed text-foreground">{ayah.tafsir}</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                التفسير غير متوفر حالياً
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
