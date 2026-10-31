'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, Cpu, Sparkles, Award } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export const About: React.FC = () => {
  const { aboutData, heroData } = usePortal();

  return (
    <section id="about" className="py-20 relative bg-transparent scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Outer decorative ambient glow frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8B9FFD]/30 via-indigo-500/20 to-purple-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden border border-white/10 card-dark-gradient shadow-2xl">
                <img loading="lazy" decoding="async"
                  src={heroData.profileImage || '/assets/images/regenerated_image_1785318122875.webp'}
                  alt={heroData.firstName + ' ' + heroData.lastName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/regenerated_image_1785318122875.webp';
                  }}
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12]/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
              {aboutData.heading}
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-8">
              {aboutData.description}
            </p>

            {aboutData.bioDetails && (
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                {aboutData.bioDetails}
              </p>
            )}

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aboutData.features.map((feature, index) => {
                const icons = [
                  <ShieldCheck className="w-5 h-5" key="0" />,
                  <Cpu className="w-5 h-5" key="1" />,
                  <Sparkles className="w-5 h-5" key="2" />,
                ];

                return (
                  <div
                    key={feature.id || index}
                    className="card-dark-gradient card-dark-hover p-5 rounded-xl flex items-start space-x-3.5 border border-white/10"
                  >
                    <div className="p-2 rounded-lg bg-[#8B9FFD]/10 text-[#8B9FFD] shrink-0 mt-0.5">
                      {icons[index % icons.length] || <Award className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
