'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckSquare,
  FileText,
  UserCheck,
  Plus,
  ArrowLeft,
  LogOut,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  Filter,
  Upload,
  Database,
  Copy,
  Check,
  Download,
  AlertCircle,
  Building,
  Shield,
  Layers,
  ChevronRight,
  Eye,
  X,
  ShoppingBag,
  Sliders,
  CreditCard,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { Project, ProjectCategory, ProjectStatus, UserRole } from '../../types';
import { CategoriesManager } from './CategoriesManager';
import { FiverrGigsManager } from './FiverrGigsManager';
import { PortfolioCmsManager } from './PortfolioCmsManager';
import { UserManagementHub } from './UserManagementHub';
import { MongoDbManager } from './MongoDbManager';
import { PaymentManager } from './PaymentManager';

interface AdminDashboardProps {
  onSelectProjectForDetails: (project: Project) => void;
}

const CATEGORY_NAMES: Record<ProjectCategory, { name: string; icon: string }> = {
  website: { name: 'Websites', icon: '🌐' },
  application: { name: 'Applications', icon: '📱' },
  erp: { name: 'ERP Systems', icon: '🏢' },
  financial_dashboard: { name: 'Financial Dashboards', icon: '📊' },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectProjectForDetails,
}) => {
  const {
    currentUser,
    logout,
    setCurrentView,
    projects,
    categories,
    fiverrGigs,
    clients,
    tasks,
    users,
    registrations,
    activities,
    milestones,
    projectUpdates,
    projectFiles,
    phasePayments,
    addProject,
    updateProject,
    deleteProject,
    updateProjectProgress,
    addClient,
    deleteClient,
    addTask,
    updateTaskStatus,
    deleteTask,
    addMilestone,
    addProjectUpdate,
    uploadProjectFile,
    deleteProjectFile,
    addUser,
    toggleUserStatus,
  } = usePortal();

  // Active section within admin
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'projects' | 'categories' | 'fiverr_gigs' | 'portfolio_cms' | 'clients' | 'tasks' | 'files' | 'users' | 'mongodb_backend' | 'payments'
  >('dashboard');

  // Filter in Projects tab
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<'all' | ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Edit project state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectForm, setEditProjectForm] = useState({
    title: '',
    clientId: '',
    category: 'website' as ProjectCategory,
    tagline: '',
    description: '',
    technologies: '',
    startDate: '',
    deadline: '',
    progress: 0,
    status: 'Planning' as ProjectStatus,
    image: '',
    liveDemoUrl: '',
    githubUrl: '',
  });

  const handleOpenEditProjectModal = (proj: Project) => {
    setEditingProjectId(proj.id);
    setEditProjectForm({
      title: proj.title || '',
      clientId: proj.clientId || clients[0]?.id || '',
      category: proj.category || 'website',
      tagline: proj.tagline || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      startDate: proj.startDate || '',
      deadline: proj.deadline || '',
      progress: proj.progress || 0,
      status: proj.status || 'Planning',
      image: proj.image || '',
      liveDemoUrl: proj.liveDemoUrl || '',
      githubUrl: proj.githubUrl || '',
    });
  };

  const handleSaveEditedProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjectId || !editProjectForm.title) return;
    const techArray = editProjectForm.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    const selectedClient = clients.find((c) => c.id === editProjectForm.clientId);

    updateProject(editingProjectId, {
      title: editProjectForm.title,
      clientId: selectedClient?.id || editProjectForm.clientId || 'client-1',
      clientName: selectedClient?.companyName || 'General Client',
      category: editProjectForm.category,
      tagline: editProjectForm.tagline,
      description: editProjectForm.description,
      technologies: techArray.length > 0 ? techArray : ['React', 'TypeScript', 'Tailwind CSS'],
      startDate: editProjectForm.startDate,
      deadline: editProjectForm.deadline,
      progress: Number(editProjectForm.progress),
      status: editProjectForm.status,
      image: editProjectForm.image,
      liveDemoUrl: editProjectForm.liveDemoUrl,
      githubUrl: editProjectForm.githubUrl,
    });

    setEditingProjectId(null);
  };

  // Selected project for sub-actions
  const [targetProjectId, setTargetProjectId] = useState<string>(projects[0]?.id || '');

  // Form states
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    clientId: clients[0]?.id || '',
    category: 'website' as ProjectCategory,
    tagline: '',
    description: '',
    technologies: 'React, Node.js, Tailwind CSS',
    startDate: '15 Aug 2026',
    deadline: '30 Oct 2026',
    progress: 50,
    status: 'In Development' as ProjectStatus,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    features: 'Responsive Dashboard, API Integration, User Authentication',
  });

  const [newClientForm, setNewClientForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });

  const [newTaskForm, setNewTaskForm] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    description: '',
    assignedTo: 'Thivanka Randimal',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    dueDate: '2026-09-15',
  });

  const [newUpdateForm, setNewUpdateForm] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    description: '',
    progress: 75,
  });

  const [newMilestoneForm, setNewMilestoneForm] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    description: '',
    dueDate: '2026-09-30',
  });

  const [newFileForm, setNewFileForm] = useState({
    projectId: projects[0]?.id || '',
    fileName: '',
    fileType: 'pdf' as 'pdf' | 'zip' | 'doc' | 'image',
    fileSize: '3.5 MB',
  });

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'client' as UserRole,
    companyName: '',
  });

  // Submit Handlers
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === newProjectForm.clientId) || clients[0];
    const techArray = newProjectForm.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    const featArray = newProjectForm.features.split(',').map((f) => f.trim()).filter(Boolean);

    addProject({
      title: newProjectForm.title,
      clientId: selectedClient?.id || 'client-1',
      clientName: selectedClient?.companyName || 'General Client',
      clientLogo: selectedClient?.logo || '🏢',
      category: newProjectForm.category,
      tagline: newProjectForm.tagline || `${newProjectForm.category.toUpperCase()} solution for ${selectedClient?.companyName}`,
      description: newProjectForm.description,
      technologies: techArray.length > 0 ? techArray : ['React', 'TypeScript', 'Tailwind CSS'],
      startDate: newProjectForm.startDate,
      deadline: newProjectForm.deadline,
      progress: Number(newProjectForm.progress),
      status: newProjectForm.status,
      image: newProjectForm.image,
      features: featArray,
      featured: true,
    });

    setShowAddProjectModal(false);
    setNewProjectForm({
      title: '',
      clientId: clients[0]?.id || '',
      category: 'website',
      tagline: '',
      description: '',
      technologies: 'React, Node.js, Tailwind CSS',
      startDate: '15 Aug 2026',
      deadline: '30 Oct 2026',
      progress: 50,
      status: 'In Development',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      features: 'Responsive Dashboard, API Integration, User Authentication',
    });
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.companyName || !newClientForm.email) return;
    addClient(newClientForm);
    setShowAddClientModal(false);
    setNewClientForm({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title) return;
    addTask({
      projectId: newTaskForm.projectId || projects[0]?.id,
      title: newTaskForm.title,
      description: newTaskForm.description,
      assignedTo: newTaskForm.assignedTo,
      priority: newTaskForm.priority,
      status: 'todo',
      dueDate: newTaskForm.dueDate,
    });
    setShowAddTaskModal(false);
    setNewTaskForm({
      projectId: projects[0]?.id || '',
      title: '',
      description: '',
      assignedTo: 'Thivanka Randimal',
      priority: 'medium',
      dueDate: '2026-09-15',
    });
  };

  const handleCreateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateForm.title) return;
    addProjectUpdate({
      projectId: newUpdateForm.projectId || projects[0]?.id,
      title: newUpdateForm.title,
      description: newUpdateForm.description,
      progress: Number(newUpdateForm.progress),
      createdBy: currentUser?.name || 'Thivanka Randimal (Admin)',
    });
    setShowAddUpdateModal(false);
    setNewUpdateForm({
      projectId: projects[0]?.id || '',
      title: '',
      description: '',
      progress: 75,
    });
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneForm.title) return;
    addMilestone({
      projectId: newMilestoneForm.projectId || projects[0]?.id,
      title: newMilestoneForm.title,
      description: newMilestoneForm.description,
      dueDate: newMilestoneForm.dueDate,
      status: 'pending',
    });
    setShowAddMilestoneModal(false);
    setNewMilestoneForm({
      projectId: projects[0]?.id || '',
      title: '',
      description: '',
      dueDate: '2026-09-30',
    });
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileForm.fileName) return;
    uploadProjectFile({
      projectId: newFileForm.projectId || projects[0]?.id,
      fileName: newFileForm.fileName,
      fileType: newFileForm.fileType,
      fileSize: newFileForm.fileSize,
      uploadedBy: currentUser?.name || 'Thivanka Randimal',
    });
    setShowUploadFileModal(false);
    setNewFileForm({
      projectId: projects[0]?.id || '',
      fileName: '',
      fileType: 'pdf',
      fileSize: '3.5 MB',
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;
    addUser(newUserForm);
    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      role: 'client',
      companyName: '',
    });
  };

  const getCategoryDisplay = (catSlug: string) => {
    const found = categories.find((c) => c.slug === catSlug || c.id === catSlug);
    if (found) {
      return { name: found.name, icon: found.icon || '📁' };
    }
    return CATEGORY_NAMES[catSlug as ProjectCategory] || { name: catSlug, icon: '📁' };
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesCat = projectCategoryFilter === 'all' || p.category === projectCategoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0e111a]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('portfolio')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Portfolio</span>
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>ADMIN DASHBOARD</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                  Full Control
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                MongoDB & MERN Stack Architecture & Multi-Client Management
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Logged in as </span>
            <span className="font-semibold text-white">{currentUser?.name}</span>
          </div>

          <button
            onClick={() => setActiveTab('mongodb_backend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'mongodb_backend'
                ? 'bg-emerald-500 text-[#0b0d12] border-emerald-400 font-bold'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MongoDB Atlas Backend</span>
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="card-dark-gradient rounded-2xl p-4 border border-white/10 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1">
              Admin Navigation
            </div>

            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'projects', label: 'Projects Manager', icon: FolderKanban, badge: projects.length },
              { id: 'categories', label: 'Categories & Filters', icon: Layers, badge: categories.length },
              { id: 'fiverr_gigs', label: 'Direct Services & Packages', icon: ShoppingBag, badge: fiverrGigs.length },
              { id: 'portfolio_cms', label: 'Portfolio CMS & Content', icon: Sliders, badge: 'CMS' },
              { id: 'clients', label: 'All Clients', icon: Building, badge: clients.length },
              { id: 'tasks', label: 'Task Management', icon: CheckSquare, badge: tasks.length },
              { id: 'files', label: 'Project Files', icon: FileText, badge: projectFiles.length },
              {
                id: 'users',
                label: 'User Accounts & Verification',
                icon: Users,
                badge: registrations.filter((r) => r.status === 'pending').length > 0
                  ? `${registrations.filter((r) => r.status === 'pending').length} Pending`
                  : users.length,
              },
              { id: 'mongodb_backend', label: 'MongoDB & Node.js Backend', icon: Database, highlight: true },
              {
                id: 'payments',
                label: 'Payment Manager',
                icon: CreditCard,
                badge: phasePayments?.filter((p) => p.status === 'slip_uploaded').length || 0,
                highlight: false,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#8B9FFD] text-[#0b0d12] font-bold shadow-md shadow-[#8B9FFD]/20'
                      : item.highlight
                      ? 'text-amber-300 hover:bg-amber-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#0b0d12]/20 text-[#0b0d12]' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Panel */}
          <div className="card-dark-gradient rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-1">
              Quick Shortcuts
            </div>
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="w-full py-2 px-3 rounded-xl bg-[#8B9FFD]/15 hover:bg-[#8B9FFD] hover:text-[#0b0d12] border border-[#8B9FFD]/30 text-[#8B9FFD] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Project</span>
            </button>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Register Client</span>
            </button>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Assign Task</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-6 overflow-hidden">
          
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card-dark-gradient p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Projects</span>
                    <FolderKanban className="w-4 h-4 text-[#8B9FFD]" />
                  </div>
                  <p className="text-3xl font-black text-white">{projects.length}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Across 4 categories</p>
                </div>

                <div className="card-dark-gradient p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Clients</span>
                    <Building className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{clients.length}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Active enterprise partners</p>
                </div>

                <div className="card-dark-gradient p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Tasks</span>
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{tasks.length}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {tasks.filter((t) => t.status === 'completed').length} completed
                  </p>
                </div>

                <div className="card-dark-gradient p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Users</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-3xl font-black text-white">{users.length}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">1 Admin • {users.length - 1} Clients</p>
                </div>
              </div>

              {/* Two Column Layout: Project Progress & Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Project Progress Widget */}
                <div className="card-dark-gradient p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#8B9FFD]" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Project Progress
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs text-[#8B9FFD] hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {projects.slice(0, 5).map((proj) => (
                      <div key={proj.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span>{getCategoryDisplay(proj.category).icon}</span>
                            <span className="font-semibold text-white">{proj.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-400 text-[11px]">{proj.clientName}</span>
                            <span className="font-bold text-[#8B9FFD]">{proj.progress}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#8B9FFD] to-[#607afb] h-full rounded-full transition-all duration-500"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities Feed */}
                <div className="card-dark-gradient p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Recent Activities
                      </h3>
                    </div>
                    <span className="text-[11px] text-zinc-500">Live Audit Log</span>
                  </div>

                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {activities.slice(0, 6).map((act, index) => (
                      <div
                        key={act.id ? `${act.id}-${index}` : `act-${index}`}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 text-xs"
                      >
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <div className="flex-1">
                          <p className="text-zinc-200">{act.activity}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{act.createdAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Four Category Overview Grid */}
              <div className="card-dark-gradient p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Category Distribution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(['website', 'application', 'erp', 'financial_dashboard'] as ProjectCategory[]).map(
                    (cat) => {
                      const count = projects.filter((p) => p.category === cat).length;
                      const info = CATEGORY_NAMES[cat];
                      return (
                        <div
                          key={cat}
                          onClick={() => {
                            setProjectCategoryFilter(cat);
                            setActiveTab('projects');
                          }}
                          className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-[#8B9FFD]/30 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{info.icon}</span>
                            <span className="text-lg font-black text-white">{count}</span>
                          </div>
                          <p className="text-xs font-bold text-zinc-200 group-hover:text-[#8B9FFD] transition-colors">
                            {info.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Click to view & filter</p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Dynamic Categories + All */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setProjectCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      projectCategoryFilter === 'all'
                        ? 'bg-[#8B9FFD] text-[#0b0d12] font-bold shadow-md'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>📁</span>
                    <span>All Projects</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setProjectCategoryFilter(cat.slug as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        projectCategoryFilter === cat.slug || projectCategoryFilter === cat.id
                          ? 'bg-[#8B9FFD] text-[#0b0d12] font-bold shadow-md'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Add Project Button */}
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by title, client, or technology..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              {/* Projects Table / Card List */}
              <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-white/5 text-zinc-500 text-xs">
                    No projects found matching the criteria.
                  </div>
                ) : (
                  filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="card-dark-gradient p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={proj.image || '/assets/images/hotel_erp_dashboard_1785315979842.jpg'}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/hotel_erp_dashboard_1785315979842.jpg';
                          }}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#8B9FFD]/15 text-[#8B9FFD] border border-[#8B9FFD]/30 flex items-center gap-1">
                              <span>{getCategoryDisplay(proj.category).icon}</span>
                              <span>{getCategoryDisplay(proj.category).name}</span>
                            </span>
                            <span className="text-xs text-zinc-400 font-medium">
                              Client: <strong className="text-white">{proj.clientName}</strong>
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                proj.status === 'Completed'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : proj.status === 'In Development'
                                  ? 'bg-sky-500/20 text-sky-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {proj.status}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white truncate">{proj.title}</h4>
                          <p className="text-xs text-zinc-400 line-clamp-1">{proj.description}</p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-1">
                            <span>Start: {proj.startDate}</span>
                            <span>•</span>
                            <span>Deadline: {proj.deadline}</span>
                            <span>•</span>
                            <span className="text-zinc-300">{proj.technologies.slice(0, 3).join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Control & Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                        {/* Progress Slider */}
                        <div className="min-w-[140px] space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-zinc-400">Progress</span>
                            <span className="text-[#8B9FFD] font-bold">{proj.progress}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={proj.progress}
                            onChange={(e) => updateProjectProgress(proj.id, Number(e.target.value))}
                            className="w-full accent-[#8B9FFD] cursor-pointer"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectProjectForDetails(proj)}
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="View full project modal"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => {
                              setTargetProjectId(proj.id);
                              setShowAddUpdateModal(true);
                            }}
                            className="px-3 py-2 rounded-xl bg-[#8B9FFD]/15 hover:bg-[#8B9FFD]/30 text-xs font-semibold text-[#8B9FFD] transition-colors cursor-pointer"
                            title="Post milestone update"
                          >
                            + Update
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${proj.title}"?`)) {
                                deleteProject(proj.id);
                              }
                            }}
                            className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && <CategoriesManager />}

          {/* TAB: SERVICES & PACKAGES */}
          {activeTab === 'fiverr_gigs' && <FiverrGigsManager />}

          {/* TAB: PORTFOLIO CMS */}
          {activeTab === 'portfolio_cms' && <PortfolioCmsManager />}

          {/* TAB: CLIENTS */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Client Directory</h3>
                  <p className="text-xs text-zinc-400">
                    Manage client profiles, assigned ERP projects, and login permissions.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Client</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map((client) => {
                  const assignedProjects = projects.filter((p) => p.clientId === client.id);

                  return (
                    <div
                      key={client.id}
                      className="card-dark-gradient p-5 rounded-2xl border border-white/10 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{client.logo || '🏢'}</span>
                          <div>
                            <h4 className="text-base font-bold text-white">{client.companyName}</h4>
                            <p className="text-xs text-zinc-400">Contact: {client.contactPerson}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Remove client "${client.companyName}"?`)) {
                              deleteClient(client.id);
                            }
                          }}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-xs space-y-1 text-zinc-300">
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Phone:</strong> {client.phone}</p>
                        {client.address && <p><strong>Address:</strong> {client.address}</p>}
                      </div>

                      {/* Assigned Projects */}
                      <div>
                        <div className="text-xs font-bold text-zinc-400 mb-2">
                          Assigned Projects ({assignedProjects.length})
                        </div>
                        <div className="space-y-1.5">
                          {assignedProjects.length === 0 ? (
                            <p className="text-xs text-zinc-500 italic">No projects assigned yet.</p>
                          ) : (
                            assignedProjects.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between text-xs p-2 rounded-lg bg-zinc-900/80 border border-white/5"
                              >
                                <span className="text-white font-medium">{p.title}</span>
                                <span className="text-[#8B9FFD] font-bold">{p.progress}%</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Task Management</h3>
                  <p className="text-xs text-zinc-400">
                    Track sprint issues, assignees, priorities, and development status.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign New Task</span>
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {tasks.map((task) => {
                  const proj = projects.find((p) => p.id === task.projectId);

                  return (
                    <div
                      key={task.id}
                      className="card-dark-gradient p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              task.priority === 'urgent'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : task.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-sm font-bold text-white">{task.title}</span>
                          <span className="text-xs text-zinc-400">({proj?.title || 'General'})</span>
                        </div>
                        {task.description && (
                          <p className="text-xs text-zinc-400">{task.description}</p>
                        )}
                        <p className="text-[11px] text-zinc-500">
                          Assigned: <strong>{task.assignedTo || 'Unassigned'}</strong>
                          {task.dueDate && ` • Target: ${task.dueDate}`}
                        </p>
                      </div>

                      {/* Status Toggle & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        {(['todo', 'in_progress', 'completed'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateTaskStatus(task.id, st)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                              task.status === st
                                ? 'bg-[#8B9FFD] text-[#0b0d12]'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {st === 'todo' ? 'To Do' : st === 'in_progress' ? 'In Progress' : 'Done'}
                          </button>
                        ))}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: FILES */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Project Files & Documents</h3>
                  <p className="text-xs text-zinc-400">
                    Centralized repository for requirements, schemas, and UI packages.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadFileModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectFiles.map((f) => {
                  const proj = projects.find((p) => p.id === f.projectId);
                  return (
                    <div
                      key={f.id}
                      className="card-dark-gradient p-4 rounded-xl border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-[#8B9FFD]/15 border border-[#8B9FFD]/30 flex items-center justify-center text-[#8B9FFD] font-bold text-xs shrink-0">
                          {f.fileType.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{f.fileName}</p>
                          <p className="text-[11px] text-zinc-400">{proj?.title || 'All Projects'}</p>
                          <p className="text-[10px] text-zinc-500">{f.fileSize} • Uploaded by {f.uploadedBy}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteProjectFile(f.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && <UserManagementHub />}

          {/* TAB: MONGODB & NODE.JS BACKEND */}
          {activeTab === 'mongodb_backend' && <MongoDbManager />}

          {/* TAB: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <CategoriesManager />
          )}

          {/* TAB: FIVERR GIGS & PACKAGES */}
          {activeTab === 'fiverr_gigs' && (
            <FiverrGigsManager />
          )}

          {/* TAB: PORTFOLIO CMS & CONTENT */}
          {activeTab === 'portfolio_cms' && (
            <PortfolioCmsManager />
          )}

          {/* TAB: PAYMENT MANAGER */}
          {activeTab === 'payments' && <PaymentManager />}

        </main>
      </div>

      {/* MODAL: ADD PROJECT */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl card-dark-gradient border border-white/15 rounded-2xl overflow-hidden p-6 text-left my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-base font-bold text-white">Create New Project</h3>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.title}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                    placeholder="e.g. ABC Hotel Management System"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Assign to Client</label>
                  <select
                    value={newProjectForm.clientId}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.contactPerson})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={newProjectForm.category}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, category: e.target.value as ProjectCategory })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Current Status</label>
                  <select
                    value={newProjectForm.status}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, status: e.target.value as ProjectStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Development">In Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Initial Progress: {newProjectForm.progress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newProjectForm.progress}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, progress: Number(e.target.value) })
                    }
                    className="w-full accent-[#8B9FFD] mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  placeholder="Describe the operational purpose and architecture..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={newProjectForm.startDate}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, startDate: e.target.value })}
                    placeholder="01 Aug 2026"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Expected Completion</label>
                  <input
                    type="text"
                    value={newProjectForm.deadline}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, deadline: e.target.value })}
                    placeholder="30 Sep 2026"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={newProjectForm.technologies}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, technologies: e.target.value })}
                  placeholder="React, Node.js, MongoDB, Tailwind CSS, Express"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] font-bold transition-all shadow"
                >
                  Save & Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROJECT */}
      {editingProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl card-dark-gradient border border-amber-500/30 rounded-2xl p-6 my-8 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Edit3 className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-white">Edit Project Details</h3>
              </div>
              <button
                onClick={() => setEditingProjectId(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Project Title</label>
                <input
                  type="text"
                  value={editProjectForm.title}
                  onChange={(e) => setEditProjectForm({ ...editProjectForm, title: e.target.value })}
                  placeholder="e.g. HELPING HEARTS Counselling & Wellness Centre"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Project Picture / Image URL</label>
                  <input
                    type="text"
                    value={editProjectForm.image}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, image: e.target.value })}
                    placeholder="/assets/images/helping_hearts_hero_1786205130552.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                  {editProjectForm.image && (
                    <div className="mt-2 h-20 w-full rounded-lg overflow-hidden border border-white/10 bg-zinc-950">
                      <img
                        src={editProjectForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Assign to Client</label>
                  <select
                    value={editProjectForm.clientId}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.contactPerson})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={editProjectForm.category}
                    onChange={(e) =>
                      setEditProjectForm({ ...editProjectForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Current Status</label>
                  <select
                    value={editProjectForm.status}
                    onChange={(e) =>
                      setEditProjectForm({ ...editProjectForm, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Development">In Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Progress: {editProjectForm.progress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editProjectForm.progress}
                    onChange={(e) =>
                      setEditProjectForm({ ...editProjectForm, progress: Number(e.target.value) })
                    }
                    className="w-full accent-amber-400 mt-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={editProjectForm.startDate}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, startDate: e.target.value })}
                    placeholder="13 Aug 2026"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Expected Completion / Deadline</label>
                  <input
                    type="text"
                    value={editProjectForm.deadline}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, deadline: e.target.value })}
                    placeholder="20 Aug 2026"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={editProjectForm.technologies}
                  onChange={(e) => setEditProjectForm({ ...editProjectForm, technologies: e.target.value })}
                  placeholder="Next.js, React 19, TypeScript, Tailwind CSS, MongoDB, NextAuth"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Tagline / Key Highlight</label>
                <input
                  type="text"
                  value={editProjectForm.tagline}
                  onChange={(e) => setEditProjectForm({ ...editProjectForm, tagline: e.target.value })}
                  placeholder="Full-cycle LMS, Online Booking & Healthcare Management System"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={editProjectForm.description}
                  onChange={(e) => setEditProjectForm({ ...editProjectForm, description: e.target.value })}
                  placeholder="Explain the technical scope, client problem solved, and architecture..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProjectId(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CLIENT */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Register New Client</h3>
              <button onClick={() => setShowAddClientModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newClientForm.companyName}
                  onChange={(e) => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                  placeholder="e.g. Ceylon Agro Ventures"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={newClientForm.contactPerson}
                  onChange={(e) => setNewClientForm({ ...newClientForm, contactPerson: e.target.value })}
                  placeholder="e.g. Kasun Jayawardena"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Client Email (Login ID)</label>
                <input
                  type="email"
                  required
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                  placeholder="client@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newClientForm.phone}
                  onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] font-bold shadow"
                >
                  Register Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Assign New Task</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Select Project</label>
                <select
                  value={newTaskForm.projectId}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder="e.g. Optimize SQL night audit stored procedures"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Priority</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) =>
                      setNewTaskForm({ ...newTaskForm, priority: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newTaskForm.assignedTo}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] font-bold shadow"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST UPDATE */}
      {showAddUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Post Project Update</h3>
                <p className="text-[11px] text-zinc-400">Post a milestone note or switch to full project editing.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const selectedProj = projects.find((p) => p.id === (newUpdateForm.projectId || targetProjectId)) || projects[0];
                    if (selectedProj) {
                      setShowAddUpdateModal(false);
                      handleOpenEditProjectModal(selectedProj);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-amber-500/30"
                  title="Edit Picture, Expected Date, Technologies, Title & Description"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Project Info</span>
                </button>
                <button onClick={() => setShowAddUpdateModal(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateUpdate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Select Project</label>
                <select
                  value={newUpdateForm.projectId || targetProjectId}
                  onChange={(e) => setNewUpdateForm({ ...newUpdateForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newUpdateForm.title}
                  onChange={(e) => setNewUpdateForm({ ...newUpdateForm, title: e.target.value })}
                  placeholder="e.g. Front Office Folio Billing module completed"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Details</label>
                <textarea
                  rows={3}
                  required
                  value={newUpdateForm.description}
                  onChange={(e) => setNewUpdateForm({ ...newUpdateForm, description: e.target.value })}
                  placeholder="Explain the work accomplished, tested features, and next sprint goals..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Update Progress: {newUpdateForm.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newUpdateForm.progress}
                  onChange={(e) => setNewUpdateForm({ ...newUpdateForm, progress: Number(e.target.value) })}
                  className="w-full accent-[#8B9FFD]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUpdateModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] font-bold shadow"
                >
                  Post Live Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD FILE */}
      {showUploadFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Upload Project File</h3>
              <button onClick={() => setShowUploadFileModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadFile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Select Project</label>
                <select
                  value={newFileForm.projectId}
                  onChange={(e) => setNewFileForm({ ...newFileForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={newFileForm.fileName}
                  onChange={(e) => setNewFileForm({ ...newFileForm, fileName: e.target.value })}
                  placeholder="e.g. Project_Requirement_Spec.pdf"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">File Type</label>
                  <select
                    value={newFileForm.fileType}
                    onChange={(e) => setNewFileForm({ ...newFileForm, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="zip">ZIP Archive</option>
                    <option value="doc">SQL / Doc</option>
                    <option value="image">Image / UI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">File Size</label>
                  <input
                    type="text"
                    value={newFileForm.fileSize}
                    onChange={(e) => setNewFileForm({ ...newFileForm, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadFileModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] font-bold shadow"
                >
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md card-dark-gradient border border-white/15 rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Create Portal User</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Email (Login ID)</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Account Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                  >
                    <option value="client">Client User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    value={newUserForm.companyName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, companyName: e.target.value })}
                    placeholder="e.g. ABC Company"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] font-bold shadow"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
