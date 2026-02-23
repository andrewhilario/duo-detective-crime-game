"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCaseStore } from '../../../../store/caseStore';
import { useSessionStore } from '../../../../store/sessionStore';
import { useMultiplayerStore } from '../../../../store/multiplayerStore';
import { ArrowLeft, Gavel, Clock, AlertTriangle } from 'lucide-react';
import { AudioEngine } from '../../../../utils/sfx';
import { motion, AnimatePresence } from 'framer-motion';
import { SuspectAvatar } from '../../../../components/SuspectAvatar';

type Phase = 'picking' | 'waiting' | 'disagree';

export default function AccusationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { activeCase, loadCase, unlockedSuspects } = useCaseStore();
  const { setGameStatus } = useSessionStore();
  const { emitAccuse, partnerAccusedId, clearPartnerAccused } = useMultiplayerStore();
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('picking');
  const router = useRouter();

  // Ref always tracks the latest selectedSuspectId — used in async callbacks
  // to avoid stale closure bugs.
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selectedSuspectId;

  useEffect(() => {
    if (!activeCase) loadCase(id);
    setGameStatus('accusation');
  }, [activeCase, loadCase, id, setGameStatus]);

  const doRedirect = (suspectId: string) => {
    AudioEngine.playAccuse();
    clearPartnerAccused();
    setTimeout(() => {
      setGameStatus('summary');
      router.push(`/case/${id}/summary?suspect=${suspectId}`);
    }, 1500);
  };

  // React to partner's accusation arriving
  useEffect(() => {
    if (!partnerAccusedId) return;
    const myPick = selectedRef.current;

    if (phase === 'waiting' && myPick) {
      if (partnerAccusedId === myPick) {
        // Agreement — both picked the same suspect
        doRedirect(myPick);
      } else {
        // Disagreement — show reconciliation screen
        setPhase('disagree');
      }
    }
    // If we're still picking, just highlight partner's choice — no action needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerAccusedId, phase]);

  const handleAccuse = () => {
    if (!selectedSuspectId) return;
    AudioEngine.playBeep();
    emitAccuse(selectedSuspectId);

    if (partnerAccusedId) {
      // Partner already committed
      if (partnerAccusedId === selectedSuspectId) {
        doRedirect(selectedSuspectId);
      } else {
        setPhase('disagree');
      }
    } else {
      setPhase('waiting');
    }
  };

  // On the disagree screen, player proceeds with their own pick.
  // Read from ref to avoid stale-closure risk on async re-renders.
  const handleOverride = () => {
    const pick = selectedRef.current;
    if (!pick) return;
    doRedirect(pick);
  };

  // Or adopt partner's pick
  const handleAdoptPartner = () => {
    if (!partnerAccusedId) return;
    setSelectedSuspectId(partnerAccusedId);
    doRedirect(partnerAccusedId);
  };

  if (!activeCase) return <div className="text-center mt-20">Loading Accusation...</div>;

  const unlocked = activeCase.suspects.filter(s => unlockedSuspects.includes(s.id));
  const partnerSuspect = partnerAccusedId ? activeCase.suspects.find(s => s.id === partnerAccusedId) : null;
  const mySuspect = selectedSuspectId ? activeCase.suspects.find(s => s.id === selectedSuspectId) : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 h-full">
      <Link href={`/case/${id}`} className="flex items-center text-gray-400 hover:text-white transition mb-2 self-start">
        <ArrowLeft size={16} className="mr-2" /> Back to Case Hub
      </Link>

      {/* Instructions banner */}
      <div className="mb-4 w-full max-w-2xl bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2.5 flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
        <span className="text-orange-400 text-base mt-0.5 shrink-0">⚖️</span>
        <span>
          <strong className="text-gray-200">Both detectives must confirm before the case is closed.</strong>{' '}
          If you agree on a suspect the verdict is filed jointly. If you disagree, you can proceed with your own report or adopt your partner&apos;s pick.{' '}
          <span className="text-red-400 font-semibold">This action is irreversible</span>
          <span className="text-gray-500"> — review all evidence carefully before committing.</span>
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full bg-gray-900 border border-red-900 shadow-[0_0_50px_rgba(139,30,30,0.3)] rounded-xl p-8 flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Gavel size={40} />
        </div>

        <AnimatePresence mode="wait">

          {/* ── Disagree screen ── */}
          {phase === 'disagree' && (
            <motion.div
              key="disagree"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <AlertTriangle size={20} />
                <h1 className="text-2xl font-bold tracking-widest uppercase">Detectives Disagree</h1>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                You and your partner have accused different suspects. Each detective will file their own report — choose how to proceed.
              </p>

              {mySuspect && partnerSuspect ? (
                <div className="w-full grid grid-cols-2 gap-4">
                  {/* My pick */}
                  <div className="flex flex-col items-center gap-3 bg-red-900/20 border border-red-700 rounded-xl p-5">
                    <p className="text-xs text-red-400 font-bold uppercase tracking-wider">You accuse</p>
                    <SuspectAvatar avatar={mySuspect.avatar} size={60} />
                    <p className="font-semibold text-white">{mySuspect.name}</p>
                    <button
                      onClick={handleOverride}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm uppercase tracking-wider transition"
                    >
                      File My Report
                    </button>
                  </div>
                  {/* Partner's pick */}
                  <div className="flex flex-col items-center gap-3 bg-yellow-900/20 border border-yellow-700 rounded-xl p-5">
                    <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Partner accuses</p>
                    <SuspectAvatar avatar={partnerSuspect.avatar} size={60} />
                    <p className="font-semibold text-white">{partnerSuspect.name}</p>
                    <button
                      onClick={handleAdoptPartner}
                      className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-lg text-sm uppercase tracking-wider transition"
                    >
                      Adopt Partner&apos;s Pick
                    </button>
                  </div>
                </div>
              ) : (
                // Fallback: suspects not resolved yet — waiting for state to settle
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                    <Clock size={28} className="text-orange-400" />
                  </motion.div>
                  <p className="text-sm">Resolving disagreement...</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Waiting screen ── */}
          {phase === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <h1 className="text-4xl font-bold text-white mb-2 tracking-widest uppercase">Accusation Filed</h1>
              {mySuspect && (
                <div className="flex flex-col items-center gap-2 mb-4">
                  <SuspectAvatar avatar={mySuspect.avatar} size={64} />
                  <p className="text-gray-300 text-sm">You accused: <strong className="text-white">{mySuspect.name}</strong></p>
                </div>
              )}
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                <Clock size={28} className="text-yellow-400" />
              </motion.div>
              <p className="font-bold tracking-widest uppercase text-sm text-yellow-400">Waiting for your partner to confirm...</p>
            </motion.div>
          )}

          {/* ── Picking screen ── */}
          {phase === 'picking' && (
            <motion.div
              key="picking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-6"
            >
              <h1 className="text-4xl font-bold text-white tracking-widest uppercase">Make Your Accusation</h1>
              <p className="text-gray-400 max-w-lg leading-relaxed">
                Both detectives must confirm before the case is closed. Choose carefully.
              </p>

              {/* Partner hint */}
              <AnimatePresence>
                {partnerSuspect && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full p-4 bg-yellow-900/20 border border-yellow-700 rounded-xl flex items-center gap-3 text-left"
                  >
                    <SuspectAvatar avatar={partnerSuspect.avatar} size={40} />
                    <div>
                      <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Your Partner Suspects:</p>
                      <p className="text-white font-semibold">{partnerSuspect.name}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlocked.map(suspect => {
                  const isSelected = selectedSuspectId === suspect.id;
                  const isPartnerPick = partnerAccusedId === suspect.id;
                  return (
                    <button
                      key={suspect.id}
                      onClick={() => { AudioEngine.playBeep(); setSelectedSuspectId(suspect.id); }}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative ${
                        isSelected
                          ? 'bg-red-900 border-red-500 text-white scale-105 shadow-lg shadow-red-900/40'
                          : isPartnerPick
                          ? 'bg-yellow-900/20 border-yellow-700 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-gray-500'
                      }`}
                    >
                      {isPartnerPick && !isSelected && (
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">Partner</span>
                      )}
                      <SuspectAvatar avatar={suspect.avatar} size={52} />
                      <span className="font-semibold text-sm">{suspect.name}</span>
                    </button>
                  );
                })}
                {unlocked.length === 0 && (
                  <div className="col-span-full p-6 text-gray-500 italic bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                    No suspects have been unlocked yet. Investigate the crime scene first.
                  </div>
                )}
              </div>

              <button
                onClick={handleAccuse}
                disabled={!selectedSuspectId}
                className={`w-full max-w-sm py-4 rounded-xl font-bold tracking-widest uppercase transition-all ${
                  selectedSuspectId
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                Confirm Accusation
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
