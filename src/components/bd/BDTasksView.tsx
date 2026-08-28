'use client';
import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { useBD } from '../../context/BDContext';
import { CheckSquare, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { BDTaskStatus, BDTask } from '../../types';

const STATUS_CFG: Record<BDTaskStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  OVERDUE: { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-zinc-400', bg: 'bg-zinc-500/20' },
};
const PRIORITY_CFG: Record<string, string> = {
  LOW: 'text-zinc-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-amber-400',
  URGENT: 'text-red-400',
};

export const BDTasksView: React.FC = () => {
  const { currentUser } = usePortal();
  const { getBDTasksForPartner, getBDProfileByUserId, updateBDTaskStatus } = useBD();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<BDTask | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [newStatus, setNewStatus] = useState<BDTaskStatus>('IN_PROGRESS');

  const bdProfile = currentUser ? getBDProfileByUserId(currentUser.id) : undefined;
  const tasks = bdProfile?.bdId ? getBDTasksForPartner(bdProfile.bdId) : [];
  const filtered = tasks.filter(t => statusFilter === 'all' || t.status === statusFilter);

  const stats = {
    pending: tasks.filter(t => t.status === 'PENDING').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    overdue: tasks.filter(t => t.status === 'OVERDUE').length,
  };

  const handleUpdate = () => {
    if (!selectedTask) return;
    updateBDTaskStatus(selectedTask.id, newStatus, noteInput || undefined);
    setSelectedTask(null);
    setNoteInput('');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: stats.pending, color: 'border-amber-500/20 text-amber-400' },
          { label: 'In Progress', value: stats.inProgress, color: 'border-blue-500/20 text-blue-400' },
          { label: 'Completed', value: stats.completed, color: 'border-emerald-500/20 text-emerald-400' },
          { label: 'Overdue', value: stats.overdue, color: 'border-red-500/20 text-red-400' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl border card-dark-gradient ${s.color}`}>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-[11px] font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...Object.keys(STATUS_CFG)].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${statusFilter === s ? 'bg-[#8B9FFD]/20 border-[#8B9FFD]/40 text-[#8B9FFD]' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'}`}
          >
            {s === 'all' ? 'All' : STATUS_CFG[s as BDTaskStatus].label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
            <p className="text-sm text-zinc-500">No tasks found</p>
          </div>
        ) : (
          filtered.map(task => (
            <div key={task.id} className="card-dark-gradient rounded-2xl border border-white/8 p-4 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${STATUS_CFG[task.status].bg}`}>
                  {task.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : task.status === 'OVERDUE' ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-white">{task.title}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">{task.taskId}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold ${PRIORITY_CFG[task.priority]}`}>{task.priority}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${STATUS_CFG[task.status].bg} ${STATUS_CFG[task.status].color}`}>
                        {STATUS_CFG[task.status].label}
                      </span>
                    </div>
                  </div>
                  {task.leadName && <p className="text-[10px] text-zinc-500 mt-1">Lead: {task.leadName}</p>}
                  {task.dueDate && <p className="text-[10px] text-zinc-500">Due: {task.dueDate}</p>}
                  {task.adminInstructions && (
                    <div className="mt-2 p-2 rounded-xl bg-blue-950/30 border border-blue-500/20">
                      <p className="text-[10px] text-blue-400 font-semibold">Admin Instructions</p>
                      <p className="text-[10px] text-blue-200 mt-0.5">{task.adminInstructions}</p>
                    </div>
                  )}
                  {task.bdNotes && <p className="text-[10px] text-zinc-400 mt-1 italic">Your notes: {task.bdNotes}</p>}
                </div>
              </div>
              {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setNewStatus(task.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED');
                      setNoteInput('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#8B9FFD]/20 border border-[#8B9FFD]/30 text-[#8B9FFD] text-[11px] font-semibold cursor-pointer hover:bg-[#8B9FFD]/30 transition-all"
                  >
                    Update Status
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Update Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Update Task</h3>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400">{selectedTask.title}</p>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">New Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as BDTaskStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#8B9FFD]"
              >
                {(Object.keys(STATUS_CFG) as BDTaskStatus[]).filter(s => s !== 'OVERDUE').map(s => (
                  <option key={s} value={s}>{STATUS_CFG[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Your Notes (Optional)</label>
              <textarea
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] h-16 resize-none"
                placeholder="Add notes about your progress..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedTask(null)} className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer">
                Cancel
              </button>
              <button onClick={handleUpdate} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
