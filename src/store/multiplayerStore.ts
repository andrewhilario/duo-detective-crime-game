import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface MultiplayerState {
  socket: Socket | null;
  roomId: string | null;
  isConnected: boolean;
  messages: { sender: string; text: string }[];
  playerId: 'player1' | 'player2' | null;
  /** The suspect ID that the partner just accused (triggers co-op confirm flow) */
  partnerAccusedId: string | null;
  connect: (roomId: string, playerId: 'player1' | 'player2', requestedCaseId?: string, onRoomInfo?: (caseId: string) => void) => void;
  disconnect: () => void;
  sendMessage: (text: string) => void;
  addMessage: (msg: { sender: string; text: string }) => void;
  /** Emit an accusation to the partner */
  emitAccuse: (suspectId: string) => void;
  clearPartnerAccused: () => void;
  /** Reset all multiplayer state (call when returning to lobby) */
  reset: () => void;
}

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  socket: null,
  roomId: null,
  isConnected: false,
  messages: [],
  playerId: null,
  partnerAccusedId: null,

  connect: (roomId, playerId, requestedCaseId, onRoomInfo) => {
    // Prevent duplicate connections — tear down any existing socket first.
    const existing = get().socket;
    if (existing) {
      existing.removeAllListeners();
      existing.disconnect();
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || '';
    const socket = io(socketUrl, { transports: ['websocket'] });

    socket.on('connect', () => {
      set({ isConnected: true });
      socket.emit('join-room', roomId, requestedCaseId);
    });

    socket.on('room-info', (caseId: string) => {
      if (onRoomInfo) onRoomInfo(caseId);
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('chat-message', (msg) => {
      get().addMessage(msg);
    });

    // Co-op accusation: partner made an accusation
    socket.on('accused', (suspectId: string) => {
      set({ partnerAccusedId: suspectId });
    });

    set({ socket, roomId, playerId });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({ socket: null, isConnected: false });
  },

  sendMessage: (text) => {
    const { socket, roomId, playerId } = get();
    if (socket && roomId) {
      const msg = { sender: playerId || 'unknown', text };
      socket.emit('chat-message', { roomId, msg });
      get().addMessage(msg);
    }
  },

  addMessage: (msg) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },

  emitAccuse: (suspectId) => {
    const { socket, roomId } = get();
    if (socket && roomId) {
      socket.emit('accuse', { roomId, suspectId });
    }
  },

  clearPartnerAccused: () => set({ partnerAccusedId: null }),

  reset: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({
      socket: null,
      roomId: null,
      isConnected: false,
      messages: [],
      playerId: null,
      partnerAccusedId: null,
    });
  },
}));
