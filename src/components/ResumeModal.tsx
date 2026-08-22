'use client';

import React from 'react';
import { X, Download, Printer, MapPin, Mail, Phone, Briefcase, GraduationCap, Award, BookOpen } from 'lucide-react';
import { HERO_DATA, EXPERIENCE_TIMELINE, CERTIFICATIONS, EDUCATION, PROFESSIONAL_QUALIFICATIONS, CONTACT_INFO, SKILL_PROGRESS_BARS } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl card-dark-gradient border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-8 text-left">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e111a]">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Curriculum Vitae</h3>
            <span className="text-xs text-[#8B9FFD] font-mono px-2 py-0.5 rounded bg-[#8B9FFD]/15">
              PDF Ready
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Canvas */}
        <div className="p-8 sm:p-10 space-y-8 max-h-[75vh] overflow-y-auto bg-[#0b0d12] text-zinc-200">
          
          {/* Resume Header */}
          <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {HERO_DATA.firstName} {HERO_DATA.lastName}
              </h1>
              <p className="text-base font-semibold text-[#8B9FFD] mt-1">
                {HERO_DATA.title} | {HERO_DATA.subTitle}
              </p>
            </div>

            <div className="text-xs space-y-1 text-zinc-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8B9FFD]" />
                <span>{HERO_DATA.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8B9FFD]" />
                <span>{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8B9FFD]" />
                <span>{CONTACT_INFO.phone}</span>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B9FFD] flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Work Experience</span>
            </h2>

            <div className="space-y-6 pl-2">
              {EXPERIENCE_TIMELINE.map((item, idx) => (
                <div key={idx} className="border-l-2 border-[#8B9FFD]/40 pl-4 space-y-1">
                  <div className="flex flex-wrap justify-between items-center text-sm font-bold text-white">
                    <span>{item.role} — <span className="text-[#8B9FFD]">{item.company}</span></span>
                    <span className="text-xs font-mono text-zinc-400">{item.period}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                    {item.description}
                  </p>
                  {item.highlights && (
                    <ul className="list-disc list-inside text-xs text-zinc-400 pt-1 space-y-0.5">
                      {item.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education & Professional Qualifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
            
            {/* Education */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B9FFD] flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Education</span>
              </h2>
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-white/5 space-y-1">
                <p className="text-sm font-bold text-white">{EDUCATION.degree}</p>
                <p className="text-xs font-semibold text-[#8B9FFD]">{EDUCATION.institution}</p>
                <p className="text-xs text-zinc-400">{EDUCATION.specialization}</p>
              </div>
            </div>

            {/* Professional Qualifications */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B9FFD] flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Professional Qualifications</span>
              </h2>
              <div className="space-y-2">
                {PROFESSIONAL_QUALIFICATIONS.map((qual, idx) => (
                  <div key={idx} className="bg-zinc-900/80 p-3 rounded-xl border border-white/5 space-y-0.5">
                    <p className="text-xs font-bold text-white">{qual.title}</p>
                    <p className="text-[11px] font-medium text-[#8B9FFD]">{qual.institution}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Certifications */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B9FFD] flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Industry Certifications</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CERTIFICATIONS.map((cert, idx) => (
                <div key={idx} className="bg-zinc-900/80 p-3 rounded-xl border border-white/5">
                  <p className="text-xs font-bold text-white">{cert.title}</p>
                  <p className="text-[10px] text-zinc-400">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Matrix */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B9FFD]">
              Core Competencies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SKILL_PROGRESS_BARS.map((s, idx) => (
                <div key={idx} className="bg-zinc-900/60 p-2.5 rounded-lg text-center border border-white/5">
                  <p className="text-xs font-semibold text-zinc-300">{s.name}</p>
                  <p className="text-xs font-mono font-bold text-[#8B9FFD] mt-0.5">{s.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
