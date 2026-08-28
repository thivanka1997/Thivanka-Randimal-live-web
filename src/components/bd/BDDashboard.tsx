'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, Target, Plus, CheckSquare,
  TrendingUp, DollarSign, Bell, User, LogOut, ArrowLeft,
  Briefcase, Menu, ChevronRight, Shield,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { useBD } from '../../context/BDContext';
import { BDDashboardHome } from './BDDashboardHome';
import { BDLeadsView } from './BDLeadsView';
import { BDSubmitLeadForm } from './BDSubmitLeadForm';
import { BDTasksView } from './BDTasksView';
import { BDCommissionsView } from './BDCommissionsView';
import { BDReferralsView } from './BDReferralsView';
import { BDProfileView } from './BDProfileView';

type BDTab = 'dashboard' | 'leads' | 'submit_lead' | 'tasks' | 'commissions' | 'referrals' | 'profile' | 'notifications';

const NAV_ITEMS: { id: BDTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'My Leads', icon: Target },
  { id: 'submit_lead', label: 'Submit Lead', icon: Plus },
  { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
  { id: 'commissions', label: 'Commissions', icon: DollarSign },
  { id: 'referrals', label: 'Referrals', icon: TrendingUp },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export const BDDashboard: React.FC = () => {
  const { currentUser, logout, setCurrentView } = usePortal();
  const { getBDProfileByUserId, getNotificationsForUser, markAllRead } = useBD();
  const [activeTab, setActiveTab] = useState<BDTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bdProfile = currentUser ? getBDProfileByUserId(currentUser.id) : undefined;
  const notifications = currentUser ? getNotificationsForUser(currentUser.id) : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleTabChange = (tab: BDTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (tab === 'notifications' && currentUser) markAllRead(currentUser.id);
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-zinc-100 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f1117] border-r border-white/8 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">BD Portal</p>
            <p className="text-[11px] text-zinc-500">{bdProfile?.bdId || 'Pending Verification'}</p>
          </div>
        </div>

        {/* BD ID Card */}
        {bdProfile?.bdId && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25">
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Referral Code</p>
            <p className="text-sm font-bold text-white font-mono mt-0.5">{bdProfile.referralCode || '—'}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badge = item.id === 'notifications' ? unreadCount : 0;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/8 space-y-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
              {currentUser?.name.charAt(0) || 'B'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
          <button
            onClick={() => setCurrentView('portfolio')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-[#8B9FFD] hover:bg-[#8B9FFD]/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-4 bg-[#0b0d12]/80 backdrop-blur-sm border-b border-white/8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-zinc-500 hidden sm:block">Business Development Partner Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-semibold">BD Partner</span>
            </div>
            <button
              onClick={() => handleTabChange('notifications')}
              className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/8 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <BDDashboardHome onNavigate={handleTabChange} />}
          {activeTab === 'leads' && <BDLeadsView />}
          {activeTab === 'submit_lead' && <BDSubmitLeadForm onSuccess={() => setActiveTab('leads')} />}
          {activeTab === 'tasks' && <BDTasksView />}
          {activeTab === 'commissions' && <BDCommissionsView />}
          {activeTab === 'referrals' && <BDReferralsView />}
          {activeTab === 'profile' && <BDProfileView />}
          {activeTab === 'notifications' && (
            <div className="p-4 lg:p-6 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all ${n.isRead ? 'bg-zinc-900/30 border-white/5' : 'bg-emerald-950/30 border-emerald-500/25'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? 'bg-zinc-600' : 'bg-emerald-400'}`} />
                      <div>
                        <p className="text-xs font-semibold text-white">{n.title}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
