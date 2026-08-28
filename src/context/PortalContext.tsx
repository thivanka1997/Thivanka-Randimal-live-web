'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  Client,
  User,
  Milestone,
  Task,
  ProjectUpdate,
  ProjectFile,
  ActivityLog,
  ProjectCategory,
  ProjectStatus,
  UserRole,
  UserStatus,
  CategoryItem,
  FiverrGig,
  HeroSectionData,
  AboutSectionData,
  ContactInfoData,
  SkillProgress,
  TechIconItem,
  ExperienceItem,
  CertificationItem,
  EducationItem,
  QualificationItem,
  MetricStat,
  AboutFeature,
  SectionVisibility,
  RegistrationRequest,
  PhasePayment,
  PaymentStatus,
  Testimonial,
} from '../types';

import {
  INITIAL_CATEGORIES,
  INITIAL_FIVERR_GIGS,
  INITIAL_REGISTRATIONS,
  HERO_DATA,
  ABOUT_DATA,
  EXPERIENCE_TIMELINE,
  SKILL_PROGRESS_BARS,
  TECH_STACK_GRID,
  CERTIFICATIONS,
  EDUCATION,
  PROFESSIONAL_QUALIFICATIONS,
  CONTACT_INFO,
  profileHeadshot,
  agritechImg,
  hotelErpImg,
  studentPortalImg,
  inventoryImg,
  fintechImg,
} from '../data/portfolioData';

const DEFAULT_PROJECT_IMG_MAP: Record<string, string> = {
  'proj-1': hotelErpImg,
  'proj-2': studentPortalImg,
  'proj-3': fintechImg,
  'proj-4': agritechImg,
  'proj-5': inventoryImg,
};

const sanitizeProjectImage = (imgUrl: any, projId?: string): string => {
  const fallback = (projId && DEFAULT_PROJECT_IMG_MAP[projId]) || hotelErpImg;
  if (!imgUrl || typeof imgUrl !== 'string' || imgUrl === '[object Object]') {
    return fallback;
  }
  if (imgUrl.includes('hotel_erp_dashboard')) return hotelErpImg;
  if (imgUrl.includes('student_portal')) return studentPortalImg;
  if (imgUrl.includes('fintech_dashboard')) return fintechImg;
  if (imgUrl.includes('agritech_dashboard')) return agritechImg;
  if (imgUrl.includes('inventory_tracking')) return inventoryImg;
  if (imgUrl.startsWith('/_next/')) return fallback;
  return imgUrl;
};

const sanitizeHeroImage = (imgUrl: any): string => {
  if (!imgUrl || typeof imgUrl !== 'string' || imgUrl === '[object Object]') {
    return profileHeadshot;
  }
  if (imgUrl.includes('regenerated_image_') || imgUrl.includes('profile_headshot') || imgUrl.includes('profile_')) {
    return profileHeadshot;
  }
  if (imgUrl.startsWith('/_next/')) {
    return profileHeadshot;
  }
  return imgUrl;
};

// Initial Seed Clients
const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    userId: 'user-2',
    companyName: 'ABC Company',
    contactPerson: 'John Perera',
    email: 'client@abc.com',
    phone: '+94 77 123 4567',
    address: '245 Galle Road, Colombo 03, Sri Lanka',
    logo: '🏢',
    createdAt: '2026-08-01',
  },
  {
    id: 'client-2',
    userId: 'user-3',
    companyName: 'Grand Luxe Hospitality Group',
    contactPerson: 'Sarah Fernando',
    email: 'client@grandluxe.com',
    phone: '+94 71 987 6543',
    address: 'Kandy Road, Peradeniya, Sri Lanka',
    logo: '🏨',
    createdAt: '2026-07-15',
  },
  {
    id: 'client-3',
    userId: 'user-4',
    companyName: 'Apex Capital Partners',
    contactPerson: 'David Silva',
    email: 'client@apex.com',
    phone: '+94 70 555 4321',
    address: 'World Trade Center, Colombo 01, Sri Lanka',
    logo: '📊',
    createdAt: '2026-06-20',
  },
  {
    id: 'client-4',
    userId: 'user-5',
    companyName: 'AgriTech Global Holdings',
    contactPerson: 'Mahesh Gunasekara',
    email: 'client@agritech.org',
    phone: '+94 78 444 8899',
    address: 'Kurunegala Tech Hub, Sri Lanka',
    logo: '🌱',
    createdAt: '2026-05-10',
  },
];

// Initial Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Thivanka Randimal (Admin)',
    email: 'admin@thivanka.dev',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: 'user-bd-1',
    name: 'Kasun Perera (BD Partner)',
    email: 'bd@thivanka.dev',
    role: 'business_development',
    status: 'active',
    phone: '+94 77 123 4567',
    companyName: 'Apex Growth Marketing',
    createdAt: '2026-08-01',
  },
  {
    id: 'user-2',
    name: 'John Perera (ABC Company)',
    email: 'client@abc.com',
    role: 'client',
    clientId: 'client-1',
    companyName: 'ABC Company',
    status: 'active',
    createdAt: '2026-08-01',
  },
  {
    id: 'user-3',
    name: 'Sarah Fernando (Grand Luxe)',
    email: 'client@grandluxe.com',
    role: 'client',
    clientId: 'client-2',
    companyName: 'Grand Luxe Hospitality Group',
    status: 'active',
    createdAt: '2026-07-15',
  },
  {
    id: 'user-4',
    name: 'David Silva (Apex Capital)',
    email: 'client@apex.com',
    role: 'client',
    clientId: 'client-3',
    companyName: 'Apex Capital Partners',
    status: 'active',
    createdAt: '2026-06-20',
  },
  {
    id: 'user-5',
    name: 'Mahesh Gunasekara (AgriTech)',
    email: 'client@agritech.org',
    role: 'client',
    clientId: 'client-4',
    companyName: 'AgriTech Global Holdings',
    status: 'active',
    createdAt: '2026-05-10',
  },
];

// Initial Seed Projects across 4 categories:
// 🌐 website, 📱 application, 🏢 erp, 📊 financial_dashboard
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    clientId: 'client-1',
    clientName: 'ABC Company',
    clientLogo: '🏢',
    title: 'ABC Hotel Management System',
    category: 'erp',
    tagline: 'Full-cycle enterprise hospitality ERP connecting PMS, POS, and financial general ledgers.',
    description: 'Enterprise ERP suite streamlining Front Office room folios, point-of-sale restaurant billing, night audit automation, and real-time inventory management.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    startDate: '01 Aug 2026',
    deadline: '30 Sep 2026',
    progress: 75,
    status: 'In Development',
    image: hotelErpImg,
    featured: true,
    features: [
      'Interactive room allocation & live booking grid',
      'Automated nightly revenue audit & tax accounting',
      'Multi-currency POS dining & banquet invoicing',
      'Real-time housekeeping status synchronization',
    ],
    metrics: [
      { label: 'Check-in Speed', value: '+65% Faster' },
      { label: 'Properties', value: '45+ Hotel Units' },
    ],
    liveDemoUrl: '#',
    githubUrl: '#',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-15',
  },
  {
    id: 'proj-2',
    clientId: 'client-1',
    clientName: 'ABC Company',
    clientLogo: '🏢',
    title: 'ABC Corporate Web Portal',
    category: 'website',
    tagline: 'High-speed corporate web platform featuring interactive client quotation workflows.',
    description: 'Modern, SEO-optimized corporate web portal built with Next.js and Tailwind CSS, featuring automated inquiry routing, client appointment scheduling, and localized content.',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Node.js'],
    startDate: '01 Aug 2026',
    deadline: '25 Sep 2026',
    progress: 80,
    status: 'In Development',
    image: studentPortalImg,
    featured: true,
    features: [
      'Responsive modern UI with sub-second page load times',
      'Automated lead capture & CRM synchronization',
      'Dynamic case study showcase with interactive filters',
      'Client inquiry management and meeting scheduler',
    ],
    metrics: [
      { label: 'Conversion Rate', value: '+38%' },
      { label: 'Lighthouse Score', value: '99/100' },
    ],
    liveDemoUrl: '#',
    githubUrl: '#',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-14',
  },
  {
    id: 'proj-3',
    clientId: 'client-3',
    clientName: 'Apex Capital Partners',
    clientLogo: '📊',
    title: 'Finance Executive BI Dashboard',
    category: 'financial_dashboard',
    tagline: 'Executive decision support dashboard with multi-source fiscal aggregation.',
    description: 'Executive financial cockpit tracking cash burn, recurring SaaS revenue, profit & loss statements, stress-test models, and predictive risk indicators in real time.',
    technologies: ['React', 'D3.js', 'Python', 'PostgreSQL', 'Figma', 'Recharts'],
    startDate: '15 Jun 2026',
    deadline: '10 Aug 2026',
    progress: 90,
    status: 'Completed',
    image: fintechImg,
    featured: true,
    features: [
      'Consolidated P&L, balance sheet, and live cash flow telematics',
      'Interactive Monte Carlo scenario stress testing',
      'Automated variance threshold anomaly alerting',
      'Role-based granular access control for board members',
    ],
    metrics: [
      { label: 'Audit Time Saved', value: '120 hrs/mo' },
      { label: 'Board Adoption', value: '100%' },
    ],
    liveDemoUrl: '#',
    githubUrl: '#',
    createdAt: '2026-06-15',
    updatedAt: '2026-08-10',
  },
  {
    id: 'proj-4',
    clientId: 'client-4',
    clientName: 'AgriTech Global Holdings',
    clientLogo: '🌱',
    title: 'Smart Field Advisor Mobile App',
    category: 'application',
    tagline: 'Cross-platform mobile application providing IoT soil intelligence & climate alerts.',
    description: 'Field advisory mobile application giving agriculturalists real-time sensor telematics, automated irrigation triggers, and AI-assisted crop disease diagnostics.',
    technologies: ['Flutter', 'Dart', 'Node.js', 'PostgreSQL', 'Firebase', 'Figma'],
    startDate: '10 May 2026',
    deadline: '20 Sep 2026',
    progress: 85,
    status: 'Testing',
    image: agritechImg,
    featured: true,
    features: [
      'Offline-first synchronization for low-connectivity zones',
      'Real-time IoT soil moisture sensor dashboard',
      'Automated satellite weather forecast alerts',
      'AI photo-based crop disease diagnosis tool',
    ],
    metrics: [
      { label: 'Farmers Reached', value: '12,000+' },
      { label: 'Yield Increase', value: '+24%' },
    ],
    liveDemoUrl: '#',
    githubUrl: '#',
    createdAt: '2026-05-10',
    updatedAt: '2026-08-12',
  },
  {
    id: 'proj-5',
    clientId: 'client-2',
    clientName: 'Grand Luxe Hospitality Group',
    clientLogo: '🏨',
    title: 'Hotel Concierge & Guest Mobile App',
    category: 'application',
    tagline: 'Keyless room entry, dining ordering, and concierge messaging for luxury hotel guests.',
    description: 'Guest-facing iOS and Android application with Bluetooth digital room key, in-room service ordering, spa bookings, and direct live chat with front desk staff.',
    technologies: ['React Native', 'TypeScript', 'Node.js', 'Socket.io', 'Tailwind'],
    startDate: '01 Jul 2026',
    deadline: '15 Oct 2026',
    progress: 45,
    status: 'In Development',
    image: hotelErpImg,
    featured: false,
    features: [
      'Digital mobile check-in & Bluetooth keycard unlocking',
      'Interactive room service menu with live prep tracking',
      'Direct concierge concierge instant messaging channel',
      'Loyalty points ledger and automated folio preview',
    ],
    metrics: [
      { label: 'Guest Engagement', value: '78%' },
      { label: 'Upsell Revenue', value: '+22%' },
    ],
    liveDemoUrl: '#',
    githubUrl: '#',
    createdAt: '2026-07-01',
    updatedAt: '2026-08-14',
  },
  {
    id: 'proj-6',
    clientId: 'client-3',
    clientName: 'Apex Capital Partners',
    clientLogo: '📊',
    title: 'Smart Warehouse SCM & Inventory ERP',
    category: 'erp',
    tagline: 'Predictive stock forecasting and barcode barcode dispatch optimization.',
    description: 'Cloud inventory and supply chain management system featuring automated barcode scanning, stockout forecasting, and multi-hub transfer routing.',
    technologies: ['Python', 'SQL Server', 'React', 'Express.js', 'Tableau'],
    startDate: '01 Jun 2026',
    deadline: '30 Aug 2026',
    progress: 65,
    status: 'Testing',
    image: inventoryImg,
    featured: true,
    features: [
      'RFID & 2D barcode live inventory scan logger',
      'Automated purchase order trigger on safety threshold',
      'Batch expiration tracking and automated discounting',
      'Optimized warehouse picking route generation',
    ],
    metrics: [
      { label: 'Stockouts Cut', value: '-42%' },
      { label: 'SKUs Tracked', value: '1.2M+' },
    ],
    liveDemoUrl: '#',
    githubUrl: '#',
    createdAt: '2026-06-01',
    updatedAt: '2026-08-11',
  },
];

