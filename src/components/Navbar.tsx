"use client";
import React from 'react';
import Link from 'next/link';
import { useSessionStore } from '../store/sessionStore';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { Settings } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  lobby: 'Lobby',
  briefing: 'Briefing',
  investigation: 'Investigation',
  accusation: 'Accusation',
  summary: 'Summary',
};

export const Navbar = () => {
  const { gameStatus } = useSessionStore();
  const { isConnected, roomId, playerId } = useMultiplayerStore();

  const roleLabel = playerId === 'player1' ? 'Detective A' : playerId === 'player2' ? 'Detective B' : null;

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white shadow-md border-b border-gray-800">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold tracking-widest text-red-500 hover:text-red-400 transition">DUO DETECTIVE</Link>
        <span className="text-xs uppercase tracking-wider text-gray-500 border border-gray-700 px-2 py-0.5 rounded font-mono">
          {STATUS_LABELS[gameStatus] ?? gameStatus}
        </span>
      </div>

      <div className="flex items-center gap-5 text-sm">
        {roleLabel && (
          <span className="text-gray-300 font-semibold tracking-wide">
            {roleLabel}
          </span>
        )}
        {roomId && (
          <span className="opacity-60 font-mono text-xs border border-gray-700 px-2 py-0.5 rounded">
            Room&nbsp;{roomId}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span className="opacity-60 text-xs">{isConnected ? 'Online' : 'Offline'}</span>
        </div>
        <Link
          href="/settings"
          className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-500 hover:text-white flex items-center justify-center text-gray-500 transition"
          title="Settings"
        >
          <Settings size={15} />
        </Link>
      </div>
    </nav>
  );
};
