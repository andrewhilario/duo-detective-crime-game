"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ArrowLeft, ArrowRight, Map, FileText, Users,
  Gavel, MessageSquare, Eye, EyeOff, Pin, Link as LinkIcon,
  CheckCircle, ChevronRight, Search, Fingerprint
} from 'lucide-react';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Duo Detective',
    subtitle: 'A Cooperative Crime Investigation',
    icon: Shield,
    color: 'text-red-500',
    content: null,
  },
  {
    id: 'roles',
    title: 'Asymmetric Roles',
    subtitle: 'You each see different clues',
    icon: Eye,
    color: 'text-blue-400',
    content: null,
  },
  {
    id: 'map',
    title: 'Investigation Map',
    subtitle: 'Explore locations, find evidence',
    icon: Map,
    color: 'text-yellow-400',
    content: null,
  },
  {
    id: 'board',
    title: 'Evidence Board',
    subtitle: 'Connect clues. Find the truth.',
    icon: FileText,
    color: 'text-green-400',
    content: null,
  },
  {
    id: 'suspects',
    title: 'Suspect Profiles',
    subtitle: 'Unlock suspects. Hear their lies.',
    icon: Users,
    color: 'text-purple-400',
    content: null,
  },
  {
    id: 'accusation',
    title: 'The Final Accusation',
    subtitle: 'You must agree to close the case.',
    icon: Gavel,
    color: 'text-red-400',
    content: null,
  },
];

