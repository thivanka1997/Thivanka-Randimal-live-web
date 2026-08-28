'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BDProfile,
  BDStatus,
  Lead,
  LeadStatus,
  LeadPriority,
  LeadAssignment,
  BDTask,
  BDTaskStatus,
  BDClient,
  BDProject,
  CommissionRule,
  Commission,
  CommissionStatus,
  BDNotification,
  AuditLog,
  UserRole,
  LeadStatusHistory,
} from '../types';

// ─── ID Generators ──────────────────────────────────────────────────────────

let bdIdSequence = 0;
const generateBDUniqueId = (prefix: string): string => {
  bdIdSequence = (bdIdSequence + 1) % 1000000;
  return `${prefix}-${Date.now()}-${bdIdSequence}-${Math.random().toString(36).substring(2, 7)}`;
};

const generateBDSequentialId = (existing: BDProfile[]): string => {
  const nums = existing
    .map((p) => p.bdId)
    .filter(Boolean)
    .map((id) => parseInt(id!.replace('BD-', ''), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `BD-${String(next).padStart(5, '0')}`;
};

const generateReferralCode = (existing: BDProfile[]): string => {
  const existingCodes = new Set(existing.map((p) => p.referralCode).filter(Boolean));
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let attempts = 0;
  do {
    code = 'BD-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    attempts++;
  } while (existingCodes.has(code) && attempts < 100);
  return code;
};

const generateLeadId = (existing: Lead[]): string => {
  const nums = existing
    .map((l) => l.leadId)
    .filter(Boolean)
    .map((id) => parseInt(id.replace('LD-', ''), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `LD-${String(next).padStart(5, '0')}`;
};

const generateTaskId = (existing: BDTask[]): string => {
  const nums = existing
    .map((t) => t.taskId)
    .filter(Boolean)
    .map((id) => parseInt(id.replace('BT-', ''), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `BT-${String(next).padStart(5, '0')}`;
};

const generateCommissionId = (existing: Commission[]): string => {
  const nums = existing
    .map((c) => c.commissionId)
    .filter(Boolean)
    .map((id) => parseInt(id.replace('CM-', ''), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `CM-${String(next).padStart(5, '0')}`;
};

// ─── Default Commission Rules ────────────────────────────────────────────────

const DEFAULT_COMMISSION_RULES: CommissionRule[] = [
  { id: 'cr-1', service: 'Basic Website', commissionPercent: 20, description: 'Static or simple dynamic website', isActive: true, createdAt: new Date().toISOString() },
  { id: 'cr-2', service: 'Standard Website', commissionPercent: 25, description: 'CMS or e-commerce website', isActive: true, createdAt: new Date().toISOString() },
  { id: 'cr-3', service: 'Premium Website', commissionPercent: 30, description: 'Complex web application', isActive: true, createdAt: new Date().toISOString() },
  { id: 'cr-4', service: 'Mobile Application', commissionPercent: 25, description: 'iOS or Android app', isActive: true, createdAt: new Date().toISOString() },
  { id: 'cr-5', service: 'ERP System', commissionPercent: 20, description: 'Enterprise resource planning system', isActive: true, createdAt: new Date().toISOString() },
  { id: 'cr-6', service: 'Financial Dashboard', commissionPercent: 22, description: 'BI and financial reporting', isActive: true, createdAt: new Date().toISOString() },
  { id: 'cr-7', service: 'Other', commissionPercent: 15, description: 'Other digital services', isActive: true, createdAt: new Date().toISOString() },
];

// ─── Context Type ────────────────────────────────────────────────────────────

interface BDContextType {
  bdProfiles: BDProfile[];
  registerBDPartner: (data: Omit<BDProfile, 'id' | 'status' | 'createdAt'>) => { success: boolean; message: string };
  addBDPartnerDirect: (data: Partial<BDProfile> & { fullName: string; email: string; phone: string }) => BDProfile;
  verifyBDPartner: (id: string, adminName: string, notes?: string) => { success: boolean; bdId: string; referralCode: string };
  rejectBDPartner: (id: string, reason: string) => void;
  suspendBDPartner: (id: string) => void;
  reactivateBDPartner: (id: string) => void;
  updateBDProfile: (id: string, updates: Partial<BDProfile>) => void;
  deleteBDPartner: (id: string) => void;
  getBDProfileByUserId: (userId: string) => BDProfile | undefined;
  getBDProfileByBdId: (bdId: string) => BDProfile | undefined;

  leads: Lead[];
  addLead: (data: Omit<Lead, 'id' | 'leadId' | 'createdAt'>) => Lead;
  addLeadsFromImport: (data: Array<Omit<Lead, 'id' | 'leadId' | 'createdAt'>>) => { imported: number; duplicates: number; errors: number };
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStatus: (id: string, status: LeadStatus, changedBy: string, changedByRole: UserRole, notes?: string) => void;
  deleteLead: (id: string) => void;
  getLeadsForBD: (bdId: string) => Lead[];

  leadStatusHistory: LeadStatusHistory[];

  leadAssignments: LeadAssignment[];
  assignLead: (data: Omit<LeadAssignment, 'id' | 'createdAt'>) => LeadAssignment;

  bdTasks: BDTask[];
  addBDTask: (data: Omit<BDTask, 'id' | 'taskId' | 'createdAt'>) => BDTask;
  updateBDTaskStatus: (id: string, status: BDTaskStatus, bdNotes?: string) => void;
  getBDTasksForPartner: (bdId: string) => BDTask[];

  bdClients: BDClient[];
  addBDClient: (data: Omit<BDClient, 'id' | 'clientId' | 'createdAt'>) => BDClient;

  bdProjects: BDProject[];
  addBDProject: (data: Omit<BDProject, 'id' | 'projectId' | 'createdAt'>) => BDProject;
  updateBDProject: (id: string, updates: Partial<BDProject>) => void;

  commissionRules: CommissionRule[];
  addCommissionRule: (data: Omit<CommissionRule, 'id' | 'createdAt'>) => CommissionRule;
  updateCommissionRule: (id: string, updates: Partial<CommissionRule>) => void;
  deleteCommissionRule: (id: string) => void;
  getCommissionRateForService: (service: string) => number;

  commissions: Commission[];
  createCommission: (data: Omit<Commission, 'id' | 'commissionId' | 'createdAt'>) => Commission;
  approveCommission: (id: string, approvedBy: string) => void;
  payCommission: (id: string, paymentReference: string) => void;
  cancelCommission: (id: string) => void;
  getCommissionsForBD: (bdId: string) => Commission[];

  bdNotifications: BDNotification[];
  addNotification: (data: Omit<BDNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: (userId: string) => void;
  getNotificationsForUser: (userId: string) => BDNotification[];

  auditLogs: AuditLog[];
  addAuditLog: (data: Omit<AuditLog, 'id' | 'createdAt'>) => void;

  findDuplicateLead: (data: { phone?: string; email?: string; businessName?: string; website?: string; googleMaps?: string; address?: string }) => Lead | undefined;
}

const BDContext = createContext<BDContextType | undefined>(undefined);

const ls = {
  get: <T,>(key: string, fallback: T): T => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
  },
  set: <T,>(key: string, val: T) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
  },
};

const DEFAULT_BD_PROFILES: BDProfile[] = [
  {
    id: 'bdp-default-1',
    userId: 'user-bd-1',
    fullName: 'Kasun Perera',
    email: 'bd@thivanka.dev',
    username: 'bd.kasun',
    password: 'bd123',
    phone: '+94 77 123 4567',
    whatsapp: '+94 77 123 4567',
    nicPassport: '951234567V',
    companyName: 'Apex Growth Marketing',
    jobPosition: 'BD Manager',
    city: 'Colombo',
    province: 'Western',
    status: 'VERIFIED',
    bdId: 'BD-00001',
    referralCode: 'BD-LK7890',
    verifiedBy: 'Admin',
    verifiedAt: '2026-08-01T00:00:00.000Z',
    agreedToTerms: true,
    agreedToReferralProgram: true,
    agreedToPrivacyPolicy: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'bdp-default-2',
    userId: 'user-bd-2',
    fullName: 'Maduka',
    email: 'maduka@trp.com',
    username: 'maduka',
    password: 'bd123',
    phone: '+94 77 644 0674',
    whatsapp: '+94 77 644 0674',
    companyName: 'TRP Business Development',
    jobPosition: 'BD Partner',
    city: 'Colombo',
    province: 'Western',
    status: 'VERIFIED',
    bdId: 'BD-00002',
    referralCode: 'BD-LK5566',
    verifiedBy: 'Admin',
    verifiedAt: '2026-08-01T00:00:00.000Z',
    agreedToTerms: true,
    agreedToReferralProgram: true,
    agreedToPrivacyPolicy: true,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
];

// ─── Provider ────────────────────────────────────────────────────────────────

export const BDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bdProfiles, setBdProfiles] = useState<BDProfile[]>(() => {
    const stored = ls.get<BDProfile[]>('bd_profiles', []);
    return stored.length > 0 ? stored : DEFAULT_BD_PROFILES;
  });
  const [leads, setLeads] = useState<Lead[]>(() => ls.get('bd_leads', []));
  const [leadStatusHistory, setLeadStatusHistory] = useState<LeadStatusHistory[]>(() => ls.get('bd_lead_status_history', []));
  const [leadAssignments, setLeadAssignments] = useState<LeadAssignment[]>(() => ls.get('bd_lead_assignments', []));
  const [bdTasks, setBdTasks] = useState<BDTask[]>(() => ls.get('bd_tasks', []));
  const [bdClients, setBdClients] = useState<BDClient[]>(() => ls.get('bd_clients', []));
  const [bdProjects, setBdProjects] = useState<BDProject[]>(() => ls.get('bd_projects', []));
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(() => ls.get('bd_commission_rules', DEFAULT_COMMISSION_RULES));
  const [commissions, setCommissions] = useState<Commission[]>(() => ls.get('bd_commissions', []));
  const [bdNotifications, setBdNotifications] = useState<BDNotification[]>(() => ls.get('bd_notifications', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => ls.get('bd_audit_logs', []));

  useEffect(() => { ls.set('bd_profiles', bdProfiles); }, [bdProfiles]);
  useEffect(() => { ls.set('bd_leads', leads); }, [leads]);
  useEffect(() => { ls.set('bd_lead_status_history', leadStatusHistory); }, [leadStatusHistory]);
  useEffect(() => { ls.set('bd_lead_assignments', leadAssignments); }, [leadAssignments]);
  useEffect(() => { ls.set('bd_tasks', bdTasks); }, [bdTasks]);
  useEffect(() => { ls.set('bd_clients', bdClients); }, [bdClients]);
  useEffect(() => { ls.set('bd_projects', bdProjects); }, [bdProjects]);
  useEffect(() => { ls.set('bd_commission_rules', commissionRules); }, [commissionRules]);
  useEffect(() => { ls.set('bd_commissions', commissions); }, [commissions]);
  useEffect(() => { ls.set('bd_notifications', bdNotifications); }, [bdNotifications]);
  useEffect(() => { ls.set('bd_audit_logs', auditLogs); }, [auditLogs]);

  const addAuditLog = (data: Omit<AuditLog, 'id' | 'createdAt'>) => {
    const log: AuditLog = { ...data, id: generateBDUniqueId('al'), createdAt: new Date().toISOString() };
    setAuditLogs((prev) => [log, ...prev.slice(0, 499)]);
  };

  const addNotification = (data: Omit<BDNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const n: BDNotification = { ...data, id: generateBDUniqueId('notif'), isRead: false, createdAt: new Date().toISOString() };
    setBdNotifications((prev) => [n, ...prev.slice(0, 199)]);
  };

  const markNotificationRead = (id: string) =>
    setBdNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));

  const markAllRead = (userId: string) =>
    setBdNotifications((prev) => prev.map((n) => n.userId === userId ? { ...n, isRead: true } : n));

  const getNotificationsForUser = (userId: string) => bdNotifications.filter((n) => n.userId === userId);

  const registerBDPartner = (data: Omit<BDProfile, 'id' | 'status' | 'createdAt'>): { success: boolean; message: string } => {
    const existing = bdProfiles.find((p) => p.email.toLowerCase() === data.email.toLowerCase());
    if (existing) return { success: false, message: 'An application with this email already exists.' };
    const profile: BDProfile = { ...data, id: generateBDUniqueId('bdp'), status: 'PENDING', createdAt: new Date().toISOString() };
    setBdProfiles((prev) => [profile, ...prev]);
    addAuditLog({ userId: 'system', userName: data.fullName, userRole: 'business_development', action: 'BD_REGISTRATION', entity: 'BDProfile', entityId: profile.id, newValue: data.fullName });
    return { success: true, message: 'Application submitted successfully.' };
  };

  const verifyBDPartner = (id: string, adminName: string, notes?: string): { success: boolean; bdId: string; referralCode: string } => {
    let generatedBdId = '';
    let generatedReferralCode = '';
    setBdProfiles((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          generatedBdId = generateBDSequentialId(prev);
          generatedReferralCode = generateReferralCode(prev);
          return { ...p, status: 'VERIFIED' as BDStatus, bdId: generatedBdId, referralCode: generatedReferralCode, verifiedBy: adminName, verifiedAt: new Date().toISOString(), adminNotes: notes || p.adminNotes };
        }
        return p;
      });
      return updated;
    });
    addAuditLog({ userId: 'admin', userName: adminName, userRole: 'admin', action: 'BD_VERIFICATION', entity: 'BDProfile', entityId: id, newValue: `BD ID: ${generatedBdId}` });
    return { success: true, bdId: generatedBdId, referralCode: generatedReferralCode };
  };

  const rejectBDPartner = (id: string, reason: string) => {
    setBdProfiles((prev) => prev.map((p) => p.id === id ? { ...p, status: 'REJECTED' as BDStatus, rejectedAt: new Date().toISOString(), rejectionReason: reason } : p));
    addAuditLog({ userId: 'admin', userName: 'Admin', userRole: 'admin', action: 'BD_REJECTION', entity: 'BDProfile', entityId: id, newValue: reason });
  };

  const suspendBDPartner = (id: string) => {
    setBdProfiles((prev) => prev.map((p) => p.id === id ? { ...p, status: 'SUSPENDED' as BDStatus, suspendedAt: new Date().toISOString() } : p));
  };

  const reactivateBDPartner = (id: string) => {
    setBdProfiles((prev) => prev.map((p) => p.id === id ? { ...p, status: 'VERIFIED' as BDStatus, suspendedAt: undefined } : p));
  };

  const addBDPartnerDirect = (data: Partial<BDProfile> & { fullName: string; email: string; phone: string }): BDProfile => {
    const profileId = generateBDUniqueId('bdp');
    const autoBdId = data.bdId || generateBDSequentialId(bdProfiles);
    const autoRefCode = data.referralCode || generateReferralCode(bdProfiles);
    const newProfile: BDProfile = {
      id: profileId,
      fullName: data.fullName,
      email: data.email,
      username: data.username || data.email,
      password: data.password || 'bd123',
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      nicPassport: data.nicPassport || '',
      city: data.city || 'Colombo',
      province: data.province || 'Western',
      companyName: data.companyName || '',
      jobPosition: data.jobPosition || 'BD Partner',
      industry: data.industry || 'IT & Technology',
      experience: data.experience || '1-3 Years',
      website: data.website || '',
      linkedin: data.linkedin || '',
      preferredServices: data.preferredServices || ['Basic Website', 'Standard Website', 'Mobile Application'],
      expectedMonthlyReferrals: data.expectedMonthlyReferrals || '4-10',
      status: (data.status as BDStatus) || 'VERIFIED',
      bdId: autoBdId,
      referralCode: autoRefCode,
      verifiedBy: 'Admin (Direct)',
      verifiedAt: new Date().toISOString(),
      agreedToTerms: true,
      agreedToReferralProgram: true,
      agreedToPrivacyPolicy: true,
      createdAt: new Date().toISOString(),
    };
    setBdProfiles((prev) => [newProfile, ...prev]);
    addAuditLog({ userId: 'admin', userName: 'Admin', userRole: 'admin', action: 'BD_DIRECT_CREATE', entity: 'BDProfile', entityId: newProfile.id, newValue: `Created partner ${newProfile.fullName} (${newProfile.bdId})` });
    return newProfile;
  };

  const updateBDProfile = (id: string, updates: Partial<BDProfile>) => {
    setBdProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)));
    addAuditLog({ userId: 'admin', userName: 'Admin', userRole: 'admin', action: 'BD_PROFILE_UPDATE', entity: 'BDProfile', entityId: id, newValue: 'Updated profile' });
  };

  const deleteBDPartner = (id: string) => {
    const target = bdProfiles.find((p) => p.id === id);
    setBdProfiles((prev) => prev.filter((p) => p.id !== id));
    addAuditLog({ userId: 'admin', userName: 'Admin', userRole: 'admin', action: 'BD_PARTNER_DELETE', entity: 'BDProfile', entityId: id, newValue: `Deleted ${target?.fullName || id}` });
  };

  const getBDProfileByUserId = (userId: string) => bdProfiles.find((p) => p.userId === userId);
  const getBDProfileByBdId = (bdId: string) => bdProfiles.find((p) => p.bdId === bdId);

  const findDuplicateLead = (data: { phone?: string; email?: string; businessName?: string; website?: string; googleMaps?: string; address?: string }): Lead | undefined => {
    return leads.find((l) => {
      if (data.phone && l.phone && l.phone.replace(/\s/g, '') === data.phone.replace(/\s/g, '')) return true;
      if (data.email && l.email && l.email.toLowerCase() === data.email.toLowerCase()) return true;
      if (data.businessName && l.businessName && l.businessName.toLowerCase() === data.businessName.toLowerCase()) return true;
      if (data.website && l.website && l.website.toLowerCase().replace(/\/+$/, '') === data.website.toLowerCase().replace(/\/+$/, '')) return true;
      return false;
    });
  };

  const addLead = (data: Omit<Lead, 'id' | 'leadId' | 'createdAt'>): Lead => {
    const lead: Lead = { ...data, id: generateBDUniqueId('lead'), leadId: generateLeadId(leads), createdAt: new Date().toISOString() };
    setLeads((prev) => [lead, ...prev]);
    addAuditLog({ userId: data.createdBy || 'system', userName: data.submittedBy || 'System', userRole: data.leadSource === 'BD_REFERRAL' ? 'business_development' : 'admin', action: 'LEAD_CREATED', entity: 'Lead', entityId: lead.id, newValue: lead.businessName });
    return lead;
  };

  const addLeadsFromImport = (dataArr: Array<Omit<Lead, 'id' | 'leadId' | 'createdAt'>>): { imported: number; duplicates: number; errors: number } => {
    let imported = 0, duplicates = 0, errors = 0;
    const newLeads: Lead[] = [];
    for (const data of dataArr) {
      try {
        const dup = findDuplicateLead({ phone: data.phone, email: data.email, businessName: data.businessName });
        if (dup) { duplicates++; continue; }
        const lead: Lead = { ...data, id: generateBDUniqueId('lead'), leadId: generateLeadId([...leads, ...newLeads]), createdAt: new Date().toISOString() };
        newLeads.push(lead);
        imported++;
      } catch { errors++; }
    }
    if (newLeads.length > 0) setLeads((prev) => [...newLeads, ...prev]);
    return { imported, duplicates, errors };
  };

  const updateLead = (id: string, updates: Partial<Lead>) =>
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l));

  const updateLeadStatus = (id: string, status: LeadStatus, changedBy: string, changedByRole: UserRole, notes?: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    const history: LeadStatusHistory = { id: generateBDUniqueId('lsh'), leadId: id, fromStatus: lead.status, toStatus: status, changedBy, changedByRole, notes, createdAt: new Date().toISOString() };
    setLeadStatusHistory((prev) => [history, ...prev]);
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l));
    addAuditLog({ userId: changedBy, userName: changedBy, userRole: changedByRole, action: 'LEAD_STATUS_CHANGED', entity: 'Lead', entityId: id, oldValue: lead.status, newValue: status });
  };

  const deleteLead = (id: string) =>
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: 'DUPLICATE' as LeadStatus } : l));

  const getLeadsForBD = (bdId: string) => leads.filter((l) => l.assignedBdId === bdId || l.referralBdId === bdId);

  const addBDTask = (data: Omit<BDTask, 'id' | 'taskId' | 'createdAt'>): BDTask => {
    const task: BDTask = { ...data, id: generateBDUniqueId('bdt'), taskId: generateTaskId(bdTasks), createdAt: new Date().toISOString() };
    setBdTasks((prev) => [task, ...prev]);
    return task;
  };

  const assignLead = (data: Omit<LeadAssignment, 'id' | 'createdAt'>): LeadAssignment => {
    const assignment: LeadAssignment = { ...data, id: generateBDUniqueId('la'), createdAt: new Date().toISOString() };
    setLeadAssignments((prev) => [assignment, ...prev]);
    updateLead(data.leadId, { assignedBdId: data.bdId, assignedBdName: data.bdName, leadPriority: data.priority, status: 'ASSIGNED' });
    if (data.task) {
      addBDTask({ title: data.task, leadId: data.leadId, leadName: data.leadName, bdId: data.bdId, bdName: data.bdName, priority: data.priority, dueDate: data.deadline, status: 'PENDING', adminInstructions: data.instructions });
    }
    addAuditLog({ userId: 'admin', userName: data.assignedBy, userRole: 'admin', action: 'LEAD_ASSIGNED', entity: 'Lead', entityId: data.leadId, newValue: `Assigned to ${data.bdName}` });
    return assignment;
  };

  const updateBDTaskStatus = (id: string, status: BDTaskStatus, bdNotes?: string) =>
    setBdTasks((prev) => prev.map((t) => t.id === id ? { ...t, status, bdNotes: bdNotes || t.bdNotes, completedAt: status === 'COMPLETED' ? new Date().toISOString() : t.completedAt } : t));

  const getBDTasksForPartner = (bdId: string) => bdTasks.filter((t) => t.bdId === bdId);

  const addBDClient = (data: Omit<BDClient, 'id' | 'clientId' | 'createdAt'>): BDClient => {
    const nums = bdClients.map((c) => parseInt(c.clientId.replace('CL-', ''), 10)).filter((n) => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    const client: BDClient = { ...data, id: generateBDUniqueId('bdc'), clientId: `CL-${String(next).padStart(5, '0')}`, createdAt: new Date().toISOString() };
    setBdClients((prev) => [client, ...prev]);
    return client;
  };

  const addBDProject = (data: Omit<BDProject, 'id' | 'projectId' | 'createdAt'>): BDProject => {
    const nums = bdProjects.map((p) => parseInt(p.projectId.replace('BP-', ''), 10)).filter((n) => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    const project: BDProject = { ...data, id: generateBDUniqueId('bdpr'), projectId: `BP-${String(next).padStart(5, '0')}`, createdAt: new Date().toISOString() };
    setBdProjects((prev) => [project, ...prev]);
    addAuditLog({ userId: 'admin', userName: 'Admin', userRole: 'admin', action: 'BD_PROJECT_CREATED', entity: 'BDProject', entityId: project.id, newValue: project.clientName });
    return project;
  };

  const updateBDProject = (id: string, updates: Partial<BDProject>) =>
    setBdProjects((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p));

  const addCommissionRule = (data: Omit<CommissionRule, 'id' | 'createdAt'>): CommissionRule => {
    const rule: CommissionRule = { ...data, id: generateBDUniqueId('cr'), createdAt: new Date().toISOString() };
    setCommissionRules((prev) => [...prev, rule]);
    return rule;
  };

  const updateCommissionRule = (id: string, updates: Partial<CommissionRule>) =>
    setCommissionRules((prev) => prev.map((r) => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));

  const deleteCommissionRule = (id: string) =>
    setCommissionRules((prev) => prev.map((r) => r.id === id ? { ...r, isActive: false } : r));

  const getCommissionRateForService = (service: string): number => {
    const rule = commissionRules.find((r) => r.isActive && r.service.toLowerCase() === service.toLowerCase());
    return rule?.commissionPercent ?? 20;
  };

  const createCommission = (data: Omit<Commission, 'id' | 'commissionId' | 'createdAt'>): Commission => {
    const commission: Commission = { ...data, id: generateBDUniqueId('cm'), commissionId: generateCommissionId(commissions), createdAt: new Date().toISOString() };
    setCommissions((prev) => [commission, ...prev]);
    addAuditLog({ userId: 'admin', userName: 'Admin', userRole: 'admin', action: 'COMMISSION_CREATED', entity: 'Commission', entityId: commission.id, newValue: `${data.bdName} – ${data.commissionAmount}` });
    return commission;
  };

  const approveCommission = (id: string, approvedBy: string) => {
    setCommissions((prev) => prev.map((c) => c.id === id ? { ...c, status: 'APPROVED' as CommissionStatus, approvedBy, approvedDate: new Date().toISOString() } : c));
    addAuditLog({ userId: 'admin', userName: approvedBy, userRole: 'admin', action: 'COMMISSION_APPROVED', entity: 'Commission', entityId: id });
  };

  const payCommission = (id: string, paymentReference: string) => {
    setCommissions((prev) => prev.map((c) => c.id === id ? { ...c, status: 'PAID' as CommissionStatus, paidDate: new Date().toISOString(), paymentReference } : c));
    addAuditLog({ userId: 'admin', userName: 'Admin', userRole: 'admin', action: 'COMMISSION_PAID', entity: 'Commission', entityId: id, newValue: paymentReference });
  };

  const cancelCommission = (id: string) =>
    setCommissions((prev) => prev.map((c) => c.id === id ? { ...c, status: 'CANCELLED' as CommissionStatus } : c));

  const getCommissionsForBD = (bdId: string) => commissions.filter((c) => c.bdId === bdId);

  return (
    <BDContext.Provider
      value={{
        bdProfiles, registerBDPartner, addBDPartnerDirect, verifyBDPartner, rejectBDPartner, suspendBDPartner, reactivateBDPartner, updateBDProfile, deleteBDPartner, getBDProfileByUserId, getBDProfileByBdId,
        leads, addLead, addLeadsFromImport, updateLead, updateLeadStatus, deleteLead, getLeadsForBD,
        leadStatusHistory,
        leadAssignments, assignLead,
        bdTasks, addBDTask, updateBDTaskStatus, getBDTasksForPartner,
        bdClients, addBDClient,
        bdProjects, addBDProject, updateBDProject,
        commissionRules, addCommissionRule, updateCommissionRule, deleteCommissionRule, getCommissionRateForService,
        commissions, createCommission, approveCommission, payCommission, cancelCommission, getCommissionsForBD,
        bdNotifications, addNotification, markNotificationRead, markAllRead, getNotificationsForUser,
        auditLogs, addAuditLog,
        findDuplicateLead,
      }}
    >
      {children}
    </BDContext.Provider>
  );
};

export const useBD = (): BDContextType => {
  const ctx = useContext(BDContext);
  if (!ctx) throw new Error('useBD must be used within BDProvider');
  return ctx;
};
