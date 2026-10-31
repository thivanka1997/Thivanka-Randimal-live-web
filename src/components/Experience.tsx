'use client';

import React from 'react';
import { Calendar, Building2, ChevronRight } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export const Experience: React.FC = () => {
  const { experienceTimeline } = usePortal();

  return (
    <section id="experience" className="py-20 relative bg-transparent scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Professional Journey
          </h2>
          <p className="text-base text-zinc-400 max-w-xl mx-auto">
            Defining the industry standards through dedicated service.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-0">
          
          {/* Central Vertical Line for Desktop, Left Line for Mobile */}
          <div className="absolute top-4 bottom-4 left-6 sm:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#8B9FFD]/60 via-indigo-500/30 to-transparent" />

          <div className="space-y-12">
            {experienceTimeline.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id || index}
                  className={`relative flex flex-col sm:flex-row items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Glowing Node Dot on Timeline */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8B9FFD] border-4 border-[#0b0d12] shadow-lg shadow-[#8B9FFD]/50 z-10" />

                  {/* Content Card */}
                  <div
                    className={`w-full sm:w-1/2 pl-8 sm:pl-0 ${
                      isEven ? 'sm:pl-10' : 'sm:pr-10'
                    }`}
                  >
                    <div className="card-dark-gradient card-dark-hover p-6 rounded-2xl relative border border-white/10 group">
                      
                      {/* Period Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B9FFD]/15 text-[#8B9FFD] text-xs font-semibold mb-3 border border-[#8B9FFD]/20">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.period}</span>
                      </div>

                      {/* Title & Company */}
                      <h3 className="text-xl font-bold text-white group-hover:text-[#8B9FFD] transition-colors mb-1">
                        {item.role}
                      </h3>
                      <div className="flex items-center text-sm font-semibold text-zinc-300 mb-3">
                        <Building2 className="w-4 h-4 mr-1.5 text-zinc-400" />
                        <span>{item.company}</span>
                      </div>

                      {/* Main Summary */}
                      <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Bullet Highlights if available */}
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="pt-3 border-t border-white/5 space-y-1.5">
                          {item.highlights.map((h, i) => (
                            <div key={i} className="flex items-start text-xs text-zinc-300">
                              <ChevronRight className="w-3.5 h-3.5 text-[#8B9FFD] shrink-0 mt-0.5 mr-1" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
