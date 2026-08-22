// Utility for creating sample payment slips and handling client slip uploads

export const generateSamplePaymentSlipSvg = (
  clientName: string,
  amount: number,
  refNumber: string,
  serviceTitle: string,
  date: string = '2026-08-18'
): string => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="600" height="800" fill="#f8fafc" rx="12" />
  
  <!-- Receipt Header -->
  <rect x="0" y="0" width="600" height="130" fill="url(#headerGrad)" rx="12" />
  <rect x="0" y="118" width="600" height="12" fill="#0f172a" />
  
  <!-- Watermark / Stamp -->
  <circle cx="490" cy="650" r="65" fill="none" stroke="#22c55e" stroke-width="4" stroke-dasharray="6,4" opacity="0.4" />
  <text x="490" y="645" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#16a34a" text-anchor="middle" opacity="0.6">PAYMENT</text>
  <text x="490" y="665" font-family="Arial, sans-serif" font-size="13" font-weight="800" fill="#16a34a" text-anchor="middle" opacity="0.6">SUBMITTED</text>

  <!-- Header Info -->
  <text x="40" y="48" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">OFFICIAL PAYMENT RECEIPT</text>
  <text x="40" y="74" font-family="Arial, sans-serif" font-size="12" font-weight="500" fill="#94a3b8">DIRECT CLIENT BANK TRANSFER / WIRE CONFIRMATION</text>
  <text x="40" y="98" font-family="Courier, monospace" font-size="11" fill="#38bdf8">REF: ${refNumber}</text>

  <rect x="440" y="32" width="120" height="34" rx="8" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e" stroke-width="1.5" />
  <text x="500" y="54" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#4ade80" text-anchor="middle">VERIFIED SLIP</text>

  <!-- Summary Box -->
  <rect x="40" y="155" width="520" height="100" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#shadow)" />
  
  <text x="65" y="185" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#64748b">TOTAL AMOUNT PAID</text>
  <text x="65" y="230" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#0f172a">$${amount.toLocaleString()}.00 <tspan font-size="14" font-weight="600" fill="#64748b">USD</tspan></text>

  <text x="380" y="185" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#64748b">TRANSACTION DATE</text>
  <text x="380" y="212" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#1e293b">${date}</text>
  <text x="380" y="232" font-family="Arial, sans-serif" font-size="11" font-weight="500" fill="#22c55e">✓ Successful Transfer</text>

  <!-- Details Grid -->
  <rect x="40" y="275" width="520" height="310" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
  
  <text x="65" y="310" font-family="Arial, sans-serif" font-size="12" font-weight="800" fill="#334155">TRANSACTION & ACCOUNT METADATA</text>
  <line x1="65" y1="322" x2="535" y2="322" stroke="#f1f5f9" stroke-width="2" />

  <!-- Field 1: Sender / Client -->
  <text x="65" y="350" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">Sender Account / Client:</text>
  <text x="250" y="350" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#0f172a">${clientName}</text>

  <!-- Field 2: Beneficiary -->
  <text x="65" y="385" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">Beneficiary Developer:</text>
  <text x="250" y="385" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#0f172a">Thivanka Randimal Premarathna</text>

  <!-- Field 3: Service Requested -->
  <text x="65" y="420" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">Service / Project Order:</text>
  <text x="250" y="420" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#2563eb">${serviceTitle.substring(0, 32)}${serviceTitle.length > 32 ? '...' : ''}</text>

  <!-- Field 4: Payment Channel -->
  <text x="65" y="455" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">Payment Channel:</text>
  <text x="250" y="455" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#0f172a">Commercial Bank / Direct Wire Transfer</text>

  <!-- Field 5: Reference / Slip ID -->
  <text x="65" y="490" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">Wire Reference #:</text>
  <text x="250" y="490" font-family="Courier, monospace" font-size="12" font-weight="700" fill="#0f172a">${refNumber}</text>

  <!-- Field 6: Verification Status -->
  <text x="65" y="525" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#64748b">Approval State:</text>
  <text x="250" y="525" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#ea580c">Pending Admin Verification</text>

  <!-- Barcode Simulation -->
  <g transform="translate(65, 610)">
    <rect x="0" y="0" width="4" height="40" fill="#1e293b" />
    <rect x="8" y="0" width="2" height="40" fill="#1e293b" />
    <rect x="14" y="0" width="6" height="40" fill="#1e293b" />
    <rect x="24" y="0" width="3" height="40" fill="#1e293b" />
    <rect x="32" y="0" width="5" height="40" fill="#1e293b" />
    <rect x="42" y="0" width="2" height="40" fill="#1e293b" />
    <rect x="48" y="0" width="8" height="40" fill="#1e293b" />
    <rect x="60" y="0" width="4" height="40" fill="#1e293b" />
    <rect x="68" y="0" width="2" height="40" fill="#1e293b" />
    <rect x="74" y="0" width="5" height="40" fill="#1e293b" />
    <rect x="84" y="0" width="7" height="40" fill="#1e293b" />
    <rect x="96" y="0" width="2" height="40" fill="#1e293b" />
    <rect x="102" y="0" width="4" height="40" fill="#1e293b" />
    <rect x="110" y="0" width="6" height="40" fill="#1e293b" />
    <rect x="120" y="0" width="3" height="40" fill="#1e293b" />
    <rect x="128" y="0" width="5" height="40" fill="#1e293b" />
    <rect x="138" y="0" width="8" height="40" fill="#1e293b" />
    <rect x="150" y="0" width="3" height="40" fill="#1e293b" />
    <rect x="158" y="0" width="6" height="40" fill="#1e293b" />
    <rect x="168" y="0" width="2" height="40" fill="#1e293b" />
    <rect x="174" y="0" width="7" height="40" fill="#1e293b" />
    <rect x="185" y="0" width="4" height="40" fill="#1e293b" />
    <rect x="194" y="0" width="2" height="40" fill="#1e293b" />
    <rect x="200" y="0" width="5" height="40" fill="#1e293b" />
    <text x="0" y="55" font-family="Courier, monospace" font-size="10" fill="#64748b">${refNumber} • ELECTRONIC AUDIT LOG</text>
  </g>

  <!-- Security Footer -->
  <rect x="40" y="720" width="520" height="45" rx="8" fill="#f1f5f9" />
  <text x="300" y="747" font-family="Arial, sans-serif" font-size="10.5" fill="#64748b" text-anchor="middle">
    Protected by encrypted SHA-256 verification. Keep this receipt for portal onboarding.
  </text>
</svg>
`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const SAMPLE_SLIPS = [
  {
    name: 'Sample Wire Transfer Receipt ($450)',
    dataUrl: generateSamplePaymentSlipSvg(
      'Nexus Global Retail Ltd',
      450,
      'WIRE-2026-98124',
      'Full Stack Web App with Auth & Database'
    ),
    fileName: 'bank_wire_nexus_450usd.pdf.png',
    fileSize: '142 KB',
    amount: 450,
    reference: 'WIRE-2026-98124',
  },
  {
    name: 'Sample Enterprise ERP Deposit ($950)',
    dataUrl: generateSamplePaymentSlipSvg(
      'Horizon Logistics Corp',
      950,
      'TT-2026-44189',
      'Custom ERP & Inventory Management Suite'
    ),
    fileName: 'telegraphic_transfer_950usd.png',
    fileSize: '198 KB',
    amount: 950,
    reference: 'TT-2026-44189',
  },
];
