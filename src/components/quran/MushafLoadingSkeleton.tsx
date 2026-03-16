import { Loader2 } from "lucide-react";

interface MushafLoadingSkeletonProps {
  surahNameArabic?: string;
}

export function MushafLoadingSkeleton({ surahNameArabic }: MushafLoadingSkeletonProps) {
  return (
    <div className="mushaf-container">
      <div className="mushaf-page-wrapper">
        <div className="mushaf-page items-center justify-center gap-6">
          {/* Decorative surah name */}
          {surahNameArabic && (
            <p className="font-arabic text-4xl text-gold animate-pulse">{surahNameArabic}</p>
          )}
          
          {/* Spinner */}
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          
          {/* Skeleton lines */}
          <div className="w-full max-w-xs space-y-3 opacity-30">
            <div className="mushaf-skeleton-line w-full" style={{ animationDelay: '0s' }} />
            <div className="mushaf-skeleton-line w-4/5 mx-auto" style={{ animationDelay: '0.15s' }} />
            <div className="mushaf-skeleton-line w-11/12" style={{ animationDelay: '0.3s' }} />
            <div className="mushaf-skeleton-line w-3/4 mx-auto" style={{ animationDelay: '0.45s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
