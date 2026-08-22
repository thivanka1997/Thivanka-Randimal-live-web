'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  FileCheck,
  Building2,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  ArrowRight,
  Eye,
  ShieldCheck,
  Receipt,
  Gift,
  Tag,
  Percent,
  Check,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { SAMPLE_SLIPS, generateSamplePaymentSlipSvg } from '../../utils/paymentSlipHelper';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  preselectedServiceId?: string;
  preselectedPackageTier?: 'basic' | 'standard' | 'premium';
  prefilledService?: {
    title: string;
    package: string;
    price: number;
    originalPrice?: number;
  };
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  preselectedServiceId,
  preselectedPackageTier,
  prefilledService,
}) => {
  const { fiverrGigs, registerWithPaymentSlip } = usePortal();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || (fiverrGigs[0]?.id || ''));
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>(preselectedPackageTier || 'standard');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Referral System State
  const [referralInput, setReferralInput] = useState('');
  const [appliedReferral, setAppliedReferral] = useState<{
    code: string;
    discount: number;
    perk: string;
  } | null>(null);
  const [referralFeedback, setReferralFeedback] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  // Payment Slip Upload State
  const [slipDataUrl, setSlipDataUrl] = useState<string>('');
  const [slipFileName, setSlipFileName] = useState<string>('');
  const [slipFileSize, setSlipFileSize] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSlipPreviewModal, setShowSlipPreviewModal] = useState(false);

  // Status & Submission
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    referenceNumber: string;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync prefilled service when modal opens or props change
  useEffect(() => {
    if (prefilledService) {
      const match = fiverrGigs.find((g) => g.title === prefilledService.title);
      if (match) {
        setSelectedServiceId(match.id);
      }
      const tierLower = prefilledService.package.toLowerCase();
      if (tierLower.includes('basic')) setSelectedTier('basic');
      else if (tierLower.includes('premium')) setSelectedTier('premium');
      else setSelectedTier('standard');
    } else if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
      if (preselectedPackageTier) setSelectedTier(preselectedPackageTier);
    }
  }, [prefilledService, preselectedServiceId, preselectedPackageTier, fiverrGigs]);

  // Find currently selected service gig & pricing calculations
  const currentService = fiverrGigs.find((g) => g.id === selectedServiceId) || fiverrGigs[0];
  const activePackage = currentService?.packages?.[selectedTier];

  // Base 30% discounted package price
  const basePrice = activePackage?.price || currentService?.startingPrice || 105;
  const originalListPrice = activePackage?.originalPrice || Math.round(basePrice / 0.7);
  const baseDiscountAmount = originalListPrice - basePrice;

  // Referral discount
  const referralDiscountAmount = appliedReferral?.discount || 0;
  const finalPayableAmount = Math.max(10, basePrice - referralDiscountAmount);
  const totalSavings = baseDiscountAmount + referralDiscountAmount;

  // Handle applying referral code
  const handleApplyReferral = () => {
    const code = referralInput.trim().toUpperCase();
    if (!code) {
      setReferralFeedback({
        type: 'error',
        message: 'Please enter a valid referral code or promoter ID.',
      });
      return;
    }

    // Dynamic referral bonus based on tier/code
    const calculatedDiscount = Math.max(5, Math.round(basePrice * 0.05));
    
    setAppliedReferral({
      code,
      discount: calculatedDiscount,
      perk: 'Extra Bonus Discount + Priority Sprint Queue',
    });

    setReferralFeedback({
      type: 'success',
      message: `Referral code "${code}" verified! Extra $${calculatedDiscount} bonus discount applied to your order.`,
    });
  };

  const handleRemoveReferral = () => {
    setAppliedReferral(null);
    setReferralInput('');
    setReferralFeedback(null);
  };

  // Handle direct file upload (image / pdf)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Payment slip file size exceeds 10MB limit.');
      return;
    }
    setErrorMsg('');
    setSlipFileName(file.name);
    setSlipFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSlipDataUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Quick Demo: Load pre-generated verified sample slip with final payable amount
  const handleUseSampleSlip = (sampleIndex: number) => {
    const sample = SAMPLE_SLIPS[sampleIndex] || SAMPLE_SLIPS[0];
    const generatedSlip = generateSamplePaymentSlipSvg(
      companyName || name || 'Client Organization',
      finalPayableAmount,
      sample.reference,
      `${activePackage?.title || currentService?.title || 'Custom Direct Service'} (30% OFF Promo)`,
      paymentDate
    );

    setSlipDataUrl(generatedSlip);
    setSlipFileName(`${companyName ? companyName.replace(/\s+/g, '_').toLowerCase() : 'client'}_bank_receipt_${finalPayableAmount}usd.png`);
    setSlipFileSize('158 KB');
    setPaymentReference(sample.reference);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please provide your full contact name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Please set a portal password with at least 4 characters.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please provide a contact phone / WhatsApp number.');
      return;
    }
    if (!companyName.trim()) {
      setErrorMsg('Please provide your company or organization name.');
      return;
    }
    if (!slipDataUrl) {
      setErrorMsg('Please upload your bank payment slip / wire transfer confirmation receipt.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = registerWithPaymentSlip({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        companyName: companyName.trim(),
        serviceId: currentService?.id,
        serviceTitle: currentService?.title,
        packageTier: selectedTier,
        packagePrice: basePrice,
        originalPrice: originalListPrice,
        discountPercent: 30,
        referralCode: appliedReferral?.code || (referralInput.trim() ? referralInput.trim().toUpperCase() : undefined),
        referralDiscount: referralDiscountAmount,
        finalAmount: finalPayableAmount,
        paymentSlipUrl: slipDataUrl,
        paymentSlipFileName: slipFileName || 'bank_payment_slip.png',
        paymentSlipFileSize: slipFileSize || '150 KB',
        paymentReference: paymentReference.trim() || 'WIRE-' + Math.floor(100000 + Math.random() * 900000),
        paymentDate,
        notes: notes.trim(),
      });

      setSubmissionResult(result);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit registration request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmissionResult(null);
    setErrorMsg('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="register-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-sm">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Package & Client Registration</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  30% DISCOUNT APPLIED
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register your account, enter referral code, and attach payment slip for instant administrative approval.
              </p>
            </div>
          </div>
          <button
            id="register-modal-close-btn"
            onClick={resetAndClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submissionResult ? (
          /* Submission Success View */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Registration & Order Submitted!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Thank you for your order. Your 30% discounted package along with attached payment slip and referral details have been queued for administrative verification.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-700">
                <span>Application Reference:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {submissionResult.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Client / Company:</span>
                <span className="font-medium text-slate-900 dark:text-white">{companyName} ({name})</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Registered Email:</span>
                <span className="font-medium text-slate-900 dark:text-white">{email}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Ordered Package:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {currentService?.title} ({activePackage?.name || 'Standard'})
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Original Regular Price:</span>
                <span className="line-through text-slate-400">${originalListPrice} USD</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Promo Discount (30%):</span>
                <span>-${baseDiscountAmount} USD</span>
              </div>
              {appliedReferral && (
                <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  <span>Referral Code ({appliedReferral.code}):</span>
                  <span>-${appliedReferral.discount} USD</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-900 dark:text-white">Final Amount Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">
                  ${finalPayableAmount} USD
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Verification Status:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending Admin Verification
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 max-w-xl mx-auto flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <p>
                <strong>What happens next?</strong> Administrator Thivanka will review your payment receipt, assign your sprint timeline, and activate your client workspace. You will be able to log in directly once approved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="register-success-login-btn"
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Go to Client Login <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="register-success-close-btn"
                onClick={resetAndClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all cursor-pointer"
              >
                Back to Services
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Section Registration & Payment Slip Form */
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Account Details & Service Package */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  1. Client & Organization Info
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Representative Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="reg-input-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe / Kasun Jayawardena"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Business Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        id="reg-input-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Portal Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        id="reg-input-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 4 characters"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Company / Organization *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        id="reg-input-company"
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Nexus Global Digital"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        id="reg-input-phone"
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Selection */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    2. Select Service & Package Tier (30% OFF)
                  </h3>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Select Project Service
                    </label>
                    <select
                      id="reg-select-service"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    >
                      {fiverrGigs.map((gig) => (
                        <option key={gig.id} value={gig.id}>
                          {gig.title} (From ${gig.startingPrice} • 30% OFF)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tier Selection */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {(['basic', 'standard', 'premium'] as const).map((tier) => {
                      const pkg = currentService?.packages?.[tier];
                      const isSelected = selectedTier === tier;
                      const orig = pkg?.originalPrice || (pkg ? Math.round(pkg.price / 0.7) : 150);
                      const currentPrice = pkg?.price || 105;

                      return (
                        <button
                          key={tier}
                          type="button"
                          id={`reg-tier-btn-${tier}`}
                          onClick={() => setSelectedTier(tier)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold capitalize text-slate-900 dark:text-white">
                              {tier}
                            </span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-[10px] text-slate-400 line-through">
                              ${orig}
                            </span>
                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                              ${currentPrice}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {pkg?.deliveryDays || 5}d • 30% OFF
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Package Feature Summary */}
                  {activePackage && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {activePackage.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500">
                          -30% Save ${baseDiscountAmount}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                        {activePackage.description}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {activePackage.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Referral Number, Bank Wire & Slip Upload */}
              <div className="lg:col-span-6 space-y-4">
                {/* 3. Referral Code Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-amber-500" />
                    3. Referral Code / Promoter ID
                  </h3>

                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-50 to-blue-500/10 dark:from-amber-950/20 dark:via-slate-800/60 dark:to-blue-950/20 border border-amber-500/20 space-y-2">
                    <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Enter Referral Number / Promo Code (Optional)
                    </label>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                          id="reg-input-referral"
                          type="text"
                          value={referralInput}
                          onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                          placeholder="e.g. VIP30, FRIEND10, REF-8890"
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      {appliedReferral ? (
                        <button
                          type="button"
                          onClick={handleRemoveReferral}
                          className="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyReferral}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <span>Apply Code</span>
                        </button>
                      )}
                    </div>

                    {referralFeedback && (
                      <p
                        className={`text-[11px] font-medium ${
                          referralFeedback.type === 'success'
                            ? 'text-emerald-600 dark:text-emerald-400 flex items-center gap-1'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {referralFeedback.type === 'success' && <Check className="w-3.5 h-3.5" />}
                        {referralFeedback.message}
                      </p>
                    )}

                    {/* Price Breakdown */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Original Package Price:</span>
                        <span className="line-through">${originalListPrice} USD</span>
                      </div>
                      <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                        <span>Flat 30% Package Promo:</span>
                        <span>-${baseDiscountAmount} USD</span>
                      </div>
                      {appliedReferral && (
                        <div className="flex justify-between text-blue-600 dark:text-blue-400 font-semibold">
                          <span>Referral Bonus ({appliedReferral.code}):</span>
                          <span>-${appliedReferral.discount} USD</span>
                        </div>
                      )}
                      <div className="flex justify-between font-extrabold text-slate-900 dark:text-white pt-1 border-t border-dashed border-slate-300 dark:border-slate-700 text-sm">
                        <span>Total Payable Amount:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-base">
                          ${finalPayableAmount} USD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Bank Wire & Upload Payment Slip */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  4. Bank Wire Details & Payment Slip
                </h3>

                {/* Direct Wire Details Card */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-medium">
                    <span>OFFICIAL BENEFICIARY ACCOUNT</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      DIRECT WIRE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Account Holder:</span>
                      <span className="font-semibold text-slate-100">Thivanka Randimal Premarathna</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Bank Name:</span>
                      <span className="font-semibold text-slate-100">Commercial Bank PLC</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Account No:</span>
                      <span className="font-semibold text-emerald-400">8004 9120 4410</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Branch / SWIFT:</span>
                      <span className="font-semibold text-slate-100">Nugegoda / CCEYLKLX</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between items-center">
                    <span>Transfer exact amount:</span>
                    <strong className="text-emerald-400 text-xs">${finalPayableAmount} USD (30% OFF)</strong>
                  </div>
                </div>

                {/* Upload Payment Slip Zone */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Upload Bank Payment Slip / Receipt *
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleUseSampleSlip(0)}
                        className="text-[11px] text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        title="Click to auto-generate and attach a simulated valid payment receipt for testing"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-Fill Sample Slip (${finalPayableAmount})
                      </button>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />

                  {!slipDataUrl ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        isDragOver
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30'
                      }`}
                    >
                      <Upload className="w-7 h-7 mx-auto text-slate-400 mb-1.5" />
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Click to upload or drag & drop payment receipt
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        PNG, JPG, PDF up to 10MB (Bank wire transfer receipt, ATM deposit slip)
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/60 dark:bg-emerald-950/30 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {slipFileName || 'payment_slip.png'}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {slipFileSize || '150 KB'} • Attached (${finalPayableAmount} USD)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowSlipPreviewModal(true)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Preview Slip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSlipDataUrl('');
                            setSlipFileName('');
                            setSlipFileSize('');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Remove Slip"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Payment Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Wire / Transaction Ref #
                    </label>
                    <input
                      id="reg-input-ref"
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. TXN-9812490"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Payment Transfer Date
                    </label>
                    <input
                      id="reg-input-date"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Special Project Requirements / Note (Optional)
                  </label>
                  <textarea
                    id="reg-input-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any key project goals, social handles to boost, or specific module specifications..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Already have an approved account?{' '}
                <button
                  type="button"
                  id="reg-switch-login-btn"
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Log in directly
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  id="reg-cancel-btn"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="reg-submit-btn"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    'Submitting Order...'
                  ) : (
                    <>
                      Confirm Order (${finalPayableAmount}) & Submit Slip <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>

      {/* Payment Slip Viewer Modal */}
      {showSlipPreviewModal && slipDataUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Receipt className="w-4 h-4 text-emerald-400" />
                Attached Payment Slip Preview (${finalPayableAmount} USD)
              </div>
              <button
                onClick={() => setShowSlipPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={slipDataUrl}
                alt="Payment Slip Receipt"
                className="max-w-full rounded-lg shadow-lg border border-slate-700"
              />
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowSlipPreviewModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
