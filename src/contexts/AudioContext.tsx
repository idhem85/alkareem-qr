import { createContext, useContext, useState, useCallback } from "react";

interface AudioState {
  isPlaying: boolean;
  currentSurahId: number | null;
  currentAyah: number | null;
  reciter: string;
}

interface AudioContextType {
  audio: AudioState;
  setAudio: React.Dispatch<React.SetStateAction<AudioState>>;
  togglePlayback: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audio, setAudio] = useState<AudioState>({
    isPlaying: false,
    currentSurahId: null,
    currentAyah: null,
    reciter: "Mishary Rashid Alafasy",
  });

  const togglePlayback = useCallback(() => {
    setAudio((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  return (
    <AudioContext.Provider value={{ audio, setAudio, togglePlayback }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
