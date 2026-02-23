"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCaseStore } from '../../../../store/caseStore';
import { ArrowLeft, Link as LinkIcon, Trash2, PinIcon } from 'lucide-react';
import { motion, useMotionValue } from 'framer-motion';
import { AudioEngine } from '../../../../utils/sfx';
import { ClueIcon } from '../../../../components/ClueIcon';
import { Clue } from '../../../../data/cases';
import { useSessionStore } from '../../../../store/sessionStore';

const CARD_W = 220;
const CARD_H = 190;
const BOARD_W = 1400;
const BOARD_H = 900;

interface CardPosition { x: number; y: number; }

function buildPath(pos1: CardPosition, pos2: CardPosition) {
  const x1 = pos1.x + CARD_W / 2;
  const y1 = pos1.y + CARD_H / 2;
  const x2 = pos2.x + CARD_W / 2;
  const y2 = pos2.y + CARD_H / 2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.15;
  return { d: `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`, x1, y1, x2, y2 };
}

// ─── Per-card component so each card has its own stable useMotionValue ────────
interface ClueCardProps {
  clue: Clue;
  cardIndex: number;
  pos: CardPosition;
  isSelected: boolean;
  connections: { source: string; target: string }[];
  allClues: Clue[];
  onClick: (clueId: string) => void;
  onRemoveConnection: (source: string, target: string) => void;
  onDragStart: () => void;
  onDragEnd: (clueId: string, dx: number, dy: number) => void;
  reliabilityColor: Record<string, string>;
}

