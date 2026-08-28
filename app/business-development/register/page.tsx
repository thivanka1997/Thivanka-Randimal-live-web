'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Building2, Target, FileCheck, CheckCircle2, ArrowLeft, Briefcase, ChevronRight, Shield } from 'lucide-react';
import { useBD } from '../../../src/context/BDContext';

const SERVICES = ['Basic Website', 'Standard Website', 'Premium Website', 'Mobile Application', 'ERP System', 'Financial Dashboard', 'Other'];
const PROVINCES = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];
const INDUSTRIES = ['IT & Technology', 'Education', 'Healthcare', 'Hospitality', 'Retail', 'Manufacturing', 'Finance', 'Real Estate', 'Agriculture', 'Other'];
const HOW_HEARD = ['Social Media', 'Friend / Colleague', 'LinkedIn', 'Google Search', 'Email', 'Event / Conference', 'Other'];

export default function BDRegisterPage() {
  const { registerBDPartner } = useBD();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [form, setForm] = useState({
    fullName: '', nicPassport: '', phone: '', whatsapp: '', email: '', password: '', address: '', city: '', province: '',
    companyName: '', jobPosition: '', industry: '', experience: '', website: '', linkedin: '', facebook: '',
    previousExperience: '', expectedMonthlyReferrals: '', howHeardAboutUs: '',
    agreedToTerms: false, agreedToReferralProgram: false, agreedToPrivacyPolicy: false,
  });

  const set = (field: string, val: string | boolean) => setForm(prev => ({ ...prev, [field]: val }));

  const toggleService = (s: string) => setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = async () => {
    if (!form.agreedToTerms || !form.agreedToReferralProgram || !form.agreedToPrivacyPolicy) {
      setError('Please agree to all terms and policies before submitting.');
      return;
    }
    setSubmitting(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const result = registerBDPartner({
      fullName: form.fullName, nicPassport: form.nicPassport, phone: form.phone, whatsapp: form.whatsapp,
      email: form.email, password: form.password || 'bd123', address: form.address, city: form.city, province: form.province,
      companyName: form.companyName, jobPosition: form.jobPosition, industry: form.industry,
      experience: form.experience, website: form.website, linkedin: form.linkedin, facebook: form.facebook,
      previousExperience: form.previousExperience, preferredServices: selectedServices,
      expectedMonthlyReferrals: form.expectedMonthlyReferrals, howHeardAboutUs: form.howHeardAboutUs,
      agreedToTerms: form.agreedToTerms, agreedToReferralProgram: form.agreedToReferralProgram, agreedToPrivacyPolicy: form.agreedToPrivacyPolicy,
    });
    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.message);
    }
  };

  const STEPS = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Professional', icon: Building2 },
    { num: 3, title: 'Referral Details', icon: Target },
    { num: 4, title: 'Agreement', icon: FileCheck },
  ];

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] transition-colors';
  const labelCls = 'block text-xs font-semibold text-zinc-300 mb-1.5';

  return (
    <div className="min-h-screen bg-[#0b0d12] text-zinc-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">BD PARTNER PORTAL</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl w-full mx-auto my-8">
        {submitted ? (
          <div className="card-dark-gradient border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
              <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
                Thank you for applying to become a Business Development & Referral Partner. Our admin team will review your application and assign your unique BD ID and Referral Code.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 max-w-sm mx-auto text-xs text-zinc-400 space-y-1">
              <p className="text-white font-semibold">{form.fullName}</p>
              <p>{form.email} · {form.phone}</p>
              <p className="text-emerald-400 font-mono">Status: Pending Verification</p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors">
                Return to Home
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors flex items-center justify-center"
              >
                Access Partner Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="card-dark-gradient border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Shield className="w-3.5 h-3.5" /> Official Partnership Program
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Business Development Partner Registration
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Join our referral network. Earn up to 30% commission per successfully converted client project.
              </p>
            </div>

            {/* Step Wizard Bar */}
            <div className="grid grid-cols-4 gap-2">
              {STEPS.map(s => {
                const Icon = s.icon;
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div
                    key={s.num}
                    onClick={() => s.num < step && setStep(s.num)}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left transition-all ${
                      isActive
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                        : isPassed
                        ? 'border-emerald-500/20 bg-zinc-900/60 text-emerald-400 cursor-pointer'
                        : 'border-white/5 bg-zinc-900/30 text-zinc-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-semibold truncate hidden sm:inline">{s.title}</span>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Full Name *</label>
                    <input className={inputCls} value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="e.g. Kasun Perera" />
                  </div>
                  <div>
                    <label className={labelCls}>NIC / Passport Number *</label>
                    <input className={inputCls} value={form.nicPassport} onChange={e => set('nicPassport', e.target.value)} placeholder="e.g. 199512345678" />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address *</label>
                    <input className={inputCls} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="e.g. kasun@example.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Create Password *</label>
                    <input className={inputCls} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Set login password" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="e.g. +94 77 123 4567" />
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp Number</label>
                    <input className={inputCls} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="e.g. +94 77 123 4567" />
                  </div>
                  <div>
                    <label className={labelCls}>City *</label>
                    <input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Colombo" />
                  </div>
                  <div>
                    <label className={labelCls}>Province *</label>
                    <select className={inputCls} value={form.province} onChange={e => set('province', e.target.value)}>
                      <option value="">Select Province</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Address</label>
                    <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. 123 Galle Road, Colombo 03" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      if (!form.fullName || !form.nicPassport || !form.email || !form.phone || !form.city || !form.province) {
                        setError('Please complete all required fields (*)');
                        return;
                      }
                      setError('');
                      setStep(2);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    Next: Professional Info <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Professional */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Current Company / Business</label>
                    <input className={inputCls} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="e.g. Acme Tech Solutions" />
                  </div>
                  <div>
                    <label className={labelCls}>Job Position / Role</label>
                    <input className={inputCls} value={form.jobPosition} onChange={e => set('jobPosition', e.target.value)} placeholder="e.g. Marketing Manager" />
                  </div>
                  <div>
                    <label className={labelCls}>Industry</label>
                    <select className={inputCls} value={form.industry} onChange={e => set('industry', e.target.value)}>
                      <option value="">Select Industry</option>
                      {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Experience (Years)</label>
                    <input className={inputCls} value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 5+ Years" />
                  </div>
                  <div>
                    <label className={labelCls}>Website</label>
                    <input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <label className={labelCls}>LinkedIn Profile</label>
                    <input className={inputCls} value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => setStep(3)} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                    Next: Referral Preferences <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Referral Preferences */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Preferred Services You Plan to Refer</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {SERVICES.map(s => {
                      const sel = selectedServices.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleService(s)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                            sel
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                          }`}
                        >
                          {sel && '✓ '}{s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Expected Monthly Referrals</label>
                    <select className={inputCls} value={form.expectedMonthlyReferrals} onChange={e => set('expectedMonthlyReferrals', e.target.value)}>
                      <option value="">Select expected count</option>
                      <option value="1-3">1 - 3 Leads / Month</option>
                      <option value="4-10">4 - 10 Leads / Month</option>
                      <option value="10+">10+ Leads / Month</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>How did you hear about us?</label>
                    <select className={inputCls} value={form.howHeardAboutUs} onChange={e => set('howHeardAboutUs', e.target.value)}>
                      <option value="">Select source</option>
                      {HOW_HEARD.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Previous Referral / Sales Experience</label>
                  <textarea
                    className={inputCls + ' h-20 resize-none'}
                    value={form.previousExperience}
                    onChange={e => set('previousExperience', e.target.value)}
                    placeholder="Briefly describe any client networks or industries you specialize in..."
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => setStep(4)} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                    Next: Partner Agreement <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Agreement */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 text-xs text-zinc-400 space-y-2">
                  <h4 className="text-white font-bold">Partner Program Highlights:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Earn verified commissions ranging from 15% to 30% per won client project.</li>
                    <li>Full tracking dashboard for submitted leads, pipeline milestones, and payment disbursements.</li>
                    <li>Unique BD ID and custom referral tracking code assigned upon admin verification.</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'agreedToTerms', text: 'I agree to the Partner Terms & Conditions and Code of Conduct.' },
                    { key: 'agreedToReferralProgram', text: 'I agree to the Referral Program rules and commission payout schedule.' },
                    { key: 'agreedToPrivacyPolicy', text: 'I agree to the Data Processing and Privacy Policy.' },
                  ].map(item => (
                    <label key={item.key} className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(form[item.key as keyof typeof form])}
                        onChange={e => set(item.key, e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-emerald-500 rounded"
                      />
                      <span className="text-xs text-zinc-300">{item.text}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(3)} className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/30"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Submit BD Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="text-center pt-4 border-t border-white/10 text-xs text-zinc-500">
              Already registered?{' '}
              <Link href="/" className="text-emerald-400 hover:underline font-semibold">
                Sign In to BD Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-600 py-4">
        © {new Date().getFullYear()} Thivanka Randimal · Business Development Partner Program
      </footer>
    </div>
  );
}
