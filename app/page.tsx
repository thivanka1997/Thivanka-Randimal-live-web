'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/src/components/Navbar';
import { Hero } from '@/src/components/Hero';
import { About } from '@/src/components/About';
import { Experience } from '@/src/components/Experience';
import { Skills } from '@/src/components/Skills';
import { Projects } from '@/src/components/Projects';
import { FiverrGigs } from '@/src/components/FiverrGigs';
import { CertificationsEducation } from '@/src/components/CertificationsEducation';
import { Testimonials } from '@/src/components/Testimonials';
import { Contact } from '@/src/components/Contact';
import { Footer } from '@/src/components/Footer';
import { usePortal } from '@/src/context/PortalContext';
import { Project } from '@/src/types';

// Dynamic Code Splitting for Modals & Dashboard Portals
const AdminDashboard = dynamic(
  () => import('@/src/components/admin/AdminDashboard').then((m) => m.AdminDashboard),
  { ssr: false }
);

const ClientDashboard = dynamic(
  () => import('@/src/components/client/ClientDashboard').then((m) => m.ClientDashboard),
  { ssr: false }
);

const BDDashboard = dynamic(
  () => import('@/src/components/bd/BDDashboard').then((m) => m.BDDashboard),
  { ssr: false }
);

const ProjectDetailModal = dynamic(
  () => import('@/src/components/ProjectDetailModal').then((m) => m.ProjectDetailModal),
  { ssr: false }
);

const GalleryModal = dynamic(
  () => import('@/src/components/GalleryModal').then((m) => m.GalleryModal),
  { ssr: false }
);

const ResumeModal = dynamic(
  () => import('@/src/components/ResumeModal').then((m) => m.ResumeModal),
  { ssr: false }
);

const LoginModal = dynamic(
  () => import('@/src/components/auth/LoginModal').then((m) => m.LoginModal),
  { ssr: false }
);

const RegisterModal = dynamic(
  () => import('@/src/components/auth/RegisterModal').then((m) => m.RegisterModal),
  { ssr: false }
);

const BDRegistrationModal = dynamic(
  () => import('@/src/components/bd/BDRegistrationModal').then((m) => m.BDRegistrationModal),
  { ssr: false }
);

export default function HomePage() {
  const { currentView, currentUser, sectionVisibility } = usePortal();

  const [mounted, setMounted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [bdRegisterModalOpen, setBdRegisterModalOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState<{
    title: string;
    package: string;
    price: number;
  } | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    const cleanId = id.replace('#', '');
    const el = document.getElementById(cleanId);
    if (el) {
      const headerOffset = 75;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  };

  const handleOpenRegister = (serviceDetails?: { title: string; package: string; price: number }) => {
    setPrefilledService(serviceDetails);
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };

  const handleOpenLogin = () => {
    setRegisterModalOpen(false);
    setBdRegisterModalOpen(false);
    setLoginModalOpen(true);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8B9FFD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If in BD Dashboard view and user is BD partner
  if (currentView === 'bd_dashboard' && currentUser?.role === 'business_development') {
    return <BDDashboard />;
  }

  // If in Admin Dashboard view and user is admin
  if (currentView === 'admin_dashboard' && currentUser?.role === 'admin') {
    return (
      <main className="min-h-screen bg-[#0b0d12]">
        <AdminDashboard
          onSelectProjectForDetails={(project) => setSelectedProject(project)}
        />
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </main>
    );
  }

  // If in Client Dashboard view and user is client
  if (currentView === 'client_dashboard' && currentUser?.role === 'client') {
    return (
      <main className="min-h-screen bg-[#0b0d12]">
        <ClientDashboard
          onSelectProjectForDetails={(project) => setSelectedProject(project)}
        />
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </main>
    );
  }

  // Default: Public Portfolio View
  return (
    <div className="min-h-screen bg-[#0b0d12] text-zinc-100 selection:bg-[#8B9FFD]/30 selection:text-white relative w-full max-w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        onOpenResume={() => setResumeOpen(true)}
        onOpenLoginModal={() => setLoginModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="w-full max-w-full overflow-x-hidden">
        {/* Hero Section */}
        {sectionVisibility.hero && (
          <Hero
            onViewProjectsClick={() => scrollToSection('projects')}
            onContactClick={() => scrollToSection('contact')}
          />
        )}

        {/* About Section */}
        {sectionVisibility.about && <About />}

        {/* Experience Section */}
        {sectionVisibility.experience && <Experience />}

        {/* Featured Projects & Portals */}
        {sectionVisibility.projects && (
          <Projects
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenGallery={() => setGalleryOpen(true)}
            onOpenLoginModal={() => setLoginModalOpen(true)}
          />
        )}

        {/* Freelance & Direct Services */}
        {sectionVisibility.fiverrGigs && (
          <FiverrGigs
            onOpenContact={() => scrollToSection('contact')}
            onOpenLoginModal={() => setLoginModalOpen(true)}
            onOpenRegisterModal={handleOpenRegister}
          />
        )}

        {/* Skills Section */}
        {sectionVisibility.skills && <Skills />}

        {/* Certifications & Education Section */}
        {sectionVisibility.education && <CertificationsEducation />}

        {/* Client Testimonials & Reviews Section */}
        {sectionVisibility.testimonials && (
          <Testimonials onOpenContact={() => scrollToSection('contact')} />
        )}

        {/* Contact Section */}
        {sectionVisibility.contact && <Contact />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={handleOpenRegister}
        onOpenBDRegister={() => {
          setLoginModalOpen(false);
          setBdRegisterModalOpen(true);
        }}
      />

      <BDRegistrationModal
        isOpen={bdRegisterModalOpen}
        onClose={() => setBdRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setBdRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={handleOpenLogin}
        prefilledService={prefilledService}
      />

      <GalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </div>
  );
}
