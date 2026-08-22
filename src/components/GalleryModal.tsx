'use client';

import React, { useState } from 'react';
import { X, ArrowRight, Filter, Sparkles, FolderKanban } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { Project } from '../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Agritech', 'Hospitality', 'EdTech', 'Supply Chain', 'FinTech'];

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl card-dark-gradient border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-8 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0e111a]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#8B9FFD]/20 text-[#8B9FFD]">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Full Portfolio Gallery</h3>
              <p className="text-xs text-zinc-400">
                Explore complete case studies and enterprise solutions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="p-6 border-b border-white/10 bg-[#0c0e17] flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-zinc-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8B9FFD] text-[#0b0d12] shadow-sm shadow-[#8B9FFD]/30'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[65vh] overflow-y-auto">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                onClose();
                onSelectProject(project);
              }}
              className="card-dark-gradient card-dark-hover rounded-xl overflow-hidden border border-white/10 cursor-pointer group flex flex-col h-full"
            >
              <div className="relative h-44 overflow-hidden bg-zinc-900">
                <img
                  src={project.image || '/assets/images/hotel_erp_dashboard_1785315979842.jpg'}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/hotel_erp_dashboard_1785315979842.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0b0d12]/80 text-[#8B9FFD] border border-white/10">
                  {project.category}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#8B9FFD] transition-colors mb-2">
                    {project.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#8B9FFD]">
                  <span>View Case Study</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0a0d14] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
