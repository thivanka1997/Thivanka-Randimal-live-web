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

export type UserRole = 'admin' | 'client' | 'business_development';

// ============================================================
// BD PORTAL TYPES
// ============================================================

export type BDStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type LeadStatus =
  | 'NEW'
  | 'PENDING_ADMIN_REVIEW'
  | 'ASSIGNED'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'REQUIREMENT_GATHERING'
  | 'QUOTATION_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'PROJECT_STARTED'
  | 'PROJECT_COMPLETED'
  | 'NOT_INTERESTED'
  | 'FOLLOW_UP_LATER'
  | 'NO_RESPONSE'
  | 'LOST'
  | 'DUPLICATE';

export type LeadSource =
  | 'ADMIN'
  | 'BD_REFERRAL'
  | 'WEBSITE'
  | 'SOCIAL_MEDIA'
  | 'GOOGLE'
  | 'DIRECT'
  | 'OTHER';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type BDTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';

export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';

export type BDProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface BDProfile {
  id: string;
  userId?: string;
  // Personal
  fullName: string;
  profilePhoto?: string;
  nicPassport?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  username?: string;
  password?: string;
  address?: string;
  city?: string;
  province?: string;
  // Professional
  companyName?: string;
  jobPosition?: string;
  industry?: string;
  experience?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  // Referral Info
  previousExperience?: string;
  preferredServices?: string[];
  expectedMonthlyReferrals?: string;
  howHeardAboutUs?: string;
  // Agreement
  agreedToTerms: boolean;
  agreedToReferralProgram: boolean;
  agreedToPrivacyPolicy: boolean;
  // Status & IDs
  status: BDStatus;
  bdId?: string;          // e.g. BD-00001
  referralCode?: string;  // auto-generated unique code
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  suspendedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReferralAccount {
  id: string;
  bdProfileId: string;
  bdId: string;
  referralCode: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  leadId: string; // human-readable e.g. LD-00001
  // Business Info
  businessName: string;
  clientName?: string;
  category?: string;
  businessType?: string;
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
  alternativePhone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  googleMaps?: string;
  // Lead Metadata
  leadSource: LeadSource;
  assignedBdId?: string;  // BD partner assigned
  assignedBdName?: string;
  leadPriority: LeadPriority;
  leadScore?: number;
  interestedService?: string;
  requirement?: string;
  estimatedBudget?: number;
  estimatedProjectValue?: number;
  expectedClosingDate?: string;
  // Referral Attribution (NEVER overwrite)
  referralBdId?: string;
  referralCode?: string;
  submittedBy?: string;   // BD user who submitted
  approvedBy?: string;
  approvedAt?: string;
  // Status & Tracking
  status: LeadStatus;
  notes?: string;
  lastContactDate?: string;
  nextFollowupDate?: string;
  // Excel import fields
  rating?: number;
  reviewCount?: number;
  // Audit
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface LeadStatusHistory {
  id: string;
  leadId: string;
  fromStatus: LeadStatus;
  toStatus: LeadStatus;
  changedBy: string;
  changedByRole: UserRole;
  notes?: string;
  createdAt: string;
}

export interface LeadAssignment {
  id: string;
  leadId: string;
  leadName: string;
  bdId: string;
  bdName: string;
  priority: LeadPriority;
  task?: string;
  deadline?: string;
  instructions?: string;
  assignedBy: string;
  createdAt: string;
}

export interface BDTask {
  id: string;
  taskId: string; // human-readable
  title: string;
  leadId?: string;
  leadName?: string;
  clientName?: string;
  bdId: string;
  bdName: string;
  priority: LeadPriority;
  dueDate?: string;
  status: BDTaskStatus;
  adminInstructions?: string;
  bdNotes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface BDClient {
  id: string;
  clientId: string; // human-readable
  businessName: string;
  clientName?: string;
  category?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  socialMedia?: string;
  leadSource: LeadSource;
  bdPartnerId?: string;
  bdPartnerName?: string;
  leadId?: string;
  requirement?: string;
  projectType?: string;
  budget?: number;
  projectValue?: number;
  quotation?: string;
  paymentStatus?: string;
  projectStatus?: string;
  notes?: string;
  createdAt: string;
}

export interface BDProject {
  id: string;
  projectId: string; // human-readable
  clientId?: string;
  clientName: string;
  leadId?: string;
  bdPartnerId?: string;
  bdPartnerName?: string;
  service?: string;
  projectValue?: number;
  startDate?: string;
  expectedCompletion?: string;
  status: BDProjectStatus;
  paymentStatus?: string;
  notes?: string;
  createdAt: string;
}

export interface CommissionRule {
  id: string;
  service: string;          // e.g. "Basic Website"
  commissionPercent: number; // e.g. 20
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Commission {
  id: string;
  commissionId: string; // human-readable
  bdId: string;
  bdName: string;
  leadId?: string;
  projectId?: string;
  clientName: string;
  service: string;
  projectValue: number;
  commissionPercent: number;
  commissionAmount: number;
  status: CommissionStatus;
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
}

export interface BDNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  relatedEntity?: string;
  relatedEntityId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}
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
  username?: string;
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
