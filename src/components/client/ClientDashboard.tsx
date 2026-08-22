'use client';

import React, { useState, useRef } from 'react';
import {
  Building,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Upload,
  CheckCheck,
  XCircle,
  AlertCircle,
  Eye,
  X,
  DollarSign,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { Project, ProjectCategory, PhasePayment } from '../../types';

interface ClientDashboardProps {
  onSelectProjectForDetails: (project: Project) => void;
}

const CATEGORY_NAMES: Record<ProjectCategory, { name: string; icon: string }> = {
  website: { name: 'Websites', icon: '🌐' },
  application: { name: 'Applications', icon: '📱' },
  erp: { name: 'ERP Systems', icon: '🏢' },
  financial_dashboard: { name: 'Financial Dashboards', icon: '📊' },
};

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Payment',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  slip_uploaded: {
    label: 'Slip Submitted',
    icon: <Clock className="w-3.5 h-3.5" />,
    className: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  },
  verified: {
    label: 'Verified ✓',
    icon: <CheckCheck className="w-3.5 h-3.5" />,
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: 'bg-red-500/15 text-red-300 border-red-500/30',
  },
};

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onSelectProjectForDetails,
}) => {
  const {
    currentUser,
    logout,
    setCurrentView,
    getProjectsForClient,
    getMilestonesForProject,
    getUpdatesForProject,
    getFilesForProject,
    getTasksForProject,
    getPaymentsForProject,
    uploadPaymentSlip,
  } = usePortal();

  const assignedProjects = getProjectsForClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    assignedProjects[0]?.id || ''
  );
  const [uploadingPaymentId, setUploadingPaymentId] = useState<string | null>(null);
  const [slipPreview, setSlipPreview] = useState<PhasePayment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProject =
    assignedProjects.find((p) => p.id === selectedProjectId) || assignedProjects[0];

  const milestones = activeProject ? getMilestonesForProject(activeProject.id) : [];
  const updates = activeProject ? getUpdatesForProject(activeProject.id) : [];
  const files = activeProject ? getFilesForProject(activeProject.id) : [];
  const tasks = activeProject ? getTasksForProject(activeProject.id) : [];
  const payments = activeProject ? getPaymentsForProject(activeProject.id) : [];

  const totalAmount = payments.reduce((s, p) => s + p.amount, 0);
  const paidAmount = payments
    .filter((p) => p.status === 'verified')
    .reduce((s, p) => s + p.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  const handleDownloadFile = (fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob(
      [`Deliverable Asset: ${fileName}\nProject: ${activeProject?.title}\nClient: ${currentUser?.companyName}`],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileSelect = (paymentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      uploadPaymentSlip(paymentId, dataUrl, file.name);
      setUploadingPaymentId(null);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const companyDisplayName =
    currentUser?.companyName ||
    currentUser?.name?.replace(' (ABC Company)', '').replace(' (Grand Luxe)', '') ||
    'VALUED CLIENT';

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 flex flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => uploadingPaymentId && handleFileSelect(uploadingPaymentId, e)}
      />

      {/* Slip Preview Modal */}
      {slipPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSlipPreview(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0e111a] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white">{slipPreview.phaseName}</h3>
                <p className="text-[11px] text-zinc-400">
                  Uploaded: {slipPreview.slipUploadedAt} · {slipPreview.slipFileName}
                </p>
              </div>
              <button
                onClick={() => setSlipPreview(null)}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-[65vh] overflow-auto">
              {slipPreview.slipUrl ? (
                slipPreview.slipUrl.startsWith('data:image') ? (
                  <img src={slipPreview.slipUrl} alt="Payment Slip" className="w-full rounded-xl" />
                ) : (
                  <iframe
                    src={slipPreview.slipUrl}
                    title="Payment Slip PDF"
                    className="w-full h-[500px] rounded-xl"
                  />
                )
              ) : (
                <p className="text-zinc-400 text-sm text-center py-8">Slip preview not available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0e111a]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('portfolio')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Portfolio</span>
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>CLIENT PORTAL</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                  Restricted Access
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Assigned Project Tracker & Deliverables Viewer
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Client: </span>
            <span className="font-semibold text-white">{companyDisplayName}</span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* Welcome Banner */}
        <div className="card-dark-gradient p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dedicated Enterprise Workspace</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                WELCOME, {companyDisplayName.toUpperCase()}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Track your active engineering deliverables, milestone progress, and manage project payments in real time.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-zinc-900/90 px-4 py-3 rounded-2xl border border-white/10 text-center min-w-[120px]">
                <span className="text-2xl font-black text-white">{assignedProjects.length}</span>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Active Projects
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Project selector */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                My Projects ({assignedProjects.length})
              </h3>
              <span className="text-[11px] text-zinc-500">Click to inspect</span>
            </div>

            {assignedProjects.length === 0 ? (
              <div className="card-dark-gradient p-8 rounded-2xl border border-white/10 text-center text-zinc-500 text-xs">
                No active projects assigned to your account.
              </div>
            ) : (
              assignedProjects.map((proj) => {
                const isSelected = activeProject?.id === proj.id;
                const catInfo = CATEGORY_NAMES[proj.category];

                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`card-dark-gradient p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-[#8B9FFD] bg-indigo-950/20 shadow-lg shadow-[#8B9FFD]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B9FFD]/15 text-[#8B9FFD] border border-[#8B9FFD]/30 inline-flex items-center gap-1">
                          <span>{catInfo?.icon}</span>
                          <span>{catInfo?.name}</span>
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5">{proj.title}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-sky-500/20 text-sky-300'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-400">Project Progress</span>
                        <span className="text-[#8B9FFD] font-bold">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#8B9FFD] to-[#607afb] h-full rounded-full transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/5 pt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Completion: <strong>{proj.deadline}</strong></span>
                      </div>
                      <span className="text-sky-400 font-semibold flex items-center gap-1">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Detail panel */}
          <div className="lg:col-span-7 space-y-6">
            {activeProject ? (
              <>
                {/* Project details card */}
                <div className="card-dark-gradient rounded-3xl border border-white/15 overflow-hidden p-6 sm:p-8 space-y-6">
                  {/* Header */}
                  <div className="border-b border-white/10 pb-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8B9FFD] bg-[#8B9FFD]/15 px-3 py-1 rounded-full border border-[#8B9FFD]/30 flex items-center gap-1.5">
                        <span>{CATEGORY_NAMES[activeProject.category]?.icon}</span>
                        <span>{CATEGORY_NAMES[activeProject.category]?.name}</span>
                      </span>
                      <button
                        onClick={() => onSelectProjectForDetails(activeProject)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Expanded View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {activeProject.title}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 mb-1">
                          <Calendar className="w-3 h-3 text-[#8B9FFD]" />
                          <span>START DATE</span>
                        </div>
                        <p className="text-sm font-bold text-white">{activeProject.startDate}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 mb-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>EXPECTED COMPLETION</span>
                        </div>
                        <p className="text-sm font-bold text-white">{activeProject.deadline}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 mb-1">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span>CURRENT STATUS</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-300">{activeProject.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">PROJECT MILESTONES</h4>
                      <span className="text-[10px] text-zinc-500">
                        {milestones.filter((m) => m.status === 'completed').length}/{milestones.length} Completed
                      </span>
                    </div>
                    <div className="space-y-2">
                      {milestones.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-3">No milestones defined yet.</p>
                      ) : (
                        milestones.map((ms) => {
                          const isDone = ms.status === 'completed';
                          const inProgress = ms.status === 'in_progress';
                          return (
                            <div
                              key={ms.id}
                              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                isDone ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                : inProgress ? 'bg-sky-950/20 border-sky-500/30 text-sky-200'
                                : 'bg-zinc-900/60 border-white/5 text-zinc-400'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : inProgress ? (
                                  <div className="w-4 h-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                                )}
                                <span className={isDone ? 'font-medium' : 'font-normal'}>{ms.title}</span>
                              </div>
                              <span className="text-[10px] font-mono shrink-0">
                                {isDone ? '✓ Completed' : inProgress ? '⏳ In Progress' : '○ Pending'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Latest Updates */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">LATEST UPDATES</h4>
                    <div className="space-y-2.5">
                      {updates.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-2">No updates recorded yet.</p>
                      ) : (
                        updates.map((upd) => (
                          <div key={upd.id} className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1 text-xs">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-[#8B9FFD]">{upd.createdAt}</span>
                              <span className="text-emerald-400 font-semibold">Progress: {upd.progress}%</span>
                            </div>
                            <p className="font-bold text-white">{upd.title}</p>
                            <p className="text-zinc-300 leading-relaxed">{upd.description}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Files */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">DOWNLOADABLE FILES & DOCUMENTS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {files.length === 0 ? (
                        <p className="text-xs text-zinc-500 col-span-2 py-2">No files shared yet.</p>
                      ) : (
                        files.map((file) => (
                          <div key={file.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <FileText className="w-4 h-4 text-[#8B9FFD] shrink-0" />
                              <div className="overflow-hidden">
                                <p className="font-bold text-white truncate">{file.fileName}</p>
                                <p className="text-[10px] text-zinc-500">{file.fileSize}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadFile(file.fileName)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-[#8B9FFD] hover:text-[#0b0d12] text-zinc-300 transition-colors cursor-pointer"
                              title="Download file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Tasks */}
                  {tasks.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">ACTIVE SPRINT TASKS ({tasks.length})</h4>
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div key={task.id} className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-white">{task.title}</span>
                              {task.dueDate && <p className="text-[10px] text-zinc-500">Target: {task.dueDate}</p>}
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {task.status === 'completed' ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ═══════════════ PAYMENT SCHEDULE CARD ═══════════════ */}
                <div className="rounded-3xl border border-emerald-500/20 overflow-hidden bg-gradient-to-br from-[#0c0f17] via-[#0b110f] to-[#0a0e0b] p-6 sm:p-8 space-y-5 shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Payment Schedule</h4>
                        <p className="text-[11px] text-zinc-400">Upload your bank slip for each project phase</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {payments.length} Phase{payments.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Summary stats */}
                  {payments.length > 0 && (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/8 text-center">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total</p>
                          <p className="text-lg font-black text-white">${totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-center">
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Paid</p>
                          <p className="text-lg font-black text-emerald-300">${paidAmount.toLocaleString()}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-center">
                          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Pending</p>
                          <p className="text-lg font-black text-amber-300">${pendingAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      {totalAmount > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-semibold">
                            <span className="text-zinc-400">Payment Progress</span>
                            <span className="text-emerald-400 font-bold">{Math.round((paidAmount / totalAmount) * 100)}%</span>
                          </div>
                          <div className="w-full bg-zinc-800/80 rounded-full h-2.5 overflow-hidden border border-white/5">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/30"
                              style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Phase Payment cards */}
                  <div className="space-y-3">
                    {payments.length === 0 ? (
                      <div className="text-center py-10 text-zinc-500">
                        <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-xs">No payment phases defined for this project yet.</p>
                      </div>
                    ) : (
                      payments.map((payment) => {
                        const cfg = STATUS_CONFIG[payment.status];
                        const canUpload = payment.status === 'pending' || payment.status === 'rejected';

                        return (
                          <div
                            key={payment.id}
                            className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition-all ${
                              payment.status === 'verified'
                                ? 'bg-emerald-950/25 border-emerald-500/25'
                                : payment.status === 'rejected'
                                ? 'bg-red-950/25 border-red-500/25'
                                : payment.status === 'slip_uploaded'
                                ? 'bg-sky-950/20 border-sky-500/20'
                                : 'bg-zinc-900/50 border-white/8'
                            }`}
                          >
                            {/* Phase title row */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {/* Phase number badge */}
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black border shrink-0 ${
                                  payment.status === 'verified' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                  : payment.status === 'rejected' ? 'bg-red-500/20 border-red-500/40 text-red-300'
                                  : payment.status === 'slip_uploaded' ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                                  : 'bg-zinc-800 border-white/10 text-zinc-400'
                                }`}>
                                  {payment.phaseNumber}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white leading-tight">{payment.phaseName}</p>
                                  <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-2.5 h-2.5" />
                                    Due: {payment.dueDate}
                                  </p>
                                </div>
                              </div>

                              {/* Status badge */}
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${cfg.className}`}>
                                {cfg.icon}
                                {cfg.label}
                              </span>
                            </div>

                            {/* Amount */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-zinc-400" />
                                <span className="text-2xl font-black text-white">${payment.amount.toLocaleString()}</span>
                                <span className="text-xs text-zinc-500">{payment.currency}</span>
                              </div>
                              {payment.status === 'verified' && (
                                <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                  ✓ Verified {payment.verifiedAt}
                                </div>
                              )}
                            </div>

                            {/* Notes */}
                            {payment.notes && (
                              <p className="text-[11px] text-zinc-400 bg-zinc-900/60 px-3 py-2 rounded-lg border border-white/5 leading-relaxed">
                                {payment.notes}
                              </p>
                            )}

                            {/* Rejection reason */}
                            {payment.status === 'rejected' && payment.rejectionReason && (
                              <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-500/30 rounded-xl px-3 py-3">
                                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-bold text-red-300 mb-0.5 uppercase tracking-wider">Rejection Reason</p>
                                  <p className="text-[11px] text-red-200 leading-relaxed">{payment.rejectionReason}</p>
                                  <p className="text-[10px] text-red-400 mt-1.5 font-semibold">
                                    Please upload a corrected payment slip below.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Uploaded slip info */}
                            {payment.slipFileName && (
                              <div className="flex items-center justify-between bg-sky-950/20 border border-sky-500/20 rounded-xl px-3 py-2.5">
                                <div className="flex items-center gap-2 text-[11px] text-sky-300 min-w-0">
                                  <FileText className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{payment.slipFileName}</span>
                                  {payment.slipUploadedAt && (
                                    <span className="text-sky-500 shrink-0">· {payment.slipUploadedAt}</span>
                                  )}
                                </div>
                                {payment.slipUrl && (
                                  <button
                                    onClick={() => setSlipPreview(payment)}
                                    className="flex items-center gap-1 text-[10px] font-bold text-sky-400 hover:text-sky-200 transition-colors cursor-pointer shrink-0 ml-2"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    View
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Upload CTA */}
                            {canUpload && (
                              <button
                                onClick={() => {
                                  setUploadingPaymentId(payment.id);
                                  setTimeout(() => fileInputRef.current?.click(), 50);
                                }}
                                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border hover:-translate-y-0.5 active:scale-[0.98] ${
                                  payment.status === 'rejected'
                                    ? 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/30 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/10'
                                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10'
                                }`}
                              >
                                <Upload className="w-3.5 h-3.5" />
                                {payment.status === 'rejected' ? 'Re-upload Corrected Slip' : 'Upload Payment Slip'}
                                <span className="text-[10px] opacity-60">(JPG, PNG, PDF)</span>
                              </button>
                            )}

                            {/* Awaiting review banner */}
                            {payment.status === 'slip_uploaded' && (
                              <div className="flex items-center gap-2 text-[11px] text-sky-300 bg-sky-950/20 border border-sky-500/20 rounded-xl px-3 py-2.5">
                                <Clock className="w-3.5 h-3.5 animate-pulse shrink-0" />
                                <span>Slip submitted — awaiting admin verification. You'll be notified once reviewed.</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="card-dark-gradient p-12 rounded-3xl border border-white/10 text-center text-zinc-500">
                Select a project from the left to view details.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
