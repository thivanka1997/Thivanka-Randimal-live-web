'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, FileText, Shield, LogOut } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenLoginModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const { currentUser, currentView, setCurrentView, logout, sectionVisibility, updateSectionVisibility } = usePortal();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Detect active section
      const sections = ['about', 'experience', 'projects', 'services', 'skills', 'education', 'testimonials', 'contact'];
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

    // If services was hidden in user section visibility, make sure it is enabled
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b0d12]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
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
            <span className="text-lg font-bold tracking-wider text-white group-hover:text-[#8B9FFD] transition-colors">
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

          {/* Actions: Portal Login + Resume */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Login / Portal Dashboard Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentView(
                      currentUser.role === 'admin' ? 'admin_dashboard' : 'client_dashboard'
                    )
                  }
                  className="px-4 py-2 text-xs font-bold text-[#0b0d12] bg-[#8B9FFD] hover:bg-[#a2b2ff] rounded-full transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>
                    {currentUser.role === 'admin' ? 'Admin Dashboard' : 'Client Portal'}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#8B9FFD]" />
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

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenLoginModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#8B9FFD]/20 border border-[#8B9FFD]/40 rounded-lg flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-[#8B9FFD]" />
              <span>Portal</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-2 rounded-lg"
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-white/10 bg-[#0e111a]/95 backdrop-blur-lg rounded-2xl px-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block py-2 text-base font-medium text-zinc-300 hover:text-[#8B9FFD] transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser) {
                    setCurrentView(
                      currentUser.role === 'admin' ? 'admin_dashboard' : 'client_dashboard'
                    );
                  } else {
                    onOpenLoginModal();
                  }
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-bold text-[#0b0d12] bg-[#8B9FFD] rounded-xl flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>
                  {currentUser
                    ? `Open ${currentUser.role === 'admin' ? 'Admin' : 'Client'} Dashboard`
                    : 'Client / Admin Portal Login'}
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Resume</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
