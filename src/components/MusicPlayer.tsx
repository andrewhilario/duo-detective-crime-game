"use client";
/**
 * MusicPlayer
 *
 * A headless component that lives in the root layout and manages the
 * background music lifecycle based on settings from sessionStore.
 *
 * - Starts music on first user interaction (required by browser autoplay policy).
 * - Responds to musicEnabled / musicVolume / sfxVolume changes immediately.
 * - Also applies sfxVolume to the AudioEngine's sfx bus.
 */
import { useEffect, useRef } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { AudioEngine } from '../utils/sfx';

export function MusicPlayer() {
  const { musicEnabled, musicVolume, sfxVolume, sfxEnabled } = useSessionStore();
  const startedRef = useRef(false);

  // Start music on first click/keydown anywhere (browser autoplay policy)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      // Init the audio engine (creates AudioContext)
      AudioEngine.init();
      AudioEngine.setMusicVolume(musicEnabled ? musicVolume : 0);
      AudioEngine.setSfxVolume(sfxEnabled ? sfxVolume : 0);

      if (musicEnabled) {
        AudioEngine.startMusic();
      }

      // Remove listeners after first interaction
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to musicEnabled toggle
  useEffect(() => {
    if (!startedRef.current) return; // Not started yet — will apply on first interaction
    if (musicEnabled) {
      AudioEngine.setMusicVolume(musicVolume);
      AudioEngine.startMusic();
    } else {
      AudioEngine.stopMusic();
    }
  }, [musicEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // React to musicVolume slider
  useEffect(() => {
    if (!startedRef.current) return;
    AudioEngine.setMusicVolume(musicEnabled ? musicVolume : 0);
  }, [musicVolume, musicEnabled]);

  // React to sfxVolume / sfxEnabled
  useEffect(() => {
    if (!startedRef.current) return;
    AudioEngine.setSfxVolume(sfxEnabled ? sfxVolume : 0);
  }, [sfxVolume, sfxEnabled]);

  // Cleanup on unmount (page close)
  useEffect(() => {
    return () => {
      AudioEngine.stopMusic();
    };
  }, []);

  return null; // No UI — purely functional
}
