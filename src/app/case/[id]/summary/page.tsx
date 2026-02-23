"use client";
import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCaseStore } from '../../../../store/caseStore';
import { CheckCircle2, XCircle, ArrowLeft, Shield, Link2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { SuspectAvatar } from '../../../../components/SuspectAvatar';

function SummaryContent({ id }: { id: string }) {
  const { activeCase, loadCase, foundClues, boardConnections } = useCaseStore();
  const searchParams = useSearchParams();
  const accusedId = searchParams.get('suspect');

  useEffect(() => {
    if (!activeCase) loadCase(id);
  }, [activeCase, loadCase, id]);

  if (!activeCase) return <div className="text-center mt-20 text-gray-400">Loading Summary...</div>;

  // Null guard: if page visited without ?suspect= param, treat as wrong accusation
  const isCorrect = !!accusedId && accusedId === activeCase.trueCulpritId;
  const accusedSuspect = accusedId ? activeCase.suspects.find(s => s.id === accusedId) : null;
  const trueCulprit = activeCase.suspects.find(s => s.id === activeCase.trueCulpritId);
  const totalClues = activeCase.clues.length;
  // Use `cid` as the filter param name to avoid shadowing outer `id`
  const cluesFound = foundClues.filter(cid => activeCase.clues.some(c => c.id === cid)).length;
  const connections = boardConnections.length;
  // Accuracy = percentage of clues found, weighted by the correct/wrong verdict
  const cluesPct = totalClues > 0 ? Math.round((cluesFound / totalClues) * 100) : 0;
  const accuracyStat = isCorrect ? cluesPct : Math.max(0, cluesPct - 20);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`max-w-2xl w-full bg-gray-900 border shadow-2xl rounded-xl overflow-hidden ${
          isCorrect ? 'border-green-900 shadow-green-900/20' : 'border-red-900 shadow-red-900/20'
        }`}
      >
        {/* Header */}
        <div className={`p-10 flex flex-col items-center text-center ${
          isCorrect ? 'bg-green-950/40' : 'bg-red-950/30'
        }`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
            isCorrect ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {isCorrect ? <CheckCircle2 size={52} /> : <XCircle size={52} />}
          </div>
          <h1 className={`text-5xl font-bold mb-3 tracking-widest uppercase ${
            isCorrect ? 'text-green-400' : 'text-red-400'
          }`}>
            CASE {isCorrect ? 'CLOSED' : 'FAILED'}
          </h1>
          <p className="text-gray-300 max-w-md leading-relaxed">
            {isCorrect ? (
              <>Excellent work, Detectives. You correctly identified <strong className="text-white">{accusedSuspect?.name}</strong> as the culprit. Justice is served.</>
            ) : accusedSuspect ? (
              <>A grave error. <strong className="text-white">{accusedSuspect.name}</strong> was innocent. The true killer — <strong className="text-red-300">{trueCulprit?.name}</strong> — walks free.</>
            ) : (
              <>No accusation was filed. The true killer — <strong className="text-red-300">{trueCulprit?.name}</strong> — walks free.</>
            )}
          </p>
        </div>

        {/* Culprit reveal */}
        <div className="px-10 py-6 border-t border-gray-800 flex items-center gap-6">
          {!isCorrect && trueCulprit && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 flex-1"
            >
              <div className="relative shrink-0">
                <SuspectAvatar avatar={trueCulprit.avatar} size={72} className="rounded-full border-2 border-red-700" />
                <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1">
                  <Shield size={12} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">True Culprit</p>
                <p className="text-white font-bold text-lg">{trueCulprit.name}</p>
                <p className="text-gray-400 text-sm">{trueCulprit.occupation}, Age {trueCulprit.age}</p>
              </div>
            </motion.div>
          )}
          {isCorrect && accusedSuspect && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 flex-1"
            >
              <div className="relative shrink-0">
                <SuspectAvatar avatar={accusedSuspect.avatar} size={72} className="rounded-full border-2 border-green-700" />
                <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-xs text-green-400 font-bold uppercase tracking-widest mb-1">Culprit Caught</p>
                <p className="text-white font-bold text-lg">{accusedSuspect.name}</p>
                <p className="text-gray-400 text-sm">{accusedSuspect.occupation}, Age {accusedSuspect.age}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-10 py-6 border-t border-gray-800 grid grid-cols-3 gap-4"
        >
          <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700">
            <div className="flex justify-center mb-2 text-yellow-500"><Search size={20} /></div>
            <p className="text-2xl font-bold text-white">{cluesFound}<span className="text-gray-500 text-sm font-normal">/{totalClues}</span></p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Clues Found</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700">
            <div className="flex justify-center mb-2 text-blue-400"><Link2 size={20} /></div>
            <p className="text-2xl font-bold text-white">{connections}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Connections</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700">
            <div className="flex justify-center mb-2 text-red-400"><Shield size={20} /></div>
            <p className="text-2xl font-bold text-white">{accuracyStat}<span className="text-gray-500 text-sm font-normal">%</span></p>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Accuracy</p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-gray-800 flex justify-center">
          <Link
            href={`/case/${id}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-bold tracking-widest uppercase transition group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Case Hub
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return (
    <Suspense fallback={<div className="text-center mt-20 text-gray-400">Loading Summary...</div>}>
      <SummaryContent id={id} />
    </Suspense>
  );
}
