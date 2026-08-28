'use client';

import React, { useState } from 'react';
import {
  FileText,
  User,
  Award,
  Briefcase,
  Cpu,
  GraduationCap,
  Mail,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Save,
  Globe,
  Sliders,
  Check,
  Eye,
  EyeOff,
  Layers,
  X,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ShieldCheck,
  FolderKanban,
  ShoppingBag,
  Upload,
  Star,
  MessageSquare,
  Quote,
} from 'lucide-react';
import { usePortal, generateUniqueId } from '../../context/PortalContext';
import { SectionVisibility } from '../../types';

export const PortfolioCmsManager: React.FC = () => {
  const {
    heroData,
    updateHeroData,
    addHeroMetric,
    updateHeroMetric,
    deleteHeroMetric,
    aboutData,
    updateAboutData,
    addAboutFeature,
    updateAboutFeature,
    deleteAboutFeature,
    experienceTimeline,
    addExperienceItem,
    updateExperienceItem,
    deleteExperienceItem,
    skillsProgress,
    addSkillProgress,
    updateSkillProgress,
    deleteSkillProgress,
    techStackGrid,
    addTechStackItem,
    updateTechStackItem,
    deleteTechStackItem,
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    qualifications,
    addQualification,
    updateQualification,
    deleteQualification,
    education,
    updateEducation,
    contactInfo,
    updateContactInfo,
    sectionVisibility,
    updateSectionVisibility,
    toggleSectionVisibility,
    resetAllToDefaults,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = usePortal();

  const [activeSubTab, setActiveSubTab] = useState<
    'visibility' | 'hero' | 'about' | 'experience' | 'skills' | 'education' | 'testimonials' | 'contact'
  >('visibility');

  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const notifySaved = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  // Local state for Hero form
  const [heroForm, setHeroForm] = useState({
    firstName: heroData.firstName,
    lastName: heroData.lastName,
    title: heroData.title,
    subTitle: heroData.subTitle,
    location: heroData.location,
    profileImage: heroData.profileImage,
  });

  // Local state for About form
  const [aboutForm, setAboutForm] = useState({
    heading: aboutData.heading,
    description: aboutData.description,
    bioDetails: aboutData.bioDetails || '',
  });

  // Local state for Education form
  const [educationForm, setEducationForm] = useState({
    degree: education.degree,
    institution: education.institution,
    specialization: education.specialization,
  });

  // Local state for Contact form
  const [contactForm, setContactForm] = useState({
    email: contactInfo?.email || '',
    phone1: contactInfo?.phone1 || (contactInfo?.phone ? contactInfo.phone.split('/')[0]?.trim() : '') || '+94 77 644 0674',
    phone2: contactInfo?.phone2 || (contactInfo?.phone && contactInfo.phone.includes('/') ? contactInfo.phone.split('/')[1]?.trim() : '') || '+94 70 481 2213',
    linkedinUrl: contactInfo?.linkedinUrl || '',
    githubUrl: contactInfo?.githubUrl || '',
    fiverrUrl: contactInfo?.fiverrUrl || '',
  });

  // Creation forms
  const [newMetric, setNewMetric] = useState({ value: '', label: '' });
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });
  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    highlights: '',
  });
  const [newSkill, setNewSkill] = useState({ name: '', percentage: 90 });
  const [newTech, setNewTech] = useState({ name: '', code: '', category: 'Frontend' });
  const [newCert, setNewCert] = useState({ title: '', issuer: '', badge: 'Oracle Certified' });
  const [newQual, setNewQual] = useState({ title: '', institution: '', description: '', badge: '' });

  // Modal Editing States
  const [editingItemType, setEditingItemType] = useState<
    'metric' | 'feature' | 'experience' | 'skill' | 'tech' | 'cert' | 'qual' | 'testimonial' | null
  >(null);
  const [editingItemData, setEditingItemData] = useState<any>(null);

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroData(heroForm);
    notifySaved('Hero section updated successfully!');
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutData(aboutForm);
    notifySaved('About section updated successfully!');
  };

  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    updateEducation(educationForm);
    notifySaved('Education details updated successfully!');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    notifySaved('Contact & social media details updated successfully!');
  };

  // Section config list for the Section Visibility Manager
  const sectionConfigList: {
    key: keyof SectionVisibility;
    title: string;
    description: string;
    icon: React.ReactNode;
    targetTab?: 'hero' | 'about' | 'experience' | 'skills' | 'education' | 'testimonials' | 'contact';
  }[] = [
    {
      key: 'hero',
      title: 'Hero Identity & Header Section',
      description: 'Main greeting, display avatar, headline title, and interactive stat cards.',
      icon: <User className="w-5 h-5 text-[#8B9FFD]" />,
      targetTab: 'hero',
    },
    {
      key: 'about',
      title: 'About Me & Core Pillars',
      description: 'Personal bio, architectural philosophies, and feature highlight cards.',
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      targetTab: 'about',
    },
    {
      key: 'experience',
      title: 'Career & Work Experience Timeline',
      description: 'Chronological timeline of software engineering roles, companies, and achievements.',
      icon: <Briefcase className="w-5 h-5 text-amber-400" />,
      targetTab: 'experience',
    },
    {
      key: 'projects',
      title: 'Featured Projects & Portals',
      description: 'Showcase grid with category filters (ERP, POS, LMS, Web) and live client previews.',
      icon: <FolderKanban className="w-5 h-5 text-cyan-400" />,
    },
    {
      key: 'fiverrGigs',
      title: 'Direct Services & Packages',
      description: 'Direct service packages, customized pricing tiers, and client registration ordering.',
      icon: <ShoppingBag className="w-5 h-5 text-blue-400" />,
    },
    {
      key: 'skills',
      title: 'Technical Skills & Modern Stack',
      description: 'Skill progress meters and interactive tech stack logo grid with categories.',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      targetTab: 'skills',
    },
    {
      key: 'education',
      title: 'Academic Degrees & Certifications',
      description: 'BSc degree qualifications, Oracle certifications, and professional credentials.',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
      targetTab: 'education',
    },
    {
      key: 'testimonials',
      title: 'Client Reviews & Endorsements',
      description: 'Verified client reviews, star ratings, and enterprise project feedback.',
      icon: <Star className="w-5 h-5 text-amber-400" />,
      targetTab: 'testimonials',
    },
    {
      key: 'contact',
      title: 'Contact Inquiry & Social Channels',
      description: 'Client contact inquiry form, direct phone numbers, email, and social networks.',
      icon: <Mail className="w-5 h-5 text-rose-400" />,
      targetTab: 'contact',
    },
  ];

  const visibleCount = Object.values(sectionVisibility).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900/50 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B9FFD] mb-1">
            <Sliders className="w-4 h-4" />
            <span>Master Content Management System</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Full Portfolio Sections & Content Editor
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Control which sections appear on your live web page, modify or delete individual items in real-time, and customize your portfolio presentation.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all CMS content back to original factory defaults?')) {
              resetAllToDefaults();
              notifySaved('All portfolio content reset to defaults!');
            }
          }}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {savedNotification && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-zinc-900/90 rounded-2xl border border-white/10">
        {[
          { id: 'visibility', label: 'Section Visibility', icon: <Layers className="w-3.5 h-3.5" />, badge: `${visibleCount}/8` },
          { id: 'hero', label: 'Hero Header', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'about', label: 'About & Features', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'experience', label: 'Experience Timeline', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'skills', label: 'Skills & Tech Stack', icon: <Cpu className="w-3.5 h-3.5" /> },
          { id: 'education', label: 'Certifications & Degrees', icon: <GraduationCap className="w-3.5 h-3.5" /> },
          { id: 'testimonials', label: 'Client Reviews', icon: <Star className="w-3.5 h-3.5" />, badge: testimonials.length },
          { id: 'contact', label: 'Contact & Socials', icon: <Mail className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#8B9FFD] text-zinc-950 shadow-md font-extrabold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-zinc-950 text-[#8B9FFD]' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 0: SECTION VISIBILITY MANAGER */}
      {activeSubTab === 'visibility' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8B9FFD]" />
                  <span>Page Section Visibility & Layout Controls</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Toggle which sections are rendered on the live portfolio. Turn sections on or off with a single click.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateSectionVisibility({
                      hero: true,
                      about: true,
                      experience: true,
                      projects: true,
                      fiverrGigs: true,
                      skills: true,
                      education: true,
                      contact: true,
                    });
                    notifySaved('All sections enabled and visible on portfolio!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Show All (8)</span>
                </button>

                <button
                  onClick={() => {
                    updateSectionVisibility({
                      hero: true,
                      about: false,
                      experience: false,
                      projects: false,
                      fiverrGigs: false,
                      skills: false,
                      education: false,
                      contact: false,
                    });
                    notifySaved('Only Hero section is active now.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Minimal Mode</span>
                </button>
              </div>
            </div>

            {/* Section Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {sectionConfigList.map((sec) => {
                const isVisible = sectionVisibility[sec.key];
                return (
                  <div
                    key={sec.key}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      isVisible
                        ? 'bg-zinc-950/80 border-white/10'
                        : 'bg-zinc-950/30 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl ${isVisible ? 'bg-zinc-900 border border-white/10' : 'bg-zinc-900/50'}`}>
                        {sec.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                              isVisible
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                : 'bg-zinc-800 text-zinc-400 border border-white/5'
                            }`}
                          >
                            {isVisible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                            <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{sec.description}</p>
                        
                        {sec.targetTab && (
                          <button
                            onClick={() => setActiveSubTab(sec.targetTab!)}
                            className="mt-2 text-[11px] text-[#8B9FFD] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <span>Edit content in CMS</span>
                            <Edit3 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSectionVisibility(sec.key)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        isVisible
                          ? 'bg-emerald-500 text-zinc-950 shadow-md hover:bg-emerald-400'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-white/10'
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: HERO SECTION & MAIN PHOTO */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveHero} className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8B9FFD]" />
                  <span>Main Banner, Hero Text & Main Photo Management</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Update your headline names, professional titles, location, and upload or replace your main portrait photo.
                </p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-zinc-950 text-xs font-extrabold shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Changes</span>
              </button>
            </div>

            {/* Profile Photo Uploader & Live Preview */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 flex flex-col md:flex-row items-center gap-6">
              {/* Photo Preview Card */}
              <div className="relative group shrink-0">
                <div className="w-32 h-40 sm:w-36 sm:h-48 rounded-2xl overflow-hidden border-2 border-[#8B9FFD]/40 bg-zinc-900 shadow-xl relative">
                  {heroForm.profileImage ? (
                    <img
                      src={heroForm.profileImage || '/assets/images/regenerated_image_1785318122875.png'}
                      alt="Main Portrait Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/regenerated_image_1785318122875.png';
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
                      <User className="w-10 h-10 mb-1" />
                      <span className="text-[10px]">No Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live Preview</span>
                  </div>
                </div>
              </div>

              {/* Photo Controls */}
              <div className="space-y-3 flex-1 w-full">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Main Profile Photo / Portrait Avatar</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      Live on Site
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Upload a high-resolution headshot from your computer, or enter an image URL directly.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 flex items-center gap-2 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#8B9FFD]" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (reader.result) {
                              setHeroForm({ ...heroForm, profileImage: reader.result as string });
                              notifySaved('New photo loaded! Click "Save Hero Changes" to publish.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setHeroForm({ ...heroForm, profileImage: heroData.profileImage });
                      notifySaved('Reverted to current saved photo.');
                    }}
                    className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs border border-white/5 cursor-pointer"
                  >
                    Revert Photo
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Image URL (Optional Alternative)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or data:image/..."
                    value={heroForm.profileImage}
                    onChange={(e) => setHeroForm({ ...heroForm, profileImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">First Name (Top Heading)</label>
                <input
                  type="text"
                  value={heroForm.firstName}
                  onChange={(e) => setHeroForm({ ...heroForm, firstName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Last Name (Glow Highlight Heading)</label>
                <input
                  type="text"
                  value={heroForm.lastName}
                  onChange={(e) => setHeroForm({ ...heroForm, lastName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>
            </div>

            {/* Titles & Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Primary Banner Badge Title</label>
                <input
                  type="text"
                  placeholder="e.g. CUSTOMER SUCCESS • APPLICATION SUPPORT • ERP SUPPORT"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Subtitle Roles / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Website Developer • App Maker • Data Analyst • Freelance Expert"
                  value={heroForm.subTitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Geographic Location</label>
              <input
                type="text"
                placeholder="e.g. Nugegoda, Sri Lanka"
                value={heroForm.location}
                onChange={(e) => setHeroForm({ ...heroForm, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>
          </form>

          {/* Hero Metrics Cards Manager */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B9FFD]" />
              <span>Hero Metric Stat Cards</span>
            </h3>

            {/* List with Modify & Delete */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {heroData.metrics.map((metric, idx) => (
                <div
                  key={metric.id || idx}
                  className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xl font-extrabold text-white">{metric.value}</span>
                    <p className="text-xs text-zinc-400">{metric.label}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingItemType('metric');
                        setEditingItemData({ index: idx, id: metric.id, value: metric.value, label: metric.label });
                      }}
                      className="text-[11px] text-[#8B9FFD] hover:text-[#a2b2ff] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteHeroMetric(metric.id || idx)}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Metric form */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Metric Value</label>
                <input
                  type="text"
                  placeholder="e.g. 50+ or 100%"
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Metric Label</label>
                <input
                  type="text"
                  placeholder="e.g. Delivered Systems"
                  value={newMetric.label}
                  onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newMetric.value || !newMetric.label) return;
                  addHeroMetric({
                    id: generateUniqueId('metric'),
                    value: newMetric.value,
                    label: newMetric.label,
                  });
                  setNewMetric({ value: '', label: '' });
                  notifySaved('New metric card added!');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT SECTION */}
      {activeSubTab === 'about' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveAbout} className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8B9FFD]" />
              <span>About Section Bio & Mission</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Headline</label>
              <input
                type="text"
                value={aboutForm.heading}
                onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Primary Summary Paragraph</label>
              <textarea
                rows={3}
                value={aboutForm.description}
                onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Detailed Technical Biography</label>
              <textarea
                rows={4}
                value={aboutForm.bioDetails}
                onChange={(e) => setAboutForm({ ...aboutForm, bioDetails: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-zinc-950 text-xs font-extrabold shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save About Content</span>
              </button>
            </div>
          </form>

          {/* About Feature Pillars */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#8B9FFD]" />
              <span>Core Highlight Pillars & Strengths</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aboutData.features.map((feat) => (
                <div
                  key={feat.id}
                  className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{feat.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingItemType('feature');
                        setEditingItemData({ id: feat.id, title: feat.title, description: feat.description });
                      }}
                      className="text-[11px] text-[#8B9FFD] hover:text-[#a2b2ff] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteAboutFeature(feat.id)}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Feature Form */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Highlight Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Enterprise Reliability"
                    value={newFeature.title}
                    onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Highlight Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 99.9% uptime architecture"
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newFeature.title) return;
                  addAboutFeature({
                    title: newFeature.title,
                    description: newFeature.description,
                  });
                  setNewFeature({ title: '', description: '' });
                  notifySaved('New highlight pillar added!');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Highlight Pillar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXPERIENCE SECTION */}
      {activeSubTab === 'experience' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#8B9FFD]" />
              <span>Career & Work Experience Timeline</span>
            </h3>

            {/* List */}
            <div className="space-y-3">
              {experienceTimeline.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{exp.role}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#8B9FFD]/10 text-[#8B9FFD] font-semibold border border-[#8B9FFD]/20">
                        {exp.company}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">{exp.period}</p>
                    <p className="text-xs text-zinc-300 max-w-xl">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingItemType('experience');
                        setEditingItemData({
                          index: idx,
                          id: exp.id,
                          role: exp.role,
                          company: exp.company,
                          period: exp.period,
                          description: exp.description,
                          highlights: (exp.highlights || []).join('\n'),
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#8B9FFD] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteExperienceItem(exp.id || idx)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Experience Form */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Add Career Position</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Full-Stack Engineer"
                    value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Freelance / Global Clients"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Time Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 - Present"
                    value={newExp.period}
                    onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of responsibilities and technical scale..."
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newExp.role || !newExp.company) return;
                  addExperienceItem({
                    id: generateUniqueId('exp'),
                    role: newExp.role,
                    company: newExp.company,
                    period: newExp.period || 'Present',
                    description: newExp.description || '',
                    highlights: newExp.highlights ? newExp.highlights.split('\n').filter(Boolean) : [],
                  });
                  setNewExp({ role: '', company: '', period: '', description: '', highlights: '' });
                  notifySaved('Career experience added!');
                }}
                className="px-4 py-2 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-zinc-950 text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SKILLS & TECH STACK */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6">
          {/* Skill Progress Bars */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8B9FFD]" />
              <span>Skill Progress & Mastery Bars</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skillsProgress.map((sk, idx) => (
                <div
                  key={sk.id || idx}
                  className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold text-white mb-1">
                      <span>{sk.name}</span>
                      <span className="text-[#8B9FFD]">{sk.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B9FFD] to-purple-500 rounded-full"
                        style={{ width: `${sk.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingItemType('skill');
                        setEditingItemData({ index: idx, id: sk.id, name: sk.name, percentage: sk.percentage });
                      }}
                      className="p-1.5 text-zinc-400 hover:text-[#8B9FFD] cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSkillProgress(sk.id || idx)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Skill */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. React & Next.js"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Proficiency ({newSkill.percentage}%)</label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={newSkill.percentage}
                  onChange={(e) => setNewSkill({ ...newSkill, percentage: parseInt(e.target.value) || 90 })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newSkill.name) return;
                  addSkillProgress({
                    id: generateUniqueId('skill'),
                    name: newSkill.name,
                    percentage: newSkill.percentage,
                  });
                  setNewSkill({ name: '', percentage: 90 });
                  notifySaved('Skill progress bar added!');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* Tech Stack Grid Items */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8B9FFD]" />
              <span>Interactive Tech Stack Grid Badges</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {techStackGrid.map((tech) => (
                <div
                  key={tech.id}
                  className="p-3 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-white">{tech.name}</span>
                    <p className="text-[10px] text-zinc-500">{tech.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingItemType('tech');
                        setEditingItemData({ id: tech.id, name: tech.name, code: tech.code, category: tech.category });
                      }}
                      className="p-1 text-zinc-400 hover:text-[#8B9FFD] cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteTechStackItem(tech.id)}
                      className="p-1 text-zinc-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Tech */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Tech / Framework Name</label>
                <input
                  type="text"
                  placeholder="e.g. Drizzle ORM"
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Category</label>
                <select
                  value={newTech.category}
                  onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps & Cloud</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newTech.name) return;
                  addTechStackItem({
                    id: generateUniqueId('tech'),
                    name: newTech.name,
                    code: newTech.name.toLowerCase().replace(/\s+/g, '-'),
                    category: newTech.category,
                  });
                  setNewTech({ name: '', code: '', category: 'Frontend' });
                  notifySaved('Tech stack badge added!');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EDUCATION & CERTIFICATIONS */}
      {activeSubTab === 'education' && (
        <div className="space-y-6">
          {/* Degree Form */}
          <form onSubmit={handleSaveEducation} className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#8B9FFD]" />
              <span>Academic University Degree</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Degree Title</label>
                <input
                  type="text"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">University / Institution</label>
                <input
                  type="text"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Specialization / Major</label>
                <input
                  type="text"
                  value={educationForm.specialization}
                  onChange={(e) => setEducationForm({ ...educationForm, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-zinc-950 text-xs font-extrabold shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Degree Details</span>
              </button>
            </div>
          </form>

          {/* Certifications Manager */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#8B9FFD]" />
              <span>Industry Certifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certifications.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                    <p className="text-xs text-zinc-400">{cert.issuer}</p>
                    {cert.badge && (
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                        {cert.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItemType('cert');
                        setEditingItemData({ index: idx, id: cert.id, title: cert.title, issuer: cert.issuer, badge: cert.badge });
                      }}
                      className="text-[11px] text-[#8B9FFD] hover:text-[#a2b2ff] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteCertification(cert.id || idx)}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Certification */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Certification Title</label>
                <input
                  type="text"
                  placeholder="e.g. Oracle Certified Associate (OCA)"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Oracle University"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newCert.title) return;
                  addCertification({
                    id: generateUniqueId('cert'),
                    title: newCert.title,
                    issuer: newCert.issuer || 'Oracle',
                    badge: newCert.badge || 'Certified',
                  });
                  setNewCert({ title: '', issuer: '', badge: 'Oracle Certified' });
                  notifySaved('Certification added!');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
              </button>
            </div>
          </div>

          {/* Qualifications Manager */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B9FFD]" />
              <span>Professional Qualifications & Diplomas</span>
            </h3>

            <div className="space-y-3">
              {qualifications.map((qual, idx) => (
                <div
                  key={qual.id || idx}
                  className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{qual.title}</h4>
                    <p className="text-xs text-zinc-400">{qual.institution}</p>
                    {qual.description && (
                      <p className="text-[11px] text-zinc-500 mt-1">{qual.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItemType('qual');
                        setEditingItemData({
                          index: idx,
                          id: qual.id,
                          title: qual.title,
                          institution: qual.institution,
                          description: qual.description,
                        });
                      }}
                      className="text-[11px] text-[#8B9FFD] hover:text-[#a2b2ff] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteQualification(qual.id || idx)}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Qualification */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Qualification Title</label>
                <input
                  type="text"
                  placeholder="e.g. Higher National Diploma in Computing"
                  value={newQual.title}
                  onChange={(e) => setNewQual({ ...newQual, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Institution</label>
                <input
                  type="text"
                  placeholder="e.g. SLIIT / Pearson UK"
                  value={newQual.institution}
                  onChange={(e) => setNewQual({ ...newQual, institution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newQual.title) return;
                  addQualification({
                    id: generateUniqueId('qual'),
                    title: newQual.title,
                    institution: newQual.institution || 'Recognized Board',
                    description: newQual.description || '',
                  });
                  setNewQual({ title: '', institution: '', description: '', badge: '' });
                  notifySaved('Professional qualification added!');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Qualification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CONTACT SECTION */}
      {activeSubTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#8B9FFD]" />
            <span>Contact Information & Social Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Primary Email Address</label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Mobile Phone (Primary)</label>
              <input
                type="text"
                required
                value={contactForm.phone1}
                onChange={(e) => setContactForm({ ...contactForm, phone1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Alternative Phone / WhatsApp</label>
              <input
                type="text"
                value={contactForm.phone2 || ''}
                onChange={(e) => setContactForm({ ...contactForm, phone2: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={contactForm.linkedinUrl}
                onChange={(e) => setContactForm({ ...contactForm, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">GitHub Profile URL</label>
              <input
                type="url"
                value={contactForm.githubUrl}
                onChange={(e) => setContactForm({ ...contactForm, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#8B9FFD]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Fiverr Profile / Gig URL</label>
              <input
                type="url"
                value={contactForm.fiverrUrl}
                onChange={(e) => setContactForm({ ...contactForm, fiverrUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#1dbf73]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-zinc-950 text-xs font-extrabold shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact & Social Details</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 7: TESTIMONIALS & CLIENT REVIEWS CMS */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Client Testimonials & Service Reviews</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage client quotes, ratings, company names, and project deliverables shown on the live portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const name = prompt('Client Name:');
                  if (!name) return;
                  const company = prompt('Company / Organization:') || 'Enterprise Client';
                  const role = prompt('Client Role (e.g. Managing Director):') || 'Director';
                  const quote = prompt('Review / Testimonial quote:') || 'Excellent software deliverable and great engineering.';
                  const projectType = prompt('Project Type (e.g. ERP System, Website, Application):') || 'ERP System';
                  
                  const initials = name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2) || 'CL';

                  addTestimonial({
                    name,
                    role,
                    company,
                    rating: 5,
                    quote,
                    projectType,
                    avatarInitials: initials,
                    avatarColor: '#6366f1',
                    date: 'Aug 2026',
                    featured: true,
                  });
                  notifySaved('Added new testimonial!');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Testimonial</span>
              </button>
            </div>

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((tst) => (
                <div
                  key={tst.id}
                  className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-3 relative group hover:border-white/15 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                        style={{ backgroundColor: tst.avatarColor || '#6366f1' }}
                      >
                        {tst.avatarInitials || tst.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{tst.name}</span>
                          <span className="text-[10px] text-zinc-500">({tst.role})</span>
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-semibold">{tst.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItemType('testimonial');
                          setEditingItemData({ ...tst });
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                        title="Edit Review"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete testimonial from ${tst.name}?`)) {
                            deleteTestimonial(tst.id);
                            notifySaved('Deleted testimonial');
                          }
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {[...Array(tst.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                    <span className="text-[10px] text-zinc-500 ml-1">({tst.projectType || 'Project'})</span>
                  </div>

                  <p className="text-xs text-zinc-300 italic leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-white/5">
                    "{tst.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ITEM EDIT MODAL */}
      {editingItemType && editingItemData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#8B9FFD]" />
                <span className="capitalize">Edit {editingItemType}</span>
              </h3>
              <button
                onClick={() => {
                  setEditingItemType(null);
                  setEditingItemData(null);
                }}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metric Form */}
            {editingItemType === 'metric' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Metric Value</label>
                  <input
                    type="text"
                    value={editingItemData.value}
                    onChange={(e) => setEditingItemData({ ...editingItemData, value: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Metric Label</label>
                  <input
                    type="text"
                    value={editingItemData.label}
                    onChange={(e) => setEditingItemData({ ...editingItemData, label: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Feature Form */}
            {editingItemType === 'feature' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Highlight Title</label>
                  <input
                    type="text"
                    value={editingItemData.title}
                    onChange={(e) => setEditingItemData({ ...editingItemData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Highlight Description</label>
                  <textarea
                    rows={3}
                    value={editingItemData.description}
                    onChange={(e) => setEditingItemData({ ...editingItemData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Experience Form */}
            {editingItemType === 'experience' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Role</label>
                    <input
                      type="text"
                      value={editingItemData.role}
                      onChange={(e) => setEditingItemData({ ...editingItemData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Company</label>
                    <input
                      type="text"
                      value={editingItemData.company}
                      onChange={(e) => setEditingItemData({ ...editingItemData, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Period</label>
                  <input
                    type="text"
                    value={editingItemData.period}
                    onChange={(e) => setEditingItemData({ ...editingItemData, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingItemData.description}
                    onChange={(e) => setEditingItemData({ ...editingItemData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Key Responsibilities / Bullet Highlights (one per line)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Architected Next.js microservices&#10;Reduced database query latency by 45%"
                    value={editingItemData.highlights || ''}
                    onChange={(e) => setEditingItemData({ ...editingItemData, highlights: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Skill Form */}
            {editingItemType === 'skill' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={editingItemData.name}
                    onChange={(e) => setEditingItemData({ ...editingItemData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Percentage ({editingItemData.percentage}%)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={editingItemData.percentage}
                    onChange={(e) => setEditingItemData({ ...editingItemData, percentage: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Tech Form */}
            {editingItemType === 'tech' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Tech Name</label>
                  <input
                    type="text"
                    value={editingItemData.name}
                    onChange={(e) => setEditingItemData({ ...editingItemData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={editingItemData.category}
                    onChange={(e) => setEditingItemData({ ...editingItemData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
              </div>
            )}

            {/* Cert Form */}
            {editingItemType === 'cert' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Certification Title</label>
                  <input
                    type="text"
                    value={editingItemData.title}
                    onChange={(e) => setEditingItemData({ ...editingItemData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Issuer</label>
                  <input
                    type="text"
                    value={editingItemData.issuer}
                    onChange={(e) => setEditingItemData({ ...editingItemData, issuer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Qual Form */}
            {editingItemType === 'qual' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Qualification Title</label>
                  <input
                    type="text"
                    value={editingItemData.title}
                    onChange={(e) => setEditingItemData({ ...editingItemData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Institution</label>
                  <input
                    type="text"
                    value={editingItemData.institution}
                    onChange={(e) => setEditingItemData({ ...editingItemData, institution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Testimonial Form */}
            {editingItemType === 'testimonial' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={editingItemData.name}
                      onChange={(e) => setEditingItemData({ ...editingItemData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Role</label>
                    <input
                      type="text"
                      value={editingItemData.role}
                      onChange={(e) => setEditingItemData({ ...editingItemData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Company</label>
                    <input
                      type="text"
                      value={editingItemData.company}
                      onChange={(e) => setEditingItemData({ ...editingItemData, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Type</label>
                    <input
                      type="text"
                      value={editingItemData.projectType}
                      onChange={(e) => setEditingItemData({ ...editingItemData, projectType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Star Rating (1 - 5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingItemData.rating}
                    onChange={(e) => setEditingItemData({ ...editingItemData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Quote / Review Content</label>
                  <textarea
                    rows={4}
                    value={editingItemData.quote}
                    onChange={(e) => setEditingItemData({ ...editingItemData, quote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs resize-none"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setEditingItemType(null);
                  setEditingItemData(null);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingItemType === 'metric') {
                    updateHeroMetric(editingItemData.id || editingItemData.index, {
                      id: editingItemData.id,
                      value: editingItemData.value,
                      label: editingItemData.label,
                    });
                  } else if (editingItemType === 'feature') {
                    updateAboutFeature(editingItemData.id, {
                      title: editingItemData.title,
                      description: editingItemData.description,
                    });
                  } else if (editingItemType === 'experience') {
                    updateExperienceItem(editingItemData.id || editingItemData.index, {
                      role: editingItemData.role,
                      company: editingItemData.company,
                      period: editingItemData.period,
                      description: editingItemData.description,
                      highlights: editingItemData.highlights ? editingItemData.highlights.split('\n').filter(Boolean) : [],
                    });
                  } else if (editingItemType === 'skill') {
                    updateSkillProgress(editingItemData.id || editingItemData.index, {
                      name: editingItemData.name,
                      percentage: editingItemData.percentage,
                    });
                  } else if (editingItemType === 'tech') {
                    updateTechStackItem(editingItemData.id, {
                      name: editingItemData.name,
                      category: editingItemData.category,
                    });
                  } else if (editingItemType === 'cert') {
                    updateCertification(editingItemData.id || editingItemData.index, {
                      title: editingItemData.title,
                      issuer: editingItemData.issuer,
                    });
                  } else if (editingItemType === 'qual') {
                    updateQualification(editingItemData.id || editingItemData.index, {
                      title: editingItemData.title,
                      institution: editingItemData.institution,
                    });
                  } else if (editingItemType === 'testimonial') {
                    updateTestimonial(editingItemData.id, {
                      name: editingItemData.name,
                      role: editingItemData.role,
                      company: editingItemData.company,
                      quote: editingItemData.quote,
                      projectType: editingItemData.projectType,
                      rating: Number(editingItemData.rating) || 5,
                    });
                  }

                  notifySaved(`Updated ${editingItemType} successfully!`);
                  setEditingItemType(null);
                  setEditingItemData(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-zinc-950 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
