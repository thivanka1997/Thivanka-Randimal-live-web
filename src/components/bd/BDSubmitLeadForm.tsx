'use client';
import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { useBD } from '../../context/BDContext';
import { Send, CheckCircle2 } from 'lucide-react';

interface Props { onSuccess?: () => void; }
const SERVICES = ['Basic Website', 'Standard Website', 'Premium Website', 'Mobile Application', 'ERP System', 'Financial Dashboard', 'Other'];

export const BDSubmitLeadForm: React.FC<Props> = ({ onSuccess }) => {
  const { currentUser } = usePortal();
  const { addLead, getBDProfileByUserId, findDuplicateLead } = useBD();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dupWarning, setDupWarning] = useState('');
  const [error, setError] = useState('');
  const bdProfile = currentUser ? getBDProfileByUserId(currentUser.id) : undefined;

  const [form, setForm] = useState({
    businessName: '', clientName: '', category: '', address: '', city: '',
    phone: '', whatsapp: '', email: '', website: '', facebook: '', instagram: '', googleMaps: '',
    interestedService: '', requirement: '', estimatedBudget: '', notes: '',
  });

  const set = (k: string, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (k === 'phone' || k === 'email' || k === 'businessName') {
      const dup = findDuplicateLead({
        phone: k === 'phone' ? v : form.phone,
        email: k === 'email' ? v : form.email,
        businessName: k === 'businessName' ? v : form.businessName,
      });
      setDupWarning(dup ? `Potential duplicate detected: "${dup.businessName}" (${dup.leadId})` : '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.phone) {
      setError('Business name and phone are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    addLead({
      businessName: form.businessName,
      clientName: form.clientName,
      category: form.category,
      address: form.address,
      city: form.city,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      website: form.website,
      facebook: form.facebook,
      instagram: form.instagram,
      googleMaps: form.googleMaps,
      interestedService: form.interestedService,
      requirement: form.requirement,
      estimatedBudget: form.estimatedBudget ? Number(form.estimatedBudget) : undefined,
      notes: form.notes,
      leadSource: 'BD_REFERRAL',
      leadPriority: 'MEDIUM',
      status: 'PENDING_ADMIN_REVIEW',
      referralBdId: bdProfile?.bdId,
      referralCode: bdProfile?.referralCode,
      submittedBy: currentUser?.name,
      createdBy: currentUser?.id,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (!bdProfile || bdProfile.status !== 'VERIFIED') {
    return (
      <div className="p-4 lg:p-6">
        <div className="max-w-lg mx-auto p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-center">
          <p className="text-sm font-bold text-amber-300 mb-2">Account Not Yet Verified</p>
          <p className="text-xs text-zinc-400">
            Your BD partner account is pending admin verification. Once approved, you can submit leads.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-4 lg:p-6">
        <div className="max-w-lg mx-auto p-8 rounded-2xl card-dark-gradient border border-white/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Lead Submitted!</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Your lead has been submitted for admin review. You will be notified once it is approved.
            </p>
            <p className="text-[11px] text-zinc-500 mt-2">
              Referral Code: <span className="font-mono text-emerald-400">{bdProfile.referralCode}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  businessName: '', clientName: '', category: '', address: '', city: '',
                  phone: '', whatsapp: '', email: '', website: '', facebook: '', instagram: '', googleMaps: '',
                  interestedService: '', requirement: '', estimatedBudget: '', notes: '',
                });
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white cursor-pointer"
            >
              Submit Another
            </button>
            <button
              onClick={onSuccess}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
            >
              View My Leads
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] transition-colors';
  const labelCls = 'block text-xs font-semibold text-zinc-300 mb-1.5';

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-2xl">
        <div className="mb-5">
          <h2 className="text-base font-bold text-white">Submit New Lead</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Your referral code <span className="font-mono text-emerald-400">{bdProfile.referralCode}</span> will be automatically attached.
          </p>
        </div>

        {dupWarning && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs">
            {dupWarning}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="card-dark-gradient rounded-2xl border border-white/8 p-5 space-y-4">
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Business Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Business Name *</label>
                <input className={inputCls} value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="ABC Tuition Centre" />
              </div>
              <div>
                <label className={labelCls}>Client / Contact Name</label>
                <input className={inputCls} value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Kamal Perera" />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <input className={inputCls} value={form.category} onChange={e => set('category', e.target.value)} placeholder="Education, Retail..." />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Colombo" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main Street" />
              </div>
            </div>
          </div>

          <div className="card-dark-gradient rounded-2xl border border-white/8 p-5 space-y-4">
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Contact Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Phone *</label>
                <input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+94 77 123 4567" />
              </div>
              <div>
                <label className={labelCls}>WhatsApp</label>
                <input className={inputCls} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+94 77 123 4567" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="info@business.com" />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Facebook</label>
                <input className={inputCls} value={form.facebook} onChange={e => set('facebook', e.target.value)} placeholder="facebook.com/..." />
              </div>
              <div>
                <label className={labelCls}>Instagram</label>
                <input className={inputCls} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@username" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Google Maps Link</label>
                <input className={inputCls} value={form.googleMaps} onChange={e => set('googleMaps', e.target.value)} placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>

          <div className="card-dark-gradient rounded-2xl border border-white/8 p-5 space-y-4">
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Service and Requirements</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Interested Service</label>
                <select className={inputCls} value={form.interestedService} onChange={e => set('interestedService', e.target.value)}>
                  <option value="">Select Service</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Estimated Budget (USD)</label>
                <input type="number" className={inputCls} value={form.estimatedBudget} onChange={e => set('estimatedBudget', e.target.value)} placeholder="500" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Requirements</label>
              <textarea className={inputCls + ' h-20 resize-none'} value={form.requirement} onChange={e => set('requirement', e.target.value)} placeholder="Describe what the client needs..." />
            </div>
            <div>
              <label className={labelCls}>Additional Notes</label>
              <textarea className={inputCls + ' h-16 resize-none'} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any other relevant information..." />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
