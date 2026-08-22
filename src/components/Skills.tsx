'use client';

import React from 'react';
import { usePortal } from '../context/PortalContext';

export const Skills: React.FC = () => {
  const { skillsProgress, techStackGrid } = usePortal();

  return (
    <section id="skills" className="py-20 relative bg-[#0b0d12] scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Expertise <span className="text-[#8B9FFD]">& Mastery</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Progress Bars */}
          <div className="lg:col-span-6 space-y-6">
            {skillsProgress.map((skill, index) => (
              <div key={skill.id || index} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-zinc-200">{skill.name}</span>
                  <span className="text-[#8B9FFD] font-mono">{skill.percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B9FFD] to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-[#8B9FFD]/30"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Tech Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {techStackGrid.map((item, index) => (
                <div
                  key={item.id || index}
                  className="card-dark-gradient card-dark-hover p-4 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800/90 border border-white/10 flex items-center justify-center mb-2.5 text-[#8B9FFD] font-bold text-sm group-hover:bg-[#8B9FFD]/20 group-hover:border-[#8B9FFD]/40 transition-colors">
                    {item.name}
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                    {item.code}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
