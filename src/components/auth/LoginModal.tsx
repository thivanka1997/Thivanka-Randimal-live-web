'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Shield,
  Building,
  ArrowRight,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onOpenBDRegister?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onOpenBDRegister,
}) => {
  const { login } = usePortal();

  const [activeTab, setActiveTab] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setErrorMsg('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email.trim(), activeTab, password);
    setLoading(false);
    if (res.success) {
      setPassword('');
      onClose();
    } else {
      setErrorMsg(res.message || 'Authentication failed. Please check your credentials.');
    }
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
              <p className="text-xs text-zinc-400">Secure Role-Based Access Control</p>
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
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 p-1 bg-zinc-900 rounded-2xl border border-white/10">
            <button
              onClick={() => handleTabChange('admin')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#8B9FFD] text-[#0b0d12] shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => handleTabChange('client')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-[#8B9FFD] text-[#0b0d12] shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Client</span>
            </button>
            <button
              onClick={() => handleTabChange('business_development' as UserRole)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === ('business_development' as UserRole)
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>BD Partner</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                {activeTab === 'admin'
                  ? 'Administrator Email'
                  : activeTab === 'business_development'
                  ? 'BD Email / Username / BD ID'
                  : 'Client Account Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === 'admin'
                      ? 'Admin email'
                      : activeTab === 'business_development'
                      ? 'Enter your BD partner email'
                      : 'Enter your Client Email'
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoComplete="current-password"
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
                  <span>
                    Sign In to{' '}
                    {activeTab === 'admin'
                      ? 'Admin Console'
                      : activeTab === 'business_development'
                      ? 'BD Dashboard'
                      : 'Client Portal'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Client Registration CTA */}
          {activeTab === 'client' && onSwitchToRegister && (
            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs text-blue-200">
              <div>
                <p className="font-bold text-white">Need a Client Account?</p>
                <p className="text-[11px] text-blue-300">Submit your registration and advance slip</p>
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

          {/* BD Partner Register CTA */}
          {activeTab === ('business_development' as UserRole) && onOpenBDRegister && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
              <div>
                <p className="font-bold text-white">Become a BD Partner?</p>
                <p className="text-[11px] text-emerald-300">Register as a referral partner & earn commissions</p>
              </div>
              <button
                type="button"
                id="login-switch-bd-register-btn"
                onClick={onOpenBDRegister}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
              >
                Apply Now <ArrowRight className="w-3 h-3" />
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
                : activeTab === ('business_development' as UserRole)
                ? 'BD Partners can only access their own leads, tasks, referrals, and commissions.'
                : 'Clients only have access to their assigned project progress, milestones, and shared deliverables.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
