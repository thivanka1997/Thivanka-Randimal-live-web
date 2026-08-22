'use client';

import React from 'react';
import { Award, GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export const CertificationsEducation: React.FC = () => {
  const { certifications, qualifications, education } = usePortal();

  return (
    <section className="py-20 relative bg-[#0b0d12] scroll-mt-20 sm:scroll-mt-24" id="education">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Education & Professional Qualifications */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Education Sub-section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#8B9FFD]/15 text-[#8B9FFD] border border-[#8B9FFD]/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Education
                </h2>
              </div>

              <div className="card-dark-gradient card-dark-hover p-7 rounded-2xl border border-white/10 relative group shadow-xl">
                <div className="absolute top-6 right-6 p-2.5 rounded-xl bg-zinc-800/60 text-zinc-400 group-hover:text-[#8B9FFD] group-hover:bg-[#8B9FFD]/15 transition-all">
                  <GraduationCap className="w-7 h-7" />
                </div>

                <div className="pr-12">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#8B9FFD] bg-[#8B9FFD]/10 px-2.5 py-0.5 rounded-full border border-[#8B9FFD]/20 mb-3">
                    Bachelor's Degree
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-[#8B9FFD] transition-colors">
                    {education.degree}
                  </h3>
                  
                  <p className="text-sm font-semibold text-[#8B9FFD] mb-3">
                    {education.institution}
                  </p>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {education.specialization}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Qualifications Sub-section */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#8B9FFD]/15 text-[#8B9FFD] border border-[#8B9FFD]/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Professional Qualifications
                </h2>
              </div>

              <div className="space-y-3.5">
                {qualifications.map((qual, index) => (
                  <div
                    key={qual.id || index}
                    className="card-dark-gradient card-dark-hover p-5 rounded-2xl border border-white/10 flex items-start justify-between gap-4 group transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-zinc-800/80 text-[#8B9FFD] shrink-0 border border-white/10 group-hover:bg-[#8B9FFD]/20 transition-colors mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#8B9FFD] transition-colors mb-0.5">
                          {qual.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#8B9FFD] mb-1">
                          {qual.institution}
                        </p>
                        {qual.description && (
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {qual.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {qual.badge && (
                      <span className="shrink-0 text-[10px] font-bold text-zinc-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full whitespace-nowrap hidden sm:inline-block">
                        {qual.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Industry Certifications */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#8B9FFD]/15 text-[#8B9FFD] border border-[#8B9FFD]/30">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Industry Certifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={cert.id || index}
                  className="card-dark-gradient card-dark-hover p-5 rounded-2xl flex items-center justify-between border border-white/10 group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-zinc-800/80 text-[#8B9FFD] shrink-0 border border-white/10 group-hover:bg-[#8B9FFD]/20 transition-colors">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#8B9FFD] transition-colors mb-0.5">
                        {cert.title}
                      </h3>
                      <p className="text-xs font-medium text-zinc-400">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>
                  {cert.badge && (
                    <span className="text-[10px] font-bold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md shrink-0">
                      {cert.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
