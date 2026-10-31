'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Plus,
  Calendar,
  Clock,
  Layers,
  ExternalLink,
  Shield,
  Building,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';
import { usePortal } from '../context/PortalContext';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
  onOpenGallery?: () => void;
  onOpenLoginModal: () => void;
}

const CATEGORY_TABS: { id: 'all' | ProjectCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Categories', icon: '✨' },
  { id: 'website', label: 'Websites', icon: '🌐' },
  { id: 'application', label: 'Applications', icon: '📱' },
  { id: 'erp', label: 'ERP Systems', icon: '🏢' },
  { id: 'financial_dashboard', label: 'Financial Dashboards', icon: '📊' },
];

const CATEGORY_STYLES: Record<ProjectCategory, { label: string; icon: string; badgeClass: string }> = {
  website: {
    label: 'Website',
    icon: '🌐',
    badgeClass: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  },
  application: {
    label: 'Application',
    icon: '📱',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  erp: {
    label: 'ERP System',
    icon: '🏢',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  financial_dashboard: {
    label: 'Financial Dashboard',
    icon: '📊',
    badgeClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
};

export const Projects: React.FC<ProjectsProps> = ({
  onSelectProject,
  onOpenGallery,
  onOpenLoginModal,
}) => {
  const { projects, categories, currentUser, setCurrentView } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const getCategoryMeta = (catSlug: string) => {
    const found = categories.find((c) => c.slug === catSlug || c.id === catSlug);
    if (found) {
      return {
        label: found.name,
        icon: found.icon,
        badgeClass: 'text-[#8B9FFD] bg-[#8B9FFD]/10 border-[#8B9FFD]/30',
      };
    }
    return {
      label: catSlug,
      icon: '📁',
      badgeClass: 'text-[#8B9FFD] bg-[#8B9FFD]/10 border-[#8B9FFD]/30',
    };
  };

  return (
    <section id="projects" className="py-24 relative bg-transparent scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B9FFD] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Delivery & Systems Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Projects & Portals
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mt-1">
              Explore custom systems across Websites, Mobile & Web Applications, MongoDB & MERN Stack Systems, and Financial Dashboards.
            </p>
          </div>

          {/* Portal Quick Access Button */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() =>
                  setCurrentView(currentUser.role === 'admin' ? 'admin_dashboard' : 'client_dashboard')
                }
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Go to {currentUser.role === 'admin' ? 'Admin' : 'Client'} Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-4 py-2 rounded-xl bg-[#8B9FFD]/15 hover:bg-[#8B9FFD] hover:text-[#0b0d12] border border-[#8B9FFD]/30 text-[#8B9FFD] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                id="header-login-btn"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Client / Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Categories Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-white/10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-[#8B9FFD] text-[#0b0d12] font-bold shadow-md shadow-[#8B9FFD]/20'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
            }`}
          >
            <span>✨</span>
            <span>All Categories</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all' ? 'bg-[#0b0d12]/20 text-[#0b0d12]' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {projects.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            const count = projects.filter((p) => p.category === cat.slug).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#8B9FFD] text-[#0b0d12] font-bold shadow-md shadow-[#8B9FFD]/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#0b0d12]/20 text-[#0b0d12]' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const categoryMeta = getCategoryMeta(project.category);

            return (
              <div
                key={project.id}
                className="card-dark-gradient card-dark-hover rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-48 overflow-hidden bg-zinc-900">
                    <img loading="lazy" decoding="async"
                      src={project.image || '/assets/images/hotel_erp_dashboard_1785315979842.jpg'}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/hotel_erp_dashboard_1785315979842.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-transparent opacity-80" />

                    {/* Category & Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md flex items-center gap-1.5 ${categoryMeta.badgeClass}`}
                      >
                        <span>{categoryMeta.icon}</span>
                        <span>{categoryMeta.label}</span>
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md ${
                          project.status === 'Completed'
                            ? 'bg-emerald-500/80 text-white'
                            : project.status === 'In Development'
                            ? 'bg-sky-500/80 text-white'
                            : 'bg-amber-500/80 text-white'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Client Name Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                      <span className="text-sm">{project.clientLogo || '🏢'}</span>
                      <span className="text-xs font-bold text-zinc-200 drop-shadow-md">
                        {project.clientName}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Project Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-[#8B9FFD] transition-colors line-clamp-1">
                      {project.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-400 text-[11px]">Development Progress</span>
                        <span className="text-[#8B9FFD] font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                          className="bg-gradient-to-r from-[#8B9FFD] to-[#607afb] h-full rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] text-zinc-300">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">START DATE</span>
                        <span className="font-semibold text-white">{project.startDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">EXPECTED</span>
                        <span className="font-semibold text-white">{project.deadline}</span>
                      </div>
                    </div>

                    {/* Technologies Tags */}
                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-zinc-300 border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-zinc-400">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-[#8B9FFD] hover:text-[#0b0d12] text-white text-xs font-bold transition-all border border-white/10 hover:border-[#8B9FFD] flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-md"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
