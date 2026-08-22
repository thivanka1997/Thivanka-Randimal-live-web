'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Github, CheckCircle, BarChart3, Layers, Code2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview'>('overview');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl card-dark-gradient border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-8 text-left">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e111a]/90">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#8B9FFD]/20 text-[#8B9FFD] border border-[#8B9FFD]/30">
              {project.category}
            </span>
            <h3 className="text-lg font-bold text-white truncate max-w-md">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Image Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900 border-b border-white/10">
          <img
            src={project.image || '/assets/images/hotel_erp_dashboard_1785315979842.jpg'}
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/hotel_erp_dashboard_1785315979842.jpg';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#8B9FFD]">
                {project.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 bg-[#0c0f17]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'overview'
                ? 'text-[#8B9FFD]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Project Overview
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B9FFD]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'preview'
                ? 'text-[#8B9FFD]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Interactive Mockup
            {activeTab === 'preview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B9FFD]" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' ? (
            <>
              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  System Architecture & Goals
                </h4>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {project.description} This solution was engineered to satisfy rigorous enterprise SLA benchmarks, featuring modular scalability, robust security protocols, and seamless API integrations.
                </p>
              </div>

              {/* Metrics Grid */}
              {project.metrics && project.metrics.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Impact & Key Performance Indicators
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {project.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-900/90 p-4 rounded-xl border border-white/5 flex items-center gap-3"
                      >
                        <BarChart3 className="w-5 h-5 text-[#8B9FFD]" />
                        <div>
                          <p className="text-lg font-bold text-white">{m.value}</p>
                          <p className="text-xs text-zinc-400">{m.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Highlights */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Core Module Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/60 border border-white/5"
                    >
                      <CheckCircle className="w-4 h-4 text-[#8B9FFD] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-zinc-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Interactive Mockup Tab */
            <div className="space-y-4 text-center py-6">
              <div className="p-6 bg-zinc-900/90 rounded-xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs text-zinc-400 font-mono">
                      https://app.{project.id}.system/demo
                    </span>
                  </div>
                  <span className="text-xs text-[#8B9FFD] font-semibold">Live Sandbox Mode</span>
                </div>
                
                <div className="py-8 space-y-3">
                  <Layers className="w-12 h-12 text-[#8B9FFD] mx-auto animate-pulse" />
                  <p className="text-base font-bold text-white">
                    {project.title} - Interactive Prototype
                  </p>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Simulating real-time telemetry, user authorization roles, and automated workflows configured by Thivanka Randimal.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a0d14] border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Close
          </button>
          
          <button
            onClick={() => alert(`Simulating Live Demo Launch for ${project.title}`)}
            className="px-5 py-2.5 text-xs font-semibold text-[#0b0d12] bg-[#8B9FFD] hover:bg-[#a2b2ff] rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
