'use client';
import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { useBD } from '../../context/BDContext';
import { DollarSign, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { CommissionStatus } from '../../types';

const STATUS_CFG: Record<CommissionStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  APPROVED: { label: 'Approved', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  PAID: { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-zinc-400', bg: 'bg-zinc-500/20' },
};

export const BDCommissionsView: React.FC = () => {
  const { currentUser } = usePortal();
  const { getCommissionsForBD, getBDProfileByUserId } = useBD();
  const bdProfile = currentUser ? getBDProfileByUserId(currentUser.id) : undefined;
  const commissions = bdProfile?.bdId ? getCommissionsForBD(bdProfile.bdId) : [];

  const totals = {
    total: commissions.reduce((s, c) => s + c.commissionAmount, 0),
    pending: commissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commissionAmount, 0),
    approved: commissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.commissionAmount, 0),
    paid: commissions.filter(c => c.status === 'PAID').reduce((s, c) => s + c.commissionAmount, 0),
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Earned', value: `$${totals.total.toLocaleString()}`, icon: TrendingUp, color: 'border-violet-500/20 text-violet-400' },
          { label: 'Pending', value: `$${totals.pending.toLocaleString()}`, icon: Clock, color: 'border-amber-500/20 text-amber-400' },
          { label: 'Approved', value: `$${totals.approved.toLocaleString()}`, icon: CheckCircle2, color: 'border-blue-500/20 text-blue-400' },
          { label: 'Paid Out', value: `$${totals.paid.toLocaleString()}`, icon: DollarSign, color: 'border-emerald-500/20 text-emerald-400' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`p-4 rounded-2xl border card-dark-gradient ${s.color}`}>
              <Icon className="w-4 h-4 mb-1.5" />
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-[11px] font-semibold mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Commission Table */}
      <div className="card-dark-gradient rounded-2xl border border-white/8 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h3 className="text-sm font-bold text-white">Commission Records</h3>
        </div>
        {commissions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
            <p className="text-sm text-zinc-500">No commissions yet</p>
            <p className="text-xs text-zinc-600 mt-1">Commissions are calculated when your referred leads are won</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-900/40">
                  {['ID', 'Client', 'Service', 'Project Value', 'Rate', 'Commission', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {commissions.map(c => (
                  <tr key={c.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-mono text-zinc-400">{c.commissionId}</td>
                    <td className="px-4 py-3 font-semibold text-white">{c.clientName}</td>
                    <td className="px-4 py-3 text-zinc-300">{c.service}</td>
                    <td className="px-4 py-3 text-zinc-300">${c.projectValue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-zinc-300">{c.commissionPercent}%</td>
                    <td className="px-4 py-3 font-bold text-white">${c.commissionAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${STATUS_CFG[c.status].bg} ${STATUS_CFG[c.status].color}`}>{STATUS_CFG[c.status].label}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
