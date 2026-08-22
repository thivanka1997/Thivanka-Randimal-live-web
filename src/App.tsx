import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { FiverrGigs } from './components/FiverrGigs';
import { CertificationsEducation } from './components/CertificationsEducation';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { GalleryModal } from './components/GalleryModal';
import { ResumeModal } from './components/ResumeModal';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ClientDashboard } from './components/client/ClientDashboard';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Project } from './types';

function AppContent() {
  const { currentView, currentUser, sectionVisibility } = usePortal();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState<{
    title: string;
    package: string;
    price: number;
  } | undefined>(undefined);

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
    setLoginModalOpen(true);
  };

  // If in Admin Dashboard view and user is admin
  if (currentView === 'admin_dashboard' && currentUser?.role === 'admin') {
    return (
      <>
        <AdminDashboard
          onSelectProjectForDetails={(project) => setSelectedProject(project)}
        />
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </>
    );
  }

  // If in Client Dashboard view and user is client
  if (currentView === 'client_dashboard' && currentUser?.role === 'client') {
    return (
      <>
        <ClientDashboard
          onSelectProjectForDetails={(project) => setSelectedProject(project)}
        />
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </>
    );
  }

  // Default: Public Portfolio View
  return (
    <div className="min-h-screen bg-[#0b0d12] text-zinc-100 selection:bg-[#8B9FFD]/30 selection:text-white relative">
      {/* Top Navbar */}
      <Navbar
        onOpenResume={() => setResumeOpen(true)}
        onOpenLoginModal={() => setLoginModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
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

        {/* Featured Projects & Portals (4 Categories) */}
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

export default function App() {
  return (
    <PortalProvider>
      <AppContent />
    </PortalProvider>
  );
}
