'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Linkedin,
  Github,
  Zap,
  MessageSquare,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { ContactFormData } from '../types';

export const Contact: React.FC = () => {
  const { contactInfo } = usePortal();

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const phone1 =
    contactInfo?.phone1 ||
    (contactInfo?.phone ? contactInfo.phone.split('/')[0]?.trim() : '') ||
    '+94 77 644 0674';
  const phone2 =
    contactInfo?.phone2 ||
    (contactInfo?.phone && contactInfo.phone.includes('/')
      ? contactInfo.phone.split('/')[1]?.trim()
      : '') ||
    '+94 70 481 2213';

  const whatsappRaw = '94776440674';

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.message) {
      alert('Please fill out your Name and Message.');
      return;
    }

    setLoading(true);

    const waText = encodeURIComponent(
      `👋 Hello Thivanka!\n\n*Name:* ${formData.fullName}\n*Email:* ${
        formData.email || 'N/A'
      }\n*Subject:* ${formData.subject || 'Portfolio Inquiry'}\n\n*Message:*\n${
        formData.message
      }`
    );

    const waUrl = `https://wa.me/${whatsappRaw}?text=${waText}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(waUrl, '_blank');
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 400);
  };

  const handleSendEmail = () => {
    if (!formData.fullName || !formData.email || !formData.message) {
      alert('Please fill out all required fields (Name, Email, Message).');
      return;
    }

    setLoading(true);

    const emailSubject = encodeURIComponent(
      formData.subject || `Portfolio Contact Message from ${formData.fullName}`
    );
    const emailBody = encodeURIComponent(
      `Name: ${formData.fullName}\nSender Email: ${formData.email}\nSubject: ${
        formData.subject || 'N/A'
      }\n\nMessage:\n${formData.message}`
    );

    const mailtoUrl = `mailto:${contactInfo.email}?subject=${emailSubject}&body=${emailBody}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.location.href = mailtoUrl;
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 500);
  };

  return (
    <section
      id="contact"
      className="py-20 relative bg-[#0b0d12] scroll-mt-20 sm:scroll-mt-24 overflow-hidden w-full max-w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B9FFD]/10 border border-[#8B9FFD]/20 text-[#8B9FFD] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
                Let's <span className="text-[#8B9FFD]">Connect</span>
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                Have a project in mind, need software consulting, or want to discuss enterprise development? Reach out directly via WhatsApp, phone, or email.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3.5">
              {/* WhatsApp Direct Connect Card */}
              <a
                href={`https://wa.me/${whatsappRaw}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 transition-all flex items-center justify-between group shadow-lg cursor-pointer"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                      <span>Direct WhatsApp</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      +94 77 644 0674
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-all">
                  <span>Chat Now</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Phone Numbers Card */}
              <div className="p-4 rounded-2xl card-dark-gradient border border-white/10 space-y-2">
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 rounded-xl bg-zinc-800/80 text-[#8B9FFD] shrink-0 border border-white/10">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      Direct Phone Lines
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm font-semibold text-white mt-0.5">
                      <a
                        href={`tel:${phone1.replace(/\s+/g, '')}`}
                        className="hover:text-[#8B9FFD] font-mono transition-colors"
                      >
                        {phone1}
                      </a>
                      {phone2 && (
                        <>
                          <span className="hidden sm:inline text-zinc-500">•</span>
                          <a
                            href={`tel:${phone2.replace(/\s+/g, '')}`}
                            className="hover:text-[#8B9FFD] font-mono transition-colors text-zinc-300"
                          >
                            {phone2}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-2xl card-dark-gradient border border-white/10">
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 rounded-xl bg-zinc-800/80 text-[#8B9FFD] shrink-0 border border-white/10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      Email Address
                    </div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm font-semibold text-white hover:text-[#8B9FFD] transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-1 flex flex-wrap items-center gap-5 text-sm font-semibold text-zinc-300">
              {contactInfo.linkedinUrl && (
                <a
                  href={contactInfo.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#8B9FFD] transition-colors flex items-center gap-1.5"
                >
                  <Linkedin className="w-4 h-4 text-[#8B9FFD]" />
                  <span>LinkedIn</span>
                </a>
              )}
              {contactInfo.githubUrl && (
                <a
                  href={contactInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#8B9FFD] transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-4 h-4 text-[#8B9FFD]" />
                  <span>GitHub</span>
                </a>
              )}
              {contactInfo.fiverrUrl && (
                <a
                  href={contactInfo.fiverrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#1dbf73] transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-[#1dbf73]" />
                  <span>Fiverr</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="card-dark-gradient p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative">
              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-semibold">
                    Thank you! Your message is sent directly to{' '}
                    <span className="underline decoration-emerald-400/50">
                      +94 77 644 0674
                    </span>{' '}
                    / {contactInfo.email}.
                  </span>
                </div>
              )}

              <form onSubmit={handleSendWhatsApp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#8B9FFD] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#8B9FFD] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Subject / Project Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Website Development or ERP Project"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#8B9FFD] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your project, timeline, or requirements..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#8B9FFD] transition-colors resize-none"
                  />
                </div>

                {/* Submit Action Buttons: WhatsApp Direct & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    id="send-whatsapp-btn"
                    className="w-full py-3.5 px-4 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send to WhatsApp (077 644 0674)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={loading}
                    id="send-email-btn"
                    className="w-full py-3.5 px-4 font-bold text-[#0b0d12] bg-[#8B9FFD] hover:bg-[#a2b2ff] rounded-xl transition-all shadow-lg shadow-[#8B9FFD]/20 cursor-pointer flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via Email</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
