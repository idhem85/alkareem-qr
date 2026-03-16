import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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

interface AudioState {
  isPlaying: boolean;
  currentSurahId: number | null;
  currentAyah: number | null;
  reciter: string;
}

interface Settings {
  fontSize: number;
  showTranslation: boolean;
  translationLang: string;
  reciter: string;
  language: string;
}

interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  bookmarks: Bookmark[];
  addBookmark: (surahId: number, ayahNumber: number, note?: string) => void;
  removeBookmark: (surahId: number, ayahNumber: number) => void;
  isBookmarked: (surahId: number, ayahNumber: number) => boolean;
  readingProgress: ReadingProgress | null;
  updateReadingProgress: (surahId: number, ayahNumber: number) => void;
  audio: AudioState;
  setAudio: React.Dispatch<React.SetStateAction<AudioState>>;
  togglePlayback: () => void;
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("almushaf-theme");
    return (saved as "light" | "dark") || "light";
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem("almushaf-bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(() => {
    const saved = localStorage.getItem("almushaf-progress");
    return saved ? JSON.parse(saved) : null;
  });

  const [audio, setAudio] = useState<AudioState>({
    isPlaying: false,
    currentSurahId: null,
    currentAyah: null,
    reciter: "Mishary Rashid Alafasy",
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("almushaf-settings");
    return saved ? JSON.parse(saved) : {
      fontSize: 28,
      showTranslation: true,
      translationLang: "fr",
      reciter: "Mishary Rashid Alafasy",
      language: "fr",
    };
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("almushaf-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("almushaf-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (readingProgress) {
      localStorage.setItem("almushaf-progress", JSON.stringify(readingProgress));
    }
  }, [readingProgress]);

  useEffect(() => {
    localStorage.setItem("almushaf-settings", JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = useCallback(() => setTheme(t => t === "light" ? "dark" : "light"), []);

  const addBookmark = useCallback((surahId: number, ayahNumber: number, note?: string) => {
    setBookmarks(prev => {
      if (prev.some(b => b.surahId === surahId && b.ayahNumber === ayahNumber)) return prev;
      return [...prev, { surahId, ayahNumber, note, timestamp: Date.now() }];
    });
  }, []);

  const removeBookmark = useCallback((surahId: number, ayahNumber: number) => {
    setBookmarks(prev => prev.filter(b => !(b.surahId === surahId && b.ayahNumber === ayahNumber)));
  }, []);

  const isBookmarked = useCallback((surahId: number, ayahNumber: number) => {
    return bookmarks.some(b => b.surahId === surahId && b.ayahNumber === ayahNumber);
  }, [bookmarks]);

  const updateReadingProgress = useCallback((surahId: number, ayahNumber: number) => {
    setReadingProgress({ surahId, ayahNumber, timestamp: Date.now() });
  }, []);

  const togglePlayback = useCallback(() => {
    setAudio(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      bookmarks, addBookmark, removeBookmark, isBookmarked,
      readingProgress, updateReadingProgress,
      audio, setAudio, togglePlayback,
      settings, updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
