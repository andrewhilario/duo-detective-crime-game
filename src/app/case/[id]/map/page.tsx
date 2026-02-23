"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCaseStore } from '../../../../store/caseStore';
import { useMultiplayerStore } from '../../../../store/multiplayerStore';
import { useSessionStore } from '../../../../store/sessionStore';
import { ArrowLeft, Search, Eye, Map as MapIcon, CheckCircle2 } from 'lucide-react';
import { Clue } from '../../../../data/cases';
import { motion, AnimatePresence } from 'framer-motion';
import { ClueIcon } from '../../../../components/ClueIcon';
import { AudioEngine } from '../../../../utils/sfx';

export default function InvestigationMap({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { activeCase, loadCase, foundClues, findClue } = useCaseStore();
  const { playerId } = useMultiplayerStore();
  const { setGameStatus } = useSessionStore();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [examiningClue, setExaminingClue] = useState<Clue | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!activeCase) {
      loadCase(id);
    }
    setGameStatus('investigation');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeCase) return <div className="text-center mt-20">Loading Map...</div>;

  const handleLocationClick = (location: string) => {
    if (selectedLocation === location) return;
    
    AudioEngine.playScan();
    setIsScanning(true);
    setSelectedLocation(location);
    setExaminingClue(null);
    
    const cluesAtLocation = activeCase.clues.filter(
      c => c.location === location && (c.visibleTo === 'all' || c.visibleTo === playerId)
    );
    setTimeout(() => {
      setIsScanning(false);
      if (cluesAtLocation.length > 0) {
        AudioEngine.playSuccess();
      }
    }, 1500);
  };

  const handleExamine = (clue: Clue) => {
    AudioEngine.playBeep();
    if (!foundClues.includes(clue.id)) {
      findClue(clue.id); // Triggers sync to other player
    }
    setExaminingClue(clue);
  };

  const visibleClues = activeCase.clues.filter(c => 
    c.location === selectedLocation && 
    (c.visibleTo === 'all' || c.visibleTo === playerId)
  );

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 h-full">
      <Link href={`/case/${id}`} className="flex items-center text-gray-400 hover:text-white mb-6 transition w-fit">
        <ArrowLeft size={16} className="mr-2" /> Back to Case Hub
      </Link>

      {/* Instructions banner */}
      <div className="mb-3 shrink-0 bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2.5 flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
        <span className="text-red-400 text-base mt-0.5 shrink-0">🗺️</span>
        <span>
          <strong className="text-gray-200">Each location may contain clues only your role can see.</strong>{' '}
          Select a location from the left panel to scan it. Click any discovered clue to examine it — examining a clue automatically logs it to your{' '}
          <strong className="text-gray-300">Evidence Board</strong>.{' '}
          <span className="text-gray-500">Your partner sees different evidence; share findings in the chat to build the full picture.</span>
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-[calc(100vh-140px)]">
        {/* Locations List */}
        <div className="w-full md:w-1/3 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-gray-800/50">
            <h2 className="font-bold text-lg text-white flex items-center">
              <Search size={20} className="mr-2 text-red-500" /> Locations
            </h2>
            <p className="text-xs text-gray-400 mt-1">Select an area to search.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeCase.locations.map(loc => {
              // Clues this player can see at this location
              const playerCluesHere = activeCase.clues.filter(
                c => c.location === loc && (c.visibleTo === 'all' || c.visibleTo === playerId)
              );
              const allFound = playerCluesHere.length > 0 &&
                playerCluesHere.every(c => foundClues.includes(c.id));
              return (
                <button
                  key={loc}
                  onClick={() => handleLocationClick(loc)}
                  className={`w-full text-left p-4 rounded-lg border transition flex items-center justify-between gap-2 ${
                    selectedLocation === loc 
                      ? 'bg-red-900/20 border-red-500 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-gray-600'
                  }`}
                >
                  <span>{loc}</span>
                  {allFound && (
                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Details & Clues */}
        <div className="w-full md:w-2/3 bg-gray-900 border border-gray-800 rounded-xl flex flex-col relative overflow-hidden">
          {selectedLocation ? (
            <>
              <div className="p-6 border-b border-gray-800 bg-gray-800/30 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{selectedLocation}</h2>
                <span className="text-sm text-gray-500 uppercase tracking-widest font-mono">SECTOR {activeCase.locations.indexOf(selectedLocation) + 1}</span>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {isScanning ? (
                    <motion.div
                      key="scanning-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-gray-500 space-y-6"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-24 h-24 rounded-full border-2 border-red-500 border-t-transparent animate-spin"
                      />
                      <p className="font-mono text-sm uppercase tracking-widest text-red-500 animate-pulse">Scanning Sector...</p>
                    </motion.div>
                  ) : examiningClue ? (
                    <motion.div 
                      key="examine-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full flex flex-col"
                    >
                      <button 
                        onClick={() => setExaminingClue(null)}
                        className="text-sm text-gray-400 hover:text-white mb-6 flex items-center transition w-fit"
                      >
                        <ArrowLeft size={14} className="mr-1" /> Back to Area
                      </button>
                      
                       <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex-1">
                         <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-gray-700/60 rounded-lg flex items-center justify-center shrink-0 border border-gray-600">
                               <ClueIcon icon={examiningClue.icon} size={36} />
                             </div>
                             <h3 className="text-3xl font-bold text-red-500">{examiningClue.name}</h3>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shrink-0 ml-4 ${
                             examiningClue.reliability === 'High' ? 'bg-green-900/30 text-green-400 border-green-800' :
                             examiningClue.reliability === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                             'bg-red-900/30 text-red-400 border-red-800'
                           }`}>
                             {examiningClue.reliability} Reliability
                           </span>
                         </div>
                        
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 text-lg leading-relaxed">{examiningClue.description}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-700 flex items-center text-sm text-gray-500">
                          <Eye size={16} className="mr-2" /> 
                          {foundClues.includes(examiningClue.id)
                            ? 'Already logged to your Evidence Board.'
                            : 'This clue has been added to your Evidence Board.'}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="grid-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <AnimatePresence>
                        {visibleClues.length > 0 ? visibleClues.map(clue => {
                          const isFound = foundClues.includes(clue.id);
                          return (
                             <motion.button
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              key={clue.id}
                              onClick={() => handleExamine(clue)}
                              className={`p-6 rounded-xl border text-left flex flex-col justify-between h-40 transition group ${
                                isFound 
                                  ? 'bg-gray-800 border-gray-600 hover:border-red-400' 
                                  : 'bg-gray-800/50 border-gray-700 border-dashed hover:border-gray-500 hover:bg-gray-800'
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isFound ? 'bg-red-900/40' : 'bg-gray-700/60'}`}>
                                    {isFound 
                                      ? <ClueIcon icon={clue.icon} size={24} color="#f87171" />
                                      : <Search size={18} className="text-gray-500" />
                                    }
                                  </div>
                                  {isFound && <span className="text-xs text-red-400 uppercase tracking-widest font-bold">Logged</span>}
                                </div>
                                <h3 className={`font-semibold text-lg mt-2 ${isFound ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                  {isFound ? clue.name : 'Unknown Object'}
                                </h3>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {isFound ? 'Click to re-examine' : 'Investigate area'}
                              </p>
                            </motion.button>
                          );
                        }) : (
                          <motion.div 
                            key="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="col-span-2 flex flex-col items-center justify-center h-40 text-gray-500"
                          >
                            <Search size={32} className="mb-2 opacity-50" />
                            <p>No actionable clues found here... yet.</p>
                            {playerId === 'player1' ? (
                              <p className="text-xs mt-2">Perhaps Detective B can spot something.</p>
                            ) : (
                              <p className="text-xs mt-2">Perhaps Detective A can spot something.</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <MapIcon size={48} className="mb-4 opacity-30" />
              <h3 className="text-xl font-medium mb-2">Awaiting Location Selection</h3>
              <p className="max-w-xs">Select a location from the list on the left to begin your search for clues.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
