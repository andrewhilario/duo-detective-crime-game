"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCaseStore } from '../../../store/caseStore';
import { Map, Briefcase, Users, FileText, Gavel } from 'lucide-react';

export default function CaseHub({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { activeCase, loadCase } = useCaseStore();

  useEffect(() => {
    if (!activeCase) {
      loadCase(id);
    }
  }, [activeCase, loadCase, id]);

  if (!activeCase) return <div className="text-center mt-20">Loading Case...</div>;

  const links = [
    { href: 'briefing', label: 'Briefing', icon: Briefcase, desc: 'Review the case details.' },
    { href: 'map', label: 'Investigation Map', icon: Map, desc: 'Explore locations and find clues.' },
    { href: 'board', label: 'Evidence Board', icon: FileText, desc: 'Connect clues and find contradictions.' },
    { href: 'suspects', label: 'Suspect Profiles', icon: Users, desc: 'Review suspects and alibis.' },
    { href: 'accusation', label: 'Make Accusation', icon: Gavel, desc: 'Ready to close the case?' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-2">{activeCase.title}</h1>
      <p className="text-gray-400 mb-12">Select an area to focus your investigation.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={`/case/${id}/${link.href}`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-red-500 hover:bg-gray-750 transition group">
              <Icon size={32} className="text-red-500 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold mb-2">{link.label}</h2>
              <p className="text-sm text-gray-400">{link.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
