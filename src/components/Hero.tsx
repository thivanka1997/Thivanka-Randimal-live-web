'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, MapPin, Star, Quote } from 'lucide-react';
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

const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

export const Hero: React.FC<HeroProps> = ({ onViewProjectsClick, onContactClick }) => {
  const { heroData, testimonials } = usePortal();
  const stageRef = useRef<HTMLDivElement>(null);

  // Subtle parallax: the portrait and the big word drift with the cursor
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = stage.getBoundingClientRect();
        stage.style.setProperty('--px', `${((e.clientX - rect.left) / rect.width - 0.5).toFixed(3)}`);
        stage.style.setProperty('--py', `${((e.clientY - rect.top) / rect.height - 0.5).toFixed(3)}`);
      });
    };
    const reset = () => {
      stage.style.setProperty('--px', '0');
      stage.style.setProperty('--py', '0');
    };
    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', reset);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(frame);
    };
  }, []);

  const fullName = `${heroData.firstName} ${heroData.lastName}`.trim();
  const featured = testimonials.find((t) => t.featured) || testimonials[0];
  const trusted = testimonials.slice(0, 4);
  const clientsMetric = heroData.metrics.find((m) => /client/i.test(m.label));

  return (
    <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="hero-enter grid lg:grid-cols-[1.6fr_1fr] rounded-[28px] overflow-hidden border border-white/10 shadow-[0_40px_120px_-40px_rgba(70,100,220,0.55)]" style={d(0)}>
          {/* ─────────── Left: portrait stage ─────────── */}
          <div ref={stageRef} className="hero-stage relative min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] overflow-hidden">
            {/* Giant headline word */}
            <div
              className="hero-bigword hero-enter absolute left-5 sm:left-10 top-7 sm:top-10 z-30 select-none pointer-events-none"
              style={d(150)}
              aria-hidden="true"
            >
              BUILD
            </div>

            {/* Portrait, blended into the stage */}
            <div className="hero-portrait absolute bottom-0 right-[-10%] sm:right-[-4%] lg:right-[-5%] h-[76%] sm:h-[86%] lg:h-[92%] aspect-[2/3] z-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroData.profileImage || '/assets/images/regenerated_image_1785318122875.webp'}
                alt={fullName}
                fetchPriority="high"
                decoding="async"
                className="hero-enter w-full h-full object-cover object-top"
                style={d(250)}
              />
            </div>

            {/* Copy + CTA */}
            <div className="absolute left-5 sm:left-10 bottom-6 sm:bottom-10 z-30 max-w-[62%] sm:max-w-sm">
              <p className="hero-enter font-display text-lg sm:text-2xl font-semibold leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]" style={d(450)}>
                Software that works.
                <br />
                <span className="text-white/75">Ideas that scale.</span>
              </p>

              <button
                onClick={onViewProjectsClick}
                id="hero-view-projects-btn"
                className="hero-enter btn-shine group mt-5 sm:mt-6 inline-flex items-center gap-2 pl-5 pr-4 py-3 rounded-full bg-white text-[#0f1530] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-transform cursor-pointer"
                style={d(550)}
              >
                View Work
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Trusted by */}
              <div className="hero-enter mt-6 sm:mt-8 flex items-center gap-3" style={d(650)}>
                <div className="flex -space-x-2.5">
                  {trusted.map((t) => (
                    <span
                      key={t.id}
                      title={t.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/80 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white"
                      style={{ background: t.avatarColor || '#3b4f9a' }}
                    >
                      {t.avatarInitials || t.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </span>
                  ))}
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/80 bg-white text-[#0f1530] flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    +{Math.max(testimonials.length - trusted.length, 12)}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs leading-tight text-white/80">
                  Trusted by {clientsMetric?.value || '500+'} clients
                  <br />
                  in Sri Lanka &amp; worldwide
                </p>
              </div>
            </div>
          </div>

          {/* ─────────── Right: info panel ─────────── */}
          <div className="relative bg-[#f4f5fa] text-[#11152b] p-6 sm:p-9 flex flex-col">
            <div className="hero-enter" style={d(350)}>
              <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#ff6a2b]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff6a2b] opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff6a2b]" />
                </span>
                Available for
                <ArrowRight className="w-3 h-3" />
              </p>
              <p className="font-display mt-2 text-3xl sm:text-4xl font-bold leading-[1.05] tracking-tight">
                Freelance
                <br />
                Projects
              </p>
            </div>

            <div className="hero-enter mt-7 pt-6 border-t border-[#11152b]/10" style={d(450)}>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold leading-tight tracking-tight">
                {fullName}
              </h1>
              <p className="mt-2 text-[13px] font-semibold text-[#3d55c4] leading-snug">{heroData.title}</p>
              <p className="mt-1.5 text-[13px] text-[#11152b]/60 leading-relaxed">{heroData.subTitle}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#11152b]/50">
                <MapPin className="w-3.5 h-3.5" />
                {heroData.location}
              </p>
            </div>

            {/* Metrics */}
            <div className="hero-enter mt-6 grid grid-cols-2 gap-2.5" style={d(550)}>
              {heroData.metrics.slice(0, 4).map((metric, i) => (
                <div key={metric.label} className="rounded-2xl bg-white border border-[#11152b]/[0.06] px-3.5 py-3 shadow-[0_1px_0_rgba(17,21,43,0.04)]">
                  <div className="font-display text-xl font-bold tabular-nums">
                    <CountUp value={metric.value} delay={700 + i * 90} />
                  </div>
                  <div className="text-[11px] text-[#11152b]/55 font-medium">{metric.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={onContactClick}
              id="hero-contact-btn"
              className="hero-enter mt-6 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#11152b] hover:bg-[#232a52] text-white text-sm font-semibold transition-colors cursor-pointer"
              style={d(620)}
            >
              Start a project
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Featured testimonial */}
            {featured && (
              <figure className="hero-enter mt-auto pt-6" style={d(720)}>
                <div className="rounded-2xl bg-white border border-[#11152b]/[0.06] p-4 shadow-[0_12px_30px_-18px_rgba(17,21,43,0.35)]">
                  <Quote className="w-5 h-5 text-[#ff6a2b] fill-[#ff6a2b]/15" />
                  <blockquote className="mt-2 text-[13px] leading-relaxed text-[#11152b]/75 line-clamp-3">
                    {featured.quote}
                  </blockquote>
                  <figcaption className="mt-3 flex items-center gap-2.5">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: featured.avatarColor || '#3b4f9a' }}
                    >
                      {featured.avatarInitials || featured.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold truncate">{featured.name}</span>
                      <span className="block text-[11px] text-[#11152b]/50 truncate">
                        {featured.role}
                        {featured.company ? `, ${featured.company}` : ''}
                      </span>
                    </span>
                    <span className="ml-auto flex gap-0.5 shrink-0" aria-label={`${featured.rating} out of 5 stars`}>
                      {Array.from({ length: featured.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </span>
                  </figcaption>
                </div>
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
