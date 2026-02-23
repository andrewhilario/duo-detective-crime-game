"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from '../../../components/Navbar';
import { Chat } from '../../../components/Chat';
import { useCaseStore } from '../../../store/caseStore';
import { useMultiplayerStore } from '../../../store/multiplayerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
}

export default function CaseLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { socket, roomId, playerId } = useMultiplayerStore();
  const { activeCase, foundClues, unlockedSuspects, boardConnections, syncState } = useCaseStore();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const prevFoundCluesRef = useRef<string[]>([]);

  const addToast = (msg: string) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    if (!socket) return;
    
    // Listen for state updates from the other player
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleStateUpdate = (stateUpdate: any) => {
      const prevClues = prevFoundCluesRef.current;
      const incomingClues: string[] = stateUpdate.foundClues || [];

      // Detect newly found clues by the partner
      const newByPartner = incomingClues.filter(cid => !prevClues.includes(cid) && !foundClues.includes(cid));
      if (newByPartner.length > 0 && activeCase) {
        newByPartner.forEach(cid => {
          const clue = activeCase.clues.find(c => c.id === cid);
          if (clue) {
            const partnerLabel = playerId === 'player1' ? 'Detective B' : 'Detective A';
            addToast(`${partnerLabel} found: ${clue.name}`);
          }
        });
      }

      syncState(stateUpdate);
    };

    socket.on('state-update', handleStateUpdate);
    return () => {
      socket.off('state-update', handleStateUpdate);
    };
  }, [socket, syncState, activeCase, foundClues, playerId]);

  // Track our own foundClues so we can diff incoming
  useEffect(() => {
    prevFoundCluesRef.current = foundClues;
  }, [foundClues]);

  // Sync our local state changes out to the room.
  // Guard: only emit when we actually have something to share — never overwrite
  // partner's progress with an empty initial state on first mount.
  const stateStr = JSON.stringify({ foundClues, unlockedSuspects, boardConnections });

  useEffect(() => {
    const hasData =
      foundClues.length > 0 ||
      boardConnections.length > 0 ||
      unlockedSuspects.length > 0;
    if (socket && roomId && hasData) {
      socket.emit('sync-state', { roomId, state: JSON.parse(stateStr) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateStr, socket, roomId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100 font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 flex flex-col relative overflow-hidden">
        {children}
      </main>
      <Chat />

      {/* Partner toast notifications */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex items-center gap-3 bg-gray-800 border border-yellow-700/60 shadow-xl rounded-xl px-4 py-3 text-sm text-white max-w-xs"
            >
              <div className="w-7 h-7 rounded-full bg-yellow-900/50 flex items-center justify-center shrink-0">
                <Search size={14} className="text-yellow-400" />
              </div>
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