// Initial Milestones
const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'ms-1',
    projectId: 'proj-1',
    title: 'Requirement Gathering & Architecture Blueprint',
    description: 'Scope definition for PMS, POS, and financial modules.',
    dueDate: '2026-08-05',
    status: 'completed',
    completedAt: '2026-08-05',
    createdAt: '2026-08-01',
  },
  {
    id: 'ms-2',
    projectId: 'proj-1',
    title: 'Database Schema & Front Office Module',
    description: 'Room matrix, guest folios, and reservation workflow.',
    dueDate: '2026-08-15',
    status: 'completed',
    completedAt: '2026-08-14',
    createdAt: '2026-08-01',
  },
  {
    id: 'ms-3',
    projectId: 'proj-1',
    title: 'POS Integration & Night Audit Engine',
    description: 'Restaurant terminal sync and automatic midnight reconciliation.',
    dueDate: '2026-09-05',
    status: 'in_progress',
    createdAt: '2026-08-01',
  },
  {
    id: 'ms-4',
    projectId: 'proj-1',
    title: 'User Acceptance Testing (UAT) & Staff Training',
    description: 'Comprehensive staff simulation with 100 test folios.',
    dueDate: '2026-09-20',
    status: 'pending',
    createdAt: '2026-08-01',
  },
  {
    id: 'ms-5',
    projectId: 'proj-1',
    title: 'Production Cutover & Live Deployment',
    description: 'Final deployment to production cloud cluster.',
    dueDate: '2026-09-30',
    status: 'pending',
    createdAt: '2026-08-01',
  },
  {
    id: 'ms-6',
    projectId: 'proj-2',
    title: 'Requirement Gathering & Wireframing',
    dueDate: '2026-08-04',
    status: 'completed',
    completedAt: '2026-08-04',
    createdAt: '2026-08-01',
  },
  {
    id: 'ms-7',
    projectId: 'proj-2',
    title: 'UI/UX High-Fidelity Design in Figma',
    dueDate: '2026-08-10',
    status: 'completed',
    completedAt: '2026-08-10',
    createdAt: '2026-08-01',
  },
  {
    id: 'ms-8',
    projectId: 'proj-2',
    title: 'Frontend Next.js Components & API Wiring',
    dueDate: '2026-08-25',
    status: 'in_progress',
    createdAt: '2026-08-01',
  },
  {
    id: 'ms-9',
    projectId: 'proj-2',
    title: 'SEO Audit & Final Launch',
    dueDate: '2026-09-25',
    status: 'pending',
    createdAt: '2026-08-01',
  },
];

// Initial Tasks
const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Configure SQL night audit stored procedures',
    description: 'Optimize daily balancing query execution time.',
    assignedTo: 'Thivanka Randimal',
    priority: 'high',
    status: 'completed',
    dueDate: '2026-08-12',
    createdAt: '2026-08-02',
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Finalize POS thermal printer driver communication',
    description: 'Verify kitchen order ticket formatting.',
    assignedTo: 'Thivanka Randimal',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2026-08-22',
    createdAt: '2026-08-05',
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Execute UAT test plan with ABC front desk supervisors',
    description: 'Verify check-in and checkout flows under peak load.',
    assignedTo: 'John Perera',
    priority: 'urgent',
    status: 'todo',
    dueDate: '2026-09-10',
    createdAt: '2026-08-08',
  },
  {
    id: 'task-4',
    projectId: 'proj-2',
    title: 'Implement contact lead routing with email notification',
    assignedTo: 'Thivanka Randimal',
    priority: 'high',
    status: 'completed',
    dueDate: '2026-08-14',
    createdAt: '2026-08-03',
  },
  {
    id: 'task-5',
    projectId: 'proj-2',
    title: 'Integrate client quote calculator component',
    assignedTo: 'Thivanka Randimal',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2026-08-28',
    createdAt: '2026-08-10',
  },
];

// Initial Updates
const INITIAL_UPDATES: ProjectUpdate[] = [
  {
    id: 'upd-1',
    projectId: 'proj-1',
    title: 'Front Office room matrix & folio billing module completed',
    description: 'Finished reservations, check-in/out, folios, and voucher posting. Database queries tested and validated on staging server.',
    progress: 75,
    createdBy: 'Thivanka Randimal',
    createdAt: '15 Aug 2026',
  },
  {
    id: 'upd-2',
    projectId: 'proj-1',
    title: 'SQL Database structure & schema indexes optimized',
    description: 'Deployed revised MS SQL Server schema with foreign key constraints and backup/restore schedules.',
    progress: 60,
    createdBy: 'Thivanka Randimal',
    createdAt: '10 Aug 2026',
  },
  {
    id: 'upd-3',
    projectId: 'proj-2',
    title: 'Homepage, services, and dynamic case study pages completed',
    description: 'Responsive layout verified across mobile, tablet, and ultra-wide desktop breakpoints. Interactive animations integrated.',
    progress: 80,
    createdBy: 'Thivanka Randimal',
    createdAt: '14 Aug 2026',
  },
  {
    id: 'upd-4',
    projectId: 'proj-3',
    title: 'Executive BI telemetry & real-time risk gauges finalized',
    description: 'Completed automated variance reporting and published live board dashboard release.',
    progress: 90,
    createdBy: 'Thivanka Randimal',
    createdAt: '10 Aug 2026',
  },
];