function ClueCard({
  clue, cardIndex, pos, isSelected, connections, allClues,
  onClick, onRemoveConnection, onDragStart, onDragEnd, reliabilityColor,
}: ClueCardProps) {
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const tiltDeg = ((cardIndex * 7) % 9) - 4;

  // Reset motion values whenever the stored position changes (after a drop)
  useEffect(() => {
    motionX.set(0);
    motionY.set(0);
  }, [pos.x, pos.y, motionX, motionY]);

  const handleDragEnd = () => {
    const dx = motionX.get();
    const dy = motionY.get();
    onDragEnd(clue.id, dx, dy);
    motionX.set(0);
    motionY.set(0);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: CARD_W,
        rotate: tiltDeg,
        zIndex: isSelected ? 20 : 10,
        x: motionX,
        y: motionY,
      }}
      dragConstraints={{
        left:   -pos.x,
        top:    -pos.y,
        right:  BOARD_W - CARD_W - pos.x,
        bottom: BOARD_H - CARD_H - pos.y,
      }}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileDrag={{ scale: 1.06, zIndex: 50, rotate: 0, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
      whileHover={{ scale: isSelected ? 1 : 1.03 }}
      className={`bg-gray-900 border-2 rounded-lg shadow-2xl cursor-grab active:cursor-grabbing select-none transition-colors ${
        isSelected
          ? 'border-yellow-400 shadow-yellow-400/30'
          : 'border-gray-700 hover:border-gray-500'
      }`}
      onClick={() => onClick(clue.id)}
    >
      {/* Thumbtack pin */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
        <div className={`w-4 h-4 rounded-full border-2 shadow-md ${isSelected ? 'bg-yellow-400 border-yellow-300' : 'bg-red-600 border-red-400'}`} />
        <div className={`w-1 h-2.5 rounded-b-full ${isSelected ? 'bg-yellow-500' : 'bg-red-700'}`} />
      </div>

      <div className="p-4 pt-3">
        <div className="flex justify-between items-start mb-2">
          <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-800/60 border border-gray-700">
            <ClueIcon icon={clue.icon} size={28} color={isSelected ? '#C9A227' : '#8B1E1E'} />
          </div>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${reliabilityColor[clue.reliability]}`}>
            {clue.reliability}
          </span>
        </div>

        <h3 className="font-bold text-white text-sm leading-tight mb-1">{clue.name}</h3>
        <p className="text-[11px] text-gray-400 leading-snug line-clamp-3 mb-2">{clue.description}</p>

        <div className="text-[10px] text-gray-600 font-mono uppercase tracking-wider border-t border-gray-800 pt-2">
          📍 {clue.location}
        </div>

        {connections.length > 0 && (
          <div className="mt-2 space-y-1">
            {connections.map((conn, idx) => {
              const otherId = conn.source === clue.id ? conn.target : conn.source;
              const otherClue = allClues.find(c => c.id === otherId);
              return (
                <div key={idx} className="flex items-center justify-between bg-red-900/20 border border-red-900/40 rounded px-2 py-0.5">
                  <span className="text-[10px] text-red-400 flex items-center gap-1">
                    <LinkIcon size={8} /> {otherClue?.name || '?'}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); onRemoveConnection(conn.source, conn.target); }}
                    className="text-red-900 hover:text-red-400 transition ml-1"
                  >
                    <Trash2 size={9} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main board ───────────────────────────────────────────────────────────────
export default function EvidenceBoard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { activeCase, loadCase, foundClues, boardConnections, boardPositions, setBoardPosition, addConnection, removeConnection } = useCaseStore();
  const { setGameStatus } = useSessionStore();
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  // Board-level drag lock: while any card is being dragged, clicks are suppressed globally
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!activeCase) loadCase(id);
    setGameStatus('investigation');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape cancels active selection
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedClueId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Assign initial positions when new clues appear (only if not already persisted)
  useEffect(() => {
    if (!activeCase) return;
    const visible = activeCase.clues.filter(c => foundClues.includes(c.id));
    visible.forEach((clue, i) => {
      if (!boardPositions[clue.id]) {
        const cols = 3;
        const col = i % cols;
        const row = Math.floor(i / cols);
        setBoardPosition(clue.id, {
          x: 60 + col * 280 + (Math.random() * 30 - 15),
          y: 60 + row * 240 + (Math.random() * 30 - 15),
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCase?.id, foundClues.length]);

  const handleAnyDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  // Called when any card drag ends — commit position, keep lock briefly so
  // the synthetic onClick that fires after pointerup is swallowed
  const handleAnyDragEnd = useCallback((clueId: string, dx: number, dy: number) => {
    const pos = boardPositions[clueId];
    if (pos) {
      const newX = Math.max(0, Math.min(BOARD_W - CARD_W, pos.x + dx));
      const newY = Math.max(0, Math.min(BOARD_H - CARD_H, pos.y + dy));
      setBoardPosition(clueId, { x: newX, y: newY });
    }
    // Keep the lock for one event-loop tick so the trailing onClick is ignored
    setTimeout(() => { isDraggingRef.current = false; }, 0);
  }, [boardPositions, setBoardPosition]);

  const handleClueClick = useCallback((clueId: string) => {
    // Ignore clicks that are the tail of a drag gesture
    if (isDraggingRef.current) return;
    AudioEngine.playBeep();
    if (selectedClueId) {
      if (selectedClueId === clueId) {
        // Clicking the already-selected card cancels the selection
        setSelectedClueId(null);
        return;
      }
      const exists = boardConnections.find(
        c => (c.source === selectedClueId && c.target === clueId) ||
             (c.target === selectedClueId && c.source === clueId)
      );
      if (exists) {
        // Toggle OFF — remove the existing connection
        removeConnection(exists.source, exists.target);
        AudioEngine.playBeep();
      } else {
        // Toggle ON — add a new connection
        addConnection(selectedClueId, clueId);
        AudioEngine.playSuccess();
      }
      setSelectedClueId(null);
    } else {
      setSelectedClueId(clueId);
    }
  }, [selectedClueId, boardConnections, addConnection, removeConnection]);

  if (!activeCase) return <div className="text-center mt-20 text-gray-400">Loading Board...</div>;

  const visibleClues = activeCase.clues.filter(c => foundClues.includes(c.id));

  const reliabilityColor: Record<string, string> = {
    High: 'text-green-400 border-green-800 bg-green-900/20',
    Medium: 'text-yellow-400 border-yellow-800 bg-yellow-900/20',
    Low: 'text-red-400 border-red-800 bg-red-900/20',
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-100px)] p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <Link href={`/case/${id}`} className="flex items-center text-gray-400 hover:text-white transition text-sm">
          <ArrowLeft size={15} className="mr-2" /> Back to Case Hub
        </Link>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold tracking-widest text-red-500 uppercase">Evidence Board</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">
            {visibleClues.length} clue{visibleClues.length !== 1 ? 's' : ''} · {boardConnections.length} connection{boardConnections.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className={`text-xs font-mono px-3 py-1.5 rounded-full border transition ${
          selectedClueId
            ? 'border-yellow-500 text-yellow-400 bg-yellow-900/20 scan-pulse'
            : 'border-gray-700 text-gray-500'
        }`}>
          {selectedClueId ? 'PIN ACTIVE — Select target clue' : 'Click clue to connect · Drag to move'}
        </div>
      </div>

      {/* Instructions banner */}
      <div className="mb-3 shrink-0 bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2.5 flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
        <span className="text-yellow-500 text-base mt-0.5 shrink-0">🔗</span>
        <span>
          <strong className="text-gray-200">Connecting clues</strong> lets you build a chain of evidence — linking two clues means you believe they point to the same suspect, motive, or event.
          The more connections you make, the clearer the picture becomes before your final accusation.{' '}
          <span className="text-gray-500">Click a card to select it, then click another to connect them. Click the same pair again to remove the link. Press <kbd className="bg-gray-800 border border-gray-700 rounded px-1 py-0.5 font-mono text-gray-300">Esc</kbd> to cancel.</span>
        </span>
      </div>

      {/* Board canvas */}
      <div
        className="flex-1 corkboard border-2 border-gray-700/50 rounded-xl relative overflow-auto"
        style={{ cursor: selectedClueId ? 'crosshair' : 'default' }}
      >
        <div style={{ width: BOARD_W, height: BOARD_H, position: 'relative' }}>

          {/* SVG string layer */}
          <svg
            className="absolute inset-0 pointer-events-none string-glow"
            width={BOARD_W}
            height={BOARD_H}
            style={{ zIndex: 1 }}
          >
            {boardConnections.map((conn, i) => {
              const pos1 = boardPositions[conn.source];
              const pos2 = boardPositions[conn.target];
              if (!pos1 || !pos2) return null;
              const { d, x1, y1, x2, y2 } = buildPath(pos1, pos2);
              return (
                <g key={`${conn.source}-${conn.target}-${i}`}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="#8B1E1E"
                    strokeWidth="2.5"
                    strokeDasharray="8 5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  <circle cx={x1} cy={y1} r="5" fill="#8B1E1E" opacity="0.9" />
                  <circle cx={x2} cy={y2} r="5" fill="#8B1E1E" opacity="0.9" />
                </g>
              );
            })}
          </svg>

          {/* Clue cards */}
          {visibleClues.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 italic">
              <div className="text-center">
                <PinIcon size={40} className="mx-auto mb-3 opacity-30" />
                <p>The board is empty. Find clues at the Investigation Map.</p>
              </div>
            </div>
          ) : (
            visibleClues.map((clue, cardIndex) => {
              const pos = boardPositions[clue.id] ?? {
                x: 60 + (cardIndex % 3) * 280,
                y: 60 + Math.floor(cardIndex / 3) * 240,
              };
              return (
                <ClueCard
                  key={clue.id}
                  clue={clue}
                  cardIndex={cardIndex}
                  pos={pos}
                  isSelected={selectedClueId === clue.id}
                  connections={boardConnections.filter(c => c.source === clue.id || c.target === clue.id)}
                  allClues={activeCase.clues}
                  onClick={handleClueClick}
                  onRemoveConnection={removeConnection}
                  onDragStart={handleAnyDragStart}
                  onDragEnd={handleAnyDragEnd}
                  reliabilityColor={reliabilityColor}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
