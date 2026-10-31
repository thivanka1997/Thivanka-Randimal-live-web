'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sparkles,
  FileText,
  Shield,
  LogOut,
  Lock,
  Briefcase,
  Building,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenLoginModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const {
    currentUser,
    currentView,
    setCurrentView,
    logout,
    sectionVisibility,
    updateSectionVisibility,
  } = usePortal();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      // Measure at most once per frame to avoid layout thrashing while scrolling
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        handleScroll();
      });
    };

    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Detect active section
      const sections = [
        'about',
        'experience',
        'projects',
        'services',
        'skills',
        'education',
        'testimonials',
        'contact',
      ];
      const scrollPosition = window.scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Services & Packages', href: '#services', id: 'services' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Reviews', href: '#testimonials', id: 'testimonials' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const scrollToElementWithOffset = (targetId: string) => {
    let attempts = 0;
    const maxAttempts = 10;

    const performScroll = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 75;
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });
        setActiveSection(targetId);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(performScroll, 50);
      }
    };

    performScroll();
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');

    if (targetId === 'services' && !sectionVisibility.fiverrGigs) {
      updateSectionVisibility({ fiverrGigs: true });
    }

    if (currentView !== 'portfolio') {
      setCurrentView('portfolio');
      setTimeout(() => {
        scrollToElementWithOffset(targetId);
      }, 100);
    } else {
      scrollToElementWithOffset(targetId);
    }
  };

  const handleDashboardClick = () => {
    if (!currentUser) {
      onOpenLoginModal();
      return;
    }
    if (currentUser.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else if (currentUser.role === 'business_development') {
      setCurrentView('bd_dashboard');
    } else {
      setCurrentView('client_dashboard');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0b0d12]/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.06] py-2.5 sm:py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]'
            : 'bg-transparent py-3.5 sm:py-5'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#about');
              }}
              className="flex items-center gap-2 group cursor-pointer"
              id="nav-logo-link"
            >
              <Sparkles className="w-5 h-5 text-[#8B9FFD] group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-base sm:text-lg font-bold tracking-wider text-white group-hover:text-[#8B9FFD] transition-colors">
                TRP
              </span>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-7" id="desktop-nav">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                    activeSection === link.id
                      ? 'text-[#8B9FFD]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B9FFD] rounded-full" />
                  )}
                </a>
              ))}
            </nav>

            {/* Desktop Actions: Portal Login + Resume */}
            <div className="hidden md:flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDashboardClick}
                    className="px-4 py-2 text-xs font-bold text-[#0b0d12] bg-[#8B9FFD] hover:bg-[#a2b2ff] rounded-full transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>
                      {currentUser.role === 'admin'
                        ? 'Admin Console'
                        : currentUser.role === 'business_development'
                        ? 'BD Dashboard'
                        : 'Client Portal'}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#8B9FFD]" />
                  <span>Portal Login</span>
                </button>
              )}

              {/* Resume Button */}
              <button
                onClick={onOpenResume}
                id="resume-nav-button"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#8B9FFD]/15 hover:bg-[#8B9FFD] hover:text-[#0b0d12] border border-[#8B9FFD]/30 hover:border-[#8B9FFD] rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#8B9FFD]/10"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            </div>

            {/* Mobile Header Buttons (Always Visible on Mobile) */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Portal Login Button */}
              {currentUser ? (
                <button
                  onClick={handleDashboardClick}
                  className="px-3 py-1.5 text-xs font-bold text-[#0b0d12] bg-[#8B9FFD] rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  aria-label="Open User Dashboard"
                >
                  <Shield className="w-3.5 h-3.5 text-[#0b0d12]" />
                  <span>Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#8B9FFD]/20 hover:bg-[#8B9FFD]/30 border border-[#8B9FFD]/50 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  aria-label="Open Portal Login Modal"
                >
                  <Lock className="w-3.5 h-3.5 text-[#8B9FFD]" />
                  <span>Portal Login</span>
                </button>
              )}

              {/* Mobile Menu Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-zinc-300 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                id="mobile-menu-toggle"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 pb-5 border-t border-white/10 bg-[#0e111a]/98 backdrop-blur-xl rounded-2xl px-4 space-y-4 shadow-2xl animate-fadeIn">
              {/* Portal Access Quick Card on Mobile Menu */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 to-[#121624] border border-[#8B9FFD]/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#8B9FFD]" />
                    <span>Portal Management Access</span>
                  </span>
                  {currentUser && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B9FFD]/20 text-[#8B9FFD] font-semibold uppercase">
                      {currentUser.role.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                {currentUser ? (
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleDashboardClick();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#8B9FFD] text-[#0b0d12] text-xs font-bold flex items-center justify-between shadow"
                    >
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4" />
                        <span>Open {currentUser.role === 'admin' ? 'Admin Console' : currentUser.role === 'business_development' ? 'BD Dashboard' : 'Client Portal'}</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out ({currentUser.name})</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenLoginModal();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#8B9FFD] text-[#0b0d12] text-xs font-bold flex items-center justify-center gap-2 shadow"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Sign In to Portal</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`block py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === link.id
                        ? 'text-[#8B9FFD] bg-[#8B9FFD]/10 font-bold'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Resume Button in Mobile Menu */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResume();
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#8B9FFD]" />
                  <span>View Full Resume</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
