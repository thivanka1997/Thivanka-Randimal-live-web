'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  User as UserIcon,
  Shield,
  Building,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login, quickLoginAs, clients } = usePortal();

  const [activeTab, setActiveTab] = useState<UserRole>('admin');
  const [email, setEmail] = useState('admin@thivanka.dev');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setErrorMsg('');
    if (role === 'admin') {
      setEmail('admin@thivanka.dev');
      setPassword('admin123');
    } else {
      setEmail('client@abc.com');
      setPassword('client123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const res = login(email, activeTab);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Authentication failed. Please check credentials.');
      }
    }, 400);
  };

  const handleQuickLogin = (role: UserRole, clientId?: string) => {
    quickLoginAs(role, clientId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md card-dark-gradient border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8 text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8B9FFD]/15 border border-[#8B9FFD]/30 flex items-center justify-center text-[#8B9FFD]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Portal Authentication</h3>
              <p className="text-xs text-zinc-400">MongoDB & Role-Based Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Tabs */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 p-1 bg-zinc-900 rounded-2xl border border-white/10">
            <button
              onClick={() => handleTabChange('admin')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#8B9FFD] text-[#0b0d12] shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => handleTabChange('client')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-[#8B9FFD] text-[#0b0d12] shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Client Portal</span>
            </button>
          </div>

          {/* Quick Demo 1-Click Buttons */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#8B9FFD]" />
                Instant Demo Logins
              </span>
              <span className="text-[10px] text-zinc-500">1-Click Test</span>
            </div>

            {activeTab === 'admin' ? (
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="w-full py-2 px-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>👑 Admin: Thivanka Randimal</span>
                </div>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded">
                  Full Control
                </span>
              </button>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('client', 'client-1')}
                  className="w-full py-2 px-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 text-sky-200 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-sky-400" />
                    <span>🏢 ABC Company</span>
                  </div>
                  <span className="text-[10px] bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded">
                    2 Projects
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('client', 'client-2')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>🏨</span>
                    <span>Grand Luxe Hotels</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded">
                    1 Project
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#121622] px-3 text-[10px] text-zinc-500 uppercase tracking-wider absolute">
              Or standard login
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {activeTab === 'admin' ? 'Administrator Email' : 'Client Account Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'admin' ? 'admin@thivanka.dev' : 'client@abc.com'}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-[#0b0d12] border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter {activeTab === 'admin' ? 'Admin Dashboard' : 'Client Portal'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Register with Payment Slip CTA */}
          {onSwitchToRegister && (
            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs text-blue-200">
              <div>
                <p className="font-bold text-white">New Client Project?</p>
                <p className="text-[11px] text-blue-300">Submit direct order & bank payment slip</p>
              </div>
              <button
                type="button"
                id="login-switch-register-btn"
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
              >
                Register & Upload <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict Role-Based Security</span>
            </div>
            <p>
              {activeTab === 'admin'
                ? 'Admin credentials grant full CRUD privileges on projects, clients, tasks, and system files.'
                : 'Clients only have access to their assigned project progress, milestones, and shared deliverables.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
