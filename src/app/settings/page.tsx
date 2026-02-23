"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSessionStore } from '../../store/sessionStore';
import { AudioEngine } from '../../utils/sfx';
import {
  ArrowLeft, Shield, Volume2, VolumeX, Music, Music2,
  Monitor, Sliders, RotateCcw
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Reusable slider component
// ---------------------------------------------------------------------------
interface SliderRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  color?: string;
}

const SliderRow = ({ label, value, onChange, disabled = false, color = 'bg-red-500' }: SliderRowProps) => (
  <div className={`flex items-center gap-4 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
    <span className="w-32 text-sm text-gray-300 shrink-0">{label}</span>
    <div className="flex-1 relative h-2 bg-gray-700 rounded-full">
      <div
        className={`absolute left-0 top-0 h-full rounded-full ${color}`}
        style={{ width: `${value * 100}%` }}
      />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
      />
    </div>
    <span className="w-10 text-right text-xs font-mono text-gray-400 shrink-0">
      {Math.round(value * 100)}%
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------
interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

const Toggle = ({ value, onChange, label, description, icon }: ToggleProps) => (
  <button
    onClick={() => onChange(!value)}
    className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:border-gray-600 transition group text-left"
  >
    {icon && (
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition ${value ? 'bg-red-900/40 border-red-700 text-red-400' : 'bg-gray-700/60 border-gray-600 text-gray-500'}`}>
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm text-white">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    {/* Toggle pill */}
    <div className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-red-600' : 'bg-gray-600'}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? 'left-6' : 'left-0.5'}`} />
    </div>
  </button>
);

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1A1C22] border border-gray-800 rounded-2xl overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/30 flex items-center gap-3">
      <span className="text-red-500">{icon}</span>
      <h2 className="font-bold text-white uppercase tracking-widest text-xs">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Settings page
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  const {
    musicEnabled, setMusicEnabled,
    sfxEnabled, setSfxEnabled,
    musicVolume, setMusicVolume,
    sfxVolume, setSfxVolume,
    crtEffect, setCrtEffect,
    scanlineOpacity, setScanlineOpacity,
  } = useSessionStore();

  const handleMusicVolumeChange = (v: number) => {
    setMusicVolume(v);
    AudioEngine.setMusicVolume(musicEnabled ? v : 0);
  };

  const handleSfxVolumeChange = (v: number) => {
    setSfxVolume(v);
    AudioEngine.setSfxVolume(sfxEnabled ? v : 0);
  };

  const handleMusicToggle = (v: boolean) => {
    setMusicEnabled(v);
    if (v) {
      AudioEngine.setMusicVolume(musicVolume);
      AudioEngine.startMusic();
    } else {
      AudioEngine.stopMusic();
    }
  };

  const handleSfxToggle = (v: boolean) => {
    setSfxEnabled(v);
    AudioEngine.setSfxVolume(v ? sfxVolume : 0);
    if (v) AudioEngine.playBeep(); // Preview
  };

  const handleReset = () => {
    setMusicEnabled(true);
    setSfxEnabled(true);
    setMusicVolume(0.4);
    setSfxVolume(0.7);
    setCrtEffect(true);
    setScanlineOpacity(0.03);
    AudioEngine.setMusicVolume(0.4);
    AudioEngine.setSfxVolume(0.7);
    AudioEngine.startMusic();
  };

  return (
    <div className="min-h-screen bg-[#0E0E11] flex flex-col text-gray-100 relative overflow-hidden">
      {/* CRT scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 3px',
        }}
      />
      {/* Atmospheric glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-red-900/10 blur-[120px] rounded-full" />

      <div className="relative z-20 w-full max-w-2xl mx-auto px-4 py-12">
        {/* Back */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-200 transition text-sm">
            <ArrowLeft size={14} /> Back to Headquarters
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
            <Sliders size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 mb-1">Control Room</p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Settings
            </h1>
          </div>
        </motion.div>

        <div className="space-y-6">

          {/* ── Audio ────────────────────────────────────────────────────── */}
          <Section title="Audio" icon={<Volume2 size={16} />}>
            <Toggle
              value={musicEnabled}
              onChange={handleMusicToggle}
              label="Background Music"
              description="Procedural noir ambient soundtrack"
              icon={<Music size={18} />}
            />

            <SliderRow
              label="Music Volume"
              value={musicVolume}
              onChange={handleMusicVolumeChange}
              disabled={!musicEnabled}
              color="bg-blue-500"
            />

            <div className="border-t border-gray-700/50 pt-5">
              <Toggle
                value={sfxEnabled}
                onChange={handleSfxToggle}
                label="Sound Effects"
                description="UI clicks, typewriter, scan sounds"
                icon={<Music2 size={18} />}
              />
            </div>

            <SliderRow
              label="SFX Volume"
              value={sfxVolume}
              onChange={handleSfxVolumeChange}
              disabled={!sfxEnabled}
              color="bg-yellow-500"
            />
          </Section>

          {/* ── Display ──────────────────────────────────────────────────── */}
          <Section title="Display" icon={<Monitor size={16} />}>
            <Toggle
              value={crtEffect}
              onChange={setCrtEffect}
              label="CRT Effect"
              description="Scanline overlay and vignette"
              icon={<Monitor size={18} />}
            />

            <SliderRow
              label="Scanline Opacity"
              value={scanlineOpacity / 0.15}   /* normalise 0–0.15 → 0–1 for slider */
              onChange={(v) => setScanlineOpacity(v * 0.15)}
              disabled={!crtEffect}
              color="bg-green-500"
            />

            {/* Live preview strip */}
            <div className="relative h-16 rounded-lg bg-gray-800 overflow-hidden border border-gray-700 flex items-center justify-center">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest z-10">Preview</span>
              {crtEffect && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity: scanlineOpacity / 0.03,  /* relative to the global overlay */
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
                    backgroundSize: '100% 3px',
                  }}
                />
              )}
            </div>
          </Section>

          {/* ── Reset ────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition text-sm font-medium"
            >
              <RotateCcw size={14} />
              Reset to Defaults
            </button>
          </motion.div>

          {/* Credit note */}
          <p className="text-center text-xs text-gray-700 font-mono pt-2">
            All audio is generated procedurally — no files, no network requests.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Shield size={14} className="text-red-900" />
            <p className="text-xs text-gray-700 font-mono tracking-widest uppercase">Duo Detective</p>
            <Shield size={14} className="text-red-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
