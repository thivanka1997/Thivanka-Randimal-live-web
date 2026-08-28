'use client';

import React from 'react';
import { MapPin, ArrowDown, ExternalLink, Briefcase, Award, Users, TicketCheck, Sparkles } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface HeroProps {
  onViewProjectsClick: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewProjectsClick, onContactClick }) => {
  const { heroData } = usePortal();

  return (
    <section className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center items-center text-center overflow-hidden w-full max-w-full">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[#8B9FFD]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Main Name Heading */}
        <div className="mb-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-1 uppercase">
            {heroData.firstName}
          </h1>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#8B9FFD] periwinkle-text-glow uppercase">
            {heroData.lastName}
          </h2>
        </div>

        {/* Roles & Subtitle */}
        <div className="mt-6 flex flex-col items-center justify-center space-y-2.5">
          <p className="text-base sm:text-xl font-bold tracking-widest text-[#8B9FFD] uppercase px-4 py-1.5 rounded-full bg-[#8B9FFD]/10 border border-[#8B9FFD]/20 shadow-inner">
            {heroData.title}
          </p>
          <p className="text-sm sm:text-base font-medium text-zinc-300 tracking-wide">
            {heroData.subTitle}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-[#8B9FFD]" />
            <span>{heroData.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onViewProjectsClick}
            id="hero-view-projects-btn"
            className="px-7 py-3.5 text-sm font-semibold text-[#0b0d12] bg-[#8B9FFD] hover:bg-[#a2b2ff] rounded-xl transition-all duration-300 shadow-lg shadow-[#8B9FFD]/20 hover:shadow-[#8B9FFD]/40 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <span>View Projects</span>
          </button>
          <button
            onClick={onContactClick}
            id="hero-contact-btn"
            className="px-7 py-3.5 text-sm font-semibold text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl transition-all duration-300 hover:border-zinc-500 cursor-pointer flex items-center gap-2"
          >
            <span>Contact Me</span>
          </button>
        </div>

        {/* Metrics Row (stat cards) */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {heroData.metrics.map((metric, index) => {
            const icons = [
              <Briefcase className="w-4 h-4 text-[#8B9FFD]" key="0" />,
              <TicketCheck className="w-4 h-4 text-[#8B9FFD]" key="1" />,
              <Users className="w-4 h-4 text-[#8B9FFD]" key="2" />,
              <Award className="w-4 h-4 text-[#8B9FFD]" key="3" />,
            ];

            return (
              <div
                key={index}
                className="card-dark-gradient card-dark-hover p-5 rounded-2xl text-center relative group"
              >
                <div className="flex justify-center mb-2">{icons[index % icons.length] || <Sparkles className="w-4 h-4 text-[#8B9FFD]" />}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 group-hover:text-[#8B9FFD] transition-colors">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-zinc-400">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        className="mt-12 text-zinc-500 hover:text-[#8B9FFD] transition-colors animate-bounce p-2"
        aria-label="Scroll to content"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};
