import { create } from 'zustand';
import { CaseData, allCases, Clue, Suspect } from '../data/cases';

interface CaseState {
  activeCase: CaseData | null;
  foundClues: string[];
  unlockedSuspects: string[];
  boardConnections: { source: string; target: string }[];
  boardPositions: Record<string, { x: number; y: number }>;
  loadCase: (caseId: string) => void;
  findClue: (clueId: string) => void;
  addConnection: (source: string, target: string) => void;
  removeConnection: (source: string, target: string) => void;
  setBoardPosition: (clueId: string, pos: { x: number; y: number }) => void;
  syncState: (state: Partial<Omit<CaseState, 'activeCase' | 'loadCase' | 'findClue' | 'addConnection' | 'removeConnection' | 'syncState' | 'setBoardPosition' | 'reset'>>) => void;
  /** Reset all case state (call when returning to lobby) */
  reset: () => void;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  activeCase: null,
  foundClues: [],
  unlockedSuspects: [],
  boardConnections: [],
  boardPositions: {},

  loadCase: (caseId) => {
    const selectedCase = allCases.find(c => c.id === caseId) || allCases[0];

    // Seed board connections from the clue data's pre-suggested `connections` arrays.
    // Deduplicate: always store with the lower-sorted id as `source` so we never
    // add the same pair twice from both directions.
    const seedConnections: { source: string; target: string }[] = [];
    const seen = new Set<string>();
    selectedCase.clues.forEach(clue => {
      clue.connections.forEach(targetId => {
        const key = [clue.id, targetId].sort().join('|');
        if (!seen.has(key)) {
          seen.add(key);
          const [src, tgt] = [clue.id, targetId].sort();
          seedConnections.push({ source: src, target: tgt });
        }
      });
    });

    set({
      activeCase: selectedCase,
      foundClues: [],
      unlockedSuspects: selectedCase.suspects.filter(s => s.unlocked).map(s => s.id),
      boardConnections: seedConnections,
    });
  },

  findClue: (clueId) => {
    const { foundClues, activeCase, unlockedSuspects } = get();
    if (foundClues.includes(clueId) || !activeCase) return;

    const newFoundClues = [...foundClues, clueId];
    
    // Check if finding this clue unlocks any suspects
    const newUnlockedSuspects = [...unlockedSuspects];
    activeCase.suspects.forEach(suspect => {
      if (!newUnlockedSuspects.includes(suspect.id)) {
        const canUnlock = suspect.unlockedByClues.some(id => newFoundClues.includes(id));
        if (canUnlock) {
          newUnlockedSuspects.push(suspect.id);
        }
      }
    });

    set({ foundClues: newFoundClues, unlockedSuspects: newUnlockedSuspects });
    // State is synced to the room via the layout.tsx sync-state watcher
  },

  addConnection: (source, target) => {
    set(state => ({
      boardConnections: [...state.boardConnections, { source, target }]
    }));
  },

  removeConnection: (source, target) => {
    set(state => ({
      boardConnections: state.boardConnections.filter(c => !(c.source === source && c.target === target))
    }));
  },

  setBoardPosition: (clueId, pos) => {
    set(state => ({ boardPositions: { ...state.boardPositions, [clueId]: pos } }));
  },

  reset: () => {
    set({
      activeCase: null,
      foundClues: [],
      unlockedSuspects: [],
      boardConnections: [],
      boardPositions: {},
    });
  },

  syncState: (incoming) => set(current => {
    // Merge additively so neither player's progress overwrites the other's.
    // foundClues and unlockedSuspects are unioned; boardConnections are unioned
    // by deduplicating on source+target.
    const mergedFoundClues = Array.from(
      new Set([...current.foundClues, ...(incoming.foundClues ?? [])])
    );

    const mergedUnlocked = Array.from(
      new Set([...current.unlockedSuspects, ...(incoming.unlockedSuspects ?? [])])
    );

    const existingConnSet = new Set(
      current.boardConnections.map(c => `${c.source}|${c.target}`)
    );
    const newConns = (incoming.boardConnections ?? []).filter(
      c => !existingConnSet.has(`${c.source}|${c.target}`) &&
           !existingConnSet.has(`${c.target}|${c.source}`)
    );
    const mergedConnections = [...current.boardConnections, ...newConns];

    return {
      foundClues: mergedFoundClues,
      unlockedSuspects: mergedUnlocked,
      boardConnections: mergedConnections,
    };
  })
}));
