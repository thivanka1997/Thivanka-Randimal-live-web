'use client';
import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { useBD } from '../../context/BDContext';
import { Award } from 'lucide-react';

export const BDReferralsView: React.FC = () => {
  const { currentUser } = usePortal();
  const { getLeadsForBD, getBDProfileByUserId, getCommissionsForBD } = useBD();
  const bdProfile = currentUser ? getBDProfileByUserId(currentUser.id) : undefined;
  const leads = bdProfile?.bdId ? getLeadsForBD(bdProfile.bdId) : [];
  const commissions = bdProfile?.bdId ? getCommissionsForBD(bdProfile.bdId) : [];

  const submitted = leads.filter(l => l.leadSource === 'BD_REFERRAL').length;
  const approved = leads.filter(l => l.leadSource === 'BD_REFERRAL' && l.status !== 'PENDING_ADMIN_REVIEW').length;
  const won = leads.filter(l => ['WON', 'PROJECT_STARTED', 'PROJECT_COMPLETED'].includes(l.status)).length;
  const lost = leads.filter(l => ['LOST', 'NOT_INTERESTED'].includes(l.status)).length;
  const active = leads.filter(l => !['WON', 'LOST', 'NOT_INTERESTED', 'PROJECT_COMPLETED', 'DUPLICATE'].includes(l.status)).length;
  const conversion = leads.length > 0 ? Math.round((won / leads.length) * 100) : 0;
  const totalCommission = commissions.reduce((s, c) => s + c.commissionAmount, 0);

  // Service breakdown
  const serviceBreakdown: Record<string, number> = {};
  leads.forEach(l => {
    if (l.interestedService) {
      serviceBreakdown[l.interestedService] = (serviceBreakdown[l.interestedService] || 0) + 1;
    }
  });
  const serviceEntries = Object.entries(serviceBreakdown).sort((a, b) => b[1] - a[1]);
  const maxServiceCount = Math.max(...serviceEntries.map(e => e[1]), 1);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Submitted', value: submitted, color: 'border-blue-500/20' },
          { label: 'Approved', value: approved, color: 'border-emerald-500/20' },
          { label: 'Active', value: active, color: 'border-sky-500/20' },
          { label: 'Won', value: won, color: 'border-violet-500/20' },
          { label: 'Lost', value: lost, color: 'border-red-500/20' },
          { label: 'Conversion Rate', value: `${conversion}%`, color: 'border-amber-500/20' },
          { label: 'Commission Earned', value: `$${totalCommission.toLocaleString()}`, color: 'border-green-500/20' },
          { label: 'Assigned to Me', value: leads.filter(l => l.leadSource !== 'BD_REFERRAL').length, color: 'border-purple-500/20' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl border card-dark-gradient ${s.color}`}>
            <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Referral Code Card */}
        <div className="card-dark-gradient rounded-2xl border border-emerald-500/25 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Your Referral Details</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900/60">
              <p className="text-[10px] text-zinc-500 font-semibold uppercase">BD ID</p>
              <p className="text-base font-bold text-white font-mono mt-0.5">{bdProfile?.bdId || '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25">
              <p className="text-[10px] text-emerald-400 font-semibold uppercase">Referral Code</p>
              <p className="text-base font-bold text-white font-mono mt-0.5">{bdProfile?.referralCode || '—'}</p>
            </div>
            <p className="text-[11px] text-zinc-500">
              Share your referral code when introducing potential clients to ensure proper attribution of your referrals.
            </p>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="card-dark-gradient rounded-2xl border border-white/8 p-5">
          <h3 className="text-sm font-bold text-white mb-4">Leads by Service</h3>
          {serviceEntries.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {serviceEntries.map(([service, count]) => (
                <div key={service}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">{service}</span>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxServiceCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
