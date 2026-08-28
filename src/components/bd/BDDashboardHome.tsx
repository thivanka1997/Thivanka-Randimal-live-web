'use client';
import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { useBD } from '../../context/BDContext';
import { Target, CheckSquare, DollarSign, TrendingUp, Plus, ArrowRight, AlertCircle } from 'lucide-react';

type BDTab = 'dashboard' | 'leads' | 'submit_lead' | 'tasks' | 'commissions' | 'referrals' | 'profile' | 'notifications';
interface Props { onNavigate: (tab: BDTab) => void; }

const StatCard = ({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) => (
  <div className={`p-4 rounded-2xl border card-dark-gradient ${color} transition-all hover:-translate-y-0.5`}>
    <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
    {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
  </div>
);

export const BDDashboardHome: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser } = usePortal();
  const { getLeadsForBD, getBDProfileByUserId, getBDTasksForPartner, getCommissionsForBD } = useBD();

  const bdProfile = currentUser ? getBDProfileByUserId(currentUser.id) : undefined;
  const myLeads = bdProfile?.bdId ? getLeadsForBD(bdProfile.bdId) : [];
  const myTasks = bdProfile?.bdId ? getBDTasksForPartner(bdProfile.bdId) : [];
  const myCommissions = bdProfile?.bdId ? getCommissionsForBD(bdProfile.bdId) : [];

  const wonLeads = myLeads.filter(l => l.status === 'WON' || l.status === 'PROJECT_STARTED' || l.status === 'PROJECT_COMPLETED');
  const activeLeads = myLeads.filter(l => !['WON', 'LOST', 'DUPLICATE', 'NOT_INTERESTED', 'PROJECT_COMPLETED'].includes(l.status));
  const conversionRate = myLeads.length > 0 ? Math.round((wonLeads.length / myLeads.length) * 100) : 0;
  const pendingCommission = myCommissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commissionAmount, 0);
  const paidCommission = myCommissions.filter(c => c.status === 'PAID').reduce((s, c) => s + c.commissionAmount, 0);
  const pendingTasks = myTasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS');

  const statusGroups = [
    { label: 'New', count: myLeads.filter(l => l.status === 'NEW' || l.status === 'ASSIGNED').length, color: '#60a5fa' },
    { label: 'Active', count: activeLeads.length, color: '#34d399' },
    { label: 'Won', count: wonLeads.length, color: '#a78bfa' },
    { label: 'Lost', count: myLeads.filter(l => l.status === 'LOST' || l.status === 'NOT_INTERESTED').length, color: '#f87171' },
  ];
  const maxCount = Math.max(...statusGroups.map(s => s.count), 1);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Welcome back, {currentUser?.name?.split(' ')[0]}!</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {bdProfile?.bdId || 'Pending Verification'} · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => onNavigate('submit_lead')}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Submit Lead
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard label="Total Leads" value={myLeads.length} color="border-blue-500/20" />
        <StatCard label="Active Leads" value={activeLeads.length} color="border-emerald-500/20" />
        <StatCard label="Won Leads" value={wonLeads.length} color="border-violet-500/20" />
        <StatCard label="Conversion" value={`${conversionRate}%`} color="border-amber-500/20" />
        <StatCard label="Pending Tasks" value={pendingTasks.length} sub="action required" color="border-orange-500/20" />
        <StatCard label="Pending Comm." value={`$${pendingCommission.toLocaleString()}`} color="border-sky-500/20" />
        <StatCard label="Paid Comm." value={`$${paidCommission.toLocaleString()}`} color="border-green-500/20" />
        <StatCard label="Total Comm." value={`$${(pendingCommission + paidCommission).toLocaleString()}`} color="border-purple-500/20" />
      </div>

      {/* Lead Status Chart + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="card-dark-gradient rounded-2xl border border-white/8 p-5">
          <h3 className="text-sm font-bold text-white mb-4">Lead Status Overview</h3>
          <div className="space-y-3">
            {statusGroups.map(g => (
              <div key={g.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">{g.label}</span>
                  <span className="text-white font-bold">{g.count}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(g.count / maxCount) * 100}%`, backgroundColor: g.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          {myLeads.length === 0 && <p className="text-xs text-zinc-600 text-center mt-4">No leads yet</p>}
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-2 card-dark-gradient rounded-2xl border border-white/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Leads</h3>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs text-[#8B9FFD] hover:text-[#a2b2ff] font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {myLeads.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
              <p className="text-xs text-zinc-500">No leads assigned yet</p>
              <button
                onClick={() => onNavigate('submit_lead')}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold cursor-pointer"
              >
                Submit Your First Lead
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {myLeads.slice(0, 5).map(lead => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${lead.status === 'WON' ? 'bg-emerald-400' : lead.status === 'LOST' ? 'bg-red-400' : lead.status === 'ASSIGNED' ? 'bg-blue-400' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{lead.businessName}</p>
                    <p className="text-[10px] text-zinc-500">{lead.interestedService || 'General'} · {lead.city}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold ${lead.status === 'WON' ? 'bg-emerald-500/20 text-emerald-400' : lead.status === 'LOST' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {lead.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="card-dark-gradient rounded-2xl border border-white/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Pending Tasks ({pendingTasks.length})
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-[#8B9FFD] font-semibold cursor-pointer flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pendingTasks.slice(0, 4).map(task => (
              <div key={task.id} className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/25">
                <p className="text-xs font-semibold text-white truncate">{task.title}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{task.leadName} · Due: {task.dueDate || 'N/A'}</p>
                <span className={`text-[10px] font-bold mt-1 inline-block ${task.priority === 'URGENT' ? 'text-red-400' : task.priority === 'HIGH' ? 'text-orange-400' : 'text-zinc-400'}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
