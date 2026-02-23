"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCaseStore } from '../../../../store/caseStore';
import { ArrowLeft, User, Lock, AlertTriangle, Briefcase, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspect } from '../../../../data/cases';
import { AudioEngine } from '../../../../utils/sfx';
import { SuspectAvatar } from '../../../../components/SuspectAvatar';
import { useSessionStore } from '../../../../store/sessionStore';

export default function Suspects({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { activeCase, loadCase, unlockedSuspects, foundClues } = useCaseStore();
  const { setGameStatus } = useSessionStore();
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);

  useEffect(() => {
    if (!activeCase) loadCase(id);
    setGameStatus('investigation');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeCase) return <div className="text-center mt-20">Loading Suspects...</div>;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-100px)] p-4 max-w-6xl mx-auto w-full">
      <Link href={`/case/${id}`} className="flex items-center text-gray-400 hover:text-white mb-4 transition w-fit shrink-0">
        <ArrowLeft size={16} className="mr-2" /> Back to Case Hub
      </Link>

      {/* Instructions banner */}
      <div className="mb-4 shrink-0 bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2.5 flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
        <span className="text-yellow-500 text-base mt-0.5 shrink-0">🔍</span>
        <span>
          <strong className="text-gray-200">Suspects are unlocked by finding relevant clues</strong> on the Location Map.{' '}
          Review each suspect&apos;s alibi and interrogation responses, then cross-reference with your partner&apos;s findings.{' '}
          <span className="text-gray-500">Responses are revealed only for clues you have personally examined — your partner may hold the key to unlocking others.</span>
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-full">
        {/* Suspects List */}
        <div className="w-full md:w-1/3 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-gray-800 bg-gray-800/50">
            <h2 className="font-bold text-lg text-white flex items-center">
              <User size={20} className="mr-2 text-red-500" /> Suspect Pool
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeCase.suspects.every(s => !unlockedSuspects.includes(s.id)) && (
              <div className="m-2 p-4 rounded-lg border border-dashed border-gray-700 text-center text-gray-500 text-sm">
                <Lock size={20} className="mx-auto mb-2 opacity-40" />
                <p>Investigate the crime scene to unlock suspects.</p>
              </div>
            )}
            {activeCase.suspects.map(suspect => {
              const isUnlocked = unlockedSuspects.includes(suspect.id);
              return (
                <button
                  key={suspect.id}
                  onClick={() => {
                    if (isUnlocked) {
                      AudioEngine.playScan();
                      setSelectedSuspect(suspect);
                    } else {
                      AudioEngine.playBeep(); // Error beep
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`w-full text-left p-4 rounded-lg border transition flex items-center gap-3 ${
                    selectedSuspect?.id === suspect.id
                      ? 'bg-red-900/20 border-red-500 text-white'
                      : isUnlocked 
                        ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-gray-600'
                        : 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {isUnlocked ? (
                    <SuspectAvatar avatar={suspect.avatar} size={40} className="rounded-full shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700">
                      <Lock size={16} />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate">{isUnlocked ? suspect.name : 'Unknown Identity'}</span>
                    {isUnlocked && (
                      <span className="text-xs text-gray-500 truncate">{suspect.occupation}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suspect Profile */}
        <div className="w-full md:w-2/3 bg-gray-900 border border-gray-800 rounded-xl flex flex-col relative overflow-hidden h-full">
          {selectedSuspect ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSuspect.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col p-8 overflow-y-auto"
              >
                <div className="border-b border-gray-800 pb-6 mb-6 flex justify-between items-start">
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold text-white mb-2 uppercase tracking-wider"
                    >
                      {selectedSuspect.name}
                    </motion.h2>
                    <p className="text-red-500 font-medium tracking-wide mb-2 uppercase text-xs">Person of Interest</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={13} /> Age {selectedSuspect.age}</span>
                      <span className="flex items-center gap-1"><Briefcase size={13} /> {selectedSuspect.occupation}</span>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="shrink-0"
                  >
                    <SuspectAvatar avatar={selectedSuspect.avatar} size={80} className="rounded-full border-2 border-gray-700" />
                  </motion.div>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Profile & Relationships</h3>
                    <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-800/50">{selectedSuspect.profile}</p>
                    <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-800/50 mt-2">{selectedSuspect.relationships}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Stated Alibi</h3>
                    <div className="bg-gray-800/50 border border-l-4 border-gray-800 border-l-red-500 p-4 rounded-lg">
                      <p className="text-gray-300 italic">&quot;{selectedSuspect.alibi}&quot;</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Interrogation Responses</h3>
                    <div className="space-y-4">
                      {Object.entries(selectedSuspect.responses).map(([clueId, response]) => {
                        const clue = activeCase.clues.find(c => c.id === clueId);
                        const hasClue = foundClues.includes(clueId);
                        
                        if (!hasClue) return null;

                        return (
                          <div key={clueId} className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                            <div className="flex items-center text-xs text-red-400 font-bold uppercase tracking-wider mb-2">
                              <AlertTriangle size={14} className="mr-2" /> When confronted with: {clue?.name}
                            </div>
                            <p className="text-gray-300">&quot;{response}&quot;</p>
                          </div>
                        );
                      })}
                      {Object.keys(selectedSuspect.responses).every(clueId => !foundClues.includes(clueId)) && (
                        <p className="text-gray-500 italic p-4 text-center border border-dashed border-gray-700 rounded-lg">
                          Find more evidence to confront this suspect.
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center h-full">
              <User size={48} className="mb-4 opacity-30" />
              <h3 className="text-xl font-medium mb-2">Awaiting Suspect Selection</h3>
              <p className="max-w-xs">Select an unlocked suspect from the list to review their profile and alibi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
