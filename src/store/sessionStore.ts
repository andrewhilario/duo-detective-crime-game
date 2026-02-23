import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  playerName: string;
  setPlayerName: (name: string) => void;
  gameStatus: 'lobby' | 'briefing' | 'investigation' | 'accusation' | 'summary';
  setGameStatus: (status: 'lobby' | 'briefing' | 'investigation' | 'accusation' | 'summary') => void;

  // Audio settings (persisted to localStorage)
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;   // 0–1
  sfxVolume: number;     // 0–1
  setMusicEnabled: (v: boolean) => void;
  setSfxEnabled: (v: boolean) => void;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;

  // Display settings (persisted)
  crtEffect: boolean;
  setCrtEffect: (v: boolean) => void;
  scanlineOpacity: number; // 0–1
  setScanlineOpacity: (v: number) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      playerName: '',
      setPlayerName: (name) => set({ playerName: name }),
      gameStatus: 'lobby',
      setGameStatus: (status) => set({ gameStatus: status }),

      musicEnabled: true,
      sfxEnabled: true,
      musicVolume: 0.4,
      sfxVolume: 0.7,
      setMusicEnabled: (v) => set({ musicEnabled: v }),
      setSfxEnabled: (v) => set({ sfxEnabled: v }),
      setMusicVolume: (v) => set({ musicVolume: v }),
      setSfxVolume: (v) => set({ sfxVolume: v }),

      crtEffect: true,
      setCrtEffect: (v) => set({ crtEffect: v }),
      scanlineOpacity: 0.03,
      setScanlineOpacity: (v) => set({ scanlineOpacity: v }),
    }),
    {
      name: 'duo-detective-settings',
      // Only persist settings, not transient game state
      partialize: (state) => ({
        playerName: state.playerName,
        musicEnabled: state.musicEnabled,
        sfxEnabled: state.sfxEnabled,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
        crtEffect: state.crtEffect,
        scanlineOpacity: state.scanlineOpacity,
      }),
    }
  )
);