const StepContent = ({ stepId }: { stepId: string }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1200);
    return () => clearInterval(t);
  }, []);

  if (stepId === 'welcome') {
    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-gray-300 text-lg text-center max-w-xl leading-relaxed">
          A murder has been committed. Two detectives — <span className="text-red-400 font-semibold">Detective A</span> and <span className="text-blue-400 font-semibold">Detective B</span> — must cooperate in real time to piece together the truth and name the killer before the case goes cold.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
          {[
            { icon: Map, label: 'Explore locations', color: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/50' },
            { icon: FileText, label: 'Connect evidence', color: 'text-green-400 bg-green-900/20 border-green-800/50' },
            { icon: Gavel, label: 'Accuse together', color: 'text-red-400 bg-red-900/20 border-red-800/50' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${color}`}>
              <Icon size={28} />
              <span className="text-sm font-medium text-white">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-sm text-gray-400">
          <MessageSquare size={14} className="text-red-400" />
          Real-time chat keeps both detectives in sync
        </div>
      </div>
    );
  }

  if (stepId === 'roles') {
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        <p className="text-gray-300 text-base text-center max-w-xl leading-relaxed">
          Each detective is assigned a <span className="text-white font-semibold">unique viewpoint</span>. Some clues are only visible to you — your partner cannot see them until you communicate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Detective A Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-900/10 border border-red-800/50 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-900/40 border border-red-700 flex items-center justify-center">
                <span className="text-red-400 font-bold font-mono text-sm">A</span>
              </div>
              <h3 className="font-bold text-white">Detective A</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-red-300"><Eye size={14} /> Sees <strong>clues tagged "player1"</strong></div>
              <div className="flex items-center gap-2 text-gray-400"><EyeOff size={14} /> Cannot see Detective B&apos;s exclusive clues</div>
              <div className="flex items-center gap-2 text-gray-400"><Eye size={14} className="text-gray-500" /> Shares all "all" clues with partner</div>
            </div>
          </motion.div>

          {/* Detective B Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-blue-900/10 border border-blue-800/50 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-700 flex items-center justify-center">
                <span className="text-blue-400 font-bold font-mono text-sm">B</span>
              </div>
              <h3 className="font-bold text-white">Detective B</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-blue-300"><Eye size={14} /> Sees <strong>clues tagged "player2"</strong></div>
              <div className="flex items-center gap-2 text-gray-400"><EyeOff size={14} /> Cannot see Detective A&apos;s exclusive clues</div>
              <div className="flex items-center gap-2 text-gray-400"><Eye size={14} className="text-gray-500" /> Shares all "all" clues with partner</div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-yellow-900/10 border border-yellow-800/40 rounded-xl text-sm text-yellow-300 max-w-xl text-center">
          <MessageSquare size={14} className="shrink-0" />
          You <strong>must</strong> describe what you find to your partner — the case can only be solved by combining both viewpoints.
        </div>
      </div>
    );
  }

  if (stepId === 'map') {
    const locations = ['Crime Scene', 'Victim\'s Office', 'Suspect\'s Home', 'Hotel Lobby'];
    const activeIdx = tick % locations.length;

    return (
      <div className="flex flex-col items-center gap-8 w-full">
        <p className="text-gray-300 text-base text-center max-w-xl leading-relaxed">
          The <span className="text-yellow-400 font-semibold">Investigation Map</span> lists all areas you can search. Click a location to scan it — your exclusive clues will appear as collectible evidence cards.
        </p>

        {/* Fake UI demo */}
        <div className="w-full max-w-2xl flex gap-4 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" style={{ height: 220 }}>
          {/* Location list */}
          <div className="w-1/3 border-r border-gray-800 flex flex-col">
            <div className="p-3 border-b border-gray-800 bg-gray-800/50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1"><Search size={12} /> Locations</p>
            </div>
            <div className="flex-1 p-2 space-y-1 overflow-hidden">
              {locations.map((loc, i) => (
                <motion.div
                  key={loc}
                  animate={{ backgroundColor: i === activeIdx ? 'rgba(139,30,30,0.15)' : 'transparent' }}
                  className={`p-2 rounded text-xs transition ${i === activeIdx ? 'text-white border border-red-800/60' : 'text-gray-500 border border-transparent'}`}
                >
                  {loc}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Clue cards */}
          <div className="flex-1 p-4 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { name: 'Broken Glass', found: true },
                  { name: 'Muddy Footprint', found: false },
                ].map(clue => (
                  <div key={clue.name} className={`p-3 rounded-lg border text-xs ${clue.found ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-800/40 border-dashed border-gray-700 text-gray-500'}`}>
                    <div className={`w-6 h-6 rounded mb-2 flex items-center justify-center ${clue.found ? 'bg-red-900/40' : 'bg-gray-700/60'}`}>
                      {clue.found ? <Fingerprint size={13} className="text-red-400" /> : <Search size={12} className="text-gray-600" />}
                    </div>
                    <p className="font-medium">{clue.found ? clue.name : 'Unknown Object'}</p>
                    <p className="text-gray-500 mt-1">{clue.found ? 'Logged' : 'Investigate area'}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
          When a clue is examined it is automatically added to your Evidence Board.
        </p>
      </div>
    );
  }

  if (stepId === 'board') {
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        <p className="text-gray-300 text-base text-center max-w-xl leading-relaxed">
          The <span className="text-green-400 font-semibold">Evidence Board</span> is a corkboard where all your found clues appear as draggable cards. You can drag them into position and draw <span className="text-red-400">red string connections</span> between related clues.
        </p>

        {/* Fake corkboard demo */}
        <div className="w-full max-w-2xl rounded-xl overflow-hidden border border-amber-900/40 relative" style={{ height: 220, backgroundColor: '#2a1b12', backgroundImage: 'radial-gradient(#140c06 15%, transparent 16%), radial-gradient(#140c06 15%, transparent 16%)', backgroundSize: '24px 24px', backgroundPosition: '0 0, 12px 12px' }}>
          {/* SVG string */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none string-glow" style={{ zIndex: 1 }}>
            <line x1="22%" y1="40%" x2="62%" y2="55%" stroke="#8B1E1E" strokeWidth="2" strokeDasharray="0" />
          </svg>

          {/* Card 1 */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute bg-yellow-50 text-gray-900 rounded shadow-xl p-3 text-xs font-mono"
            style={{ left: '8%', top: '20%', width: 130, zIndex: 2 }}
          >
            <div className="flex items-center gap-1 mb-1 text-red-700 font-bold uppercase text-[10px]">
              <Pin size={10} /> Evidence
            </div>
            <p className="font-semibold">Broken Glass</p>
            <p className="text-gray-500 mt-0.5 text-[10px] leading-snug">Found near rear exit. Pattern suggests outward force.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bg-yellow-50 text-gray-900 rounded shadow-xl p-3 text-xs font-mono"
            style={{ left: '52%', top: '30%', width: 130, zIndex: 2 }}
          >
            <div className="flex items-center gap-1 mb-1 text-red-700 font-bold uppercase text-[10px]">
              <Pin size={10} /> Evidence
            </div>
            <p className="font-semibold">Muddy Boot Print</p>
            <p className="text-gray-500 mt-0.5 text-[10px] leading-snug">Size 11. Matches the gardener&apos;s work boots.</p>
          </motion.div>

          {/* Connection label */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 px-3 py-1 rounded-full text-xs text-red-400 font-mono z-10">
            <LinkIcon size={11} /> Click two cards to connect them
          </div>
        </div>

        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest text-center">
          Board positions sync between you and your partner in real time.
        </p>
      </div>
    );
  }

  if (stepId === 'suspects') {
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        <p className="text-gray-300 text-base text-center max-w-xl leading-relaxed">
          Suspects start <span className="text-gray-500 font-semibold">locked</span>. As you and your partner find clues that reference a suspect, their profile unlocks. You can then read their alibi and confrontation responses.
        </p>

        <div className="w-full max-w-2xl grid grid-cols-3 gap-3">
          {[
            { name: 'Marcus Vane', unlocked: true, tag: 'Unlocked via 2 clues' },
            { name: 'Elise Moreau', unlocked: true, tag: 'Unlocked via 1 clue' },
            { name: 'Unknown', unlocked: false, tag: 'Find more evidence' },
          ].map(({ name, unlocked, tag }) => (
            <motion.div
              key={name}
              whileHover={unlocked ? { scale: 1.03 } : {}}
              className={`rounded-xl border p-4 flex flex-col items-center gap-2 text-center transition ${
                unlocked
                  ? 'bg-gray-800 border-gray-700 text-white cursor-pointer'
                  : 'bg-gray-900 border-gray-800 text-gray-600 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${unlocked ? 'bg-red-900/30 border-red-700' : 'bg-gray-800 border-gray-700'}`}>
                {unlocked ? <Users size={20} className="text-red-400" /> : <EyeOff size={18} />}
              </div>
              <p className="font-semibold text-sm leading-tight">{name}</p>
              <p className={`text-[10px] uppercase tracking-wider font-mono ${unlocked ? 'text-green-400' : 'text-gray-600'}`}>{tag}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400 font-mono">
          <CheckCircle size={13} className="text-green-400" />
          Confrontation responses only appear when you have the relevant clue
        </div>
      </div>
    );
  }

  if (stepId === 'accusation') {
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        <p className="text-gray-300 text-base text-center max-w-xl leading-relaxed">
          When you are ready, navigate to <span className="text-red-400 font-semibold">Make Accusation</span>. Both detectives independently select a suspect. If you agree, the accusation is submitted. If you disagree, one of you must stand down or override.
        </p>

        <div className="w-full max-w-xl grid grid-cols-2 gap-5">
          {/* Agree scenario */}
          <div className="bg-green-900/10 border border-green-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 text-green-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle size={16} /> Agreed
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-red-900/40 border border-red-700 text-red-400 text-[10px] font-bold flex items-center justify-center">A</span>
                <span className="text-gray-300">Marcus Vane</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-900/40 border border-blue-700 text-blue-400 text-[10px] font-bold flex items-center justify-center">B</span>
                <span className="text-gray-300">Marcus Vane</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-green-400 font-mono">Case submitted. Verdict revealed.</p>
          </div>

          {/* Disagree scenario */}
          <div className="bg-red-900/10 border border-red-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 text-red-400 font-bold text-sm uppercase tracking-wider">
              <Gavel size={16} /> Disagreed
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-red-900/40 border border-red-700 text-red-400 text-[10px] font-bold flex items-center justify-center">A</span>
                <span className="text-gray-300">Marcus Vane</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-900/40 border border-blue-700 text-blue-400 text-[10px] font-bold flex items-center justify-center">B</span>
                <span className="text-gray-300">Elise Moreau</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-yellow-400 font-mono">Discuss, then one detective overrides.</p>
          </div>
        </div>

        <p className="text-gray-400 text-sm text-center max-w-xs">
          A correct verdict earns a higher score. An incorrect one penalizes accuracy. The truth is revealed in the <span className="text-yellow-400">Case Summary</span>.
        </p>
      </div>
    );
  }

  return null;
};

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-[#0E0E11] flex flex-col text-gray-100 relative overflow-hidden">
      {/* CRT scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)', backgroundSize: '100% 3px' }}
      />
      {/* Atmospheric glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-900/10 blur-[120px] rounded-full" />

      <div className="relative z-20 flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-12 min-h-screen">

        {/* Back link */}
        <div className="w-full mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-200 transition text-sm w-fit">
            <ArrowLeft size={14} /> Back to Headquarters
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield size={22} className="text-red-500" />
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">Detective Academy — Field Manual</p>
            <Shield size={22} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-wide text-white" style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 0 40px rgba(139,30,30,0.5)' }}>
            How to Play
          </h1>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`transition rounded-full ${i === currentStep ? 'w-8 h-2 bg-red-500' : 'w-2 h-2 bg-gray-700 hover:bg-gray-500'}`}
              aria-label={`Go to step: ${s.title}`}
            />
          ))}
        </div>

        {/* Step card */}
        <div className="w-full flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-[#1A1C22] border border-gray-800 rounded-2xl p-8 flex flex-col gap-8 w-full"
            >
              {/* Step header */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 ${step.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-1">
                    Step {currentStep + 1} of {STEPS.length}
                  </p>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {step.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{step.subtitle}</p>
                </div>
              </div>

              {/* Step content */}
              <StepContent stepId={step.id} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between w-full mt-8">
          <button
            onClick={() => setCurrentStep(p => p - 1)}
            disabled={isFirst}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={14} /> Previous
          </button>

          {isLast ? (
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-sm uppercase tracking-widest transition"
            >
              Start Investigation <ChevronRight size={16} />
            </Link>
          ) : (
            <button
              onClick={() => setCurrentStep(p => p + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold text-sm transition"
            >
              Next <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Skip link */}
        {!isLast && (
          <Link href="/" className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition font-mono">
            Skip tutorial
          </Link>
        )}
      </div>
    </div>
  );
}