// Initial Project Files
const INITIAL_FILES: ProjectFile[] = [
  {
    id: 'file-1',
    projectId: 'proj-1',
    fileName: 'ABC_Hotel_ERP_Requirement_Spec.pdf',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    uploadedBy: 'Thivanka Randimal',
    createdAt: '2026-08-02',
  },
  {
    id: 'file-2',
    projectId: 'proj-1',
    fileName: 'Hotel_ERP_Database_Schema_v2.sql',
    fileType: 'doc',
    fileSize: '1.2 MB',
    uploadedBy: 'Thivanka Randimal',
    createdAt: '2026-08-10',
  },
  {
    id: 'file-3',
    projectId: 'proj-1',
    fileName: 'ERP_System_Screenshots_Pack.zip',
    fileType: 'zip',
    fileSize: '14.5 MB',
    uploadedBy: 'Thivanka Randimal',
    createdAt: '2026-08-14',
  },
  {
    id: 'file-4',
    projectId: 'proj-2',
    fileName: 'ABC_Company_Website_UI_Figma_Export.pdf',
    fileType: 'pdf',
    fileSize: '8.2 MB',
    uploadedBy: 'Thivanka Randimal',
    createdAt: '2026-08-05',
  },
  {
    id: 'file-5',
    projectId: 'proj-2',
    fileName: 'Website_Content_Assets_Bundle.zip',
    fileType: 'zip',
    fileSize: '22.0 MB',
    uploadedBy: 'Thivanka Randimal',
    createdAt: '2026-08-12',
  },
];

// Initial Phase Payments
const INITIAL_PHASE_PAYMENTS: PhasePayment[] = [
  {
    id: 'pay-1',
    projectId: 'proj-1',
    phaseName: 'Phase 1 – Discovery & Requirements',
    phaseNumber: 1,
    amount: 500,
    currency: 'USD',
    dueDate: '10 Aug 2026',
    status: 'verified',
    verifiedAt: '12 Aug 2026',
    verifiedBy: 'Thivanka Randimal',
    notes: 'Initial discovery payment. Requirements document delivered.',
    createdAt: '2026-08-01',
  },
  {
    id: 'pay-2',
    projectId: 'proj-1',
    phaseName: 'Phase 2 – Core Development',
    phaseNumber: 2,
    amount: 1200,
    currency: 'USD',
    dueDate: '25 Aug 2026',
    status: 'slip_uploaded',
    slipFileName: 'bank_transfer_aug22.jpg',
    slipUploadedAt: '22 Aug 2026',
    notes: 'Front Office & POS modules in progress.',
    createdAt: '2026-08-01',
  },
  {
    id: 'pay-3',
    projectId: 'proj-1',
    phaseName: 'Phase 3 – Testing & Deployment',
    phaseNumber: 3,
    amount: 800,
    currency: 'USD',
    dueDate: '28 Sep 2026',
    status: 'pending',
    notes: 'Final payment due on project completion & UAT sign-off.',
    createdAt: '2026-08-01',
  },
  {
    id: 'pay-4',
    projectId: 'proj-2',
    phaseName: 'Phase 1 – Design & Wireframes',
    phaseNumber: 1,
    amount: 400,
    currency: 'USD',
    dueDate: '05 Aug 2026',
    status: 'verified',
    verifiedAt: '07 Aug 2026',
    verifiedBy: 'Thivanka Randimal',
    notes: 'Figma prototype and wireframe package delivered.',
    createdAt: '2026-08-01',
  },
  {
    id: 'pay-5',
    projectId: 'proj-2',
    phaseName: 'Phase 2 – Development & Launch',
    phaseNumber: 2,
    amount: 900,
    currency: 'USD',
    dueDate: '20 Sep 2026',
    status: 'pending',
    notes: 'Full website development and deployment.',
    createdAt: '2026-08-01',
  },
  {
    id: 'pay-6',
    projectId: 'proj-3',
    phaseName: 'Phase 1 – Dashboard Development',
    phaseNumber: 1,
    amount: 1500,
    currency: 'USD',
    dueDate: '01 Aug 2026',
    status: 'verified',
    verifiedAt: '03 Aug 2026',
    verifiedBy: 'Thivanka Randimal',
    notes: 'Full BI dashboard completed and delivered to client.',
    createdAt: '2026-06-20',
  },
];

// Initial Activity Logs
const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    userId: 'user-1',
    userName: 'Thivanka Randimal',
    projectId: 'proj-1',
    projectTitle: 'ABC Hotel Management System',
    activity: 'Updated progress to 75% and completed Front Office milestone',
    createdAt: 'Just now',
  },
  {
    id: 'act-2',
    userId: 'user-1',
    userName: 'Thivanka Randimal',
    projectId: 'proj-2',
    projectTitle: 'ABC Corporate Web Portal',
    activity: 'Uploaded latest UI mockup designs (8.2 MB)',
    createdAt: '2 hours ago',
  },
  {
    id: 'act-3',
    userId: 'user-1',
    userName: 'Thivanka Randimal',
    projectId: 'proj-3',
    projectTitle: 'Finance Executive BI Dashboard',
    activity: 'Marked project status as Completed (90%)',
    createdAt: 'Yesterday',
  },
  {
    id: 'act-4',
    userId: 'user-1',
    userName: 'Thivanka Randimal',
    activity: 'Created new client profile for ABC Company',
    createdAt: '2 days ago',
  },
];

