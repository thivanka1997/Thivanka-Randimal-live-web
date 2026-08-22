'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  FileText,
  Download,
  Layers,
  Code2,
  ExternalLink,
  Plus,
  Building2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';
import { usePortal } from '../context/PortalContext';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ProjectCategory, { label: string; icon: string; color: string }> = {
  website: { label: 'Websites', icon: '🌐', color: 'text-sky-400 bg-sky-500/15 border-sky-500/30' },
  application: { label: 'Applications', icon: '📱', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  erp: { label: 'ERP Systems', icon: '🏢', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  financial_dashboard: { label: 'Financial Dashboards', icon: '📊', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
};

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const {
    currentUser,
    getMilestonesForProject,
    getTasksForProject,
    getUpdatesForProject,
    getFilesForProject,
    toggleMilestoneStatus,
    updateTaskStatus,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'updates' | 'files' | 'tasks'>('overview');

  if (!project) return null;

  const categoryInfo = CATEGORY_LABELS[project.category] || {
    label: project.category,
    icon: '📁',
    color: 'text-[#8B9FFD] bg-[#8B9FFD]/15 border-[#8B9FFD]/30',
  };

  const milestones = getMilestonesForProject(project.id);
  const tasks = getTasksForProject(project.id);
  const updates = getUpdatesForProject(project.id);
  const files = getFilesForProject(project.id);

  const isAdmin = currentUser?.role === 'admin';

  const handleDownloadFile = (fileName: string) => {
    // Simulated safe file download
    const element = document.createElement('a');
    const file = new Blob([`Simulated project asset: ${fileName}\nProject: ${project.title}\nClient: ${project.clientName}`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl card-dark-gradient border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-8 text-left max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e111a]/95">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${categoryInfo.color}`}>
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.label}</span>
            </span>
            <span className="text-xs text-zinc-400 font-medium hidden sm:inline-flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              {project.clientName}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Banner with Key Metrics */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-zinc-950 shrink-0 border-b border-white/10">
          <img
            src={project.image || '/assets/images/hotel_erp_dashboard_1785315979842.jpg'}
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/hotel_erp_dashboard_1785315979842.jpg';
            }}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-[#0c0f17]/60 to-transparent" />

          {/* Banner Floating Metadata */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{project.clientLogo || '🏢'}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {project.clientName}
                </span>
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : project.status === 'In Development'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {project.title}
              </h2>
            </div>

            {/* Progress Box */}
            <div className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 shrink-0 min-w-[200px]">
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-zinc-400">Overall Progress</span>
                <span className="text-[#8B9FFD] font-bold text-sm">{project.progress}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#8B9FFD] to-[#607afb] h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 bg-[#0c0f17] overflow-x-auto shrink-0 space-x-1">
          {[
            { id: 'overview', label: 'Project Overview', count: null },
            { id: 'milestones', label: 'Milestones', count: milestones.length },
            { id: 'updates', label: 'Latest Updates', count: updates.length },
            { id: 'tasks', label: 'Assigned Tasks', count: tasks.length },
            { id: 'files', label: 'Files & Documents', count: files.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'text-[#8B9FFD]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-[#8B9FFD]/20 text-[#8B9FFD]'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B9FFD]" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-zinc-300">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Timeline & Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8B9FFD]" />
                    <span>START DATE</span>
                  </div>
                  <p className="text-base font-bold text-white">{project.startDate}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>EXPECTED COMPLETION</span>
                  </div>
                  <p className="text-base font-bold text-white">{project.deadline}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CURRENT STATUS</span>
                  </div>
                  <p className="text-base font-bold text-white">{project.status}</p>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Project Description
                </h4>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                  {project.description}
                </p>
              </div>

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Core Functional Modules & Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/70 border border-white/5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#8B9FFD] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-zinc-200">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies Used */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#8B9FFD]/10 text-[#8B9FFD] border border-[#8B9FFD]/20 flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Project Milestones</h4>
                  <p className="text-xs text-zinc-400">
                    Track the lifecycle from requirement gathering to production cutover.
                  </p>
                </div>
                {isAdmin && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Admin: Click checkbox to toggle status
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {milestones.length === 0 ? (
                  <p className="text-sm text-zinc-500 py-6 text-center">No milestones listed yet.</p>
                ) : (
                  milestones.map((ms) => {
                    const isDone = ms.status === 'completed';
                    const isInProgress = ms.status === 'in_progress';

                    return (
                      <div
                        key={ms.id}
                        onClick={() => isAdmin && toggleMilestoneStatus(ms.id)}
                        className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : isInProgress
                            ? 'bg-sky-950/20 border-sky-500/30'
                            : 'bg-zinc-900/60 border-white/5'
                        } ${isAdmin ? 'cursor-pointer hover:border-[#8B9FFD]/40' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isInProgress ? (
                              <div className="w-5 h-5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-500" />
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                isDone ? 'text-emerald-300 line-through' : 'text-white'
                              }`}
                            >
                              {ms.title}
                            </p>
                            {ms.description && (
                              <p className="text-xs text-zinc-400 mt-0.5">{ms.description}</p>
                            )}
                            {ms.dueDate && (
                              <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Target Date: {ms.dueDate}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : isInProgress
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {isDone ? '✓ Completed' : isInProgress ? '⏳ In Progress' : '○ Pending'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LATEST UPDATES */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white">Latest Project Updates</h4>
                <p className="text-xs text-zinc-400">
                  Chronological activity and progress log delivered by the engineering lead.
                </p>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-zinc-800">
                {updates.length === 0 ? (
                  <p className="text-sm text-zinc-500 py-6 text-center">No updates logged yet.</p>
                ) : (
                  updates.map((upd) => (
                    <div key={upd.id} className="relative pl-8 space-y-1">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#8B9FFD] border-4 border-[#0b0d12]" />
                      <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/5 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#8B9FFD] bg-[#8B9FFD]/15 px-2.5 py-0.5 rounded-md">
                            {upd.createdAt}
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            Progress: {upd.progress}%
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-white">{upd.title}</h5>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {upd.description}
                        </p>
                        <p className="text-[10px] text-zinc-500 pt-1">
                          Posted by: {upd.createdBy}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white">Assigned Project Tasks</h4>
                <p className="text-xs text-zinc-400">
                  Sprint deliverables and operational action items.
                </p>
              </div>

              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-sm text-zinc-500 py-6 text-center">No tasks assigned.</p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              task.priority === 'urgent'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : task.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <p className="text-sm font-bold text-white">{task.title}</p>
                        </div>
                        {task.description && (
                          <p className="text-xs text-zinc-400">{task.description}</p>
                        )}
                        <p className="text-[11px] text-zinc-500">
                          Assigned to: <span className="text-zinc-300">{task.assignedTo || 'Unassigned'}</span>
                          {task.dueDate && ` • Due: ${task.dueDate}`}
                        </p>
                      </div>

                      {isAdmin ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {(['todo', 'in_progress', 'completed'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateTaskStatus(task.id, st)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                                task.status === st
                                  ? 'bg-[#8B9FFD] text-[#0b0d12]'
                                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {st === 'todo' ? 'To Do' : st === 'in_progress' ? 'In Progress' : 'Done'}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                            task.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : task.status === 'in_progress'
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {task.status === 'completed'
                            ? 'Completed'
                            : task.status === 'in_progress'
                            ? 'In Progress'
                            : 'Pending'}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: FILES */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white">Project Files & Documents</h4>
                <p className="text-xs text-zinc-400">
                  Download functional specifications, architecture schematics, and UI packages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.length === 0 ? (
                  <p className="text-sm text-zinc-500 py-6 text-center col-span-2">
                    No files uploaded for this project yet.
                  </p>
                ) : (
                  files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-between gap-3 hover:border-[#8B9FFD]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-[#8B9FFD]/15 border border-[#8B9FFD]/30 flex items-center justify-center text-[#8B9FFD] shrink-0 font-bold text-xs">
                          {file.fileType.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs sm:text-sm font-semibold text-white truncate">
                            {file.fileName}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            {file.fileSize} • Uploaded by {file.uploadedBy}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadFile(file.fileName)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-[#8B9FFD] hover:text-[#0b0d12] text-zinc-300 transition-colors cursor-pointer shrink-0"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a0d14] border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Close Window
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 hidden sm:inline">
              Host Target: MongoDB Atlas / MERN Stack
            </span>
            <button
              onClick={() => alert(`Launching live sandbox simulation for ${project.title}`)}
              className="px-5 py-2 text-xs font-semibold text-[#0b0d12] bg-[#8B9FFD] hover:bg-[#a2b2ff] rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Live Prototype Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
