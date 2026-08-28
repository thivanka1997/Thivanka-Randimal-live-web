'use client';
import React, { useState } from 'react';
import { useBD } from '../../context/BDContext';
import { usePortal } from '../../context/PortalContext';
import { DollarSign, Plus, CheckCircle2, X } from 'lucide-react';
import { CommissionStatus } from '../../types';

const STATUS_CFG: Record<CommissionStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  APPROVED: { label: 'Approved', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  PAID: { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-zinc-400', bg: 'bg-zinc-500/20' },
};

export const AdminCommissionsManager: React.FC = () => {
  const { commissions, commissionRules, approveCommission, payCommission, cancelCommission,
    createCommission, addCommissionRule, deleteCommissionRule, bdProfiles } = useBD();
  const { currentUser } = usePortal();
  const [activeTab, setActiveTab] = useState<'commissions' | 'rules' | 'create'>('commissions');
  const [payRef, setPayRef] = useState<{ id: string; ref: string } | null>(null);
  const [newRule, setNewRule] = useState({ service: '', commissionPercent: '20', description: '' });
  const [newCommission, setNewCommission] = useState({
    bdId: '', clientName: '', service: '', projectValue: '', commissionPercent: '20',
  });

  const totals = {
    total: commissions.reduce((s, c) => s + c.commissionAmount, 0),
    pending: commissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commissionAmount, 0),
    approved: commissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.commissionAmount, 0),
    paid: commissions.filter(c => c.status === 'PAID').reduce((s, c) => s + c.commissionAmount, 0),
  };

  const handleCreateCommission = () => {
    const pct = Number(newCommission.commissionPercent);
    const pv = Number(newCommission.projectValue);
    if (!newCommission.bdId || !newCommission.clientName || !newCommission.service || !pv) return;
    const bd = bdProfiles.find(p => p.bdId === newCommission.bdId);
    createCommission({
      bdId: newCommission.bdId,
      bdName: bd?.fullName || newCommission.bdId,
      clientName: newCommission.clientName,
      service: newCommission.service,
      projectValue: pv,
      commissionPercent: pct,
      commissionAmount: Math.round((pv * pct) / 100),
      status: 'PENDING',
    });
    setNewCommission({ bdId: '', clientName: '', service: '', projectValue: '', commissionPercent: '20' });
    setActiveTab('commissions');
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] transition-colors';

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Commissions', value: `$${totals.total.toLocaleString()}`, color: 'border-violet-500/20' },
          { label: 'Pending', value: `$${totals.pending.toLocaleString()}`, color: 'border-amber-500/20' },
          { label: 'Approved', value: `$${totals.approved.toLocaleString()}`, color: 'border-blue-500/20' },
          { label: 'Paid Out', value: `$${totals.paid.toLocaleString()}`, color: 'border-emerald-500/20' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl card-dark-gradient border ${s.color}`}>
            <p className="text-[11px] text-zinc-400 font-semibold">{s.label}</p>
            <p className="text-xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['commissions', 'rules', 'create'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${activeTab === t ? 'bg-[#8B9FFD]/20 border-[#8B9FFD]/40 text-[#8B9FFD]' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'}`}
          >
            {t === 'commissions' ? 'Commission Records' : t === 'rules' ? 'Commission Rules' : '+ Create Commission'}
          </button>
        ))}
      </div>

      {activeTab === 'commissions' && (
        <div className="card-dark-gradient rounded-2xl border border-white/8 overflow-hidden">
          {commissions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
              <p className="text-sm text-zinc-500">No commissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/8 bg-zinc-900/40">
                    {['ID', 'BD Partner', 'Client', 'Service', 'Project Value', 'Commission %', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {commissions.map(c => (
                    <tr key={c.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 font-mono text-zinc-400">{c.commissionId}</td>
                      <td className="px-4 py-3 font-semibold text-white">
                        {c.bdName} <span className="text-zinc-500 text-[10px]">({c.bdId})</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{c.clientName}</td>
                      <td className="px-4 py-3 text-zinc-300">{c.service}</td>
                      <td className="px-4 py-3 text-zinc-300">${c.projectValue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-zinc-300">{c.commissionPercent}%</td>
                      <td className="px-4 py-3 font-bold text-white">${c.commissionAmount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${STATUS_CFG[c.status].bg} ${STATUS_CFG[c.status].color}`}>
                          {STATUS_CFG[c.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {c.status === 'PENDING' && (
                            <button
                              onClick={() => approveCommission(c.id, currentUser?.name || 'Admin')}
                              className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-[10px] font-semibold cursor-pointer hover:bg-blue-500/30"
                            >
                              Approve
                            </button>
                          )}
                          {c.status === 'APPROVED' && (
                            <button
                              onClick={() => setPayRef({ id: c.id, ref: '' })}
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold cursor-pointer hover:bg-emerald-500/30"
                            >
                              Pay
                            </button>
                          )}
                          {(c.status === 'PENDING' || c.status === 'APPROVED') && (
                            <button
                              onClick={() => cancelCommission(c.id)}
                              className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-semibold cursor-pointer hover:bg-red-500/20"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-3">
          <div className="card-dark-gradient rounded-2xl border border-white/8 p-4">
            <h4 className="text-xs font-bold text-zinc-300 mb-3">Add New Rule</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input className={inputCls} placeholder="Service Name" value={newRule.service} onChange={e => setNewRule(p => ({ ...p, service: e.target.value }))} />
              <input type="number" className={inputCls} placeholder="Commission %" value={newRule.commissionPercent} onChange={e => setNewRule(p => ({ ...p, commissionPercent: e.target.value }))} />
              <input className={inputCls} placeholder="Description (optional)" value={newRule.description} onChange={e => setNewRule(p => ({ ...p, description: e.target.value }))} />
            </div>
            <button
              onClick={() => {
                if (!newRule.service) return;
                addCommissionRule({ service: newRule.service, commissionPercent: Number(newRule.commissionPercent), description: newRule.description, isActive: true });
                setNewRule({ service: '', commissionPercent: '20', description: '' });
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              Add Rule
            </button>
          </div>
          <div className="card-dark-gradient rounded-2xl border border-white/8 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8 bg-zinc-900/40">
                  {['Service', 'Commission %', 'Description', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {commissionRules.map(r => (
                  <tr key={r.id} className="hover:bg-white/3">
                    <td className="px-4 py-3 font-semibold text-white">{r.service}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{r.commissionPercent}%</td>
                    <td className="px-4 py-3 text-zinc-400">{r.description || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${r.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                        {r.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteCommissionRule(r.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 cursor-pointer hover:bg-red-500/20">
                        <X className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card-dark-gradient rounded-2xl border border-white/8 p-5 max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Create Commission Record</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">BD Partner *</label>
              <select className={inputCls} value={newCommission.bdId} onChange={e => setNewCommission(p => ({ ...p, bdId: e.target.value }))}>
                <option value="">Select BD Partner</option>
                {bdProfiles.filter(p => p.status === 'VERIFIED').map(p => (
                  <option key={p.bdId} value={p.bdId || ''}>{p.fullName} ({p.bdId})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Client Name *</label>
              <input className={inputCls} value={newCommission.clientName} onChange={e => setNewCommission(p => ({ ...p, clientName: e.target.value }))} placeholder="Client Business Name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Service *</label>
              <select
                className={inputCls}
                value={newCommission.service}
                onChange={e => {
                  const rate = commissionRules.find(r => r.service === e.target.value)?.commissionPercent;
                  setNewCommission(p => ({ ...p, service: e.target.value, commissionPercent: rate?.toString() || '20' }));
                }}
              >
                <option value="">Select Service</option>
                {commissionRules.filter(r => r.isActive).map(r => (
                  <option key={r.id} value={r.service}>{r.service} ({r.commissionPercent}%)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Project Value ($) *</label>
              <input type="number" className={inputCls} value={newCommission.projectValue} onChange={e => setNewCommission(p => ({ ...p, projectValue: e.target.value }))} placeholder="5000" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Commission %</label>
              <input type="number" className={inputCls} value={newCommission.commissionPercent} onChange={e => setNewCommission(p => ({ ...p, commissionPercent: e.target.value }))} />
            </div>
            <div className="flex items-end pb-0.5">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25 flex-1">
                <p className="text-[10px] text-emerald-400 font-semibold">Commission Amount</p>
                <p className="text-base font-bold text-white">
                  ${newCommission.projectValue && newCommission.commissionPercent
                    ? Math.round(Number(newCommission.projectValue) * Number(newCommission.commissionPercent) / 100).toLocaleString()
                    : '0'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleCreateCommission}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Create Commission Record
          </button>
        </div>
      )}

      {/* Pay Commission Modal */}
      {payRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Record Payment</h3>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Payment Reference / Transaction ID</label>
              <input
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#8B9FFD]"
                value={payRef.ref}
                onChange={e => setPayRef(p => p ? { ...p, ref: e.target.value } : p)}
                placeholder="Bank ref, receipt no..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPayRef(null)} className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-white text-xs font-semibold cursor-pointer">Cancel</button>
              <button
                onClick={() => { if (payRef.ref) { payCommission(payRef.id, payRef.ref); setPayRef(null); } }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
