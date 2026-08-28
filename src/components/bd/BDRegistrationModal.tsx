'use client';

import React, { useState } from 'react';
import { X, User, Building2, Target, FileCheck, CheckCircle2, ArrowRight, ArrowLeft, Briefcase, ChevronRight } from 'lucide-react';
import { useBD } from '../../context/BDContext';
import { BDProfile } from '../../types';

interface BDRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

const SERVICES = ['Basic Website', 'Standard Website', 'Premium Website', 'Mobile Application', 'ERP System', 'Financial Dashboard', 'Other'];
const PROVINCES = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];
const INDUSTRIES = ['IT & Technology', 'Education', 'Healthcare', 'Hospitality', 'Retail', 'Manufacturing', 'Finance', 'Real Estate', 'Agriculture', 'Other'];
const HOW_HEARD = ['Social Media', 'Friend / Colleague', 'LinkedIn', 'Google Search', 'Email', 'Event / Conference', 'Other'];

export const BDRegistrationModal: React.FC<BDRegistrationModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
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
    if (result.success) { setSubmitted(true); }
    else { setError(result.message); }
  };

  if (!isOpen) return null;

  const steps = [
    { num: 1, label: 'Personal', icon: User },
    { num: 2, label: 'Professional', icon: Building2 },
    { num: 3, label: 'Referral', icon: Target },
    { num: 4, label: 'Agreement', icon: FileCheck },
  ];

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD] transition-colors';
  const labelCls = 'block text-xs font-semibold text-zinc-300 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl card-dark-gradient border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8 text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">BD Partner Registration</h3>
              <p className="text-xs text-zinc-400">Business Development Referral Program</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        {!submitted && (
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/40 border-b border-white/5">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s.num ? 'bg-emerald-500 text-white' : step > s.num ? 'bg-emerald-500/30 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${step === s.num ? 'text-emerald-400' : step > s.num ? 'text-zinc-400' : 'text-zinc-600'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-px mx-2 ${step > s.num ? 'bg-emerald-500/40' : 'bg-white/8'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="p-6">
          {/* SUCCESS */}
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">Your Business Development Partner application has been submitted successfully. Our team will review your information and contact you within 2–3 business days.</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-left space-y-2">
                <p className="text-xs font-bold text-emerald-400">What happens next?</p>
                <div className="space-y-1 text-xs text-zinc-300">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Application review (1–2 business days)</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Admin verification & approval</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Receive BD ID + unique referral code via email</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Access your BD Partner dashboard</div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-all cursor-pointer">Close</button>
                {onSwitchToLogin && <button onClick={onSwitchToLogin} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1">Login <ArrowRight className="w-3.5 h-3.5" /></button>}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">{error}</div>}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Personal Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className={labelCls}>Full Name *</label><input className={inputCls} value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Kasun Perera" /></div>
                    <div><label className={labelCls}>NIC / Passport</label><input className={inputCls} value={form.nicPassport} onChange={e => set('nicPassport', e.target.value)} placeholder="990123456V" /></div>
                    <div><label className={labelCls}>Phone *</label><input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+94 77 123 4567" /></div>
                    <div><label className={labelCls}>WhatsApp</label><input className={inputCls} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+94 77 123 4567" /></div>
                    <div><label className={labelCls}>Email Address *</label><input className={inputCls} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="kasun@example.com" /></div>
                    <div><label className={labelCls}>Create Password *</label><input className={inputCls} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Set login password" /></div>
                    <div className="sm:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main Street" /></div>
                    <div><label className={labelCls}>City</label><input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Colombo" /></div>
                    <div>
                      <label className={labelCls}>Province</label>
                      <select className={inputCls} value={form.province} onChange={e => set('province', e.target.value)}>
                        <option value="">Select Province</option>
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => { if (!form.fullName || !form.phone || !form.email) { setError('Please fill in required fields (Name, Phone, Email).'); return; } setError(''); setStep(2); }} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all">Next <ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Professional Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className={labelCls}>Company Name</label><input className={inputCls} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="ABC Solutions Pvt Ltd" /></div>
                    <div><label className={labelCls}>Job Position</label><input className={inputCls} value={form.jobPosition} onChange={e => set('jobPosition', e.target.value)} placeholder="Sales Manager" /></div>
                    <div>
                      <label className={labelCls}>Industry</label>
                      <select className={inputCls} value={form.industry} onChange={e => set('industry', e.target.value)}>
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Years of Experience</label>
                      <select className={inputCls} value={form.experience} onChange={e => set('experience', e.target.value)}>
                        <option value="">Select</option>
                        {['Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years'].map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div><label className={labelCls}>Website</label><input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yoursite.com" /></div>
                    <div><label className={labelCls}>LinkedIn</label><input className={inputCls} value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/..." /></div>
                    <div className="sm:col-span-2"><label className={labelCls}>Facebook</label><input className={inputCls} value={form.facebook} onChange={e => set('facebook', e.target.value)} placeholder="facebook.com/..." /></div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <button onClick={() => { setError(''); setStep(3); }} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all">Next <ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Referral Information</p>
                  <div>
                    <label className={labelCls}>Previous Sales / Referral Experience</label>
                    <textarea className={inputCls + ' h-20 resize-none'} value={form.previousExperience} onChange={e => set('previousExperience', e.target.value)} placeholder="Describe your sales or referral experience..." />
                  </div>
                  <div>
                    <label className={labelCls}>Preferred Services to Refer</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {SERVICES.map(s => (
                        <button key={s} type="button" onClick={() => toggleService(s)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${selectedServices.includes(s) ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Expected Monthly Referrals</label>
                      <select className={inputCls} value={form.expectedMonthlyReferrals} onChange={e => set('expectedMonthlyReferrals', e.target.value)}>
                        <option value="">Select</option>
                        {['1–2','3–5','6–10','10+'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>How did you hear about us?</label>
                      <select className={inputCls} value={form.howHeardAboutUs} onChange={e => set('howHeardAboutUs', e.target.value)}>
                        <option value="">Select</option>
                        {HOW_HEARD.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <button onClick={() => { setError(''); setStep(4); }} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all">Next <ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Agreement & Consent</p>
                  <div className="space-y-3">
                    {[
                      { key: 'agreedToTerms', label: 'Terms & Conditions', desc: 'I agree to the BD Partner Terms & Conditions including code of conduct, lead handling responsibilities, and compliance requirements.' },
                      { key: 'agreedToReferralProgram', label: 'Referral Program Agreement', desc: 'I agree to the Referral Program Agreement including commission structure, payment terms, and referral attribution policies.' },
                      { key: 'agreedToPrivacyPolicy', label: 'Privacy Policy', desc: 'I agree to the Privacy Policy and consent to the collection and processing of my personal data for business purposes.' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} onClick={() => set(key, !(form as any)[key])} className={`p-4 rounded-2xl border cursor-pointer transition-all ${(form as any)[key] ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-zinc-900/60 border-white/8 hover:border-white/15'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${(form as any)[key] ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                            {(form as any)[key] && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{label} *</p>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] text-zinc-400">
                    By submitting this application, your information will be reviewed by our team. Status: <span className="text-amber-400 font-bold">PENDING VERIFICATION</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button onClick={() => setStep(3)} className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60">
                      {submitting ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <><span>Submit Application</span><ChevronRight className="w-3.5 h-3.5" /></>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!submitted && onSwitchToLogin && (
          <div className="px-6 pb-5 text-center">
            <span className="text-xs text-zinc-500">Already registered? </span>
            <button onClick={onSwitchToLogin} className="text-xs text-emerald-400 font-semibold hover:text-emerald-300 cursor-pointer">Sign in here</button>
          </div>
        )}
      </div>
    </div>
  );
};
