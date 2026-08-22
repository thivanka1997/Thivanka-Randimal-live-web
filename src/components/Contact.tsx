'use client';

import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, Globe, Linkedin, Github, Zap } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
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
      
      // Attempt to trigger default email client with pre-filled message
      window.location.href = mailtoUrl;

      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 600);
  };

  const phone1 = contactInfo?.phone1 || (contactInfo?.phone ? contactInfo.phone.split('/')[0]?.trim() : '') || '+94 70 481 2213';
  const phone2 = contactInfo?.phone2 || (contactInfo?.phone && contactInfo.phone.includes('/') ? contactInfo.phone.split('/')[1]?.trim() : '') || '+94 78 338 3075';

  return (
    <section id="contact" className="py-20 relative bg-[#0b0d12] scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Let's <span className="text-[#8B9FFD]">Connect</span>
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                Have a project in mind or looking to optimize your business operations? I'm always open to discussing new opportunities.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-zinc-800/80 text-[#8B9FFD] shrink-0 border border-white/10">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                    EMAIL
                  </div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm font-semibold text-white hover:text-[#8B9FFD] transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-zinc-800/80 text-[#8B9FFD] shrink-0 border border-white/10">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                    PHONE
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm font-semibold text-white">
                    <a
                      href={`tel:${(phone1 || '').replace(/\s+/g, '')}`}
                      className="hover:text-[#8B9FFD] transition-colors"
                    >
                      {phone1}
                    </a>
                    {phone2 && (
                      <>
                        <span className="hidden sm:inline text-zinc-500">•</span>
                        <a
                          href={`tel:${(phone2 || '').replace(/\s+/g, '')}`}
                          className="hover:text-[#8B9FFD] transition-colors"
                        >
                          {phone2}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Social Links */}
            <div className="pt-2 flex flex-wrap items-center gap-5 text-sm font-semibold text-zinc-300">
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
            <div className="card-dark-gradient p-8 rounded-2xl border border-white/10 shadow-2xl relative">
              
              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span className="text-sm font-semibold">
                    Thank you! Your message is routed directly to <span className="underline decoration-emerald-400/50">{contactInfo.email}</span>.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B9FFD] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B9FFD] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Project Inquiry"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B9FFD] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#8B9FFD] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="send-message-btn"
                  className="w-full py-3.5 px-6 font-semibold text-[#0b0d12] bg-[#8B9FFD] hover:bg-[#a2b2ff] rounded-xl transition-all shadow-lg shadow-[#8B9FFD]/20 cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
