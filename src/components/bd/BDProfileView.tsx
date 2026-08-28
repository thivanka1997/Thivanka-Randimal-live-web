'use client';
import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { useBD } from '../../context/BDContext';
import { Copy, Check } from 'lucide-react';

export const BDProfileView: React.FC = () => {
  const { currentUser } = usePortal();
  const { getBDProfileByUserId } = useBD();
  const [copied, setCopied] = useState(false);
  const bdProfile = currentUser ? getBDProfileByUserId(currentUser.id) : undefined;

  const copyCode = () => {
    if (bdProfile?.referralCode) {
      navigator.clipboard.writeText(bdProfile.referralCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!bdProfile) {
    return (
      <div className="p-4 lg:p-6 text-center">
        <p className="text-sm text-zinc-500">No BD profile found. Please complete registration.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    UNDER_REVIEW: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    VERIFIED: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    REJECTED: 'text-red-400 bg-red-500/20 border-red-500/30',
    SUSPENDED: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="card-dark-gradient rounded-2xl border border-white/8 p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-2xl font-bold">
            {bdProfile.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{bdProfile.fullName}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{bdProfile.jobPosition || 'BD Partner'}</p>
            {bdProfile.companyName && <p className="text-xs text-zinc-500">{bdProfile.companyName}</p>}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[bdProfile.status] || ''}`}>
            {bdProfile.status}
          </span>
          {bdProfile.bdId && (
            <div className="pt-2 space-y-2">
              <div className="p-2 rounded-xl bg-zinc-900/60">
                <p className="text-[10px] text-zinc-500 font-semibold">BD ID</p>
                <p className="text-sm font-bold text-white font-mono">{bdProfile.bdId}</p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/25">
                <p className="text-[10px] text-emerald-400 font-semibold">Referral Code</p>
                <div className="flex items-center gap-2 justify-center mt-0.5">
                  <p className="text-sm font-bold text-white font-mono">{bdProfile.referralCode}</p>
                  <button onClick={copyCode} className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 cursor-pointer">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-dark-gradient rounded-2xl border border-white/8 p-5">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                ['Email', bdProfile.email],
                ['Phone', bdProfile.phone],
                ['WhatsApp', bdProfile.whatsapp],
                ['NIC / Passport', bdProfile.nicPassport],
                ['City', bdProfile.city],
                ['Province', bdProfile.province],
                ['Address', bdProfile.address],
              ].map(([k, v]) =>
                v ? (
                  <div key={k as string} className="p-2 rounded-xl bg-zinc-900/60">
                    <p className="text-zinc-500 text-[10px]">{k}</p>
                    <p className="text-white font-semibold mt-0.5">{v as string}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
          <div className="card-dark-gradient rounded-2xl border border-white/8 p-5">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Professional Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                ['Company', bdProfile.companyName],
                ['Position', bdProfile.jobPosition],
                ['Industry', bdProfile.industry],
                ['Experience', bdProfile.experience],
                ['Website', bdProfile.website],
                ['LinkedIn', bdProfile.linkedin],
              ].map(([k, v]) =>
                v ? (
                  <div key={k as string} className="p-2 rounded-xl bg-zinc-900/60">
                    <p className="text-zinc-500 text-[10px]">{k}</p>
                    <p className="text-white font-semibold mt-0.5 truncate">{v as string}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
          {bdProfile.preferredServices && bdProfile.preferredServices.length > 0 && (
            <div className="card-dark-gradient rounded-2xl border border-white/8 p-5">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Preferred Services</h4>
              <div className="flex flex-wrap gap-2">
                {bdProfile.preferredServices.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
