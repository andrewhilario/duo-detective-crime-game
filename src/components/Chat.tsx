"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { useSessionStore } from '../store/sessionStore';
import { MessageSquare, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioEngine } from '../utils/sfx';

export const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { messages, sendMessage, playerId } = useMultiplayerStore();
  const { playerName } = useSessionStore();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef(messages.length);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (messages.length > previousMessagesLength.current) {
      const newMessages = messages.slice(previousMessagesLength.current);
      let newUnread = 0;
      for (const msg of newMessages) {
        if (msg.sender !== playerId && msg.sender !== 'system') {
          AudioEngine.playChatPing();
          if (!isOpen) newUnread++;
        }
      }
      if (newUnread > 0) setUnreadCount(prev => prev + newUnread);
    }
    previousMessagesLength.current = messages.length;
  }, [messages, playerId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const getSenderLabel = (sender: string) => {
    if (sender === playerId) return playerName || (sender === 'player1' ? 'Detective A' : 'Detective B');
    if (sender === 'player1') return 'Detective A';
    if (sender === 'player2') return 'Detective B';
    return 'System';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-80 h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl mb-4 flex flex-col"
          >
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-200 text-sm">Case Chat</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => {
                const isMe = msg.sender === playerId;
                const isP1 = msg.sender === 'player1';
                const isP2 = msg.sender === 'player2';
                const isSystem = !isP1 && !isP2;
                const stableKey = `${msg.sender}-${msg.text.slice(0, 20)}-${i}`;
                
                return (
                  <div key={stableKey} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-gray-500 mb-1">{getSenderLabel(msg.sender)}</span>
                    <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] break-words ${
                      isSystem ? 'bg-gray-700 text-gray-200' :
                      isMe ? 'bg-red-700 text-white' :
                      isP1 ? 'bg-blue-700 text-white' :
                      'bg-green-700 text-white'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={endOfMessagesRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-gray-800 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Discuss evidence..."
              />
              <button type="submit" className="p-2 bg-red-600 rounded-md hover:bg-red-700 transition">
                <Send size={16} className="text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition relative"
      >
        <MessageSquare size={20} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
