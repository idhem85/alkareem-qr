import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Settings {
  fontSize: number;
  showTranslation: boolean;
  translationLang: string;
  reciter: string;
  language: string;
  prayerTimezone?: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("almushaf-settings");
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: 28,
          showTranslation: true,
          translationLang: "fr",
          reciter: "Mishary Rashid Alafasy",
          language: "fr",
        };
  });

  useEffect(() => {
    localStorage.setItem("almushaf-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
