export interface MetricStat {
  id?: string;
  label: string;
  value: string;
  subtext?: string;
}

export type ProjectCategory = string;

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  color?: string;
  badgeColor?: string;
}

export interface FiverrPackage {
  name: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  deliveryDays: number;
  revisions: string;
  features: string[];
}

export interface FiverrGig {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  ordersInQueue?: number;
  fiverrUrl: string;
  badge?: string;
  tags: string[];
  packages: {
    basic: FiverrPackage;
    standard: FiverrPackage;
    premium: FiverrPackage;
  };
  featured?: boolean;
  createdAt?: string;
}

export interface HeroSectionData {
  firstName: string;
  lastName: string;
  title: string;
  subTitle: string;
  location: string;
  profileImage: string;
  metrics: MetricStat[];
}

export interface AboutFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface AboutSectionData {
  heading: string;
  description: string;
  bioDetails?: string;
  features: AboutFeature[];
}

export interface ContactInfoData {
  email: string;
  phone?: string;
  phone1?: string;
  phone2?: string;
  location: string;
  fiverrUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  whatsappUrl?: string;
  availabilityStatus?: string;
}

export type ProjectStatus = 'Planning' | 'In Development' | 'Testing' | 'Completed' | 'Maintenance';

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  clientLogo?: string;
  title: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  technologies: string[];
  techStack?: string[];
  startDate: string;
  deadline: string;
  progress: number;
  status: ProjectStatus;
  image: string;
  featured?: boolean;
  features?: string[];
  metrics?: { label: string; value: string }[];
  liveDemoUrl?: string;
  githubUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'client';
export type UserStatus = 'active' | 'inactive' | 'pending_verification' | 'rejected';

export interface RegistrationRequest {
  id: string;
  referenceNumber: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  companyName: string;
  serviceId?: string;
  serviceTitle?: string;
  packageTier?: 'basic' | 'standard' | 'premium';
  packagePrice?: number;
  originalPrice?: number;
  discountPercent?: number;
  referralCode?: string;
  referralDiscount?: number;
  finalAmount?: number;
  paymentSlipUrl: string;
  paymentSlipFileName: string;
  paymentSlipFileSize?: string;
  paymentReference?: string;
  paymentDate?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdUserId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  clientId?: string;
  companyName?: string;
  phone?: string;
  status: UserStatus;
  registrationRef?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  logo?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'completed' | 'pending' | 'in_progress';
  completedAt?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'completed';
  dueDate?: string;
  createdAt: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  description: string;
  progress: number;
  createdBy: string;
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  fileName: string;
  fileType: 'pdf' | 'zip' | 'doc' | 'image' | 'figma' | 'other';
  fileSize: string;
  fileUrl?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  projectId?: string;
  projectTitle?: string;
  activity: string;
  createdAt: string;
}

export interface SkillProgress {
  id?: string;
  name: string;
  percentage: number;
}

export interface TechIconItem {
  id: string;
  name: string;
  code: string;
  category: string;
  description?: string;
}

export interface ExperienceItem {
  id?: string;
  period: string;
  role: string;
  company: string;
  description: string;
  highlights?: string[];
}

export interface CertificationItem {
  id?: string;
  title: string;
  issuer: string;
  badge?: string;
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  specialization: string;
}

export interface QualificationItem {
  id?: string;
  title: string;
  institution: string;
  badge?: string;
  description?: string;
}

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  experience: boolean;
  projects: boolean;
  fiverrGigs: boolean;
  skills: boolean;
  education: boolean;
  testimonials: boolean;
  contact: boolean;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  avatarInitials?: string;
  avatarColor?: string;
  rating: number; // 1-5
  quote: string;
  projectType?: string;
  date?: string;
  featured?: boolean;
}

export type PaymentStatus = 'pending' | 'slip_uploaded' | 'verified' | 'rejected';

export interface PhasePayment {
  id: string;
  projectId: string;
  milestoneId?: string;
  phaseName: string;
  phaseNumber: number;
  amount: number;
  currency: string;
  dueDate: string;
  status: PaymentStatus;
  slipUrl?: string;
  slipFileName?: string;
  slipUploadedAt?: string;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
  createdAt: string;
}
