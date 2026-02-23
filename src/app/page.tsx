"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { useSessionStore } from '../store/sessionStore';
import { allCases } from '../data/cases';
import { AudioEngine } from '../utils/sfx';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight, Radio, Lock, BookOpen } from 'lucide-react';

const DIFFICULTY_COLORS = {
  Easy: 'text-green-400 border-green-800 bg-green-900/20',
  Medium: 'text-yellow-400 border-yellow-800 bg-yellow-900/20',
  Hard: 'text-red-400 border-red-800 bg-red-900/20',
};

export default function Lobby() {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'player1' | 'player2'>('player1');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(allCases[0].id);
  const router = useRouter();
  const { connect } = useMultiplayerStore();
  const { setPlayerName, setGameStatus } = useSessionStore();

  const selectedCase = allCases.find(c => c.id === selectedCaseId)!;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    AudioEngine.init();
    AudioEngine.playBeep();
    if (name && roomId) {
      setPlayerName(name);
      connect(roomId, role, selectedCaseId, (caseId) => {
        setGameStatus('briefing');
        router.push(`/case/${caseId}/briefing`);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E11] flex flex-col items-center justify-center text-gray-100 font-sans relative overflow-hidden">
      {/* CRT scanlines overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)', backgroundSize: '100% 3px' }}
      />

      {/* Atmospheric glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-900/10 blur-[120px] rounded-full" />

      <div className="relative z-20 w-full max-w-4xl px-4 py-12 flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield size={28} className="text-red-500" />
            <h1 className="text-5xl font-bold tracking-[0.25em] text-white uppercase" style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 0 40px rgba(139,30,30,0.6)' }}>
              Duo Detective
            </h1>
            <Shield size={28} className="text-red-500" />
          </div>
          <p className="text-gray-500 tracking-widest uppercase text-sm">Cooperative Crime Investigation</p>
          <Link href="/tutorial" className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 transition font-mono border border-gray-800 hover:border-gray-600 px-3 py-1.5 rounded-full">
            <BookOpen size={12} /> How to Play
          </Link>
        </motion.div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Case Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#1A1C22] border border-gray-800 rounded-xl overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-gray-800 flex items-center gap-2 shrink-0">
              <Radio size={16} className="text-red-500" />
              <h2 className="font-bold text-white tracking-widest uppercase text-sm">Select Case File</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {allCases.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => {
                   AudioEngine.playBeep();
                    setSelectedCaseId(c.id);
                  }}
                  className={`w-full text-left p-4 border-b border-gray-800/60 flex items-center gap-3 transition group ${
                    selectedCaseId === c.id
                      ? 'bg-red-900/15 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition ${
                    selectedCaseId === c.id ? 'border-red-500 bg-red-600' : 'border-gray-600 group-hover:border-gray-400'
                  }`}>
                    {selectedCaseId === c.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{c.title}</div>
                    <div className="text-xs text-gray-500 truncate">{c.setting}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${DIFFICULTY_COLORS[c.difficulty]}`}>
                    {c.difficulty}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Case preview + join form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Case preview card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCaseId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#1A1C22] border border-gray-800 rounded-xl p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {selectedCase.title}
                  </h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ml-2 shrink-0 ${DIFFICULTY_COLORS[selectedCase.difficulty]}`}>
                    {selectedCase.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{selectedCase.setting}</p>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{selectedCase.briefing}</p>
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  <span>{selectedCase.clues.length} clues</span>
                  <span>{selectedCase.suspects.length} suspects</span>
                  <span>{selectedCase.locations.length} locations</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Join form */}
            <div className="bg-[#1A1C22] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
                <Lock size={14} className="text-red-500" />
                <h2 className="font-bold text-white tracking-widest uppercase text-sm">Join Investigation</h2>
              </div>
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Detective Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                    placeholder="e.g. Holmes"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Room Code</label>
                  <input
                    type="text"
                    required
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm font-mono"
                    placeholder="Both players enter the same code"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('player1')}
                      className={`py-2.5 rounded-lg border text-sm font-semibold transition ${role === 'player1' ? 'bg-red-900/40 border-red-600 text-red-200' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                    >
                      Detective A
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('player2')}
                      className={`py-2.5 rounded-lg border text-sm font-semibold transition ${role === 'player2' ? 'bg-red-900/40 border-red-600 text-red-200' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                    >
                      Detective B
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">Each role sees different clues.</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 tracking-widest uppercase text-sm"
                >
                  Open Case File <ChevronRight size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
