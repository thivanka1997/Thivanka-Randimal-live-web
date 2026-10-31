'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  CalendarCheck,
  GraduationCap,
  Users,
  PlayCircle,
  MessageCircle,
  Lock,
  MapPin,
  Layers,
  Images,
  Award,
  BarChart3,
  FileCheck,
  Sparkles,
  Globe,
} from 'lucide-react';

interface LiveProject {
  id: string;
  name: string;
  category: string;
  url: string;
  badge?: string;
  summary: string;
  accent: string;
  shots: { src: string; label: string }[];
  features: { icon: React.ElementType; title: string; text: string }[];
  tags: string[];
}

// To add another live site: drop screenshots in /public/assets/images/live and add an entry here.
const LIVE_PROJECTS: LiveProject[] = [
  {
    id: 'kingsbridge',
    name: 'Kingsbridge American College',
    category: 'Education · School Website',
    url: 'https://www.kingsbridgeamericancollege.com/',
    badge: 'Most recent',
    summary:
      'A premium website for an English-medium school network with three branches — built to drive admissions and showcase school life, from Pre-School through to O/L.',
    accent: '#c9a54a',
    shots: [
      { src: '/assets/images/live/kingsbridge-1.webp', label: 'Home' },
      { src: '/assets/images/live/kingsbridge-2.webp', label: 'History' },
      { src: '/assets/images/live/kingsbridge-3.webp', label: 'School life' },
      { src: '/assets/images/live/kingsbridge-4.webp', label: 'Principal' },
    ],
    features: [
      { icon: FileCheck, title: 'Online admissions', text: 'Apply-now flow that turns visitors into enquiries' },
      { icon: MapPin, title: '3 branch network', text: 'Boralesgamuwa, Mattegoda & Horana in one place' },
      { icon: Layers, title: 'Academic pathways', text: 'Interactive Pre-School → Primary → O/L tabs' },
      { icon: Images, title: 'School life gallery', text: 'Photo stories of classes, events & activities' },
      { icon: Award, title: 'Principal’s message', text: 'Leadership profile with qualifications' },
      { icon: BarChart3, title: 'Live stats counters', text: 'Animated students, teachers & awards figures' },
    ],
    tags: ['Responsive', 'SEO & Schema.org', 'Animated UI', 'Fast loading'],
  },
  {
    id: 'helping-hearts',
    name: 'Helping Hearts Counselling & Wellness Centre',
    category: 'Healthcare · Booking + LMS Platform',
    url: 'https://www.helpingheartscounsellingandwellnesscentre.cc/',
    summary:
      'A full platform for a counselling centre and psychology academy — confidential session booking, a course LMS, lecturer profiles and events, in collaboration with CIMS Campus.',
    accent: '#f5a623',
    shots: [
      { src: '/assets/images/live/helping-hearts-1.webp', label: 'Home' },
      { src: '/assets/images/live/helping-hearts-2.webp', label: 'Video tour' },
      { src: '/assets/images/live/helping-hearts-3.webp', label: 'Services' },
      { src: '/assets/images/live/helping-hearts-4.webp', label: 'Courses' },
    ],
    features: [
      { icon: CalendarCheck, title: 'Session booking', text: '13 counselling services with online appointments' },
      { icon: GraduationCap, title: 'Course LMS', text: 'Diplomas & certificates with fees and schedules' },
      { icon: Users, title: 'Lecturer panel', text: 'Profiles for psychologists and trainers' },
      { icon: PlayCircle, title: 'Video tour', text: 'Promo video of the Wattala sanctuary' },
      { icon: MessageCircle, title: 'WhatsApp & helpline', text: 'One-tap contact from every page' },
      { icon: Lock, title: 'Portal login', text: 'Secure area for students and staff' },
    ],
    tags: ['Booking system', 'LMS', 'Responsive', 'SEO'],
  },
];

const domainOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const ProjectShowcase: React.FC<{ project: LiveProject; reverse: boolean }> = ({ project, reverse }) => {
  const [active, setActive] = useState(0);
  const shot = project.shots[active];

  return (
    <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Browser mockup + thumbnails */}
      <div className={`lg:col-span-7 ${reverse ? 'lg:order-2' : ''}`}>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="live-browser group block rounded-2xl overflow-hidden border border-white/10 bg-[#11141c] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
          style={{ '--accent': project.accent } as React.CSSProperties}
          aria-label={`Open ${project.name} live website`}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#0d1017]">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </span>
            <span className="mx-auto flex items-center gap-1.5 max-w-[75%] px-3 py-1 rounded-md bg-white/[0.04] text-[11px] text-zinc-400 truncate">
              <Lock className="w-3 h-3 text-emerald-400/80 shrink-0" />
              <span className="truncate">{domainOf(project.url)}</span>
            </span>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={shot.src}
              src={shot.src}
              alt={`${project.name} — ${shot.label}`}
              loading="lazy"
              decoding="async"
              className="live-shot w-full h-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
            />
            <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#0f1530] text-xs font-bold shadow-lg">
              Visit live site <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </a>

        <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3" role="tablist" aria-label={`${project.name} screenshots`}>
          {project.shots.map((s, i) => (
            <button
              key={s.src}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`group/thumb relative rounded-lg overflow-hidden border transition-all cursor-pointer ${
                i === active ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/50' : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
              style={{ '--accent': project.accent } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" loading="lazy" decoding="async" className="w-full aspect-[16/10] object-cover object-top" />
              <span className="absolute inset-x-0 bottom-0 px-1.5 py-1 text-[9px] sm:text-[10px] font-semibold text-white bg-gradient-to-t from-black/80 to-transparent text-left truncate">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className={`lg:col-span-5 ${reverse ? 'lg:order-1' : ''}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: project.accent }}>
            {project.category}
          </span>
          {project.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
              <Sparkles className="w-3 h-3" />
              {project.badge}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight">{project.name}</h3>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          {domainOf(project.url)}
        </a>
        <p className="mt-4 text-sm sm:text-[15px] text-zinc-400 leading-relaxed">{project.summary}</p>

        <ul className="mt-6 grid sm:grid-cols-2 gap-x-5 gap-y-4">
          {project.features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <span
                className="mt-0.5 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center border border-white/10"
                style={{ background: `${project.accent}14`, color: project.accent }}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="block text-xs text-zinc-500 leading-snug">{text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-medium text-zinc-300 bg-white/[0.04] border border-white/10">
              {tag}
            </span>
          ))}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shine group mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0f1530] text-sm font-bold hover:-translate-y-0.5 transition-transform"
        >
          Visit live site
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </article>
  );
};

export const LiveProjects: React.FC = () => (
  <section id="live-projects" className="py-20 sm:py-24 relative bg-transparent scroll-mt-20 sm:scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mb-14 sm:mb-16">
        <p className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live right now
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Live <span className="text-[#8B9FFD]">Projects</span>
        </h2>
        <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
          Real websites I designed and built for real clients — open them, click around, and see the work in action.
        </p>
      </div>

      <div className="space-y-20 sm:space-y-28">
        {LIVE_PROJECTS.map((project, i) => (
          <ProjectShowcase key={project.id} project={project} reverse={i % 2 === 1} />
        ))}
      </div>
    </div>
  </section>
);