// Unique ID Generator guaranteeing no duplicates even if called in the same tick
let idSequence = 0;
export const generateUniqueId = (prefix: string = 'id'): string => {
  idSequence = (idSequence + 1) % 1000000;
  const rand = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${Date.now()}-${idSequence}-${rand}`;
};

function sanitizeUniqueItems<T extends { id?: string }>(items: T[], prefix: string): T[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  return items.map((item) => {
    if (!item || typeof item !== 'object') return item;
    if (!item.id || seen.has(item.id)) {
      const newId = generateUniqueId(prefix);
      seen.add(newId);
      return { ...item, id: newId };
    }
    seen.add(item.id);
    return item;
  });
}

interface PortalContextType {
  currentUser: User | null;
  currentView: 'portfolio' | 'admin_dashboard' | 'client_dashboard' | 'bd_dashboard';
  setCurrentView: (view: 'portfolio' | 'admin_dashboard' | 'client_dashboard' | 'bd_dashboard') => void;
  login: (email: string, role?: UserRole) => { success: boolean; message?: string };
  logout: () => void;
  quickLoginAs: (role: UserRole, clientId?: string) => void;
  
  // Projects & Categories
  projects: Project[];
  selectedCategory: 'all' | ProjectCategory;
  setSelectedCategory: (cat: 'all' | ProjectCategory) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateProjectProgress: (id: string, progress: number, status?: ProjectStatus) => void;

  categories: CategoryItem[];
  addCategory: (cat: Omit<CategoryItem, 'id'>) => CategoryItem;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // Fiverr Gigs
  fiverrGigs: FiverrGig[];
  addFiverrGig: (gig: Omit<FiverrGig, 'id' | 'createdAt'>) => FiverrGig;
  updateFiverrGig: (id: string, updates: Partial<FiverrGig>) => void;
  deleteFiverrGig: (id: string) => void;

  // Portfolio Sections CMS
  heroData: HeroSectionData;
  updateHeroData: (updates: Partial<HeroSectionData>) => void;
  addHeroMetric: (metric: MetricStat) => void;
  updateHeroMetric: (index: number, metric: MetricStat) => void;
  deleteHeroMetric: (indexOrId: number | string) => void;

  aboutData: AboutSectionData;
  updateAboutData: (updates: Partial<AboutSectionData>) => void;
  addAboutFeature: (feature: Omit<AboutFeature, 'id'>) => void;
  updateAboutFeature: (id: string, updates: Partial<AboutFeature>) => void;
  deleteAboutFeature: (id: string) => void;

  experienceTimeline: ExperienceItem[];
  addExperienceItem: (item: ExperienceItem) => void;
  updateExperienceItem: (index: number, updates: Partial<ExperienceItem>) => void;
  deleteExperienceItem: (indexOrId: number | string) => void;

  skillsProgress: SkillProgress[];
  addSkillProgress: (skill: SkillProgress) => void;
  updateSkillProgress: (index: number, updates: Partial<SkillProgress>) => void;
  deleteSkillProgress: (indexOrId: number | string) => void;

  techStackGrid: TechIconItem[];
  addTechStackItem: (item: TechIconItem) => void;
  updateTechStackItem: (id: string, updates: Partial<TechIconItem>) => void;
  deleteTechStackItem: (id: string) => void;

  certifications: CertificationItem[];
  addCertification: (cert: CertificationItem) => void;
  updateCertification: (index: number, updates: Partial<CertificationItem>) => void;
  deleteCertification: (indexOrId: number | string) => void;

  qualifications: QualificationItem[];
  addQualification: (qual: QualificationItem) => void;
  updateQualification: (index: number, updates: Partial<QualificationItem>) => void;
  deleteQualification: (indexOrId: number | string) => void;

  education: EducationItem;
  updateEducation: (edu: EducationItem) => void;

  contactInfo: ContactInfoData;
  updateContactInfo: (updates: Partial<ContactInfoData>) => void;

  sectionVisibility: SectionVisibility;
  updateSectionVisibility: (updates: Partial<SectionVisibility>) => void;
  toggleSectionVisibility: (sectionKey: keyof SectionVisibility) => void;

  resetAllToDefaults: () => void;

  // Clients
  clients: Client[];
  addClient: (clientData: { companyName: string; contactPerson: string; email: string; phone: string; address?: string }) => Client;
  deleteClient: (id: string) => void;

  // Milestones
  milestones: Milestone[];
  addMilestone: (data: Omit<Milestone, 'id' | 'createdAt'>) => Milestone;
  toggleMilestoneStatus: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTaskStatus: (id: string, status: 'todo' | 'in_progress' | 'completed') => void;
  deleteTask: (id: string) => void;

  // Updates
  projectUpdates: ProjectUpdate[];
  addProjectUpdate: (data: Omit<ProjectUpdate, 'id' | 'createdAt'>) => ProjectUpdate;

  // Files
  projectFiles: ProjectFile[];
  uploadProjectFile: (data: Omit<ProjectFile, 'id' | 'createdAt'>) => ProjectFile;
  deleteProjectFile: (id: string) => void;

  // Users & Access Control
  users: User[];
  addUser: (data: { name: string; email: string; role: UserRole; companyName?: string }) => User;
  createUserDirect: (data: { name: string; email: string; role: UserRole; companyName?: string; phone?: string; password?: string; status?: UserStatus }) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  // Registration Requests & Payment Slips
  registrations: RegistrationRequest[];
  registerWithPaymentSlip: (
    data: Omit<RegistrationRequest, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'verifiedAt' | 'verifiedBy' | 'createdUserId'>
  ) => { success: boolean; referenceNumber: string; message: string };
  approveRegistration: (registrationId: string) => { success: boolean; message: string; user?: User };
  rejectRegistration: (registrationId: string, reason: string) => { success: boolean; message: string };
  deleteRegistration: (registrationId: string) => void;

  // Activities
  activities: ActivityLog[];
  logActivity: (activity: string, projectId?: string, projectTitle?: string) => void;

  // Phase Payments
  phasePayments: PhasePayment[];
  getPaymentsForProject: (projectId: string) => PhasePayment[];
  addPhasePayment: (data: Omit<PhasePayment, 'id' | 'createdAt'>) => PhasePayment;
  updatePhasePayment: (id: string, updates: Partial<PhasePayment>) => void;
  deletePhasePayment: (id: string) => void;
  uploadPaymentSlip: (id: string, slipUrl: string, slipFileName: string) => void;
  verifyPayment: (id: string) => void;
  rejectPayment: (id: string, reason: string) => void;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (data: Omit<Testimonial, 'id'>) => Testimonial;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Helpers
  getProjectsForClient: (clientId?: string) => Project[];
  getMilestonesForProject: (projectId: string) => Milestone[];
  getTasksForProject: (projectId: string) => Task[];
  getUpdatesForProject: (projectId: string) => ProjectUpdate[];
  getFilesForProject: (projectId: string) => ProjectFile[];
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage-backed state with initial fallbacks
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('trp_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<'portfolio' | 'admin_dashboard' | 'client_dashboard' | 'bd_dashboard'>('portfolio');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('trp_projects');
      if (saved) {
        const raw: Project[] = JSON.parse(saved);
        const cleaned = raw.map((p) => ({
          ...p,
          image: sanitizeProjectImage(p.image, p.id),
          technologies: (p.technologies || []).map((t) => (t === 'MySQL' || t === 'SQL Server' || t === 'SQL' ? 'MongoDB' : t)),
          techStack: (p.techStack || []).map((t) => (t === 'MySQL' || t === 'SQL Server' || t === 'SQL' ? 'MongoDB' : t)),
        }));
        return sanitizeUniqueItems(cleaned, 'proj');
      }
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('trp_categories');
      if (saved) {
        const parsed: CategoryItem[] = JSON.parse(saved);
        const existingSlugs = new Set(parsed.map((c) => c.slug || c.id));
        const missing = INITIAL_CATEGORIES.filter((c) => !existingSlugs.has(c.slug) && !existingSlugs.has(c.id));
        return sanitizeUniqueItems([...parsed, ...missing], 'cat');
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [fiverrGigs, setFiverrGigs] = useState<FiverrGig[]>(() => {
    try {
      const saved = localStorage.getItem('trp_fiverr_gigs');
      if (saved) {
        const parsed: FiverrGig[] = JSON.parse(saved);
        const cleaned: FiverrGig[] = parsed.map((g) => ({
          ...g,
          image: sanitizeProjectImage(g.image) || studentPortalImg,
          badge: '20% - 30% OFF PROMO',
          tags: (g.tags || []).map((t) => (t === 'MySQL' || t === '#MySQL' ? 'MongoDB' : t)),
          description: g.description?.replace(/MySQL/g, 'MongoDB') || g.description,
          packages: g.packages ? {
            basic: { ...g.packages.basic, discountPercent: 20 },
            standard: { ...g.packages.standard, discountPercent: 25 },
            premium: { ...g.packages.premium, discountPercent: 30 },
          } : g.packages,
        }));
        const existingIds = new Set(cleaned.map((g) => g.id));
        const missing = INITIAL_FIVERR_GIGS.filter((g) => !existingIds.has(g.id));
        return sanitizeUniqueItems([...cleaned, ...missing], 'gig');
      }
      return INITIAL_FIVERR_GIGS;
    } catch {
      return INITIAL_FIVERR_GIGS;
    }
  });

  const [heroData, setHeroData] = useState<HeroSectionData>(() => {
    try {
      const saved = localStorage.getItem('trp_hero_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          profileImage: sanitizeHeroImage(parsed.profileImage),
          metrics: sanitizeUniqueItems(parsed.metrics || HERO_DATA.metrics, 'metric'),
        };
      }
      return HERO_DATA;
    } catch {
      return HERO_DATA;
    }
  });

  const [aboutData, setAboutData] = useState<AboutSectionData>(() => {
    try {
      const saved = localStorage.getItem('trp_about_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          features: sanitizeUniqueItems(parsed.features || ABOUT_DATA.features, 'feat'),
        };
      }
      return ABOUT_DATA;
    } catch {
      return ABOUT_DATA;
    }
  });

  const [experienceTimeline, setExperienceTimeline] = useState<ExperienceItem[]>(() => {
    try {
      const saved = localStorage.getItem('trp_experience');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'exp') : EXPERIENCE_TIMELINE;
    } catch {
      return EXPERIENCE_TIMELINE;
    }
  });

  const [skillsProgress, setSkillsProgress] = useState<SkillProgress[]>(() => {
    try {
      const saved = localStorage.getItem('trp_skills_progress');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'skill') : SKILL_PROGRESS_BARS;
    } catch {
      return SKILL_PROGRESS_BARS;
    }
  });

  const [techStackGrid, setTechStackGrid] = useState<TechIconItem[]>(() => {
    try {
      const saved = localStorage.getItem('trp_tech_stack');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'tech') : TECH_STACK_GRID;
    } catch {
      return TECH_STACK_GRID;
    }
  });

  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('trp_certifications');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'cert') : CERTIFICATIONS;
    } catch {
      return CERTIFICATIONS;
    }
  });

  const [qualifications, setQualifications] = useState<QualificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('trp_qualifications');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'qual') : PROFESSIONAL_QUALIFICATIONS;
    } catch {
      return PROFESSIONAL_QUALIFICATIONS;
    }
  });

  const [education, setEducation] = useState<EducationItem>(() => {
    try {
      const saved = localStorage.getItem('trp_education');
      return saved ? JSON.parse(saved) : EDUCATION;
    } catch {
      return EDUCATION;
    }
  });

  const [contactInfo, setContactInfo] = useState<ContactInfoData>(() => {
    try {
      const saved = localStorage.getItem('trp_contact_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        const p1 = parsed.phone1 || (parsed.phone ? parsed.phone.split('/')[0]?.trim() : '') || CONTACT_INFO.phone1 || '+94 70 481 2213';
        const p2 = parsed.phone2 || (parsed.phone && parsed.phone.includes('/') ? parsed.phone.split('/')[1]?.trim() : '') || CONTACT_INFO.phone2 || '+94 78 338 3075';
        return {
          ...CONTACT_INFO,
          ...parsed,
          phone1: p1,
          phone2: p2,
          phone: parsed.phone || `${p1} / ${p2}`,
        };
      }
      return CONTACT_INFO;
    } catch {
      return CONTACT_INFO;
    }
  });

  const INITIAL_SECTION_VISIBILITY: SectionVisibility = {
    hero: true,
    about: true,
    experience: true,
    projects: true,
    fiverrGigs: true,
    skills: true,
    education: true,
    testimonials: true,
    contact: true,
  };

  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(() => {
    try {
      const saved = localStorage.getItem('trp_section_visibility');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SECTION_VISIBILITY,
          ...parsed,
          fiverrGigs: parsed.fiverrGigs !== false,
          testimonials: parsed.testimonials !== false,
        };
      }
      return INITIAL_SECTION_VISIBILITY;
    } catch {
      return INITIAL_SECTION_VISIBILITY;
    }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('trp_clients');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'client') : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('trp_users');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'user') : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem('trp_milestones');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'ms') : INITIAL_MILESTONES;
    } catch {
      return INITIAL_MILESTONES;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('trp_tasks');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'task') : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>(() => {
    try {
      const saved = localStorage.getItem('trp_project_updates');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'upd') : INITIAL_UPDATES;
    } catch {
      return INITIAL_UPDATES;
    }
  });

  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(() => {
    try {
      const saved = localStorage.getItem('trp_project_files');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'file') : INITIAL_FILES;
    } catch {
      return INITIAL_FILES;
    }
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('trp_activities');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'act') : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [registrations, setRegistrations] = useState<RegistrationRequest[]>(() => {
    try {
      const saved = localStorage.getItem('trp_registrations');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'reg') : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('trp_registrations', JSON.stringify(registrations));
    } catch (e) {
      console.error(e);
    }
  }, [registrations]);
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('trp_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('trp_auth_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_projects', JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_fiverr_gigs', JSON.stringify(fiverrGigs));
    } catch (e) {
      console.error(e);
    }
  }, [fiverrGigs]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_hero_data', JSON.stringify(heroData));
    } catch (e) {
      console.error(e);
    }
  }, [heroData]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_about_data', JSON.stringify(aboutData));
    } catch (e) {
      console.error(e);
    }
  }, [aboutData]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_experience', JSON.stringify(experienceTimeline));
    } catch (e) {
      console.error(e);
    }
  }, [experienceTimeline]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_skills_progress', JSON.stringify(skillsProgress));
    } catch (e) {
      console.error(e);
    }
  }, [skillsProgress]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_tech_stack', JSON.stringify(techStackGrid));
    } catch (e) {
      console.error(e);
    }
  }, [techStackGrid]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_certifications', JSON.stringify(certifications));
    } catch (e) {
      console.error(e);
    }
  }, [certifications]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_qualifications', JSON.stringify(qualifications));
    } catch (e) {
      console.error(e);
    }
  }, [qualifications]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_education', JSON.stringify(education));
    } catch (e) {
      console.error(e);
    }
  }, [education]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_contact_info', JSON.stringify(contactInfo));
    } catch (e) {
      console.error(e);
    }
  }, [contactInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_section_visibility', JSON.stringify(sectionVisibility));
    } catch (e) {
      console.error(e);
    }
  }, [sectionVisibility]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_clients', JSON.stringify(clients));
    } catch (e) {
      console.error(e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_milestones', JSON.stringify(milestones));
    } catch (e) {
      console.error(e);
    }
  }, [milestones]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_project_updates', JSON.stringify(projectUpdates));
    } catch (e) {
      console.error(e);
    }
  }, [projectUpdates]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_project_files', JSON.stringify(projectFiles));
    } catch (e) {
      console.error(e);
    }
  }, [projectFiles]);

  useEffect(() => {
    try {
      localStorage.setItem('trp_activities', JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  // Initial sync from MongoDB Atlas
  useEffect(() => {
    const loadMongoDbData = async () => {
      try {
        const res = await fetch('/api/projects');
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          const fetchedProjects = json.data.map((p: any) => ({
            id: p.id || p._id?.toString(),
            clientId: p.clientId || '',
            clientName: p.clientName || '',
            title: p.title || '',
            category: p.category || '',
            description: p.description || '',
            technologies: p.technologies || [],
            startDate: p.startDate || '',
            deadline: p.deadline || '',
            progress: p.progress ?? 0,
            status: p.status || 'Planning',
            image: sanitizeProjectImage(p.image, p.id),
            liveUrl: p.liveUrl || '',
            githubUrl: p.githubUrl || '',
            createdAt: p.createdAt ? String(p.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
            updatedAt: p.updatedAt ? String(p.updatedAt).split('T')[0] : new Date().toISOString().split('T')[0],
          }));

          setProjects((prev) => {
            const map = new Map<string, Project>();
            prev.forEach((item) => map.set(item.id, item));
            fetchedProjects.forEach((item: Project) => map.set(item.id, item));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('Initial MongoDB projects load notice:', err);
      }
    };

    loadMongoDbData();
  }, []);

  const logActivity = (activity: string, projectId?: string, projectTitle?: string) => {
    const newAct: ActivityLog = {
      id: generateUniqueId('act'),
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'System',
      projectId,
      projectTitle,
      activity,
      createdAt: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 40)]);
  };

  // Auth Operations
  const login = (email: string, role?: UserRole): { success: boolean; message?: string } => {
    const trimmed = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email.toLowerCase() === trimmed);

    if (foundUser) {
      // Check user account status
      if (foundUser.status === 'pending_verification') {
        return {
          success: false,
          message:
            'Your account registration and payment slip are currently pending verification by the administrator. Once approved, your login will be activated immediately.',
        };
      }
      if (foundUser.status === 'rejected') {
        return {
          success: false,
          message:
            'Your registration could not be approved. Please review the requirements or contact the developer directly.',
        };
      }
      if (foundUser.status === 'inactive') {
        return {
          success: false,
          message: 'This account has been deactivated. Please contact the administrator.',
        };
      }

      // If logging into admin dashboard or requesting admin role, ensure user is actually an admin
      if (role === 'admin' && foundUser.role !== 'admin') {
        return {
          success: false,
          message: 'Access denied: Client accounts do not have administrator portal permissions.',
        };
      }

      setCurrentUser(foundUser);
      if (foundUser.role === 'admin') {
        setCurrentView('admin_dashboard');
      } else if (foundUser.role === 'business_development') {
        setCurrentView('bd_dashboard');
      } else {
        setCurrentView('client_dashboard');
      }
      logActivity(`Logged in as ${foundUser.name}`);
      return { success: true };
    }

    // Direct match not found - if explicit role was requested
    if (role === 'admin') {
      return {
        success: false,
        message: 'No administrator account found with this email. Please check your credentials.',
      };
    }

    // Check if there is a matching BD Partner profile in localStorage
    try {
      const savedBD = localStorage.getItem('bd_profiles');
      if (savedBD) {
        const bdList = JSON.parse(savedBD);
        const foundBD = bdList.find(
          (b: any) =>
            b.email.toLowerCase() === trimmed ||
            (b.username && b.username.toLowerCase() === trimmed) ||
            (b.bdId && b.bdId.toLowerCase() === trimmed)
        );
        if (foundBD) {
          if (foundBD.status === 'PENDING' || foundBD.status === 'UNDER_REVIEW') {
            return {
              success: false,
              message: 'Your BD Partner application is currently pending admin verification. Once verified, you will be able to log in.',
            };
          }
          if (foundBD.status === 'REJECTED') {
            return {
              success: false,
              message: `Your BD application was rejected. Reason: ${foundBD.rejectionReason || 'Requirements not met'}`,
            };
          }
          if (foundBD.status === 'SUSPENDED') {
            return {
              success: false,
              message: 'Your BD Partner account has been temporarily suspended by the administrator.',
            };
          }
          const bdUser: User = {
            id: foundBD.userId || foundBD.id,
            name: foundBD.fullName,
            email: foundBD.email,
            role: 'business_development',
            status: 'active',
            companyName: foundBD.companyName,
            phone: foundBD.phone,
            password: foundBD.password || 'bd123',
            createdAt: foundBD.createdAt,
          };
          setCurrentUser(bdUser);
          setCurrentView('bd_dashboard');
          logActivity(`Logged in as BD Partner ${bdUser.name}`);
          return { success: true };
        }
      }
    } catch {
      // ignore
    }

    // Check if there is a pending registration with this email
    const pendingReg = registrations.find(
      (r) => r.email.toLowerCase() === trimmed && r.status === 'pending'
    );
    if (pendingReg) {
      return {
        success: false,
        message: `Registration Ref #${pendingReg.referenceNumber} is pending payment slip verification by the administrator.`,
      };
    }

    return {
      success: false,
      message: 'Account not found. Please register your account and submit your payment slip for administrator approval.',
    };
  };

  const logout = () => {
    if (currentUser) {
      logActivity(`Logged out (${currentUser.name})`);
    }
    setCurrentUser(null);
    setCurrentView('portfolio');
  };

  const quickLoginAs = (role: UserRole, clientId?: string) => {
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(admin);
      setCurrentView('admin_dashboard');
      logActivity(`Quick-authenticated as Admin (${admin.name})`);
    } else {
      const targetClient = clientId
        ? clients.find((c) => c.id === clientId)
        : clients[0];
      const clientUser =
        users.find((u) => u.clientId === targetClient?.id) ||
        users.find((u) => u.role === 'client') ||
        INITIAL_USERS[1];
      setCurrentUser(clientUser);
      setCurrentView('client_dashboard');
      logActivity(`Quick-authenticated as Client (${targetClient?.companyName || clientUser.name})`);
    }
  };

  // Projects CRUD
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const id = generateUniqueId('proj');
    const newProj: Project = {
      ...projectData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProj, ...prev]);
    logActivity(`Created new project "${newProj.title}" (${newProj.category})`, id, newProj.title);

    // Sync to MongoDB Atlas
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj),
    }).catch((err) => console.warn('MongoDB project sync error:', err));

    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
          logActivity(`Updated project details for "${updated.title}"`, id, updated.title);

          // Sync to MongoDB Atlas
          fetch('/api/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch((err) => console.warn('MongoDB project update error:', err));

          return updated;
        }
        return p;
      })
    );
  };

  const deleteProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setMilestones((prev) => prev.filter((m) => m.projectId !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    setProjectUpdates((prev) => prev.filter((u) => u.projectId !== id));
    setProjectFiles((prev) => prev.filter((f) => f.projectId !== id));
    logActivity(`Deleted project "${proj?.title || id}"`);

    // Sync to MongoDB Atlas
    fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('MongoDB project delete error:', err));
  };

  const updateProjectProgress = (id: string, progress: number, status?: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = status || (progress === 100 ? 'Completed' : p.status);
          const updated = {
            ...p,
            progress: Math.min(100, Math.max(0, progress)),
            status: newStatus,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          logActivity(`Updated "${p.title}" progress to ${progress}% (${newStatus})`, id, p.title);
          return updated;
        }
        return p;
      })
    );
  };

  // Clients CRUD
  const addClient = (data: { companyName: string; contactPerson: string; email: string; phone: string; address?: string }): Client => {
    const clientId = generateUniqueId('client');
    const userId = generateUniqueId('user');

    const newUser: User = {
      id: userId,
      name: `${data.contactPerson} (${data.companyName})`,
      email: data.email,
      role: 'client',
      clientId: clientId,
      companyName: data.companyName,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const newClient: Client = {
      id: clientId,
      userId: userId,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      address: data.address,
      logo: '🏢',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setClients((prev) => [...prev, newClient]);
    logActivity(`Added new client "${newClient.companyName}" (${newClient.contactPerson})`);
    return newClient;
  };

  const deleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    setUsers((prev) => prev.filter((u) => u.clientId !== id));
    logActivity(`Removed client "${client?.companyName || id}"`);
  };

  // Milestones CRUD
  const addMilestone = (data: Omit<Milestone, 'id' | 'createdAt'>): Milestone => {
    const newMs: Milestone = {
      ...data,
      id: generateUniqueId('ms'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMilestones((prev) => [...prev, newMs]);
    const proj = projects.find((p) => p.id === data.projectId);
    logActivity(`Added milestone "${newMs.title}" to ${proj?.title || 'project'}`, data.projectId, proj?.title);
    return newMs;
  };

  const toggleMilestoneStatus = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'completed' ? 'pending' : 'completed';
          const completedAt = nextStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined;
          logActivity(`Milestone "${m.title}" marked as ${nextStatus}`, m.projectId);
          return { ...m, status: nextStatus, completedAt };
        }
        return m;
      })
    );
  };

  // Tasks CRUD
  const addTask = (data: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...data,
      id: generateUniqueId('task'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [...prev, newTask]);
    const proj = projects.find((p) => p.id === data.projectId);
    logActivity(`Added task "${newTask.title}" for ${proj?.title || 'project'}`, data.projectId, proj?.title);
    return newTask;
  };

  const updateTaskStatus = (id: string, status: 'todo' | 'in_progress' | 'completed') => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          logActivity(`Task "${t.title}" status changed to ${status}`, t.projectId);
          return { ...t, status };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    const t = tasks.find((item) => item.id === id);
    setTasks((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Deleted task "${t?.title || id}"`, t?.projectId);
  };

  // Updates CRUD
  const addProjectUpdate = (data: Omit<ProjectUpdate, 'id' | 'createdAt'>): ProjectUpdate => {
    const newUpd: ProjectUpdate = {
      ...data,
      id: generateUniqueId('upd'),
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setProjectUpdates((prev) => [newUpd, ...prev]);

    // Also update parent project progress
    if (data.progress !== undefined) {
      updateProjectProgress(data.projectId, data.progress);
    }
    const proj = projects.find((p) => p.id === data.projectId);
    logActivity(`Posted update on "${proj?.title}": ${newUpd.title}`, data.projectId, proj?.title);
    return newUpd;
  };

  // Categories CRUD
  const addCategory = (cat: Omit<CategoryItem, 'id'>): CategoryItem => {
    const newCat: CategoryItem = {
      ...cat,
      id: generateUniqueId('cat'),
    };
    setCategories((prev) => [...prev, newCat]);
    logActivity(`Added new category "${newCat.name}" (${newCat.icon})`);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          logActivity(`Updated category "${updated.name}"`);
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCategory = (id: string) => {
    const c = categories.find((item) => item.id === id);
    setCategories((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Deleted category "${c?.name || id}"`);
  };

  // Fiverr Gigs CRUD
  const addFiverrGig = (gig: Omit<FiverrGig, 'id' | 'createdAt'>): FiverrGig => {
    const newGig: FiverrGig = {
      ...gig,
      id: generateUniqueId('gig'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFiverrGigs((prev) => [newGig, ...prev]);
    logActivity(`Published new Fiverr service gig "${newGig.title}"`);
    return newGig;
  };

  const updateFiverrGig = (id: string, updates: Partial<FiverrGig>) => {
    setFiverrGigs((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...updates };
          logActivity(`Updated Fiverr gig "${updated.title}"`);
          return updated;
        }
        return g;
      })
    );
  };

  const deleteFiverrGig = (id: string) => {
    const g = fiverrGigs.find((item) => item.id === id);
    setFiverrGigs((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Removed Fiverr gig "${g?.title || id}"`);
  };

  // Portfolio Section CMS Handlers
  const updateHeroData = (updates: Partial<HeroSectionData>) => {
    setHeroData((prev) => ({ ...prev, ...updates }));
    logActivity(`Updated Hero profile header data`);
  };

  const addHeroMetric = (metric: MetricStat) => {
    const metricWithId = {
      ...metric,
      id: metric.id || generateUniqueId('metric'),
    };
    setHeroData((prev) => ({
      ...prev,
      metrics: [...prev.metrics, metricWithId],
    }));
    logActivity(`Added hero metric "${metric.label}: ${metric.value}"`);
  };

  const updateHeroMetric = (indexOrId: number | string, metric: MetricStat) => {
    setHeroData((prev) => {
      const next = [...prev.metrics];
      if (typeof indexOrId === 'number') {
        next[indexOrId] = metric;
      } else {
        const foundIdx = next.findIndex((m) => m.id === indexOrId || m.label === indexOrId);
        if (foundIdx !== -1) next[foundIdx] = metric;
        else next.push(metric);
      }
      return { ...prev, metrics: next };
    });
    logActivity(`Updated hero metric "${metric.label}: ${metric.value}"`);
  };

  const deleteHeroMetric = (indexOrId: number | string) => {
    setHeroData((prev) => {
      const next = prev.metrics.filter((m, idx) =>
        typeof indexOrId === 'number' ? idx !== indexOrId : m.id !== indexOrId && m.label !== indexOrId
      );
      return { ...prev, metrics: next };
    });
    logActivity(`Deleted hero metric`);
  };

  const updateAboutData = (updates: Partial<AboutSectionData>) => {
    setAboutData((prev) => ({ ...prev, ...updates }));
    logActivity(`Updated About Section data`);
  };

  const addAboutFeature = (feature: Omit<AboutFeature, 'id'>) => {
    const newFeat: AboutFeature = {
      ...feature,
      id: generateUniqueId('feat'),
    };
    setAboutData((prev) => ({
      ...prev,
      features: [...prev.features, newFeat],
    }));
    logActivity(`Added about highlight card "${newFeat.title}"`);
  };

  const updateAboutFeature = (id: string, updates: Partial<AboutFeature>) => {
    setAboutData((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
    logActivity(`Updated about highlight card`);
  };

  const deleteAboutFeature = (id: string) => {
    setAboutData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
    logActivity(`Removed about highlight card`);
  };

  const addExperienceItem = (item: ExperienceItem) => {
    const itemWithId = {
      ...item,
      id: item.id || generateUniqueId('exp'),
    };
    setExperienceTimeline((prev) => [itemWithId, ...prev]);
    logActivity(`Added career experience "${item.role}" at ${item.company}`);
  };

  const updateExperienceItem = (indexOrId: number | string, updates: Partial<ExperienceItem>) => {
    setExperienceTimeline((prev) => {
      const next = [...prev];
      if (typeof indexOrId === 'number') {
        next[indexOrId] = { ...next[indexOrId], ...updates };
      } else {
        const foundIdx = next.findIndex((e) => e.id === indexOrId || `${e.role}-${e.company}` === indexOrId);
        if (foundIdx !== -1) {
          next[foundIdx] = { ...next[foundIdx], ...updates };
        }
      }
      return next;
    });
    logActivity(`Updated career experience item`);
  };

  const deleteExperienceItem = (indexOrId: number | string) => {
    setExperienceTimeline((prev) =>
      prev.filter((exp, idx) =>
        typeof indexOrId === 'number'
          ? idx !== indexOrId
          : exp.id !== indexOrId && `${exp.role}-${exp.company}` !== indexOrId
      )
    );
    logActivity(`Deleted career experience item`);
  };

  const addSkillProgress = (skill: SkillProgress) => {
    const skillWithId = {
      ...skill,
      id: skill.id || generateUniqueId('skill'),
    };
    setSkillsProgress((prev) => [...prev, skillWithId]);
    logActivity(`Added skill progress "${skill.name}" (${skill.percentage}%)`);
  };

  const updateSkillProgress = (indexOrId: number | string, updates: Partial<SkillProgress>) => {
    setSkillsProgress((prev) => {
      const next = [...prev];
      if (typeof indexOrId === 'number') {
        next[indexOrId] = { ...next[indexOrId], ...updates };
      } else {
        const foundIdx = next.findIndex((s) => s.id === indexOrId || s.name === indexOrId);
        if (foundIdx !== -1) {
          next[foundIdx] = { ...next[foundIdx], ...updates };
        }
      }
      return next;
    });
    logActivity(`Updated skill progress`);
  };

  const deleteSkillProgress = (indexOrId: number | string) => {
    setSkillsProgress((prev) =>
      prev.filter((sk, idx) =>
        typeof indexOrId === 'number'
          ? idx !== indexOrId
          : sk.id !== indexOrId && sk.name !== indexOrId
      )
    );
    logActivity(`Deleted skill progress item`);
  };

  const addTechStackItem = (item: TechIconItem) => {
    const itemWithId = {
      ...item,
      id: item.id || generateUniqueId('tech'),
    };
    setTechStackGrid((prev) => [...prev, itemWithId]);
    logActivity(`Added tech stack item "${item.name}"`);
  };

  const updateTechStackItem = (id: string, updates: Partial<TechIconItem>) => {
    setTechStackGrid((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    logActivity(`Updated tech stack item "${id}"`);
  };

  const deleteTechStackItem = (id: string) => {
    setTechStackGrid((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Deleted tech stack item "${id}"`);
  };

  const addCertification = (cert: CertificationItem) => {
    const certWithId = {
      ...cert,
      id: cert.id || generateUniqueId('cert'),
    };
    setCertifications((prev) => [...prev, certWithId]);
    logActivity(`Added certification "${cert.title}"`);
  };

  const updateCertification = (indexOrId: number | string, updates: Partial<CertificationItem>) => {
    setCertifications((prev) => {
      const next = [...prev];
      if (typeof indexOrId === 'number') {
        next[indexOrId] = { ...next[indexOrId], ...updates };
      } else {
        const foundIdx = next.findIndex((c) => c.id === indexOrId || c.title === indexOrId);
        if (foundIdx !== -1) {
          next[foundIdx] = { ...next[foundIdx], ...updates };
        }
      }
      return next;
    });
    logActivity(`Updated certification`);
  };

  const deleteCertification = (indexOrId: number | string) => {
    setCertifications((prev) =>
      prev.filter((cert, idx) =>
        typeof indexOrId === 'number'
          ? idx !== indexOrId
          : cert.id !== indexOrId && cert.title !== indexOrId
      )
    );
    logActivity(`Deleted certification`);
  };

  const addQualification = (qual: QualificationItem) => {
    const qualWithId = {
      ...qual,
      id: qual.id || generateUniqueId('qual'),
    };
    setQualifications((prev) => [...prev, qualWithId]);
    logActivity(`Added professional qualification "${qual.title}"`);
  };

  const updateQualification = (indexOrId: number | string, updates: Partial<QualificationItem>) => {
    setQualifications((prev) => {
      const next = [...prev];
      if (typeof indexOrId === 'number') {
        next[indexOrId] = { ...next[indexOrId], ...updates };
      } else {
        const foundIdx = next.findIndex((q) => q.id === indexOrId || q.title === indexOrId);
        if (foundIdx !== -1) {
          next[foundIdx] = { ...next[foundIdx], ...updates };
        }
      }
      return next;
    });
    logActivity(`Updated professional qualification`);
  };

  const deleteQualification = (indexOrId: number | string) => {
    setQualifications((prev) =>
      prev.filter((qual, idx) =>
        typeof indexOrId === 'number'
          ? idx !== indexOrId
          : qual.id !== indexOrId && qual.title !== indexOrId
      )
    );
    logActivity(`Deleted professional qualification`);
  };

  const updateEducation = (edu: EducationItem) => {
    setEducation(edu);
    logActivity(`Updated academic education credentials`);
  };

  const updateContactInfo = (updates: Partial<ContactInfoData>) => {
    setContactInfo((prev) => ({ ...prev, ...updates }));
    logActivity(`Updated contact & social profiles info`);
  };

  const updateSectionVisibility = (updates: Partial<SectionVisibility>) => {
    setSectionVisibility((prev) => ({ ...prev, ...updates }));
    logActivity(`Updated page section visibility`);
  };

  const toggleSectionVisibility = (sectionKey: keyof SectionVisibility) => {
    setSectionVisibility((prev) => {
      const next = { ...prev, [sectionKey]: !prev[sectionKey] };
      logActivity(`Toggled section "${sectionKey}" visibility to ${next[sectionKey] ? 'visible' : 'hidden'}`);
      return next;
    });
  };

  const resetAllToDefaults = () => {
    setProjects(INITIAL_PROJECTS);
    setCategories(INITIAL_CATEGORIES);
    setFiverrGigs(INITIAL_FIVERR_GIGS);
    setHeroData(HERO_DATA);
    setAboutData(ABOUT_DATA);
    setExperienceTimeline(EXPERIENCE_TIMELINE);
    setSkillsProgress(SKILL_PROGRESS_BARS);
    setTechStackGrid(TECH_STACK_GRID);
    setCertifications(CERTIFICATIONS);
    setQualifications(PROFESSIONAL_QUALIFICATIONS);
    setEducation(EDUCATION);
    setContactInfo(CONTACT_INFO);
    setSectionVisibility(INITIAL_SECTION_VISIBILITY);
    setClients(INITIAL_CLIENTS);
    setUsers(INITIAL_USERS);
    setMilestones(INITIAL_MILESTONES);
    setTasks(INITIAL_TASKS);
    setProjectUpdates(INITIAL_UPDATES);
    setProjectFiles(INITIAL_FILES);
    logActivity('Reset all portfolio & portal state to default seeds');
  };

  // Files CRUD
  const uploadProjectFile = (data: Omit<ProjectFile, 'id' | 'createdAt'>): ProjectFile => {
    const newFile: ProjectFile = {
      ...data,
      id: generateUniqueId('file'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjectFiles((prev) => [newFile, ...prev]);
    const proj = projects.find((p) => p.id === data.projectId);
    logActivity(`Uploaded file "${newFile.fileName}" (${newFile.fileSize})`, data.projectId, proj?.title);
    return newFile;
  };

  const deleteProjectFile = (id: string) => {
    const f = projectFiles.find((item) => item.id === id);
    setProjectFiles((prev) => prev.filter((item) => item.id !== id));
    logActivity(`Removed file "${f?.fileName || id}"`, f?.projectId);
  };

  // Users CRUD & Admin Controls
  const addUser = (data: { name: string; email: string; role: UserRole; companyName?: string }): User => {
    const newUser: User = {
      id: generateUniqueId('user'),
      name: data.name,
      email: data.email,
      password: data.role === 'admin' ? 'admin123' : 'client123',
      role: data.role,
      companyName: data.companyName,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    logActivity(`Created new ${data.role} account for ${data.name}`);
    return newUser;
  };

  const createUserDirect = (data: {
    name: string;
    email: string;
    role: UserRole;
    companyName?: string;
    phone?: string;
    password?: string;
    status?: UserStatus;
  }): User => {
    const now = new Date().toISOString().split('T')[0];
    const newUser: User = {
      id: generateUniqueId('user'),
      name: data.name,
      email: data.email,
      password: data.password || (data.role === 'admin' ? 'admin123' : 'client123'),
      role: data.role,
      companyName: data.companyName,
      phone: data.phone,
      status: data.status || 'active',
      createdAt: now,
    };

    // If client with company name, ensure matching Client record exists
    if (data.role === 'client' && data.companyName) {
      const existingClient = clients.find(
        (c) => c.companyName.toLowerCase() === data.companyName!.toLowerCase()
      );
      if (existingClient) {
        newUser.clientId = existingClient.id;
      } else {
        const newClient: Client = {
          id: generateUniqueId('client'),
          userId: newUser.id,
          companyName: data.companyName,
          contactPerson: data.name,
          email: data.email,
          phone: data.phone || '+94 77 000 0000',
          createdAt: now,
        };
        setClients((prev) => [...prev, newClient]);
        newUser.clientId = newClient.id;
      }
    }

    setUsers((prev) => [...prev, newUser]);
    logActivity(`Admin directly created ${data.role} user "${data.name}" (${data.email})`);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          logActivity(`Updated user profile for "${updated.name}"`);
          return updated;
        }
        return u;
      })
    );
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    logActivity(`Deleted user account "${target?.name || id}"`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next: UserStatus = u.status === 'active' ? 'inactive' : 'active';
          logActivity(`User ${u.name} status updated to ${next}`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  // Client Registration with Payment Slip Operations
  const registerWithPaymentSlip = (
    data: Omit<RegistrationRequest, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'verifiedAt' | 'verifiedBy' | 'createdUserId'>
  ): { success: boolean; referenceNumber: string; message: string } => {
    const now = new Date().toISOString().split('T')[0];
    const refNum = 'REG-2026-' + Math.floor(1000 + Math.random() * 9000);

    const newReg: RegistrationRequest = {
      ...data,
      id: generateUniqueId('reg'),
      referenceNumber: refNum,
      status: 'pending',
      createdAt: now,
    };

    // Pre-create or link pending user record
    const existingUser = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (!existingUser) {
      const pendingUser: User = {
        id: generateUniqueId('user'),
        name: data.name,
        email: data.email,
        password: data.password || 'client123',
        role: 'client',
        companyName: data.companyName,
        phone: data.phone,
        status: 'pending_verification',
        registrationRef: refNum,
        createdAt: now,
      };
      setUsers((prev) => [...prev, pendingUser]);
      newReg.createdUserId = pendingUser.id;
    } else {
      newReg.createdUserId = existingUser.id;
    }

    setRegistrations((prev) => [newReg, ...prev]);
    logActivity(`New client registration submitted with payment slip by ${data.name} (${refNum})`);

    // Sync to MongoDB Atlas
    fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReg),
    }).catch((err) => console.warn('MongoDB registration sync error:', err));

    return {
      success: true,
      referenceNumber: refNum,
      message: `Registration reference #${refNum} recorded! Your payment slip has been submitted to administrator Thivanka for verification. You will be able to log in as soon as it is approved.`,
    };
  };

  const approveRegistration = (registrationId: string): { success: boolean; message: string; user?: User } => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return { success: false, message: 'Registration request not found.' };

    const now = new Date().toISOString().split('T')[0];

    // 1. Create or Find Client Organization
    let targetClientId = '';
    const existingClient = clients.find((c) => c.email.toLowerCase() === reg.email.toLowerCase() || (reg.companyName && c.companyName.toLowerCase() === reg.companyName.toLowerCase()));
    if (existingClient) {
      targetClientId = existingClient.id;
    } else {
      const newClient: Client = {
        id: generateUniqueId('client'),
        userId: reg.createdUserId || generateUniqueId('user'),
        companyName: reg.companyName || `${reg.name}'s Organization`,
        contactPerson: reg.name,
        email: reg.email,
        phone: reg.phone,
        createdAt: now,
      };
      setClients((prev) => [...prev, newClient]);
      targetClientId = newClient.id;
    }

    // 2. Activate or Create User
    let activatedUser: User | undefined;
    setUsers((prev) => {
      const existing = prev.find((u) => u.email.toLowerCase() === reg.email.toLowerCase());
      if (existing) {
        activatedUser = {
          ...existing,
          status: 'active',
          role: 'client',
          clientId: targetClientId,
          companyName: reg.companyName,
          phone: reg.phone || existing.phone,
        };
        return prev.map((u) => (u.id === existing.id ? activatedUser! : u));
      } else {
        activatedUser = {
          id: reg.createdUserId || generateUniqueId('user'),
          name: reg.name,
          email: reg.email,
          password: reg.password || 'client123',
          role: 'client',
          clientId: targetClientId,
          companyName: reg.companyName,
          phone: reg.phone,
          status: 'active',
          registrationRef: reg.referenceNumber,
          createdAt: now,
        };
        return [...prev, activatedUser];
      }
    });

    // 3. Mark Registration as Approved
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === registrationId
          ? {
              ...r,
              status: 'approved',
              verifiedAt: now,
              verifiedBy: currentUser?.name || 'Thivanka Randimal (Admin)',
            }
          : r
      )
    );

    logActivity(`Admin verified payment slip and activated account for ${reg.name} (${reg.referenceNumber})`);

    return {
      success: true,
      message: `Verified payment slip for ${reg.name}. Client account activated successfully!`,
      user: activatedUser,
    };
  };

  const rejectRegistration = (registrationId: string, reason: string): { success: boolean; message: string } => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return { success: false, message: 'Registration request not found.' };

    const now = new Date().toISOString().split('T')[0];

    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === registrationId
          ? {
              ...r,
              status: 'rejected',
              rejectionReason: reason || 'Payment slip details could not be verified.',
              verifiedAt: now,
              verifiedBy: currentUser?.name || 'Administrator',
            }
          : r
      )
    );

    // Update user status to rejected
    setUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === reg.email.toLowerCase()
          ? { ...u, status: 'rejected' }
          : u
      )
    );

    logActivity(`Rejected registration request #${reg.referenceNumber} (${reason})`);
    return { success: true, message: 'Registration request rejected.' };
  };

  const deleteRegistration = (registrationId: string) => {
    const target = registrations.find((r) => r.id === registrationId);
    setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
    logActivity(`Deleted registration log #${target?.referenceNumber || registrationId}`);
  };

  // ── Phase Payment State ─────────────────────────────────────────────────
  const [phasePayments, setPhasePayments] = useState<PhasePayment[]>(() => {
    try {
      const saved = localStorage.getItem('trp_phase_payments');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'pay') : INITIAL_PHASE_PAYMENTS;
    } catch {
      return INITIAL_PHASE_PAYMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trp_phase_payments', JSON.stringify(phasePayments));
    } catch (e) { console.error(e); }
  }, [phasePayments]);

  const getPaymentsForProject = (projectId: string): PhasePayment[] =>
    phasePayments.filter((p) => p.projectId === projectId).sort((a, b) => a.phaseNumber - b.phaseNumber);

  const addPhasePayment = (data: Omit<PhasePayment, 'id' | 'createdAt'>): PhasePayment => {
    const newPayment: PhasePayment = {
      ...data,
      id: generateUniqueId('pay'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPhasePayments((prev) => [...prev, newPayment]);
    logActivity(`Added Phase ${data.phaseNumber} payment ($${data.amount}) for project`);
    return newPayment;
  };

  const updatePhasePayment = (id: string, updates: Partial<PhasePayment>) => {
    setPhasePayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePhasePayment = (id: string) => {
    setPhasePayments((prev) => prev.filter((p) => p.id !== id));
  };

  const uploadPaymentSlip = (id: string, slipUrl: string, slipFileName: string) => {
    setPhasePayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'slip_uploaded' as PaymentStatus,
              slipUrl,
              slipFileName,
              slipUploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : p
      )
    );
    logActivity(`Client uploaded payment slip for phase payment`);
  };

  const verifyPayment = (id: string) => {
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setPhasePayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'verified' as PaymentStatus,
              verifiedAt: now,
              verifiedBy: currentUser?.name || 'Thivanka Randimal',
              rejectionReason: undefined,
            }
          : p
      )
    );
    logActivity(`Verified phase payment slip`);
  };

  const rejectPayment = (id: string, reason: string) => {
    setPhasePayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'rejected' as PaymentStatus,
              rejectionReason: reason,
            }
          : p
      )
    );
    logActivity(`Rejected phase payment slip: ${reason}`);
  };

  // ── Testimonials State ─────────────────────────────────────────────────
  const INITIAL_TESTIMONIALS: Testimonial[] = [
    {
      id: 'tst-1',
      name: 'Rajith Perera',
      role: 'Managing Director',
      company: 'ABC Company',
      avatarInitials: 'RP',
      avatarColor: '#6366f1',
      rating: 5,
      quote: 'Thivanka delivered an exceptional Hotel Management ERP that completely transformed our operations. The system integrates our PMS, POS, and financial modules seamlessly. Highly professional and always on time.',
      projectType: 'ERP System',
      date: 'Aug 2026',
      featured: true,
    },
    {
      id: 'tst-2',
      name: 'Sarah Fernando',
      role: 'CEO',
      company: 'Grand Luxe Hospitality Group',
      avatarInitials: 'SF',
      avatarColor: '#ec4899',
      rating: 5,
      quote: 'Outstanding web portal development. The design is stunning and the performance is top-notch. Our booking inquiries have increased by 40% since launch. Would absolutely recommend.',
      projectType: 'Website',
      date: 'Aug 2026',
      featured: true,
    },
    {
      id: 'tst-3',
      name: 'David Silva',
      role: 'CFO',
      company: 'Apex Capital Partners',
      avatarInitials: 'DS',
      avatarColor: '#10b981',
      rating: 5,
      quote: 'The financial BI dashboard is exactly what we needed. Real-time data visualization, complex KPI tracking, and beautiful charts. Delivered ahead of schedule with zero bugs.',
      projectType: 'Financial Dashboard',
      date: 'Jul 2026',
      featured: false,
    },
    {
      id: 'tst-4',
      name: 'Mahesh Gunasekara',
      role: 'CTO',
      company: 'AgriTech Global Holdings',
      avatarInitials: 'MG',
      avatarColor: '#f59e0b',
      rating: 5,
      quote: 'We hired Thivanka for a complex agricultural management platform and the results exceeded all expectations. Clean architecture, excellent documentation, and responsive support throughout.',
      projectType: 'Application',
      date: 'Jun 2026',
      featured: false,
    },
    {
      id: 'tst-5',
      name: 'Nuwan Bandara',
      role: 'Product Manager',
      company: 'TechStart LK',
      avatarInitials: 'NB',
      avatarColor: '#8b5cf6',
      rating: 5,
      quote: 'Incredible React & Node.js development skills. Built our entire SaaS platform from scratch with clean, maintainable code. A true professional who understands business requirements.',
      projectType: 'Web Application',
      date: 'May 2026',
      featured: false,
    },
    {
      id: 'tst-6',
      name: 'Priya Wickramasinghe',
      role: 'Operations Manager',
      company: 'Ceylon Exports Ltd',
      avatarInitials: 'PW',
      avatarColor: '#0ea5e9',
      rating: 5,
      quote: 'From the first meeting to final delivery, Thivanka was professional, communicative, and delivered beyond our expectations. Our new ERP has cut manual work by 70%.',
      projectType: 'ERP System',
      date: 'Apr 2026',
      featured: false,
    },
  ];

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('trp_testimonials');
      return saved ? sanitizeUniqueItems(JSON.parse(saved), 'tst') : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trp_testimonials', JSON.stringify(testimonials));
    } catch (e) { console.error(e); }
  }, [testimonials]);

  const addTestimonial = (data: Omit<Testimonial, 'id'>): Testimonial => {
    const t: Testimonial = { ...data, id: generateUniqueId('tst') };
    setTestimonials((prev) => [...prev, t]);
    return t;
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter Helpers
  const getProjectsForClient = (clientId?: string): Project[] => {
    if (!clientId && currentUser?.role === 'client') {
      const activeClientId = currentUser.clientId;
      if (!activeClientId) return [];
      return projects.filter((p) => p.clientId === activeClientId);
    }
    if (clientId) {
      return projects.filter((p) => p.clientId === clientId);
    }
    return projects;
  };

  const getMilestonesForProject = (projectId: string): Milestone[] => {
    return milestones.filter((m) => m.projectId === projectId);
  };

  const getTasksForProject = (projectId: string): Task[] => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getUpdatesForProject = (projectId: string): ProjectUpdate[] => {
    return projectUpdates.filter((u) => u.projectId === projectId);
  };

  const getFilesForProject = (projectId: string): ProjectFile[] => {
    return projectFiles.filter((f) => f.projectId === projectId);
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        currentView,
        setCurrentView,
        login,
        logout,
        quickLoginAs,
        projects,
        selectedCategory,
        setSelectedCategory,
        addProject,
        updateProject,
        deleteProject,
        updateProjectProgress,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        fiverrGigs,
        addFiverrGig,
        updateFiverrGig,
        deleteFiverrGig,
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
        clients,
        addClient,
        deleteClient,
        milestones,
        addMilestone,
        toggleMilestoneStatus,
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        projectUpdates,
        addProjectUpdate,
        projectFiles,
        uploadProjectFile,
        deleteProjectFile,
        users,
        addUser,
        createUserDirect,
        updateUser,
        deleteUser,
        toggleUserStatus,
        registrations,
        registerWithPaymentSlip,
        approveRegistration,
        rejectRegistration,
        deleteRegistration,
        activities,
        logActivity,
        phasePayments,
        getPaymentsForProject,
        addPhasePayment,
        updatePhasePayment,
        deletePhasePayment,
        uploadPaymentSlip,
        verifyPayment,
        rejectPayment,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        getProjectsForClient,
        getMilestonesForProject,
        getTasksForProject,
        getUpdatesForProject,
        getFilesForProject,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
