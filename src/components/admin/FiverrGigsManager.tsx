'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Edit3,
  Trash2,
  Star,
  Clock,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  X,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { FiverrGig, FiverrPackage } from '../../types';

export const FiverrGigsManager: React.FC = () => {
  const { fiverrGigs, categories, addFiverrGig, updateFiverrGig, deleteFiverrGig } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGig, setEditingGig] = useState<FiverrGig | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: 'website',
    rating: 5.0,
    reviewsCount: 24,
    badge: 'Verified Service',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
    tags: 'React, Node.js, Enterprise',
    ordersInQueue: 3,
    fiverrUrl: '',
    basic: {
      name: 'Basic',
      title: 'Starter Package',
      description: 'Core functionality setup and basic configuration.',
      price: 150,
      deliveryDays: 3,
      revisions: '2 Revisions',
      features: 'Core Setup, Responsive UI, 1 Revision',
    },
    standard: {
      name: 'Standard',
      title: 'Standard Enterprise Package',
      description: 'Complete end-to-end module implementation with database.',
      price: 350,
      deliveryDays: 7,
      revisions: '5 Revisions',
      features: 'Full Module, DB Schemas, API Endpoints, 5 Revisions',
    },
    premium: {
      name: 'Premium',
      title: 'VIP Full-Stack System',
      description: 'Comprehensive system architecture with production deployment.',
      price: 750,
      deliveryDays: 14,
      revisions: 'Unlimited Revisions',
      features: 'Full Source Code, MongoDB Atlas DB, CI/CD, Priority 24/7 Support',
    },
  });

  const handleOpenAdd = () => {
    setEditingGig(null);
    setFormData({
      title: '',
      tagline: '',
      category: categories[0]?.slug || 'website',
      rating: 5.0,
      reviewsCount: 15,
      badge: 'Top Rated',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      tags: 'Full-Stack, React, MongoDB, MERN',
      ordersInQueue: 2,
      fiverrUrl: '',
      basic: {
        name: 'Basic',
        title: 'Starter Tier',
        description: 'Single component or bug fix with documentation.',
        price: 100,
        deliveryDays: 3,
        revisions: '2 Revisions',
        features: 'Single Page, Responsive, Basic Support',
      },
      standard: {
        name: 'Standard',
        title: 'Standard Custom System',
        description: 'Full multi-page application with backend APIs.',
        price: 350,
        deliveryDays: 7,
        revisions: '5 Revisions',
        features: 'Full Features, Database Setup, API Integration',
      },
      premium: {
        name: 'Premium',
        title: 'Enterprise Architecture',
        description: 'Complete scalable SaaS/ERP platform with cloud deployment.',
        price: 850,
        deliveryDays: 14,
        revisions: 'Unlimited Revisions',
        features: 'Full System, Complete Code, Hosting Deploy, VIP Support',
      },
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (gig: FiverrGig) => {
    setEditingGig(gig);
    setFormData({
      title: gig.title,
      tagline: gig.tagline,
      category: gig.category,
      rating: gig.rating,
      reviewsCount: gig.reviewsCount,
      badge: gig.badge || '',
      image: gig.image,
      tags: gig.tags.join(', '),
      ordersInQueue: gig.ordersInQueue,
      fiverrUrl: gig.fiverrUrl || '',
      basic: {
        name: gig.packages.basic.name,
        title: gig.packages.basic.title,
        description: gig.packages.basic.description,
        price: gig.packages.basic.price,
        deliveryDays: gig.packages.basic.deliveryDays,
        revisions: gig.packages.basic.revisions,
        features: gig.packages.basic.features.join(', '),
      },
      standard: {
        name: gig.packages.standard.name,
        title: gig.packages.standard.title,
        description: gig.packages.standard.description,
        price: gig.packages.standard.price,
        deliveryDays: gig.packages.standard.deliveryDays,
        revisions: gig.packages.standard.revisions,
        features: gig.packages.standard.features.join(', '),
      },
      premium: {
        name: gig.packages.premium.name,
        title: gig.packages.premium.title,
        description: gig.packages.premium.description,
        price: gig.packages.premium.price,
        deliveryDays: gig.packages.premium.deliveryDays,
        revisions: gig.packages.premium.revisions,
        features: gig.packages.premium.features.join(', '),
      },
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please provide a service title.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      description: formData.basic.description.trim() || formData.tagline.trim(),
      startingPrice: Number(formData.basic.price) || 50,
      category: formData.category,
      rating: Number(formData.rating) || 5.0,
      reviewsCount: Number(formData.reviewsCount) || 1,
      badge: formData.badge.trim(),
      image: formData.image.trim(),
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      ordersInQueue: Number(formData.ordersInQueue) || 0,
      fiverrUrl: formData.fiverrUrl.trim(),
      packages: {
        basic: {
          name: 'Basic',
          title: formData.basic.title.trim(),
          description: formData.basic.description.trim(),
          price: Number(formData.basic.price) || 50,
          deliveryDays: Number(formData.basic.deliveryDays) || 3,
          revisions: formData.basic.revisions.trim(),
          features: formData.basic.features.split(',').map((f) => f.trim()).filter(Boolean),
        },
        standard: {
          name: 'Standard',
          title: formData.standard.title.trim(),
          description: formData.standard.description.trim(),
          price: Number(formData.standard.price) || 150,
          deliveryDays: Number(formData.standard.deliveryDays) || 7,
          revisions: formData.standard.revisions.trim(),
          features: formData.standard.features.split(',').map((f) => f.trim()).filter(Boolean),
        },
        premium: {
          name: 'Premium',
          title: formData.premium.title.trim(),
          description: formData.premium.description.trim(),
          price: Number(formData.premium.price) || 350,
          deliveryDays: Number(formData.premium.deliveryDays) || 14,
          revisions: formData.premium.revisions.trim(),
          features: formData.premium.features.split(',').map((f) => f.trim()).filter(Boolean),
        },
      },
    };

    if (editingGig) {
      updateFiverrGig(editingGig.id, payload);
    } else {
      addFiverrGig(payload);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete service "${title}"?`)) {
      deleteFiverrGig(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900/50 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Direct Client Services & Pricing Tiers</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Manage Direct Services & Packages
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Control direct service packages (Basic, Standard, Premium), pricing, delivery duration, feature checklists, and order requirements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Service</span>
        </button>
      </div>

      {/* Gigs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fiverrGigs.map((gig) => (
          <div
            key={gig.id}
            className="rounded-2xl bg-zinc-900/70 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-xl group"
          >
            <div>
              {/* Top Banner */}
              <div className="relative h-44 bg-zinc-950 overflow-hidden">
                <img
                  src={gig.image}
                  alt={gig.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white">
                    {gig.badge || 'SERVICE'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-900/80 text-zinc-300 backdrop-blur-sm border border-white/10">
                    {gig.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 text-xs flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{gig.rating.toFixed(1)}</span>
                  <span className="text-zinc-400 text-[10px]">({gig.reviewsCount})</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {gig.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {gig.tagline}
                </p>

                {/* 3 Tier Price Pill Preview */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-950/80 border border-white/5 text-center">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Basic</span>
                    <span className="text-xs font-black text-white">${gig.packages.basic.price}</span>
                  </div>
                  <div className="border-x border-white/5">
                    <span className="text-[10px] text-blue-400 block uppercase font-bold">Standard</span>
                    <span className="text-xs font-black text-blue-400">${gig.packages.standard.price}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Premium</span>
                    <span className="text-xs font-black text-purple-300">${gig.packages.premium.price}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {gig.tags.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-zinc-400 border border-white/5"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between mt-4">
              <span className="text-xs text-zinc-500 font-medium">
                {gig.ordersInQueue} Active Project Inquiries
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(gig)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Edit Service"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(gig.id, gig.title)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#11141d] rounded-2xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingGig ? 'Edit Direct Service Package' : 'Create New Direct Service'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  1. Basic Information
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Custom ERP, SaaS & Enterprise Application Development"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Short Tagline / Scope Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Enterprise modular ERP with financial ledgers, inventory, and role-based ACL."
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pro Verified / Top Rated"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Active Inquiries
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.ordersInQueue}
                      onChange={(e) => setFormData({ ...formData, ordersInQueue: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="ERP, React, MongoDB, MERN Stack, Node.js"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Package Tiers Setup */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  2. Direct Pricing Packages (Basic / Standard / Premium)
                </h4>

                {/* BASIC */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/5 space-y-3">
                  <span className="text-xs font-bold text-white uppercase block">
                    🟢 Basic Tier
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Package Title</label>
                      <input
                        type="text"
                        value={formData.basic.title}
                        onChange={(e) => setFormData({
                          ...formData,
                          basic: { ...formData.basic, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Price ($ USD)</label>
                      <input
                        type="number"
                        value={formData.basic.price}
                        onChange={(e) => setFormData({
                          ...formData,
                          basic: { ...formData.basic, price: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Delivery Days</label>
                      <input
                        type="number"
                        value={formData.basic.deliveryDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          basic: { ...formData.basic, deliveryDays: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Features (comma separated)</label>
                    <input
                      type="text"
                      value={formData.basic.features}
                      onChange={(e) => setFormData({
                        ...formData,
                        basic: { ...formData.basic, features: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                {/* STANDARD */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/5 space-y-3">
                  <span className="text-xs font-bold text-blue-400 uppercase block">
                    💎 Standard Tier (Recommended)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Package Title</label>
                      <input
                        type="text"
                        value={formData.standard.title}
                        onChange={(e) => setFormData({
                          ...formData,
                          standard: { ...formData.standard, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Price ($ USD)</label>
                      <input
                        type="number"
                        value={formData.standard.price}
                        onChange={(e) => setFormData({
                          ...formData,
                          standard: { ...formData.standard, price: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Delivery Days</label>
                      <input
                        type="number"
                        value={formData.standard.deliveryDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          standard: { ...formData.standard, deliveryDays: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Features (comma separated)</label>
                    <input
                      type="text"
                      value={formData.standard.features}
                      onChange={(e) => setFormData({
                        ...formData,
                        standard: { ...formData.standard, features: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                {/* PREMIUM */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/5 space-y-3">
                  <span className="text-xs font-bold text-purple-400 uppercase block">
                    👑 Premium VIP Tier
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Package Title</label>
                      <input
                        type="text"
                        value={formData.premium.title}
                        onChange={(e) => setFormData({
                          ...formData,
                          premium: { ...formData.premium, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Price ($ USD)</label>
                      <input
                        type="number"
                        value={formData.premium.price}
                        onChange={(e) => setFormData({
                          ...formData,
                          premium: { ...formData.premium, price: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Delivery Days</label>
                      <input
                        type="number"
                        value={formData.premium.deliveryDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          premium: { ...formData.premium, deliveryDays: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Features (comma separated)</label>
                    <input
                      type="text"
                      value={formData.premium.features}
                      onChange={(e) => setFormData({
                        ...formData,
                        premium: { ...formData.premium, features: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg cursor-pointer"
                >
                  {editingGig ? 'Save Changes' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

