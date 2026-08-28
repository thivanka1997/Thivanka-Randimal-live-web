'use client';
import React, { useState, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import { useBD } from '../../context/BDContext';
import {
  Target, Search, Eye, X, FileSpreadsheet, FileCode,
  Phone, MapPin, Globe, User, Building2, Tag, ExternalLink,
  DollarSign, CheckCircle2, Clock
} from 'lucide-react';
import { Lead } from '../../types';

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

function exportToCSV(leads: Lead[], filename = 'my_customers_and_leads.csv') {
  const headers = [
    'Lead ID', 'Business / Shop Name', 'Customer / Client Name', 'Category',
    'Address', 'City', 'Province', 'Mobile / Phone', 'WhatsApp', 'Email',
    'Website', 'Google Maps', 'Service Needed', 'Estimated Budget (USD)',
    'Priority', 'Status', 'Date Added'
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

function exportToXML(leads: Lead[], filename = 'my_customers_and_leads.xml') {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<BDCustomerLeads>\n';
  leads.forEach(l => {
    xml += '  <CustomerLead>\n';
    xml += `    <LeadId>${escapeXml(l.leadId)}</LeadId>\n`;
    xml += `    <BusinessOrShopName>${escapeXml(l.businessName)}</BusinessOrShopName>\n`;
    xml += `    <CustomerName>${escapeXml(l.clientName || '')}</CustomerName>\n`;
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
    xml += `    <OnlineLinks>\n`;
    xml += `      <Website>${escapeXml(l.website || '')}</Website>\n`;
    xml += `      <GoogleMaps>${escapeXml(l.googleMaps || '')}</GoogleMaps>\n`;
    xml += `    </OnlineLinks>\n`;
    xml += `    <Service>${escapeXml(l.interestedService || '')}</Service>\n`;
    xml += `    <Budget>${l.estimatedBudget || 0}</Budget>\n`;
    xml += `    <Status>${l.status}</Status>\n`;
    xml += `    <Priority>${l.leadPriority}</Priority>\n`;
    xml += `    <DateAdded>${l.createdAt ? new Date(l.createdAt).toISOString() : ''}</DateAdded>\n`;
    xml += '  </CustomerLead>\n';
  });
  xml += '</BDCustomerLeads>';

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const BDLeadsView: React.FC = () => {
  const { currentUser } = usePortal();
  const { getLeadsForBD, getBDProfileByUserId } = useBD();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const bdProfile = currentUser ? getBDProfileByUserId(currentUser.id) : undefined;
  const allLeads = bdProfile?.bdId ? getLeadsForBD(bdProfile.bdId) : [];

  // Filter lists
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    allLeads.forEach(l => { if (l.category) set.add(l.category); });
    return Array.from(set);
  }, [allLeads]);

  const citiesList = useMemo(() => {
    const set = new Set<string>();
    allLeads.forEach(l => { if (l.city) set.add(l.city); });
    return Array.from(set);
  }, [allLeads]);

  const filtered = useMemo(() => {
    return allLeads.filter(l => {
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
        (l.leadId && l.leadId.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || l.category === categoryFilter;
      const matchCity = cityFilter === 'all' || l.city === cityFilter;

      return matchSearch && matchStatus && matchCategory && matchCity;
    });
  }, [allLeads, search, statusFilter, categoryFilter, cityFilter]);

  const pipeline = [
    { label: 'New / Assigned', statuses: ['NEW', 'ASSIGNED', 'PENDING_ADMIN_REVIEW'], color: '#60a5fa' },
    { label: 'In Progress', statuses: ['CONTACTED', 'INTERESTED', 'REQUIREMENT_GATHERING'], color: '#34d399' },
    { label: 'Advanced', statuses: ['QUOTATION_SENT', 'NEGOTIATION'], color: '#a78bfa' },
    { label: 'Won', statuses: ['WON', 'PROJECT_STARTED', 'PROJECT_COMPLETED'], color: '#10b981' },
    { label: 'Closed', statuses: ['NOT_INTERESTED', 'NO_RESPONSE', 'LOST', 'DUPLICATE', 'FOLLOW_UP_LATER'], color: '#ef4444' },
  ];

  const handleExportCSV = () => {
    exportToCSV(filtered, `my_customers_${bdProfile?.bdId || 'export'}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportXML = () => {
    exportToXML(filtered, `my_customers_${bdProfile?.bdId || 'export'}_${new Date().toISOString().split('T')[0]}.xml`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Top Header with Pipeline and Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white">My Customers & Referred Leads</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Overview of all your customer names, shop locations, mobile numbers, and project stages.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download your customer list as Excel CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleExportXML}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download your customer list as XML"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Export XML</span>
          </button>
        </div>
      </div>

      {/* Pipeline Stage Cards */}
      <div className="card-dark-gradient rounded-2xl border border-white/8 p-5">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Pipeline Status Overview</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {pipeline.map(stage => {
            const count = allLeads.filter(l => stage.statuses.includes(l.status)).length;
            return (
              <div
                key={stage.label}
                className="flex-1 min-w-24 text-center p-3 rounded-xl border transition-all"
                style={{ borderColor: stage.color + '30', backgroundColor: stage.color + '10' }}
              >
                <p className="text-xl font-bold text-white">{count}</p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color: stage.color }}>{stage.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Multi-Filters */}
      <div className="card-dark-gradient p-4 rounded-2xl border border-white/8 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your customers by Name, Shop/Place, Phone/Mobile, Location, Website..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#8B9FFD]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto">
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

            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#8B9FFD]"
            >
              <option value="all">All Cities</option>
              {citiesList.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>Showing {filtered.length} of {allLeads.length} customer records</span>
          {(search || statusFilter !== 'all' || categoryFilter !== 'all' || cityFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); setCityFilter('all'); }}
              className="text-[#8B9FFD] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Customer Leads Table */}
      <div className="card-dark-gradient rounded-2xl border border-white/8 overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
            <p className="text-sm text-zinc-500">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8 bg-zinc-900/40">
                  {['Lead ID', 'Customer / Business Name', 'Location / Place', 'Mobile & Contact', 'Website / Online', 'Service Needed', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(lead => (
                  <tr key={lead.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-zinc-400 whitespace-nowrap">{lead.leadId}</td>

                    {/* Customer & Shop/Business Name */}
                    <td className="px-4 py-3 min-w-44">
                      <p className="font-bold text-white text-xs">{lead.businessName}</p>
                      {lead.clientName && (
                        <p className="text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-zinc-500" />
                          <span>{lead.clientName}</span>
                        </p>
                      )}
                      {lead.category && (
                        <span className="text-[10px] text-zinc-500 font-medium">🏷️ {lead.category}</span>
                      )}
                    </td>

                    {/* Location / Place */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-zinc-300 font-semibold">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{lead.city || lead.address || '—'}</span>
                      </div>
                      {lead.address && lead.city && lead.address !== lead.city && (
                        <p className="text-zinc-500 text-[10px] truncate max-w-32">{lead.address}</p>
                      )}
                    </td>

                    {/* Mobile & Contact */}
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
                            className="text-emerald-400 text-[10px] block font-mono"
                          >
                            WA: {lead.whatsapp}
                          </a>
                        )}
                        {lead.email && <p className="text-zinc-500 text-[10px]">{lead.email}</p>}
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
                          <span className="text-zinc-600">—</span>
                        )}
                        {lead.googleMaps && (
                          <a href={lead.googleMaps} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline text-[10px] block">
                            Maps Link
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-zinc-200 font-semibold">{lead.interestedService || 'General'}</p>
                      {lead.estimatedBudget ? (
                        <p className="text-emerald-400 font-mono text-[10px]">${lead.estimatedBudget.toLocaleString()}</p>
                      ) : null}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${STATUS_COLORS[lead.status] || 'bg-zinc-500/20 text-zinc-400'}`}>
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Detail button */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                        title="View Full Customer Details"
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

      {/* Customer Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn" onClick={() => setSelectedLead(null)}>
          <div className="w-full max-w-lg card-dark-gradient border border-white/15 rounded-2xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-xs text-zinc-500 font-mono">{selectedLead.leadId}</p>
                <h3 className="text-base font-bold text-white">{selectedLead.businessName}</h3>
                {selectedLead.clientName && <p className="text-xs text-zinc-400">{selectedLead.clientName}</p>}
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ['Customer Contact', selectedLead.clientName],
                ['Phone / Mobile', selectedLead.phone],
                ['WhatsApp', selectedLead.whatsapp],
                ['Email', selectedLead.email],
                ['Location / City', selectedLead.city],
                ['Address', selectedLead.address],
                ['Province', selectedLead.province],
                ['Category', selectedLead.category],
                ['Service Needed', selectedLead.interestedService],
                ['Estimated Budget', selectedLead.estimatedBudget ? `$${selectedLead.estimatedBudget.toLocaleString()}` : '—'],
                ['Lead Priority', selectedLead.leadPriority],
                ['Status', selectedLead.status.replace(/_/g, ' ')],
              ].map(([k, v]) => (
                <div key={k as string} className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5">
                  <p className="text-zinc-500 text-[10px] font-semibold">{k}</p>
                  <p className="text-white font-semibold mt-0.5 truncate">{(v as string) || '—'}</p>
                </div>
              ))}
            </div>

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
                    <MapPin className="w-3.5 h-3.5" /> Google Maps
                  </a>
                )}
              </div>
            )}

            {selectedLead.requirement && (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <p className="text-[10px] text-zinc-500 font-semibold mb-1">Requirement</p>
                <p className="text-xs text-zinc-300">{selectedLead.requirement}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
