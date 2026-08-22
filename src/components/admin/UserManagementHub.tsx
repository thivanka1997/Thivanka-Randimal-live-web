'use client';

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Receipt,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
  Edit3,
  Search,
  Filter,
  Shield,
  Building,
  KeyRound,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { User, UserRole, UserStatus, RegistrationRequest } from '../../types';

export const UserManagementHub: React.FC = () => {
  const {
    users,
    clients,
    registrations,
    createUserDirect,
    updateUser,
    deleteUser,
    toggleUserStatus,
    approveRegistration,
    rejectRegistration,
    deleteRegistration,
  } = usePortal();

  // Active sub-tab
  const [subTab, setSubTab] = useState<'registrations' | 'users'>('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Modals
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showSlipViewerModal, setShowSlipViewerModal] = useState<RegistrationRequest | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<RegistrationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Create User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client' as UserRole,
    companyName: '',
    phone: '',
    status: 'active' as UserStatus,
  });

  const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    createUserDirect({
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      password: newUserForm.password || (newUserForm.role === 'admin' ? 'admin123' : 'client123'),
      role: newUserForm.role,
      companyName: newUserForm.companyName.trim() || undefined,
      phone: newUserForm.phone.trim() || undefined,
      status: newUserForm.status,
    });

    setShowCreateUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      password: '',
      role: 'client',
      companyName: '',
      phone: '',
      status: 'active',
    });
    showToast('New user account created successfully!');
  };

  const handleApprove = (regId: string) => {
    const res = approveRegistration(regId);
    if (res.success) {
      showToast(res.message);
    }
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRejectModal) return;

    const res = rejectRegistration(showRejectModal.id, rejectionReason || 'Payment verification failed.');
    if (res.success) {
      showToast('Registration request marked as rejected.');
    }
    setShowRejectModal(null);
    setRejectionReason('');
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast('');
    }, 4000);
  };

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.companyName && r.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Sub-tab navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8B9FFD]" />
            User Creation & Registration Verification
          </h3>
          <p className="text-xs text-zinc-400">
            Review user registration requests, inspect submitted bank payment slips, and manage active accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex p-1 bg-zinc-900 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              id="subtab-registrations-btn"
              onClick={() => setSubTab('registrations')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                subTab === 'registrations'
                  ? 'bg-[#8B9FFD] text-[#0b0d12] font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Payment Slips & Signups</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="subtab-users-btn"
              onClick={() => setSubTab('users')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                subTab === 'users'
                  ? 'bg-[#8B9FFD] text-[#0b0d12] font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>All User Accounts ({users.length})</span>
            </button>
          </div>

          <button
            id="admin-create-user-modal-btn"
            onClick={() => setShowCreateUserModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: REGISTRATIONS & PAYMENT SLIPS */}
      {subTab === 'registrations' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference, client, email..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <span className="text-zinc-400 text-[11px]">Filter by Status:</span>
              <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-white/10 text-[11px]">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                      statusFilter === st
                        ? 'bg-white/15 text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Registration Cards Grid */}
          {filteredRegistrations.length === 0 ? (
            <div className="card-dark-gradient p-8 rounded-2xl border border-white/10 text-center space-y-2">
              <Receipt className="w-10 h-10 mx-auto text-zinc-500" />
              <p className="text-sm font-semibold text-white">No registration requests found</p>
              <p className="text-xs text-zinc-400">
                When new clients register and upload bank payment slips, they will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className={`card-dark-gradient p-5 rounded-2xl border transition-all ${
                    reg.status === 'pending'
                      ? 'border-amber-500/40 ring-1 ring-amber-500/20 bg-amber-950/10'
                      : reg.status === 'approved'
                      ? 'border-emerald-500/30'
                      : 'border-rose-500/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Applicant Details */}
                    <div className="space-y-2 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                          {reg.referenceNumber}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            reg.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : reg.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          ● {reg.status === 'pending' ? 'Pending Admin Review' : reg.status}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Submitted on {reg.createdAt}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          {reg.name}
                          {reg.companyName && (
                            <span className="text-xs font-medium text-zinc-400 font-sans">
                              ({reg.companyName})
                            </span>
                          )}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-zinc-500" /> {reg.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-zinc-500" /> {reg.phone}
                          </span>
                        </div>
                      </div>

                      {/* Service Ordered & Package Price */}
                      <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-zinc-300 font-semibold">
                          <span>{reg.serviceTitle || 'Custom Direct Service'}</span>
                          <span className="font-bold text-emerald-400">
                            ${reg.finalAmount || reg.packagePrice || 105} USD ({reg.packageTier || 'standard'})
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            30% Promo Applied (-${reg.originalPrice && reg.packagePrice ? reg.originalPrice - reg.packagePrice : '30%'})
                          </span>
                          {reg.referralCode && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 font-mono">
                              Referral: {reg.referralCode} {reg.referralDiscount ? `(-$${reg.referralDiscount})` : ''}
                            </span>
                          )}
                        </div>

                        {reg.paymentReference && (
                          <p className="text-[11px] text-zinc-400 font-mono">
                            Wire Ref: {reg.paymentReference} • Date: {reg.paymentDate || reg.createdAt}
                          </p>
                        )}
                        {reg.notes && (
                          <p className="text-[11px] text-zinc-300 italic pt-1 border-t border-white/5">
                            "{reg.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Payment Slip Receipt Thumbnail & Action Controls */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/10">
                      {/* Payment Slip Thumbnail Box */}
                      <div
                        onClick={() => setShowSlipViewerModal(reg)}
                        className="group relative cursor-pointer rounded-xl overflow-hidden border border-white/15 bg-zinc-900 hover:border-blue-400 transition-all p-2 flex items-center gap-3 w-full sm:w-auto"
                      >
                        <div className="w-12 h-14 bg-slate-950 rounded flex items-center justify-center overflow-hidden border border-white/10 relative">
                          {reg.paymentSlipUrl ? (
                            <img
                              src={reg.paymentSlipUrl}
                              alt="Slip Preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <Receipt className="w-6 h-6 text-zinc-500" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <div className="text-left text-xs">
                          <p className="font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                            Inspect Payment Slip
                          </p>
                          <p className="text-[10px] text-zinc-400 truncate max-w-[150px]">
                            {reg.paymentSlipFileName || 'receipt.png'}
                          </p>
                          <span className="text-[10px] text-blue-400 font-semibold group-hover:underline">
                            Click to Zoom & Verify →
                          </span>
                        </div>
                      </div>

                      {/* Status & Action Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-1">
                        {reg.status === 'pending' ? (
                          <>
                            <button
                              id={`approve-reg-btn-${reg.id}`}
                              onClick={() => handleApprove(reg.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                              title="Verify payment slip and activate client portal login"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify & Create User</span>
                            </button>

                            <button
                              id={`reject-reg-btn-${reg.id}`}
                              onClick={() => setShowRejectModal(reg)}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-semibold transition-colors border border-rose-500/40 cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : reg.status === 'approved' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified by {reg.verifiedBy || 'Admin'}
                            </span>
                            <button
                              onClick={() => deleteRegistration(reg.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                              title="Delete Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Rejected ({reg.rejectionReason})
                            </span>
                            <button
                              onClick={() => deleteRegistration(reg.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                              title="Delete Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: ALL USER ACCOUNTS */}
      {subTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name, email, company..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <span className="text-zinc-400 text-[11px]">Role:</span>
              <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-white/10 text-[11px]">
                {(['all', 'admin', 'client'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                      roleFilter === r
                        ? 'bg-white/15 text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="card-dark-gradient p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      u.role === 'admin'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}
                  >
                    {u.role === 'admin' ? 'ADM' : 'CLT'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{u.name}</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        }`}
                      >
                        {u.role}
                      </span>
                      {u.companyName && (
                        <span className="text-[11px] text-zinc-400">({u.companyName})</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-0.5">
                      <span>{u.email}</span>
                      {u.phone && <span>• {u.phone}</span>}
                      {u.registrationRef && <span>• Ref: {u.registrationRef}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      u.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : u.status === 'pending_verification'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {u.status || 'active'}
                  </span>

                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className="text-xs text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                      title="Toggle active / inactive access"
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}

                  {u.role !== 'admin' && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: DIRECT USER CREATION BY ADMIN */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <UserPlus className="w-4 h-4 text-[#8B9FFD]" />
                Admin Direct User Creation
              </div>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Account Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewUserForm({ ...newUserForm, role: 'client' })}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      newUserForm.role === 'client'
                        ? 'border-sky-500 bg-sky-500/20 text-sky-200'
                        : 'border-white/10 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Client Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUserForm({ ...newUserForm, role: 'admin' })}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      newUserForm.role === 'admin'
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
                        : 'border-white/10 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Account</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Ruwan Silva"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="user@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Password</label>
                  <input
                    type="text"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder={newUserForm.role === 'admin' ? 'admin123' : 'client123'}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>
              </div>

              {newUserForm.role === 'client' && (
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={newUserForm.companyName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, companyName: e.target.value })}
                    placeholder="e.g. Apex Technologies Ltd"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] font-bold shadow"
                >
                  Create & Activate User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAYMENT SLIP VIEWER & VERIFICATION AUDIT */}
      {showSlipViewerModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl card-dark-gradient border border-white/15 rounded-2xl overflow-hidden shadow-2xl text-left">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Payment Slip & Wire Audit</h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Ref: {showSlipViewerModal.referenceNumber} • {showSlipViewerModal.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSlipViewerModal(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
              {/* Slip Visual Image */}
              <div className="md:col-span-7 flex flex-col items-center justify-center bg-black/40 rounded-xl p-3 border border-white/10">
                {showSlipViewerModal.paymentSlipUrl ? (
                  <img
                    src={showSlipViewerModal.paymentSlipUrl}
                    alt="Payment Slip"
                    className="max-h-[480px] w-auto object-contain rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="py-12 text-center text-zinc-500">
                    <Receipt className="w-12 h-12 mx-auto mb-2" />
                    <p>No receipt image file available</p>
                  </div>
                )}
                <div className="w-full flex items-center justify-between text-[11px] text-zinc-400 pt-2">
                  <span>File: {showSlipViewerModal.paymentSlipFileName || 'receipt.png'}</span>
                  <span>{showSlipViewerModal.paymentSlipFileSize || '150 KB'}</span>
                </div>
              </div>

              {/* Wire Metadata & Action Card */}
              <div className="md:col-span-5 space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Verification Checklist
                  </span>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">Client / Organization:</span>
                    <span className="font-semibold text-white">
                      {showSlipViewerModal.name} ({showSlipViewerModal.companyName})
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">Email & Contact:</span>
                    <span className="text-zinc-200">{showSlipViewerModal.email} • {showSlipViewerModal.phone}</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">Selected Direct Service:</span>
                    <span className="font-semibold text-blue-300">
                      {showSlipViewerModal.serviceTitle}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">Package & Amount:</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      ${showSlipViewerModal.packagePrice} USD ({showSlipViewerModal.packageTier})
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">Bank Wire / Reference #:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {showSlipViewerModal.paymentReference || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">Transfer Date:</span>
                    <span className="text-zinc-300">{showSlipViewerModal.paymentDate || showSlipViewerModal.createdAt}</span>
                  </div>
                </div>

                {/* Direct Action inside viewer */}
                {showSlipViewerModal.status === 'pending' && (
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleApprove(showSlipViewerModal.id);
                        setShowSlipViewerModal(null);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Slip & Activate User</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const target = showSlipViewerModal;
                        setShowSlipViewerModal(null);
                        setShowRejectModal(target);
                      }}
                      className="w-full py-2 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold transition-colors"
                    >
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT REGISTRATION REASON */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md card-dark-gradient border border-rose-500/40 rounded-2xl p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                Reject Registration Request
              </h3>
              <button onClick={() => setShowRejectModal(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectConfirm} className="space-y-3.5 text-xs">
              <p className="text-zinc-300">
                Rejecting registration Ref <strong className="text-white font-mono">{showRejectModal.referenceNumber}</strong> ({showRejectModal.name}).
              </p>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Rejection Reason</label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Wire transfer reference could not be located in bank records, or slip unreadable."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
