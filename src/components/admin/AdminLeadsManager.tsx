'use client';
import React, { useState, useRef, useMemo } from 'react';
import { useBD } from '../../context/BDContext';
import { usePortal } from '../../context/PortalContext';
import {
  Upload, Search, Eye, X, CheckCircle2, AlertTriangle,
  BarChart2, PieChart, FileSpreadsheet, Download, FileCode,
  Phone, Globe, MapPin, User, Building2, Tag, Filter, UserCheck, ExternalLink
} from 'lucide-react';
import { Lead, LeadStatus, UserRole } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ASSIGNED: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  CONTACTED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  INTERESTED: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  REQUIREMENT_GATHERING: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  QUOTATION_SENT: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  NEGOTIATION: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  WON: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  PROJECT_STARTED: 'bg-green-500/20 text-green-400 border-green-500/30',
  PROJECT_COMPLETED: 'bg-green-700/20 text-green-300 border-green-700/30',
  NOT_INTERESTED: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  FOLLOW_UP_LATER: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  NO_RESPONSE: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  LOST: 'bg-red-500/20 text-red-400 border-red-500/30',
  DUPLICATE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  PENDING_ADMIN_REVIEW: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'text-zinc-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-amber-400',
  URGENT: 'text-red-400',
};

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function exportToCSV(leads: Lead[], filename = 'clients_and_leads_export.csv') {
  const headers = [
    'Lead ID', 'Business / Shop Name', 'Client / Customer Name', 'Category',
    'Address', 'City', 'Province', 'Mobile / Phone', 'WhatsApp', 'Email',
    'Website', 'Google Maps', 'Service Needed', 'Estimated Budget (USD)',
    'Priority', 'Status', 'Assigned BD ID', 'Assigned BD Name', 'Date Added'
  ];

  const rows = leads.map(l => [
    l.leadId,
    `"${(l.businessName || '').replace(/"/g, '""')}"`,
    `"${(l.clientName || '').replace(/"/g, '""')}"`,
    `"${(l.category || '').replace(/"/g, '""')}"`,
    `"${(l.address || '').replace(/"/g, '""')}"`,
    `"${(l.city || '').replace(/"/g, '""')}"`,
    `"${(l.province || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.whatsapp || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.website || '').replace(/"/g, '""')}"`,
    `"${(l.googleMaps || '').replace(/"/g, '""')}"`,
    `"${(l.interestedService || '').replace(/"/g, '""')}"`,
    l.estimatedBudget || 0,
    l.leadPriority,
    l.status,
    l.assignedBdId || l.referralBdId || '',
    `"${(l.assignedBdName || '').replace(/"/g, '""')}"`,
    l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToXML(leads: Lead[], filename = 'clients_and_leads_export.xml') {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<ClientsAndLeads>\n';
  leads.forEach(l => {
    xml += '  <Lead>\n';
    xml += `    <LeadId>${escapeXml(l.leadId)}</LeadId>\n`;
    xml += `    <BusinessName>${escapeXml(l.businessName)}</BusinessName>\n`;
    xml += `    <ClientName>${escapeXml(l.clientName || '')}</ClientName>\n`;
    xml += `    <Category>${escapeXml(l.category || '')}</Category>\n`;
    xml += `    <Location>\n`;
    xml += `      <Address>${escapeXml(l.address || '')}</Address>\n`;
    xml += `      <City>${escapeXml(l.city || '')}</City>\n`;
    xml += `      <Province>${escapeXml(l.province || '')}</Province>\n`;
    xml += `    </Location>\n`;
    xml += `    <Contact>\n`;
    xml += `      <Mobile>${escapeXml(l.phone)}</Mobile>\n`;
    xml += `      <WhatsApp>${escapeXml(l.whatsapp || '')}</WhatsApp>\n`;
    xml += `      <Email>${escapeXml(l.email || '')}</Email>\n`;
    xml += `    </Contact>\n`;
    xml += `    <Online>\n`;
    xml += `      <Website>${escapeXml(l.website || '')}</Website>\n`;
    xml += `      <GoogleMaps>${escapeXml(l.googleMaps || '')}</GoogleMaps>\n`;
    xml += `    </Online>\n`;
    xml += `    <Service>${escapeXml(l.interestedService || '')}</Service>\n`;
    xml += `    <Budget>${l.estimatedBudget || 0}</Budget>\n`;
    xml += `    <Priority>${l.leadPriority}</Priority>\n`;
    xml += `    <Status>${l.status}</Status>\n`;
    xml += `    <AssignedBD>\n`;
    xml += `      <BDId>${escapeXml(l.assignedBdId || l.referralBdId || '')}</BDId>\n`;
    xml += `      <BDName>${escapeXml(l.assignedBdName || '')}</BDName>\n`;
    xml += `    </AssignedBD>\n`;
    xml += `    <DateAdded>${l.createdAt ? new Date(l.createdAt).toISOString() : ''}</DateAdded>\n`;
    xml += '  </Lead>\n';
  });
  xml += '</ClientsAndLeads>';

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line => {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if ((ch === ',' || ch === '\t') && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cells.push(current.trim());
    return cells;
  });
}

function mapRowToLead(headers: string[], row: string[]): Omit<Lead, 'id' | 'leadId' | 'createdAt'> {
  const get = (names: string[]) => {
    for (const n of names) {
      const idx = headers.findIndex(h =>
        h.toLowerCase().replace(/[\s_]/g, '').includes(n.toLowerCase().replace(/[\s_]/g, ''))
      );
      if (idx >= 0 && row[idx]) return row[idx];
    }
    return '';
  };
  return {
    businessName: get(['businessname', 'business', 'name', 'company', 'shop']) || 'Unknown',
    clientName: get(['clientname', 'contact', 'contactperson', 'owner', 'customer']),
    category: get(['category', 'type', 'businesstype']),
    address: get(['address', 'location', 'place']),
    city: get(['city', 'area', 'district']),
    province: get(['province']),
    phone: get(['phone', 'mobile', 'telephone', 'contact']),
    alternativePhone: get(['altphone', 'alternative']),
    whatsapp: get(['whatsapp', 'wa']),
    email: get(['email', 'mail']),
    website: get(['website', 'web', 'url', 'site']),
    facebook: get(['facebook', 'fb']),
    instagram: get(['instagram', 'ig']),
    googleMaps: get(['googlemaps', 'maps', 'maplink']),
    interestedService: get(['service', 'interestedservice']),
    requirement: get(['requirement', 'needs', 'description']),
    estimatedBudget: get(['budget', 'estimatedbudget']) ? Number(get(['budget', 'estimatedbudget'])) : undefined,
    notes: get(['notes', 'remarks', 'comment']),
    rating: get(['rating']) ? Number(get(['rating'])) : undefined,
    reviewCount: get(['reviewcount', 'reviews', 'reviewno']) ? Number(get(['reviewcount', 'reviews', 'reviewno'])) : undefined,
    leadSource: 'ADMIN',
    leadPriority: 'MEDIUM',
    status: 'NEW',
    createdBy: 'admin',
  };
}

export const AdminLeadsManager: React.FC = () => {
  const { leads, addLead, updateLead, updateLeadStatus, addLeadsFromImport, findDuplicateLead, bdProfiles } = useBD();
  const { currentUser } = usePortal();
  const fileRef = useRef<HTMLInputElement>(null);

  const [activeView, setActiveView] = useState<'table' | 'charts' | 'import'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [bdFilter, setBdFilter] = useState('all');

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [newStatus, setNewStatus] = useState<LeadStatus>('CONTACTED');

  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [importRows, setImportRows] = useState<Array<Omit<Lead, 'id' | 'leadId' | 'createdAt'>>>([]);
  const [importResult, setImportResult] = useState<{ imported: number; duplicates: number; errors: number } | null>(null);
  const [importDupWarnings, setImportDupWarnings] = useState<string[]>([]);

  // Unique list of categories and cities for dropdowns
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    leads.forEach(l => { if (l.category) set.add(l.category); });
    return Array.from(set);
  }, [leads]);

  const citiesList = useMemo(() => {
    const set = new Set<string>();
    leads.forEach(l => { if (l.city) set.add(l.city); });
    return Array.from(set);
  }, [leads]);

  // Filtered Leads
  const filtered = useMemo(() => {
    return leads.filter(l => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        (l.businessName && l.businessName.toLowerCase().includes(q)) ||
        (l.clientName && l.clientName.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.address && l.address.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q)) ||
        (l.whatsapp && l.whatsapp.includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.website && l.website.toLowerCase().includes(q)) ||
        (l.leadId && l.leadId.toLowerCase().includes(q)) ||
        (l.assignedBdName && l.assignedBdName.toLowerCase().includes(q)) ||
        (l.assignedBdId && l.assignedBdId.toLowerCase().includes(q)) ||
        (l.referralCode && l.referralCode.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchSource = sourceFilter === 'all' || l.leadSource === sourceFilter;
      const matchCategory = categoryFilter === 'all' || l.category === categoryFilter;
      const matchCity = cityFilter === 'all' || l.city === cityFilter;
      const matchBD =
        bdFilter === 'all' ||
        l.assignedBdId === bdFilter ||
        l.referralBdId === bdFilter ||
        l.assignedBdName?.toLowerCase() === bdFilter.toLowerCase();

      return matchSearch && matchStatus && matchSource && matchCategory && matchCity && matchBD;
    });
  }, [leads, search, statusFilter, sourceFilter, categoryFilter, cityFilter, bdFilter]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      if (!text) return;
      const parsed = parseCSV(text);
      if (parsed.length < 2) return;
      const headers = parsed[0];
      const rows = parsed.slice(1).filter(r => r.some(c => c.length > 0));
      const mapped = rows.map(r => mapRowToLead(headers, r));
      const dupWarnings: string[] = [];
      mapped.forEach((lead, i) => {
        const dup = findDuplicateLead({ phone: lead.phone, email: lead.email, businessName: lead.businessName });
        if (dup) dupWarnings.push(`Row ${i + 1} (${lead.businessName}) matches existing lead #${dup.leadId}`);
      });
      setImportRows(mapped);
      setImportDupWarnings(dupWarnings);
      setImportStep('preview');
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    const res = addLeadsFromImport(importRows);
    setImportResult(res);
    setImportStep('result');
  };

  const handleStatusChange = (leadId: string) => {
    updateLeadStatus(leadId, newStatus, currentUser?.name || 'Admin', (currentUser?.role || 'admin') as UserRole, statusNote || undefined);
    setSelectedLead(null);
    setStatusNote('');
  };

  const handleExportCSV = () => {
    const filterName = bdFilter !== 'all' ? `_${bdFilter}` : '';
    exportToCSV(filtered, `clients_and_leads${filterName}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportXML = () => {
    const filterName = bdFilter !== 'all' ? `_${bdFilter}` : '';
    exportToXML(filtered, `clients_and_leads${filterName}_${new Date().toISOString().split('T')[0]}.xml`);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & View Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveView('table')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'table' ? 'bg-[#8B9FFD] text-[#0b0d12] shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Clients & Leads Directory ({filtered.length})</span>
          </button>
          <button
            onClick={() => setActiveView('charts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'charts' ? 'bg-[#8B9FFD] text-[#0b0d12] shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analytics Charts</span>
          </button>
          <button
            onClick={() => setActiveView('import')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'import' ? 'bg-[#8B9FFD] text-[#0b0d12] shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Excel / CSV</span>
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Export filtered records to Microsoft Excel (CSV)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleExportXML}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Export filtered records to structured XML"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Export XML</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {activeView === 'table' && (
        <div className="space-y-4">
          {/* Multi-Attribute Categorized Filters */}
          <div className="card-dark-gradient p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-center">
              {/* Main Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by Client Name, Shop/Place, Phone/Mobile, Location, Website, BD..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#8B9FFD]"
                />
              </div>

              {/* Categorization Dropdowns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#8B9FFD]"
                >
                  <option value="all">All Statuses</option>
                  {Object.keys(STATUS_COLORS).map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>

                {/* Category / Place Filter */}
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#8B9FFD]"
                >
                  <option value="all">All Categories</option>
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* City / Location Filter */}
                <select
                  value={cityFilter}
                  onChange={e => setCityFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#8B9FFD]"
                >
                  <option value="all">All Cities / Places</option>
                  {citiesList.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                {/* Relevant BD Partner Filter */}
                <select
                  value={bdFilter}
                  onChange={e => setBdFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-emerald-500/30 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All BD Partners</option>
                  {bdProfiles.filter(b => b.bdId).map(b => (
                    <option key={b.id} value={b.bdId}>{b.bdId} - {b.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick summary chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-500">Active Results:</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-mono">{filtered.length} clients</span>
              {bdFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  BD: {bdFilter}
                </span>
              )}
              {cityFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Place: {cityFilter}
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Category: {categoryFilter}
                </span>
              )}
              {(search || statusFilter !== 'all' || categoryFilter !== 'all' || cityFilter !== 'all' || bdFilter !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); setCityFilter('all'); setBdFilter('all'); }}
                  className="text-xs text-[#8B9FFD] hover:underline ml-2 cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Table of Leads */}
          <div className="card-dark-gradient rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No clients or leads match your current search filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-zinc-900/60">
                      {['ID', 'Client / Shop Name', 'Location / Place', 'Mobile & Contact', 'Website / Online', 'Service', 'Assigned BD Partner', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-zinc-400 whitespace-nowrap">{lead.leadId}</td>

                        {/* Customer / Shop Name */}
                        <td className="px-4 py-3 min-w-44">
                          <p className="font-bold text-white text-xs">{lead.businessName}</p>
                          {lead.clientName && (
                            <p className="text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3 text-zinc-500" />
                              <span>{lead.clientName}</span>
                            </p>
                          )}
                          {lead.category && (
                            <span className="inline-block text-[10px] text-zinc-500 mt-0.5 font-medium">
                              🏷️ {lead.category}
                            </span>
                          )}
                        </td>

                        {/* Location / Place */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-zinc-300 font-semibold">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            <span>{lead.city || lead.address || '—'}</span>
                          </div>
                          {lead.address && lead.city && lead.address !== lead.city && (
                            <p className="text-zinc-500 text-[10px] truncate max-w-36">{lead.address}</p>
                          )}
                        </td>

                        {/* Mobile & Phone Numbers */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-0.5">
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1 font-mono text-zinc-300 hover:text-emerald-400 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-emerald-400" />
                                <span>{lead.phone}</span>
                              </a>
                            )}
                            {lead.whatsapp && lead.whatsapp !== lead.phone && (
                              <a
                                href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 font-mono text-emerald-400 text-[10px]"
                              >
                                <span>WA: {lead.whatsapp}</span>
                              </a>
                            )}
                            {lead.email && (
                              <p className="text-zinc-500 text-[10px] truncate max-w-36">{lead.email}</p>
                            )}
                          </div>
                        </td>

                        {/* Website & Online */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-1">
                            {lead.website ? (
                              <a
                                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-blue-400 hover:underline max-w-32 truncate text-[11px]"
                              >
                                <Globe className="w-3 h-3" />
                                <span>{lead.website.replace(/^https?:\/\//, '')}</span>
                              </a>
                            ) : (
                              <span className="text-zinc-600 text-[11px]">—</span>
                            )}
                            {lead.googleMaps && (
                              <a
                                href={lead.googleMaps}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-amber-400 hover:underline text-[10px]"
                              >
                                <MapPin className="w-2.5 h-2.5" />
                                <span>Maps</span>
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Interested Service */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-zinc-200 font-semibold">{lead.interestedService || 'General'}</p>
                          {lead.estimatedBudget ? (
                            <p className="text-emerald-400 text-[10px] font-mono">${lead.estimatedBudget.toLocaleString()}</p>
                          ) : null}
                        </td>

                        {/* Assigned BD Partner */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {lead.assignedBdId || lead.referralBdId ? (
                            <div className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/25">
                              <p className="font-mono text-emerald-400 font-bold text-[11px]">{lead.assignedBdId || lead.referralBdId}</p>
                              {lead.assignedBdName && <p className="text-zinc-400 text-[10px] truncate max-w-28">{lead.assignedBdName}</p>}
                            </div>
                          ) : (
                            <span className="text-zinc-600 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${STATUS_COLORS[lead.status] || 'bg-zinc-500/20 text-zinc-400'}`}>
                            {lead.status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* Detail Action */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => { setSelectedLead(lead); setNewStatus(lead.status as LeadStatus); }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                            title="View Full Client & Lead Info"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ANALYTICS CHARTS */}
      {activeView === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card-dark-gradient p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#8B9FFD]" />
              Leads by Status
            </h3>
            <div className="space-y-2.5">
              {Object.keys(STATUS_COLORS).map(st => {
                const count = leads.filter(l => l.status === st).length;
                if (count === 0) return null;
                const pct = Math.round((count / leads.length) * 100);
                return (
                  <div key={st} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300">{st.replace(/_/g, ' ')}</span>
                      <span className="text-white font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8B9FFD] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-dark-gradient p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Leads by Location / Place
            </h3>
            <div className="space-y-2.5">
              {citiesList.map(city => {
                const count = leads.filter(l => l.city === city).length;
                const pct = Math.round((count / (leads.length || 1)) * 100);
                return (
                  <div key={city} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300">{city}</span>
                      <span className="text-white font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {citiesList.length === 0 && <p className="text-xs text-zinc-500 text-center py-4">No city data available</p>}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: IMPORT EXCEL / CSV */}
      {activeView === 'import' && (
        <div className="card-dark-gradient p-6 rounded-2xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Import Clients & Leads from Excel / CSV</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Upload CSV or Excel files with columns for Business Name, Contact Person, Phone, City, Service, etc.
              </p>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#8B9FFD] hover:bg-[#a2b2ff] text-[#0b0d12] text-xs font-bold cursor-pointer transition-all shadow"
            >
              Choose File
            </button>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          </div>

          {importStep === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200">
                Ready to import <strong>{importRows.length}</strong> client records.
              </div>

              {importDupWarnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 space-y-1 max-h-32 overflow-y-auto">
                  <p className="font-bold">⚠️ Duplicate Warnings ({importDupWarnings.length}):</p>
                  {importDupWarnings.map((w, idx) => <p key={idx} className="text-[11px]">{w}</p>)}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button onClick={() => setImportStep('upload')} className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-white">
                  Cancel
                </button>
                <button onClick={handleConfirmImport} className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white">
                  Import All Records
                </button>
              </div>
            </div>
          )}

          {importStep === 'result' && importResult && (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Import Process Complete</h4>
              <p className="text-xs text-zinc-300">
                Successfully imported <strong>{importResult.imported}</strong> new records. Skipped <strong>{importResult.duplicates}</strong> duplicates.
              </p>
              <button
                onClick={() => { setActiveView('table'); setImportStep('upload'); }}
                className="px-6 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white mt-2"
              >
                View in Directory
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL: FULL LEAD DETAIL & STATUS UPDATE */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn" onClick={() => setSelectedLead(null)}>
          <div className="w-full max-w-xl card-dark-gradient border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-mono text-[#8B9FFD] font-bold">{selectedLead.leadId}</p>
                <h3 className="text-lg font-bold text-white">{selectedLead.businessName}</h3>
                {selectedLead.clientName && <p className="text-xs text-zinc-400">Contact: {selectedLead.clientName}</p>}
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {[
                ['Phone / Mobile', selectedLead.phone],
                ['WhatsApp', selectedLead.whatsapp || '—'],
                ['Email', selectedLead.email || '—'],
                ['City / Area', selectedLead.city || '—'],
                ['Province', selectedLead.province || '—'],
                ['Address', selectedLead.address || '—'],
                ['Category', selectedLead.category || '—'],
                ['Service', selectedLead.interestedService || '—'],
                ['Budget', selectedLead.estimatedBudget ? `$${selectedLead.estimatedBudget.toLocaleString()}` : '—'],
                ['Assigned BD ID', selectedLead.assignedBdId || selectedLead.referralBdId || 'Unassigned'],
                ['Assigned BD Name', selectedLead.assignedBdName || '—'],
                ['Date Added', selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleDateString() : '—'],
              ].map(([k, v]) => (
                <div key={k as string} className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
                  <p className="text-zinc-500 text-[10px] font-semibold">{k}</p>
                  <p className="text-white font-semibold mt-0.5 truncate">{v as string}</p>
                </div>
              ))}
            </div>

            {/* Online Links */}
            {(selectedLead.website || selectedLead.googleMaps) && (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-wrap gap-4 text-xs">
                {selectedLead.website && (
                  <a
                    href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" /> {selectedLead.website}
                  </a>
                )}
                {selectedLead.googleMaps && (
                  <a href={selectedLead.googleMaps} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> View on Google Maps
                  </a>
                )}
              </div>
            )}

            {selectedLead.requirement && (
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 text-xs">
                <p className="text-zinc-400 font-semibold mb-1">Client Requirements & Notes</p>
                <p className="text-zinc-200">{selectedLead.requirement}</p>
              </div>
            )}

            {/* Update Status Section */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3">
              <p className="text-xs font-bold text-white">Update Lead Pipeline Status</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">New Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs"
                  >
                    {Object.keys(STATUS_COLORS).map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">Status Notes (Optional)</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={e => setStatusNote(e.target.value)}
                    placeholder="e.g. Quotation sent to client"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs placeholder:text-zinc-600"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleStatusChange(selectedLead.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow"
                >
                  Save Status Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
