'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCheck,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  X,
  DollarSign,
  Plus,
  Trash2,
  FileText,
  Building2,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { PhasePayment } from '../../types';

const STATUS_CFG = {
  pending: {
    label: 'Pending',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    row: 'border-amber-500/10',
  },
  slip_uploaded: {
    label: 'Review Required',
    icon: <Clock className="w-3.5 h-3.5 animate-pulse" />,
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    row: 'border-sky-500/20 bg-sky-950/10',
  },
  verified: {
    label: 'Verified',
    icon: <CheckCheck className="w-3.5 h-3.5" />,
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    row: 'border-emerald-500/10 bg-emerald-950/10',
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle className="w-3.5 h-3.5" />,
    badge: 'bg-red-500/15 text-red-300 border-red-500/30',
    row: 'border-red-500/10 bg-red-950/10',
  },
};

export const PaymentManager: React.FC = () => {
  const {
    projects,
    phasePayments,
    addPhasePayment,
    deletePhasePayment,
    verifyPayment,
    rejectPayment,
    currentUser,
  } = usePortal();

  const [filterStatus, setFilterStatus] = useState<'all' | PhasePayment['status']>('all');
  const [filterProjectId, setFilterProjectId] = useState<string>('all');
  const [slipPreview, setSlipPreview] = useState<PhasePayment | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; phaseName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [addModal, setAddModal] = useState(false);

  // Add phase form state
  const [newPhase, setNewPhase] = useState({
    projectId: '',
    phaseName: '',
    phaseNumber: 1,
    amount: '',
    currency: 'USD',
    dueDate: '',
    notes: '',
  });

  const filtered = phasePayments
    .filter((p) => filterStatus === 'all' || p.status === filterStatus)
    .filter((p) => filterProjectId === 'all' || p.projectId === filterProjectId)
    .sort((a, b) => {
      // slip_uploaded first (action needed)
      const order = { slip_uploaded: 0, pending: 1, rejected: 2, verified: 3 };
      return order[a.status] - order[b.status];
    });

  const totalByStatus = (s: PhasePayment['status']) => phasePayments.filter((p) => p.status === s).length;

  const handleVerify = (id: string) => {
    verifyPayment(id);
  };

  const handleRejectSubmit = () => {
    if (!rejectModal) return;
    rejectPayment(rejectModal.id, rejectReason || 'Payment details could not be verified. Please resubmit.');
    setRejectModal(null);
    setRejectReason('');
  };

  const handleAddPhase = () => {
    if (!newPhase.projectId || !newPhase.phaseName || !newPhase.amount) return;
    const proj = projects.find((p) => p.id === newPhase.projectId);
    addPhasePayment({
      projectId: newPhase.projectId,
      phaseName: newPhase.phaseName,
      phaseNumber: newPhase.phaseNumber,
      amount: Number(newPhase.amount),
      currency: newPhase.currency,
      dueDate: newPhase.dueDate || 'TBD',
      status: 'pending',
      notes: newPhase.notes,
    });
    setNewPhase({ projectId: '', phaseName: '', phaseNumber: 1, amount: '', currency: 'USD', dueDate: '', notes: '' });
    setAddModal(false);
  };

  const getProjectTitle = (id: string) => projects.find((p) => p.id === id)?.title || id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Payment Manager
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Review & verify client phase payment slips</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Payment Phase
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['slip_uploaded', 'pending', 'verified', 'rejected'] as const).map((s) => {
          const cfg = STATUS_CFG[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer hover:scale-[1.02] ${
                filterStatus === s ? cfg.badge + ' scale-[1.02]' : 'bg-zinc-900/60 border-white/8 hover:border-white/15'
              }`}
            >
              <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold mb-2 ${filterStatus === s ? '' : 'text-zinc-400'}`}>
                {cfg.icon}
                {cfg.label}
              </div>
              <p className="text-2xl font-black text-white">{totalByStatus(s)}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-semibold">Filter:</span>
        </div>
        <select
          value={filterProjectId}
          onChange={(e) => setFilterProjectId(e.target.value)}
          className="text-xs bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-white/20 transition-colors"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        {filterStatus !== 'all' && (
          <button
            onClick={() => setFilterStatus('all')}
            className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" /> Clear filter
          </button>
        )}
        <span className="ml-auto text-[11px] text-zinc-500">{filtered.length} entries</span>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-zinc-500">
            <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No payment phases match this filter.</p>
          </div>
        ) : (
          filtered.map((payment) => {
            const cfg = STATUS_CFG[payment.status];
            return (
              <div
                key={payment.id}
                className={`rounded-2xl border p-5 transition-all ${cfg.row} border bg-zinc-900/50`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Left info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black border ${cfg.badge}`}>
                        {payment.phaseNumber}
                      </div>
                      <p className="text-sm font-bold text-white">{payment.phaseName}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badge}`}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-zinc-500" />
                        {getProjectTitle(payment.projectId)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        Due: {payment.dueDate}
                      </span>
                      <span className="flex items-center gap-1.5 text-white font-bold">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                        ${payment.amount.toLocaleString()} {payment.currency}
                      </span>
                    </div>

                    {payment.notes && (
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{payment.notes}</p>
                    )}

                    {payment.slipFileName && (
                      <div className="flex items-center gap-2 text-[11px] text-sky-300">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{payment.slipFileName}</span>
                        {payment.slipUploadedAt && <span className="text-zinc-500 shrink-0">· {payment.slipUploadedAt}</span>}
                      </div>
                    )}

                    {payment.status === 'verified' && (
                      <p className="text-[10px] text-emerald-400 font-semibold">
                        ✓ Verified by {payment.verifiedBy} on {payment.verifiedAt}
                      </p>
                    )}
                    {payment.status === 'rejected' && payment.rejectionReason && (
                      <p className="text-[10px] text-red-400 font-semibold">
                        ✗ Rejected: {payment.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                    {payment.slipUrl && (
                      <button
                        onClick={() => setSlipPreview(payment)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Slip
                      </button>
                    )}

                    {payment.status === 'slip_uploaded' && (
                      <>
                        <button
                          onClick={() => handleVerify(payment.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Verify
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: payment.id, phaseName: payment.phaseName })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => deletePhasePayment(payment.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-white/5 hover:border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Slip Preview Modal ── */}
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
                  {slipPreview.slipFileName} · {slipPreview.slipUploadedAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {slipPreview.status === 'slip_uploaded' && (
                  <>
                    <button
                      onClick={() => { handleVerify(slipPreview.id); setSlipPreview(null); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Verify
                    </button>
                    <button
                      onClick={() => { setRejectModal({ id: slipPreview.id, phaseName: slipPreview.phaseName }); setSlipPreview(null); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSlipPreview(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 max-h-[65vh] overflow-auto">
              {slipPreview.slipUrl ? (
                slipPreview.slipUrl.startsWith('data:image') ? (
                  <img src={slipPreview.slipUrl} alt="Payment Slip" className="w-full rounded-xl" />
                ) : (
                  <iframe src={slipPreview.slipUrl} title="Slip PDF" className="w-full h-[500px] rounded-xl" />
                )
              ) : (
                <p className="text-zinc-400 text-sm text-center py-8">Slip file not available for preview.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setRejectModal(null)}
        >
          <div
            className="w-full max-w-md bg-[#0e111a] border border-red-500/30 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                Reject Payment Slip
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">{rejectModal.phaseName}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Amount does not match, incorrect account, illegible slip..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-red-500/50 transition-colors resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRejectSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-sm font-bold transition-all cursor-pointer"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => { setRejectModal(null); setRejectReason(''); }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Phase Modal ── */}
      {addModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setAddModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0e111a] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add Payment Phase
              </h3>
              <button onClick={() => setAddModal(false)} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Project *</label>
                  <select
                    value={newPhase.projectId}
                    onChange={(e) => setNewPhase((p) => ({ ...p, projectId: e.target.value }))}
                    className="w-full bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500/50 transition-colors"
                  >
                    <option value="">Select project…</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Phase Name *</label>
                  <input
                    type="text"
                    value={newPhase.phaseName}
                    onChange={(e) => setNewPhase((p) => ({ ...p, phaseName: e.target.value }))}
                    placeholder="e.g. Phase 2 – Core Development"
                    className="w-full bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500/50 transition-colors placeholder-zinc-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Phase # *</label>
                  <input
                    type="number"
                    min={1}
                    value={newPhase.phaseNumber}
                    onChange={(e) => setNewPhase((p) => ({ ...p, phaseNumber: Number(e.target.value) }))}
                    className="w-full bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Amount (USD) *</label>
                  <input
                    type="number"
                    min={0}
                    value={newPhase.amount}
                    onChange={(e) => setNewPhase((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500/50 transition-colors placeholder-zinc-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Due Date</label>
                  <input
                    type="text"
                    value={newPhase.dueDate}
                    onChange={(e) => setNewPhase((p) => ({ ...p, dueDate: e.target.value }))}
                    placeholder="e.g. 30 Sep 2026"
                    className="w-full bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500/50 transition-colors placeholder-zinc-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Notes</label>
                  <textarea
                    value={newPhase.notes}
                    onChange={(e) => setNewPhase((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Optional description for the client…"
                    rows={2}
                    className="w-full bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500/50 transition-colors placeholder-zinc-600 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddPhase}
                  disabled={!newPhase.projectId || !newPhase.phaseName || !newPhase.amount}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-emerald-300 border border-emerald-500/40 text-sm font-bold transition-all cursor-pointer"
                >
                  Add Phase
                </button>
                <button
                  onClick={() => setAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
