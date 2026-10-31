'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  RefreshCw,
  Shield,
  ArrowRight,
  Zap,
  ShoppingBag,
  SlidersHorizontal,
  CreditCard,
  Tag,
  Gift,
  Flame,
  Mail,
  MessageCircle,
  Percent,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { FiverrGig, FiverrPackage } from '../types';

interface FiverrGigsProps {
  onOpenContact?: () => void;
  onOpenLoginModal?: () => void;
  onOpenRegisterModal?: (serviceDetails?: {
    title: string;
    package: string;
    price: number;
    originalPrice?: number;
  }) => void;
}

export const FiverrGigs: React.FC<FiverrGigsProps> = ({
  onOpenContact,
  onOpenLoginModal,
  onOpenRegisterModal,
}) => {
  const { fiverrGigs, categories, contactInfo } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackageTier, setSelectedPackageTier] = useState<Record<string, 'basic' | 'standard' | 'premium'>>({});

  const filteredGigs = selectedCategory === 'all'
    ? fiverrGigs
    : fiverrGigs.filter((g) => g.category === selectedCategory);

  const getTierDiscount = (tierKey: 'basic' | 'standard' | 'premium', pkg?: FiverrPackage): number => {
    if (tierKey === 'basic') return pkg?.discountPercent || 20;
    if (tierKey === 'standard') return pkg?.discountPercent || 25;
    if (tierKey === 'premium') return pkg?.discountPercent || 30;
    return 25;
  };

  const getActivePackage = (gig: FiverrGig): FiverrPackage => {
    const tier = selectedPackageTier[gig.id] || 'standard';
    return gig.packages[tier] || gig.packages.basic;
  };

  const handleTierSelect = (gigId: string, tier: 'basic' | 'standard' | 'premium') => {
    setSelectedPackageTier((prev) => ({ ...prev, [gigId]: tier }));
  };

  const handleContactForGig = (gig: FiverrGig, tierKey: 'basic' | 'standard' | 'premium') => {
    const pkg = gig.packages[tierKey] || gig.packages.basic;
    const discount = getTierDiscount(tierKey, pkg);

    if (onOpenContact) {
      onOpenContact();
    } else {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Find subject input in contact form if present
        const subjectInput = el.querySelector('input[name="subject"]') as HTMLInputElement | null;
        if (subjectInput) {
          subjectInput.value = `Inquiry: ${gig.title} (${pkg.name} Package - ${discount}% OFF)`;
        }
      }
    }
  };

  const whatsappNumber = (contactInfo?.phone1 || contactInfo?.phone || '+94776440674').replace(/[^0-9]/g, '');

  return (
    <section id="services" className="py-24 relative bg-[#07090e]/70 border-t border-white/5 scroll-mt-20 sm:scroll-mt-24 overflow-hidden w-full max-w-full">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top Tiered Promo Notice Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-blue-500/15 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                  Limited Time Promo
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Special Discounts: 20% OFF Basic • 25% OFF Standard • 30% OFF Premium
                </h3>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Contact us for customized quotes with tiered discount savings applied. We build tailored enterprise web systems, dashboards, ERPs, and marketing packages.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('contact');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-md hover:scale-105 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-slate-950" />
            <span>Contact Us for Pricing & Quote</span>
          </a>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Direct Client Services & Discount Packages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Software Development, Data Analytics & Social Media Packages
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mt-2 leading-relaxed">
              Tailored custom websites, MERN web applications, Power BI & Excel dashboards, LMS academies, enterprise ERPs, and viral Facebook, Instagram & TikTok boost packages. Contact us for custom scope and discounted pricing.
            </p>
          </div>

          {/* Quick Contact Button */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us For Quote</span>
            </a>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-white/10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
            }`}
          >
            <span>✨</span>
            <span>All Services</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {fiverrGigs.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = fiverrGigs.filter((g) => g.category === cat.slug).length;
            if (count === 0) return null;
            const isActive = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredGigs.map((gig) => {
            const currentTierKey = selectedPackageTier[gig.id] || 'standard';
            const pkg = getActivePackage(gig);
            const currentDiscount = getTierDiscount(currentTierKey, pkg);

            return (
              <div
                key={gig.id}
                className="bg-gradient-to-b from-[#11141d] to-[#0c0e15] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 shadow-xl group"
              >
                <div>
                  {/* Image & Header Overlay */}
                  <div className="relative h-56 overflow-hidden bg-zinc-900">
                    <img loading="lazy" decoding="async"
                      src={gig.image || '/assets/images/student_portal_1785315995029.jpg'}
                      alt={gig.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/student_portal_1785315995029.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11141d] via-[#11141d]/40 to-transparent" />

                    {/* Badge top-left */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-rose-600 text-white shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        20% - 30% OFF
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-900/90 backdrop-blur-md text-zinc-300 border border-white/10">
                        {gig.category.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>

                    {/* Rating top-right */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{gig.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-zinc-500">|</span>
                      <span className="text-zinc-400 text-[11px]">({gig.reviewsCount} reviews)</span>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-blue-400 transition-colors drop-shadow-md">
                        {gig.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-5">
                    {/* Short Tagline */}
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {gig.tagline}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {gig.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800/80 text-zinc-300 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 3-Tier Package Switcher */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                          Select Package Tier:
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {currentDiscount}% Promo Available
                        </span>
                      </div>

                      {/* Package Tabs */}
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-white/5">
                        {(['basic', 'standard', 'premium'] as const).map((tierKey) => {
                          const currentPkg = gig.packages[tierKey];
                          if (!currentPkg) return null;
                          const isSelected = currentTierKey === tierKey;
                          const discount = getTierDiscount(tierKey, currentPkg);

                          return (
                            <button
                              key={tierKey}
                              type="button"
                              onClick={() => handleTierSelect(gig.id, tierKey)}
                              className={`py-2 px-1.5 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                isSelected
                                  ? 'bg-blue-600 text-white font-bold shadow-md'
                                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                              }`}
                            >
                              <span className="text-[10px] uppercase tracking-wider font-extrabold">
                                {currentPkg.name}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : tierKey === 'premium'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : tierKey === 'standard'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {discount}% OFF
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Package Details Card */}
                      <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              {pkg.title}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                              {pkg.description}
                            </p>
                          </div>
                          <div className="sm:text-right shrink-0 bg-zinc-800/60 sm:bg-transparent p-2.5 sm:p-0 rounded-lg sm:rounded-none border border-white/5 sm:border-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                                Pricing
                              </span>
                              <span className="text-sm sm:text-base font-black text-emerald-400 block">
                                Contact Us
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 mt-0.5 inline-block">
                              {currentDiscount}% OFF Promo
                            </span>
                          </div>
                        </div>

                        {/* Delivery & Revisions */}
                        <div className="flex items-center gap-4 text-xs text-zinc-300 pt-1 border-t border-white/5">
                          <div className="flex items-center gap-1 text-zinc-300">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span>{pkg.deliveryDays} Days Delivery</span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-300">
                            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                            <span>{pkg.revisions}</span>
                          </div>
                        </div>

                        {/* Included Features List */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                            Included in this package:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {pkg.features.map((feat, fIdx) => (
                              <div
                                key={fIdx}
                                className="flex items-center gap-1.5 text-[11px] text-zinc-300"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span className="line-clamp-1">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleContactForGig(gig, currentTierKey)}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Us • Claim {currentDiscount}% OFF</span>
                  </button>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hi Thivanka, I am interested in ${gig.title} (${pkg.name} Package with ${currentDiscount}% OFF). Could you please provide a custom pricing quotation?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all border border-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Referral & Inquiries Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-blue-950/30 to-zinc-900/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Looking for Custom Solutions or Enterprise Architecture?
              </h4>
              <p className="text-xs text-zinc-400 max-w-xl">
                Get in touch directly to discuss your enterprise requirements, get milestone estimates, and unlock tiered discount savings on full development sprints.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('contact');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
          >
            <span>Contact Us for Custom Pricing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};


