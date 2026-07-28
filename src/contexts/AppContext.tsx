/**
 * AppContext — Combined provider & barrel export.
 *
 * Wraps all sub-contexts (Theme, Bookmarks, Audio, Settings) into a single
 * <AppProvider> so that App.tsx only needs one provider wrapper.
 *
 * Re-exports all hooks for backward compatibility:
 *   import { useApp } from "@/contexts/AppContext"   ← still works
 *   import { useTheme } from "@/contexts/AppContext"  ← also works
 */
import type { ReactNode } from "react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { BookmarksProvider, useBookmarks } from "./BookmarksContext";
import { AudioProvider, useAudio } from "./AudioContext";
import { SettingsProvider, useSettings } from "./SettingsContext";

export { useTheme, useBookmarks, useAudio, useSettings };

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <BookmarksProvider>
        <AudioProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </AudioProvider>
      </BookmarksProvider>
    </ThemeProvider>
  );
}

/**
 * Convenience hook: combines all contexts into a single object.
 * Importing components still re-render when ANY context changes,
 * but this keeps existing code working without changes.
 *
 * For better performance, import the specific hook instead:
 *   import { useTheme } from "@/contexts/AppContext";
 */
export function useApp() {
  const { theme, toggleTheme } = useTheme();
  const {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    readingProgress,
    updateReadingProgress,
  } = useBookmarks();
  const { audio, setAudio, togglePlayback } = useAudio();
  const { settings, updateSettings } = useSettings();

  return {
    theme,
    toggleTheme,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    readingProgress,
    updateReadingProgress,
    audio,
    setAudio,
    togglePlayback,
    settings,
    updateSettings,
  };
}
