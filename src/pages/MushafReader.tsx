import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { surahs } from "@/data/surahs";
import { AyahDrawer } from "@/components/quran/AyahDrawer";
import { ReadingToolbar } from "@/components/quran/ReadingToolbar";
import { MushafPage } from "@/components/quran/MushafPage";
import { MushafLoadingSkeleton } from "@/components/quran/MushafLoadingSkeleton";
import { MushafErrorState } from "@/components/quran/MushafErrorState";
import { useApp } from "@/contexts/AppContext";
import type { Ayah } from "@/data/ayahs";
import { useAyahs, prefetchSurah } from "@/hooks/useAyahs";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

function buildPagesForSurah(surahId: number, allAyahs: Ayah[]): PageContent[] {
  const surah = surahs.find(s => s.id === surahId);
  if (!surah || allAyahs.length === 0) return [];

  const AYAHS_PER_PAGE = 8;
  const pages: PageContent[] = [];
  let currentAyahIndex = 0;

  while (currentAyahIndex < allAyahs.length) {
    const segments: PageSegment[] = [];

    if (currentAyahIndex === 0) {
      segments.push({ type: "surah-header", surahId, surah });
      if (surahId !== 1 && surahId !== 9) {
        segments.push({ type: "bismillah" });
      }
      const firstPageCount = Math.max(4, AYAHS_PER_PAGE - 2);
      const pageAyahs = allAyahs.slice(currentAyahIndex, currentAyahIndex + firstPageCount);
      segments.push({ type: "ayahs", ayahs: pageAyahs, surahId });
      currentAyahIndex += firstPageCount;
    } else {
      const pageAyahs = allAyahs.slice(currentAyahIndex, currentAyahIndex + AYAHS_PER_PAGE);
      segments.push({ type: "ayahs", ayahs: pageAyahs, surahId });
      currentAyahIndex += AYAHS_PER_PAGE;
    }

    const juz = Math.ceil(surahId / 4) || 1;

    pages.push({
      pageNumber: pages.length + 1,
      surahId,
      surahName: surah.nameTransliteration,
      surahNameArabic: surah.nameArabic,
      juzNumber: Math.min(juz, 30),
      hizbInfo: `½ حزب ${juz * 2}`,
      segments,
    });
  }

  return pages;
}

export default function MushafReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const surahId = parseInt(id || "1");
  const surah = surahs.find(s => s.id === surahId);

  const { ayahs, loading } = useAyahs(surahId);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const { updateReadingProgress } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const pages = useMemo(() => buildPagesForSurah(surahId, ayahs), [surahId, ayahs]);

  useEffect(() => { prefetchSurah(surahId + 1); }, [surahId]);

  useEffect(() => {
    setCurrentPageIndex(0);
    if (surah) updateReadingProgress(surahId, 1);
  }, [surahId]);

  useEffect(() => {
    const showToolbar = () => {
      setToolbarVisible(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setToolbarVisible(false), 3500);
    };
    showToolbar();
    return () => clearTimeout(hideTimer.current);
  }, [currentPageIndex]);

  const goToPage = useCallback((index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
      // Scroll ayah blocks back to top
      containerRef.current?.querySelectorAll('.mushaf-ayah-block').forEach(el => {
        el.scrollTop = 0;
      });
      const page = pages[index];
      const firstAyahSegment = page.segments.find(s => s.type === "ayahs");
      if (firstAyahSegment?.ayahs?.[0]) {
        updateReadingProgress(firstAyahSegment.ayahs[0].surahId, firstAyahSegment.ayahs[0].numberInSurah);
      }
    }
  }, [pages, updateReadingProgress]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) goToPage(currentPageIndex - 1);
    else if (surahId > 1) navigate(`/surah/${surahId - 1}`);
  }, [currentPageIndex, goToPage, surahId, navigate]);

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < pages.length - 1) goToPage(currentPageIndex + 1);
    else if (surahId < 114) navigate(`/surah/${surahId + 1}`);
  }, [currentPageIndex, pages.length, goToPage, surahId, navigate]);

  // Swipe (RTL: swipe left → next page, swipe right → prev page)
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      // RTL: swipe right (dx > 0) → next page, swipe left (dx < 0) → prev page
      if (dx > 0) goToNextPage();
      else goToPrevPage();
    }
    touchStart.current = null;
  }, [goToNextPage, goToPrevPage]);

  // Keyboard navigation (RTL aware)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToNextPage();
      if (e.key === "ArrowRight") goToPrevPage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToNextPage, goToPrevPage]);

  // Not found
  if (!surah) {
    return <MushafErrorState message="سورة غير موجودة — Sourate non trouvée." />;
  }

  // Loading
  if (loading || pages.length === 0) {
    if (loading) return <MushafLoadingSkeleton surahNameArabic={surah.nameArabic} />;
    return <MushafErrorState message="المحتوى غير متاح — Contenu indisponible." onRetry={() => window.location.reload()} />;
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="mushaf-container animate-fade-in" ref={containerRef}>
      {/* Toolbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          toolbarVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        onClick={() => setToolbarVisible(true)}
      >
        <ReadingToolbar
          surahName={currentPage.surahName}
          surahNameArabic={currentPage.surahNameArabic}
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

      {/* Desktop nav arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}
        className="mushaf-nav-btn mushaf-nav-right"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goToNextPage(); }}
        className="mushaf-nav-btn mushaf-nav-left"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page dots */}
      {pages.length <= 40 && (
        <div className="mushaf-page-indicator">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goToPage(i); }}
              className={`mushaf-dot ${i === currentPageIndex ? "mushaf-dot-active" : ""}`}
            />
          ))}
        </div>
      )}

      <AyahDrawer ayah={selectedAyah} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
