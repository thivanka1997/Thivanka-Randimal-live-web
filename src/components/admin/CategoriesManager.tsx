'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FolderKanban,
  X,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { CategoryItem } from '../../types';

export const CategoriesManager: React.FC = () => {
  const { categories, projects, addCategory, updateCategory, deleteCategory } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '📁',
    description: '',
    badgeColor: 'sky',
  });

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      slug: '',
      icon: '📁',
      description: '',
      badgeColor: 'sky',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '📁',
      description: cat.description || '',
      badgeColor: cat.badgeColor || 'sky',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    if (editingCat) {
      updateCategory(editingCat.id, {
        name: formData.name.trim(),
        slug,
        icon: formData.icon.trim() || '📁',
        description: formData.description.trim(),
        badgeColor: formData.badgeColor,
      });
    } else {
      addCategory({
        name: formData.name.trim(),
        slug,
        icon: formData.icon.trim() || '📁',
        description: formData.description.trim(),
        badgeColor: formData.badgeColor,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    const attachedCount = projects.filter((p) => p.category === id || p.category === categories.find(c => c.id === id)?.slug).length;
    if (attachedCount > 0) {
      if (!window.confirm(`Warning: ${attachedCount} project(s) are in category "${name}". Are you sure you want to delete this category?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
        return;
      }
    }
    deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900/50 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B9FFD] mb-1">
            <Layers className="w-4 h-4" />
            <span>Category Hierarchy & Filters</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Manage Portfolio & Service Categories
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Add custom project categories, define display icons, color badges, and categorize your portfolio and freelance gigs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-zinc-950 text-xs font-extrabold transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const projectCount = projects.filter(
            (p) => p.category === cat.slug || p.category === cat.id
          ).length;

          return (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 hover:border-[#8B9FFD]/30 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#8B9FFD] transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        slug: {cat.slug}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#8B9FFD]/15 text-[#8B9FFD] border border-[#8B9FFD]/20">
                    {projectCount} projects
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  ID: {cat.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#11141d] rounded-2xl border border-white/15 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#8B9FFD]" />
                <h3 className="text-lg font-bold text-white">
                  {editingCat ? 'Edit Category' : 'Create New Category'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Machine Learning"
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name: val,
                      slug: editingCat ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Icon Emoji / Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 🤖 or 🌐"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Category Slug
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ai_ml"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the systems categorized here..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-zinc-950 text-xs font-extrabold shadow-lg cursor-pointer"
                >
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
