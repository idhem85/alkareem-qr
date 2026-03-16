import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { surahs } from "@/data/surahs";
import { AyahDrawer } from "@/components/quran/AyahDrawer";
import { ReadingToolbar } from "@/components/quran/ReadingToolbar";
import { MushafPage } from "@/components/quran/MushafPage";
import { useApp } from "@/contexts/AppContext";
import type { Ayah } from "@/data/ayahs";
import { useAyahs, prefetchSurah } from "@/hooks/useAyahs";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PageContent {
  pageNumber: number;
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  juzNumber: number;
  hizbInfo: string;
  segments: PageSegment[];
}

interface PageSegment {
  type: "surah-header" | "bismillah" | "ayahs";
  surahId?: number;
  surah?: typeof surahs[0];
  ayahs?: Ayah[];
}

function buildPagesForSurah(surahId: number): PageContent[] {
  const surah = surahs.find(s => s.id === surahId);
  if (!surah) return [];

  const allAyahs = ayahsBySurah[surahId] || [];
  if (allAyahs.length === 0) return [];

  const AYAHS_PER_PAGE = 8;
  const pages: PageContent[] = [];
  let currentAyahIndex = 0;

  while (currentAyahIndex < allAyahs.length) {
    const pageNumber = pages.length + 1;
    const segments: PageSegment[] = [];

    // First page gets surah header + bismillah
    if (currentAyahIndex === 0) {
      segments.push({ type: "surah-header", surahId, surah });
      if (surahId !== 1 && surahId !== 9) {
        segments.push({ type: "bismillah" });
      }
      // First page has fewer ayahs due to header
      const firstPageCount = Math.max(4, AYAHS_PER_PAGE - 2);
      const pageAyahs = allAyahs.slice(currentAyahIndex, currentAyahIndex + firstPageCount);
      segments.push({ type: "ayahs", ayahs: pageAyahs, surahId });
      currentAyahIndex += firstPageCount;
    } else {
      const pageAyahs = allAyahs.slice(currentAyahIndex, currentAyahIndex + AYAHS_PER_PAGE);
      segments.push({ type: "ayahs", ayahs: pageAyahs, surahId });
      currentAyahIndex += AYAHS_PER_PAGE;
    }

    // Determine juz (simplified mapping)
    const juz = Math.ceil(surahId / 4) || 1;
    
    pages.push({
      pageNumber,
      surahId,
      surahName: surah.nameTransliteration,
      surahNameArabic: surah.nameArabic,
      juzNumber: Math.min(juz, 30),
      hizbInfo: `½ Hizb ${juz * 2}`,
      segments,
    });
  }

  // If there's a next surah with content, add its beginning to continue the flow
  const nextSurahId = surahId + 1;
  if (nextSurahId <= 114) {
    const nextSurah = surahs.find(s => s.id === nextSurahId);
    const nextAyahs = ayahsBySurah[nextSurahId];
    if (nextSurah && nextAyahs && nextAyahs.length > 0) {
      // Add a transition page showing end of current + start of next
      const lastPage = pages[pages.length - 1];
      const lastSegmentAyahs = lastPage.segments.find(s => s.type === "ayahs")?.ayahs;
      
      // If the last page isn't full, append next surah header there
      if (lastSegmentAyahs && lastSegmentAyahs.length < 6) {
        lastPage.segments.push({ type: "surah-header", surahId: nextSurahId, surah: nextSurah });
        if (nextSurahId !== 9) {
          lastPage.segments.push({ type: "bismillah" });
        }
        const firstAyahs = nextAyahs.slice(0, 3);
        lastPage.segments.push({ type: "ayahs", ayahs: firstAyahs, surahId: nextSurahId });
      }
    }
  }

  return pages;
}

export default function MushafReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const surahId = parseInt(id || "1");
  const surah = surahs.find(s => s.id === surahId);

  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const { updateReadingProgress } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const pages = useMemo(() => buildPagesForSurah(surahId), [surahId]);

  useEffect(() => {
    setCurrentPageIndex(0);
    if (surah) updateReadingProgress(surahId, 1);
  }, [surahId]);

  // Auto-hide toolbar
  useEffect(() => {
    const showToolbar = () => {
      setToolbarVisible(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setToolbarVisible(false), 3000);
    };
    showToolbar();
    return () => clearTimeout(hideTimer.current);
  }, [currentPageIndex]);

  const goToPage = useCallback((index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
      const page = pages[index];
      const firstAyahSegment = page.segments.find(s => s.type === "ayahs");
      if (firstAyahSegment?.ayahs?.[0]) {
        updateReadingProgress(firstAyahSegment.ayahs[0].surahId, firstAyahSegment.ayahs[0].numberInSurah);
      }
    }
  }, [pages, updateReadingProgress]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      goToPage(currentPageIndex - 1);
    } else if (surahId > 1) {
      navigate(`/surah/${surahId - 1}`);
    }
  }, [currentPageIndex, goToPage, surahId, navigate]);

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      goToPage(currentPageIndex + 1);
    } else if (surahId < 114) {
      navigate(`/surah/${surahId + 1}`);
    }
  }, [currentPageIndex, pages.length, goToPage, surahId, navigate]);

  // Swipe handling
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      // RTL: swipe left = next, swipe right = prev (reversed for RTL)
      if (dx < 0) goToNextPage();
      else goToPrevPage();
    }
    touchStart.current = null;
  }, [goToNextPage, goToPrevPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToNextPage(); // RTL
      if (e.key === "ArrowRight") goToPrevPage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToNextPage, goToPrevPage]);

  if (!surah) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Sourate non trouvée.</p>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-arabic text-4xl text-accent">{surah.nameArabic}</p>
        <p className="text-muted-foreground text-sm">
          Le contenu de cette sourate sera disponible prochainement.
        </p>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="mushaf-container animate-fade-in" ref={containerRef}>
      {/* Toolbar - auto-hiding */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          toolbarVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        onClick={() => setToolbarVisible(true)}
      >
        <ReadingToolbar
          surahName={currentPage.surahName}
          juzNumber={currentPage.juzNumber}
          pageNumber={currentPageIndex + 1}
          totalPages={pages.length}
        />
      </div>

      {/* Mushaf Page */}
      <div
        className="mushaf-page-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setToolbarVisible(v => !v)}
      >
        <MushafPage
          page={currentPage}
          onAyahTap={(ayah) => {
            setSelectedAyah(ayah);
            setDrawerOpen(true);
            updateReadingProgress(ayah.surahId, ayah.numberInSurah);
          }}
          selectedAyahId={selectedAyah?.id}
        />
      </div>

      {/* Page navigation arrows - desktop */}
      <button
        onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}
        className="mushaf-nav-btn mushaf-nav-right"
        aria-label="Page précédente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goToNextPage(); }}
        className="mushaf-nav-btn mushaf-nav-left"
        aria-label="Page suivante"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page indicator dots */}
      <div className="mushaf-page-indicator">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goToPage(i); }}
            className={`mushaf-dot ${i === currentPageIndex ? "mushaf-dot-active" : ""}`}
          />
        ))}
      </div>

      <AyahDrawer ayah={selectedAyah} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
