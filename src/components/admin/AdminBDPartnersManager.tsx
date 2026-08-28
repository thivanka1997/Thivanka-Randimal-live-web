'use client';
import React, { useState } from 'react';
import { useBD } from '../../context/BDContext';
import { usePortal } from '../../context/PortalContext';
import { Users, CheckCircle2, XCircle, AlertTriangle, RotateCcw, Eye, Search, X, Plus, Edit3, Trash2, ShieldCheck, Copy, Check } from 'lucide-react';
import { BDProfile, BDStatus } from '../../types';

const STATUS_CFG: Record<BDStatus, { label: string; color: string; bg: string; border: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
  UNDER_REVIEW: { label: 'Under Review', color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
  VERIFIED: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  REJECTED: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' },
  SUSPENDED: { label: 'Suspended', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
};

type FilterTab = 'all' | 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED';

const SERVICES_OPTIONS = ['Basic Website', 'Standard Website', 'Premium Website', 'Mobile Application', 'ERP System', 'Financial Dashboard', 'Other'];

export const AdminBDPartnersManager: React.FC = () => {
  const { bdProfiles, verifyBDPartner, rejectBDPartner, suspendBDPartner, reactivateBDPartner, addBDPartnerDirect, updateBDProfile, deleteBDPartner } = useBD();
  const { currentUser, createUserDirect, deleteUser } = usePortal();
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<BDProfile | null>(null);
  const [actionModal, setActionModal] = useState<{ type: 'verify' | 'reject' | 'suspend' | 'reactivate'; profile: BDProfile } | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionResult, setActionResult] = useState('');

  // Add Partner Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    fullName: '',
    email: '',
    username: '',
    password: 'bd' + Math.floor(1000 + Math.random() * 9000),
    phone: '',
    companyName: '',
    jobPosition: 'BD Partner',
    city: 'Colombo',
    status: 'VERIFIED' as BDStatus,
  });

  // Edit Partner Modal State
  const [editingProfile, setEditingProfile] = useState<BDProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<BDProfile>>({});

  // Delete Partner Modal State
  const [deletingProfile, setDeletingProfile] = useState<BDProfile | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filtered = bdProfiles.filter(p => {
    const matchTab = filterTab === 'all' || p.status === filterTab;
    const matchSearch = !search || p.fullName.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()) || (p.phone || '').includes(search) || (p.bdId || '').toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Partners', count: bdProfiles.length },
    { id: 'PENDING', label: 'Pending Verification', count: bdProfiles.filter(p => p.status === 'PENDING' || p.status === 'UNDER_REVIEW').length },
    { id: 'VERIFIED', label: 'Active Partners', count: bdProfiles.filter(p => p.status === 'VERIFIED').length },
    { id: 'SUSPENDED', label: 'Suspended', count: bdProfiles.filter(p => p.status === 'SUSPENDED').length },
    { id: 'REJECTED', label: 'Rejected', count: bdProfiles.filter(p => p.status === 'REJECTED').length },
  ];

  const handleAction = () => {
    if (!actionModal) return;
    const adminName = currentUser?.name || 'Admin';
    if (actionModal.type === 'verify') {
      const result = verifyBDPartner(actionModal.profile.id, adminName, notes);
      setActionResult(`Verified! BD ID: ${result.bdId} | Referral Code: ${result.referralCode}`);
    } else if (actionModal.type === 'reject') {
      if (!rejectionReason) return;
      rejectBDPartner(actionModal.profile.id, rejectionReason);
      setActionResult('Application rejected.');
    } else if (actionModal.type === 'suspend') {
      suspendBDPartner(actionModal.profile.id);
      setActionResult('Partner suspended.');
    } else if (actionModal.type === 'reactivate') {
      reactivateBDPartner(actionModal.profile.id);
      setActionResult('Partner reactivated.');
    }
    setNotes(''); setRejectionReason('');
    setTimeout(() => { setActionModal(null); setActionResult(''); }, 2000);
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.fullName || !newPartner.email || !newPartner.phone) return;
    const createdProfile = addBDPartnerDirect(newPartner);
    if (createUserDirect) {
      createUserDirect({
        name: newPartner.fullName,
        email: newPartner.email,
        role: 'business_development',
        companyName: newPartner.companyName,
        phone: newPartner.phone,
        password: newPartner.password || 'bd123',
        status: 'active',
      });
    }
    setShowAddModal(false);
    setNewPartner({
      fullName: '',
      email: '',
      username: '',
      password: 'bd' + Math.floor(1000 + Math.random() * 9000),
      phone: '',
      companyName: '',
      jobPosition: 'BD Partner',
      city: 'Colombo',
      status: 'VERIFIED',
    });
  };

  const handleStartEdit = (p: BDProfile) => {
    setEditingProfile(p);
    setEditForm({ ...p });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    updateBDProfile(editingProfile.id, editForm);
    setEditingProfile(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingProfile) return;
    deleteBDPartner(deletingProfile.id);
    if (deleteUser && deletingProfile.userId) {
      deleteUser(deletingProfile.userId);
    }
    setDeletingProfile(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD]';

  return (
    <div className="space-y-5">
      {/* Top Controls: Tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setFilterTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border flex items-center gap-1.5 ${filterTab === t.id ? 'bg-[#8B9FFD]/20 border-[#8B9FFD]/40 text-[#8B9FFD]' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'}`}
            >
              {t.label}
              <span className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[10px]">{t.count}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add BD Partner</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, BD ID..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD]"
        />
      </div>

      {/* Partners Table */}
      <div className="card-dark-gradient rounded-2xl border border-white/8 overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
            <p className="text-sm text-zinc-500">No BD partners found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold cursor-pointer"
            >
              Create First BD Partner
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8 bg-zinc-900/60">
                  {['BD ID', 'Name & Company', 'Referral Code', 'Email', 'Phone', 'City', 'Status', 'Registered', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-zinc-300">{p.bdId || '—'}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{p.fullName}</p>
                      {p.companyName && <p className="text-zinc-500 text-[10px]">{p.companyName} {p.jobPosition ? `• ${p.jobPosition}` : ''}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {p.referralCode ? (
                        <button
                          onClick={() => handleCopyCode(p.referralCode!)}
                          className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer"
                          title="Click to copy"
                        >
                          <span>{p.referralCode}</span>
                          {copiedCode === p.referralCode ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-emerald-500" />}
                        </button>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{p.email}</td>
                    <td className="px-4 py-3 text-zinc-300">{p.phone}</td>
                    <td className="px-4 py-3 text-zinc-400">{p.city || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${STATUS_CFG[p.status].bg} ${STATUS_CFG[p.status].color} ${STATUS_CFG[p.status].border}`}>
                        {STATUS_CFG[p.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* View Profile */}
                        <button onClick={() => setSelectedProfile(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer" title="View Full Profile">
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Partner */}
                        <button onClick={() => handleStartEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-[#8B9FFD] hover:text-white cursor-pointer" title="Edit Partner Details">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Verification controls */}
                        {(p.status === 'PENDING' || p.status === 'UNDER_REVIEW') && (
                          <button onClick={() => setActionModal({ type: 'verify', profile: p })} className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 cursor-pointer" title="Verify & Assign ID">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(p.status === 'PENDING' || p.status === 'UNDER_REVIEW') && (
                          <button onClick={() => setActionModal({ type: 'reject', profile: p })} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer" title="Reject">
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {p.status === 'VERIFIED' && (
                          <button onClick={() => setActionModal({ type: 'suspend', profile: p })} className="p-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 cursor-pointer" title="Suspend">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {p.status === 'SUSPENDED' && (
                          <button onClick={() => setActionModal({ type: 'reactivate', profile: p })} className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 cursor-pointer" title="Reactivate">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Partner */}
                        <button onClick={() => setDeletingProfile(p)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 cursor-pointer" title="Delete BD Partner">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW BD PARTNER (DIRECT) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-lg card-dark-gradient border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Plus className="w-4 h-4" />
                <span>Admin Direct BD Partner Creation</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newPartner.fullName}
                  onChange={e => setNewPartner({ ...newPartner, fullName: e.target.value })}
                  placeholder="e.g. Samantha Gamage"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newPartner.email}
                    onChange={e => setNewPartner({ ...newPartner, email: e.target.value })}
                    placeholder="partner@business.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.phone}
                    onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Username / Login ID</label>
                  <input
                    type="text"
                    value={newPartner.username}
                    onChange={e => setNewPartner({ ...newPartner, username: e.target.value })}
                    placeholder="e.g. bd.samantha (or use email)"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Assign Login Password *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.password}
                    onChange={e => setNewPartner({ ...newPartner, password: e.target.value })}
                    placeholder="e.g. Pass1234"
                    className={inputCls + ' font-mono text-emerald-400 font-bold'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    value={newPartner.companyName}
                    onChange={e => setNewPartner({ ...newPartner, companyName: e.target.value })}
                    placeholder="e.g. Apex Marketing"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Job Position</label>
                  <input
                    type="text"
                    value={newPartner.jobPosition}
                    onChange={e => setNewPartner({ ...newPartner, jobPosition: e.target.value })}
                    placeholder="e.g. Business Development Manager"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={newPartner.city}
                    onChange={e => setNewPartner({ ...newPartner, city: e.target.value })}
                    placeholder="Colombo"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Initial Status</label>
                  <select
                    value={newPartner.status}
                    onChange={e => setNewPartner({ ...newPartner, status: e.target.value as BDStatus })}
                    className={inputCls}
                  >
                    <option value="VERIFIED">VERIFIED (Active Partner)</option>
                    <option value="PENDING">PENDING (Review Required)</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                This will automatically generate a sequential BD ID (`BD-XXXXX`) and unique referral tracking code.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow cursor-pointer"
                >
                  Create & Activate BD Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT BD PARTNER (MODIFY) */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-lg card-dark-gradient border border-[#8B9FFD]/30 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#8B9FFD] font-bold text-sm">
                <Edit3 className="w-4 h-4" />
                <span>Edit BD Partner Details ({editingProfile.bdId || editingProfile.fullName})</span>
              </div>
              <button onClick={() => setEditingProfile(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">BD ID</label>
                  <input
                    type="text"
                    value={editForm.bdId || ''}
                    onChange={e => setEditForm({ ...editForm, bdId: e.target.value })}
                    className={inputCls + ' font-mono'}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Referral Code</label>
                  <input
                    type="text"
                    value={editForm.referralCode || ''}
                    onChange={e => setEditForm({ ...editForm, referralCode: e.target.value })}
                    className={inputCls + ' font-mono text-emerald-400'}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName || ''}
                  onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email || ''}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone || ''}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Username / Login ID</label>
                  <input
                    type="text"
                    value={editForm.username || ''}
                    onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                    placeholder="e.g. bd.user"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Reset Login Password</label>
                  <input
                    type="text"
                    value={editForm.password || ''}
                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="Set new password"
                    className={inputCls + ' font-mono text-[#8B9FFD] font-bold'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={editForm.companyName || ''}
                    onChange={e => setEditForm({ ...editForm, companyName: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Job Position</label>
                  <input
                    type="text"
                    value={editForm.jobPosition || ''}
                    onChange={e => setEditForm({ ...editForm, jobPosition: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city || ''}
                    onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Status</label>
                  <select
                    value={editForm.status || 'VERIFIED'}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value as BDStatus })}
                    className={inputCls}
                  >
                    <option value="VERIFIED">VERIFIED (Active)</option>
                    <option value="PENDING">PENDING</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Admin Notes</label>
                <textarea
                  rows={2}
                  value={editForm.adminNotes || ''}
                  onChange={e => setEditForm({ ...editForm, adminNotes: e.target.value })}
                  placeholder="Internal notes about this partner..."
                  className={inputCls + ' resize-none'}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] font-bold transition-all shadow cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE BD PARTNER CONFIRMATION */}
      {deletingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md card-dark-gradient border border-red-500/40 rounded-2xl p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-red-300 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                Delete BD Partner
              </h3>
              <button onClick={() => setDeletingProfile(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Are you sure you want to delete <strong className="text-white">{deletingProfile.fullName}</strong> ({deletingProfile.bdId || deletingProfile.email})?
            </p>
            <p className="text-[11px] text-zinc-500">
              This will remove the partner profile and unassign associated active sessions. Existing historical leads will remain intact in the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingProfile(null)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow cursor-pointer transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FULL PROFILE DETAILS */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl card-dark-gradient border border-white/15 rounded-2xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{selectedProfile.fullName}</h3>
                <p className="text-xs text-zinc-400">{selectedProfile.bdId || 'Not yet assigned'} · {selectedProfile.email}</p>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                ['Status', selectedProfile.status],
                ['BD ID', selectedProfile.bdId || '—'],
                ['Ref. Code', selectedProfile.referralCode || '—'],
                ['Phone', selectedProfile.phone],
                ['WhatsApp', selectedProfile.whatsapp || '—'],
                ['NIC', selectedProfile.nicPassport || '—'],
                ['City', selectedProfile.city || '—'],
                ['Province', selectedProfile.province || '—'],
                ['Company', selectedProfile.companyName || '—'],
                ['Position', selectedProfile.jobPosition || '—'],
                ['Industry', selectedProfile.industry || '—'],
                ['Experience', selectedProfile.experience || '—'],
                ['Monthly Refs', selectedProfile.expectedMonthlyReferrals || '—'],
                ['How heard', selectedProfile.howHeardAboutUs || '—'],
                ['Registered', new Date(selectedProfile.createdAt).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k as string} className="p-2 rounded-xl bg-zinc-900/60">
                  <p className="text-zinc-500 text-[10px] font-semibold">{k}</p>
                  <p className="text-white font-semibold mt-0.5 truncate">{v as string}</p>
                </div>
              ))}
            </div>
            {selectedProfile.previousExperience && (
              <div className="p-3 rounded-xl bg-zinc-900/60">
                <p className="text-[10px] text-zinc-500 font-semibold mb-1">Previous Experience</p>
                <p className="text-xs text-zinc-300">{selectedProfile.previousExperience}</p>
              </div>
            )}
            {selectedProfile.preferredServices && selectedProfile.preferredServices.length > 0 && (
              <div>
                <p className="text-[10px] text-zinc-500 font-semibold mb-2">Preferred Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfile.preferredServices.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedProfile.adminNotes && (
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20">
                <p className="text-[10px] text-blue-400 font-semibold mb-1">Admin Notes</p>
                <p className="text-xs text-blue-200">{selectedProfile.adminNotes}</p>
              </div>
            )}
            {selectedProfile.rejectionReason && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/20">
                <p className="text-[10px] text-red-400 font-semibold mb-1">Rejection Reason</p>
                <p className="text-xs text-red-200">{selectedProfile.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 5: VERIFY / REJECT ACTION */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {actionModal.type === 'verify' ? 'Verify Partner' : actionModal.type === 'reject' ? 'Reject Application' : actionModal.type === 'suspend' ? 'Suspend Partner' : 'Reactivate Partner'}
              </h3>
              <button onClick={() => setActionModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400">{actionModal.profile.fullName} · {actionModal.profile.email}</p>
            {actionResult ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">{actionResult}</div>
            ) : (
              <>
                {actionModal.type === 'verify' && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Admin Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] h-16 resize-none"
                      placeholder="Notes about this partner..."
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">This will auto-generate a unique BD ID and referral code.</p>
                  </div>
                )}
                {actionModal.type === 'reject' && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Rejection Reason *</label>
                    <textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-red-500 h-16 resize-none"
                      placeholder="Reason for rejection..."
                    />
                  </div>
                )}
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer">Cancel</button>
                  <button
                    onClick={handleAction}
                    className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer ${actionModal.type === 'verify' ? 'bg-emerald-600 hover:bg-emerald-500' : actionModal.type === 'reject' ? 'bg-red-600 hover:bg-red-500' : actionModal.type === 'suspend' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                  >
                    {actionModal.type === 'verify' ? 'Verify and Approve' : actionModal.type === 'reject' ? 'Reject Application' : actionModal.type === 'suspend' ? 'Suspend Partner' : 'Reactivate Partner'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
