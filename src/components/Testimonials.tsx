'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  ArrowRight,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Testimonial } from '../types';

interface TestimonialsProps {
  onOpenContact?: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onOpenContact }) => {
  const { testimonials, addTestimonial } = usePortal();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form for leaving a review
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    company: '',
    rating: 5,
    quote: '',
    projectType: 'Website',
  });
  const [submittedReview, setSubmittedReview] = useState(false);

  const categories = ['All', 'ERP System', 'Website', 'Application', 'Financial Dashboard'];

  const filteredTestimonials = testimonials.filter(
    (t) => selectedFilter === 'All' || t.projectType?.toLowerCase().includes(selectedFilter.toLowerCase())
  );

  const totalReviews = testimonials.length;
  const averageRating =
    totalReviews > 0
      ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || filteredTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, filteredTestimonials.length]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedFilter]);

  const handlePrev = () => {
    if (filteredTestimonials.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (filteredTestimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.quote) return;

    const initials = reviewForm.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'CL';

    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#0ea5e9', '#14b8a6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    addTestimonial({
      name: reviewForm.name,
      role: reviewForm.role || 'Client',
      company: reviewForm.company || 'Enterprise Client',
      rating: reviewForm.rating,
      quote: reviewForm.quote,
      projectType: reviewForm.projectType,
      avatarInitials: initials,
      avatarColor: randomColor,
      date: 'Just now',
      featured: false,
    });

    setSubmittedReview(true);
    setTimeout(() => {
      setSubmittedReview(false);
      setShowReviewModal(false);
      setReviewForm({
        name: '',
        role: '',
        company: '',
        rating: 5,
        quote: '',
        projectType: 'Website',
      });
    }, 1800);
  };

  return (
    <section id="testimonials" className="py-24 relative bg-[#0b0d12] scroll-mt-20 sm:scroll-mt-24 overflow-hidden w-full max-w-full">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[400px] bg-gradient-to-tr from-[#8B9FFD]/15 via-indigo-600/10 to-teal-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-80 max-w-full h-80 bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B9FFD]/10 border border-[#8B9FFD]/25 text-[#8B9FFD] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Reviews & Verified Endorsements</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            What Clients Say About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B9FFD] via-indigo-300 to-teal-300">
              My Engineering
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Real feedback from enterprise partners, startups, and business owners on ERP deployments, web systems, and custom SaaS platforms.
          </p>

          {/* Social Proof Stats Bar */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-zinc-300">
            <div className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-2xl border border-white/5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white text-sm">{averageRating} / 5.0</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">{totalReviews} Verified Client Reviews</span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-2xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-zinc-300">100% On-Time Project Delivery</span>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Leave Feedback</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === category
                  ? 'bg-gradient-to-r from-[#8B9FFD] to-[#607afb] text-[#0b0d12] shadow-lg shadow-[#8B9FFD]/20 scale-105'
                  : 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Testimonials Auto-Scrolling Carousel Grid */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {filteredTestimonials.length === 0 ? (
            <div className="card-dark-gradient p-12 rounded-3xl border border-white/10 text-center text-zinc-500">
              No reviews under this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Display dynamic slice or carousel items */}
              {filteredTestimonials.map((testimonial, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={testimonial.id}
                    className={`card-dark-gradient rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-500 relative group overflow-hidden ${
                      isActive
                        ? 'border-[#8B9FFD]/50 shadow-2xl shadow-[#8B9FFD]/10 bg-indigo-950/20 scale-[1.02]'
                        : 'border-white/10 hover:border-white/20 hover:shadow-xl'
                    }`}
                  >
                    {/* Top ambient hover accent */}
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#8B9FFD]/10 rounded-full blur-2xl group-hover:bg-[#8B9FFD]/25 transition duration-500" />

                    {/* Card Content Top */}
                    <div className="space-y-4 relative z-10">
                      {/* Header with Stars & Tag */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-zinc-700 text-zinc-700'
                              }`}
                            />
                          ))}
                        </div>

                        {testimonial.projectType && (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                            {testimonial.projectType}
                          </span>
                        )}
                      </div>

                      {/* Quote Text */}
                      <div className="relative">
                        <Quote className="w-8 h-8 text-[#8B9FFD]/20 absolute -top-2 -left-2 pointer-events-none" />
                        <p className="text-zinc-200 text-sm sm:text-[13.5px] leading-relaxed pt-2 relative z-10 italic">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>

                    {/* Card Content Bottom: Client Profile Info */}
                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/15"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md"
                            style={{ backgroundColor: testimonial.avatarColor || '#6366f1' }}
                          >
                            {testimonial.avatarInitials || testimonial.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        {/* Name & Role */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white group-hover:text-[#8B9FFD] transition-colors">
                              {testimonial.name}
                            </h4>
                            <span title="Verified Client">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            {testimonial.role} • <span className="text-zinc-300 font-semibold">{testimonial.company}</span>
                          </p>
                        </div>
                      </div>

                      {testimonial.date && (
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                          {testimonial.date}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Carousel Navigation Buttons & Dots */}
          {filteredTestimonials.length > 3 && (
            <div className="flex items-center justify-between mt-10 pt-4">
              <div className="flex items-center gap-2">
                {filteredTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === i
                        ? 'w-8 bg-[#8B9FFD]'
                        : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-[#8B9FFD]/40 transition-all cursor-pointer active:scale-95"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-[#8B9FFD]/40 transition-all cursor-pointer active:scale-95"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 card-dark-gradient rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ready to build your next enterprise solution?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Let's collaborate on your next ERP system, web portal, or custom software deliverable with high engineering standards.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B9FFD] to-[#607afb] hover:from-[#9fb1ff] hover:to-[#738dfc] text-[#0b0d12] font-black text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-[#8B9FFD]/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="relative w-full max-w-lg card-dark-gradient border border-white/15 rounded-3xl p-6 sm:p-8 text-left shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-[#8B9FFD]" />
                  <span>Submit Client Feedback</span>
                </h3>
                <p className="text-xs text-zinc-400">Share your experience working with Thivanka Randimal</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {submittedReview ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Your review has been successfully added to the portfolio testimonials.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder="e.g. Rajith Perera"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B9FFD]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-300 mb-1.5">Your Role</label>
                    <input
                      type="text"
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      placeholder="e.g. Managing Director"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B9FFD]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-zinc-300 mb-1.5">Company / Organization</label>
                    <input
                      type="text"
                      value={reviewForm.company}
                      onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                      placeholder="e.g. ABC Group"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B9FFD]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-300 mb-1.5">Project Type</label>
                    <select
                      value={reviewForm.projectType}
                      onChange={(e) => setReviewForm({ ...reviewForm, projectType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                    >
                      <option value="ERP System">ERP System</option>
                      <option value="Website">Website</option>
                      <option value="Application">Application</option>
                      <option value="Financial Dashboard">Financial Dashboard</option>
                    </select>
                  </div>
                </div>

                {/* Rating Picker */}
                <div>
                  <label className="block font-bold text-zinc-300 mb-1.5">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-zinc-800 text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-zinc-400 font-bold ml-2">{reviewForm.rating} Stars</span>
                  </div>
                </div>

                {/* Quote / Review Text */}
                <div>
                  <label className="block font-bold text-zinc-300 mb-1.5">Your Review / Endorsement *</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewForm.quote}
                    onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                    placeholder="Describe your experience, quality of deliverables, timeline, and results..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#8B9FFD] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B9FFD] to-[#607afb] text-[#0b0d12] font-black shadow-lg shadow-[#8B9FFD]/20 transition-all hover:scale-105 cursor-pointer"
                  >
                    Post Endorsement
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
