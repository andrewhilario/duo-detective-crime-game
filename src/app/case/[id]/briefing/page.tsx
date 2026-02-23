"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCaseStore } from '../../../../store/caseStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Typewriter } from '../../../../components/Typewriter';

export default function BriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { activeCase, loadCase } = useCaseStore();

  useEffect(() => {
    if (!activeCase) {
      loadCase(id);
    }
  }, [activeCase, loadCase, id]);

  if (!activeCase) return <div className="text-center mt-20 text-gray-500 animate-pulse">Loading Case File...</div>;

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto p-8">
      <Link href={`/case/${id}`} className="flex items-center text-gray-400 hover:text-white mb-8 transition w-fit">
        <ArrowLeft size={16} className="mr-2" /> Back to Case Hub
      </Link>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 shadow-xl">
        <div className="border-b border-gray-700 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-white tracking-wide uppercase mb-2">
            CASE FILE #{activeCase.id.replace(/\D/g, '').padStart(3, '0')}
          </h1>
          <h2 className="text-xl text-red-500 font-semibold">{activeCase.title}</h2>
          <span className="inline-block mt-4 px-3 py-1 bg-red-900/30 text-red-400 border border-red-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Difficulty: {activeCase.difficulty}
          </span>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Briefing
            </h3>
            <p className="pl-5 border-l-2 border-gray-800">
              <Typewriter text={activeCase.briefing} speed={15} />
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Known Timeline
            </h3>
            <div className="pl-5 space-y-4">
              {activeCase.timeline.map((event, idx) => (
                <div key={idx} className="flex relative">
                  <div className="w-24 text-red-400 font-mono text-sm shrink-0 pt-0.5">{event.time}</div>
                  <div className="flex-1 pb-4 relative">
                    {/* Timeline line */}
                    {idx !== activeCase.timeline.length - 1 && (
                      <div className="absolute left-[-1.5rem] top-3 bottom-0 w-px bg-gray-800"></div>
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-[-1.65rem] top-1.5 w-1.5 h-1.5 rounded-full bg-gray-600 border border-gray-900"></div>
                    <p className="text-gray-300">{event.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 flex justify-end">
          <Link 
            href={`/case/${id}/map`}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg shadow-red-900/20"
          >
            Start Investigation <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
