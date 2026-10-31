'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ArrowRight, Briefcase, Award, Users, TicketCheck, Sparkles } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface HeroProps {
  onViewProjectsClick: () => void;
  onContactClick: () => void;
}

/** Counts the numeric part of a value like "500+" or "3+ Years" up from zero. */
const CountUp: React.FC<{ value: string; delay?: number }> = ({ value, delay = 0 }) => {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, prefix, num, suffix] = match;
    const target = parseInt(num, 10);
    const duration = 1400;
    let raf = 0;
    let start = 0;
    setDisplay(`${prefix}0${suffix}`);

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => (raf = requestAnimationFrame(tick)), delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
};

export const Hero: React.FC<HeroProps> = ({ onViewProjectsClick, onContactClick }) => {
  const { heroData } = usePortal();
  const sectionRef = useRef<HTMLElement>(null);

  // Soft spotlight that follows the cursor across the hero
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia('(hover: hover)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        section.style.setProperty('--hx', `${e.clientX - rect.left}px`);
        section.style.setProperty('--hy', `${e.clientY - rect.top}px`);
      });
    };
    section.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      section.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const icons = [Briefcase, TicketCheck, Users, Award];

  return (
    <section
      ref={sectionRef}
      className="hero-spotlight relative min-h-[100svh] pt-28 pb-16 flex flex-col justify-center items-center text-center overflow-hidden w-full max-w-full"
    >
      {/* Background: fine grid + glow */}
      <div className="hero-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] h-[640px] bg-[#8B9FFD]/10 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Availability badge */}
        <div className="hero-enter mb-8 flex justify-center" style={{ '--d': '0ms' } as React.CSSProperties}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] text-xs sm:text-sm font-medium text-emerald-300/90 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for new projects
          </span>
        </div>

        {/* Name */}
        <h1 className="font-display mb-4 leading-[0.95]">
          <span
            className="hero-enter block text-[clamp(2.25rem,10.5vw,6rem)] font-extrabold tracking-tight text-white uppercase"
            style={{ '--d': '80ms' } as React.CSSProperties}
          >
            {heroData.firstName}
          </span>
          <span
            className="hero-enter text-gradient-animated block text-[clamp(2.25rem,10.5vw,6rem)] font-extrabold tracking-tight uppercase"
            style={{ '--d': '180ms' } as React.CSSProperties}
          >
            {heroData.lastName}
          </span>
        </h1>

        {/* Roles & Subtitle */}
        <div className="hero-enter mt-8 flex flex-col items-center justify-center space-y-3" style={{ '--d': '300ms' } as React.CSSProperties}>
          <p className="text-sm sm:text-lg font-semibold tracking-[0.2em] text-[#aab8ff] uppercase px-5 py-1.5 rounded-full bg-[#8B9FFD]/[0.08] border border-[#8B9FFD]/20">
            {heroData.title}
          </p>
          <p className="text-base sm:text-lg text-zinc-400 tracking-wide max-w-2xl">
            {heroData.subTitle}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500">
            <MapPin className="w-3.5 h-3.5 text-[#8B9FFD]" />
            <span>{heroData.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hero-enter mt-10 flex flex-wrap items-center justify-center gap-4" style={{ '--d': '420ms' } as React.CSSProperties}>
          <button
            onClick={onViewProjectsClick}
            id="hero-view-projects-btn"
            className="btn-shine group px-7 py-3.5 text-sm font-semibold text-[#0b0d12] bg-[#8B9FFD] hover:bg-[#a2b2ff] rounded-xl transition-all duration-300 shadow-lg shadow-[#8B9FFD]/25 hover:shadow-[#8B9FFD]/45 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={onContactClick}
            id="hero-contact-btn"
            className="px-7 py-3.5 text-sm font-semibold text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/25 rounded-xl transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <span>Contact Me</span>
          </button>
        </div>

        {/* Metrics Row (stat cards) */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {heroData.metrics.map((metric, index) => {
            const Icon = icons[index] || Sparkles;
            return (
              <div
                key={index}
                className="hero-enter card-dark-gradient card-dark-hover p-5 rounded-2xl text-center relative group"
                style={{ '--d': `${560 + index * 90}ms` } as React.CSSProperties}
              >
                <div className="flex justify-center mb-2">
                  <Icon className="w-4 h-4 text-[#8B9FFD]" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1 tabular-nums group-hover:text-[#aab8ff] transition-colors">
                  <CountUp value={metric.value} delay={600 + index * 90} />
                </div>
                <div className="text-xs sm:text-sm font-medium text-zinc-500">{metric.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="hero-enter mt-14 flex flex-col items-center gap-2 text-zinc-500 hover:text-[#8B9FFD] transition-colors"
        style={{ '--d': '1000ms' } as React.CSSProperties}
        aria-label="Scroll to content"
      >
        <span className="scroll-mouse" aria-hidden="true" />
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
      </a>
    </section>
  );
};
