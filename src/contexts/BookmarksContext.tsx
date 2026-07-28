import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useCloudSync } from "@/hooks/useCloudSync";

interface Bookmark {
  surahId: number;
  ayahNumber: number;
  note?: string;
  timestamp: number;
}

interface ReadingProgress {
  surahId: number;
  ayahNumber: number;
  timestamp: number;
}

interface BookmarksContextType {
  bookmarks: Bookmark[];
  addBookmark: (surahId: number, ayahNumber: number, note?: string) => void;
  removeBookmark: (surahId: number, ayahNumber: number) => void;
  isBookmarked: (surahId: number, ayahNumber: number) => boolean;
  readingProgress: ReadingProgress | null;
  updateReadingProgress: (surahId: number, ayahNumber: number) => void;
  cloudSync: {
    enabled: boolean;
    syncing: boolean;
    syncError: string | null;
    lastSyncTime: Date | null;
  };
  syncNow: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem("almushaf-bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(() => {
    const saved = localStorage.getItem("almushaf-progress");
    return saved ? JSON.parse(saved) : null;
  });

  const cloud = useCloudSync();
  const initialSyncDone = useRef(false);

  // Cloud sync: pull from cloud when enabled, reset when toggle changes
  useEffect(() => {
    if (!cloud.enabled) {
      initialSyncDone.current = false;
      return;
    }
    if (initialSyncDone.current) return;
    initialSyncDone.current = true;

    cloud.fetchBookmarks().then((rows) => {
      if (rows.length > 0) {
        const cloudBm: Bookmark[] = rows.map((r) => ({
          surahId: r.surah_id,
          ayahNumber: r.ayah_number,
          note: r.note || undefined,
          timestamp: new Date(r.created_at).getTime(),
        }));

        // Merge: keep the most recent timestamp for duplicates
        setBookmarks((local) => {
          const merged = new Map<string, Bookmark>();
          for (const b of local) {
            merged.set(`${b.surahId}:${b.ayahNumber}`, b);
          }
          for (const b of cloudBm) {
            const key = `${b.surahId}:${b.ayahNumber}`;
            const existing = merged.get(key);
            if (!existing || b.timestamp > existing.timestamp) {
              merged.set(key, b);
            }
          }
          return Array.from(merged.values());
        });
      }
    });

    cloud.fetchProgress().then((rows) => {
      if (rows.length > 0) {
        const latest = rows[0];
        setReadingProgress((prev) => {
          const cloudTs = new Date(latest.updated_at).getTime();
          if (!prev || cloudTs > prev.timestamp) {
            return { surahId: latest.surah_id, ayahNumber: latest.ayah_number, timestamp: cloudTs };
          }
          return prev;
        });
      }
    });
  }, [cloud.enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("almushaf-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (readingProgress) {
      localStorage.setItem("almushaf-progress", JSON.stringify(readingProgress));
    }
  }, [readingProgress]);

  const addBookmark = useCallback(
    (surahId: number, ayahNumber: number, note?: string) => {
      setBookmarks((prev) => {
        if (prev.some((b) => b.surahId === surahId && b.ayahNumber === ayahNumber)) return prev;
        const newBookmark = { surahId, ayahNumber, note, timestamp: Date.now() };
        cloud.saveBookmark(surahId, ayahNumber, note);
        return [...prev, newBookmark];
      });
    },
    [cloud]
  );

  const removeBookmark = useCallback(
    (surahId: number, ayahNumber: number) => {
      setBookmarks((prev) => prev.filter((b) => !(b.surahId === surahId && b.ayahNumber === ayahNumber)));
      cloud.removeBookmark(surahId, ayahNumber);
    },
    [cloud]
  );

  const isBookmarked = useCallback(
    (surahId: number, ayahNumber: number) => {
      return bookmarks.some((b) => b.surahId === surahId && b.ayahNumber === ayahNumber);
    },
    [bookmarks]
  );

  const updateReadingProgress = useCallback(
    (surahId: number, ayahNumber: number) => {
      setReadingProgress({ surahId, ayahNumber, timestamp: Date.now() });
      cloud.saveProgress(surahId, ayahNumber);
    },
    [cloud]
  );

  /** Force a full sync now */
  const syncNow = useCallback(async () => {
    const result = await cloud.syncNow(bookmarks, readingProgress);
    setBookmarks(result.bookmarks);
    setReadingProgress(result.progress);
  }, [cloud, bookmarks, readingProgress]);

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        readingProgress,
        updateReadingProgress,
        syncNow,
        cloudSync: {
          enabled: cloud.enabled,
          syncing: cloud.syncing,
          syncError: cloud.syncError,
          lastSyncTime: cloud.lastSyncTime,
        },
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarksProvider");
  return ctx;
}
