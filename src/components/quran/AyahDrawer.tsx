import { Ayah, toArabicNumber } from "@/data/ayahs";
import { surahs } from "@/data/surahs";
import { useApp } from "@/contexts/AppContext";
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
  const { isBookmarked, addBookmark, removeBookmark, setAudio } = useApp();

  if (!ayah) return null;

  const surah = surahs.find(s => s.id === ayah.surahId);
  const bookmarked = isBookmarked(ayah.surahId, ayah.numberInSurah);

  const handleCopy = () => {
    navigator.clipboard.writeText(ayah.textArabic);
    toast({ title: "Copié", description: "Le verset a été copié dans le presse-papier." });
  };

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(ayah.surahId, ayah.numberInSurah);
      toast({ title: "Signet retiré" });
    } else {
      addBookmark(ayah.surahId, ayah.numberInSurah);
      toast({ title: "Signet ajouté" });
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-center pb-2">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-sm text-muted-foreground">
              {surah?.nameTransliteration} • Ayah {toArabicNumber(ayah.numberInSurah)}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <p className="font-quran text-xl mt-3 leading-relaxed" dir="rtl">{ayah.textArabic}</p>
        </DrawerHeader>

        <div className="flex items-center justify-center gap-2 py-3 border-b border-border">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5 mr-1.5" /> Copier
          </Button>
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5 mr-1.5" /> : <Bookmark className="h-3.5 w-3.5 mr-1.5" />}
            {bookmarked ? "Retiré" : "Signet"}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePlay}>
            <Play className="h-3.5 w-3.5 mr-1.5" /> Écouter
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5 mr-1.5" /> Partager
          </Button>
        </div>

        <Tabs defaultValue="translation" className="p-4">
          <TabsList className="w-full">
            <TabsTrigger value="translation" className="flex-1">Traduction</TabsTrigger>
            <TabsTrigger value="tafsir" className="flex-1">Tafsir</TabsTrigger>
          </TabsList>
          <TabsContent value="translation" className="mt-4">
            <p className="text-sm leading-relaxed text-foreground">{ayah.translationFr}</p>
          </TabsContent>
          <TabsContent value="tafsir" className="mt-4">
            <p className="text-sm leading-relaxed text-foreground">{ayah.tafsir}</p>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
