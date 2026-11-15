import PDFDocument from 'pdfkit';
import { pool } from './db.js';

const CURRENCY_NAMES = {
  EUR: 'Euro',
  USD: 'US Dollar',
  GBP: 'British Pound',
  CHF: 'Swiss Franc',
  BDT: 'Bangladeshi Taka',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar'
};

function getCurrencyLabel(code) {
  const upper = String(code || 'EUR').toUpperCase();
  const name = CURRENCY_NAMES[upper];
  return name ? `${upper} (${name})` : upper;
}

function formatMoneyText(amount, currency = 'EUR') {
  const code = String(currency || 'EUR').toUpperCase();
  const num = Number(amount || 0);
  return `${code} ${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function formatDateText(value, includeTime = false) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  if (includeTime) {
    return `${d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    })} · ${d.toISOString().slice(11, 16)} UTC`;
  }
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

function formatProviderLabel(provider) {
  const normalized = String(provider || '').trim().toLowerCase();
  if (!normalized) return 'Direct Settlement';
  if (normalized === 'stripe') return 'Stripe Checkout (Card / Online)';
  if (normalized === 'paypal') return 'PayPal Checkout';
  if (normalized === 'bank' || normalized === 'bank_transfer' || normalized === 'sepa') return 'Bank Wire / SEPA Transfer';
  if (normalized === 'manual') return 'Direct Settlement (Verified by RSTechwerk)';
  return normalized.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildReceiptNumber(prefix, rawId, paidAt, existingRef) {
  const year = paidAt && !Number.isNaN(new Date(paidAt).getTime())
    ? new Date(paidAt).getUTCFullYear()
    : new Date().getUTCFullYear();
  if (existingRef && /^[A-Z0-9-]+$/i.test(existingRef)) {
    return `RCP-${year}-${String(existingRef).toUpperCase()}`;
  }
  const shortHex = String(rawId || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
  return `RCP-${year}-${prefix}-${shortHex || '0000'}`;
}

async function loadCompanyContext() {
  const [[siteRows], [officeRows]] = await Promise.all([
    pool.execute('SELECT content_json FROM site_content WHERE content_key = ? LIMIT 1', ['site']),
    pool.query(
      `SELECT country, city, office_label AS officeLabel, street_address AS streetAddress,
              postal_city AS postalCity, phone, email
       FROM office_locations
       WHERE is_active = TRUE
       ORDER BY sort_order ASC, is_primary DESC, created_at ASC`
    )
  ]);

  let companyName = 'RSTechwerk';
  let companyEmail = 'inquiry@rstechwerk.com';
  let companyWebsite = 'https://rstechwerk.com';

  if (siteRows[0]?.content_json) {
    try {
      const parsed = JSON.parse(siteRows[0].content_json);
      if (parsed?.settings?.companyName) companyName = String(parsed.settings.companyName);
      if (parsed?.settings?.inquiryEmail) companyEmail = String(parsed.settings.inquiryEmail);
      if (parsed?.settings?.canonicalUrl) companyWebsite = String(parsed.settings.canonicalUrl).replace(/\/$/, '');
    } catch {
      // keep defaults
    }
  }

  return {
    companyName,
    companyEmail,
    companyWebsite,
    offices: officeRows || []
  };
}

export async function resolveReceiptData(type, id, user, isStaff) {
  const normalizedType = String(type || '').toLowerCase();
  if (!['milestone', 'invoice', 'maintenance'].includes(normalizedType) || !id) {
    return { errorStatus: 400, errorMessage: 'Invalid receipt type or reference.' };
  }

  const company = await loadCompanyContext();

  if (normalizedType === 'milestone') {
    const [rows] = await pool.execute(
      `SELECT m.id, m.project_id AS projectId, m.title, m.description, m.amount, m.currency,
              m.due_date AS dueDate, m.status, m.payment_provider AS paymentProvider,
              m.payment_reference AS paymentReference, m.paid_at AS paidAt, m.sort_order AS sortOrder,
              p.name AS projectName, p.description AS projectDescription,
              c.id AS clientId, c.user_id AS clientUserId, c.company_name AS companyName,
              c.contact_name AS contactName, c.email AS clientEmail, c.phone AS clientPhone,
              c.country AS clientCountry,
              cp.address AS clientAddress, cp.city AS clientCity, cp.postal_code AS clientPostalCode
       FROM project_milestones m
       JOIN projects p ON p.id = m.project_id
       JOIN clients c ON c.id = p.client_id
       LEFT JOIN client_profiles cp ON cp.client_id = c.id
       WHERE m.id = ?
       LIMIT 1`,
      [id]
    );
    const row = rows[0];
    if (!row || (!isStaff && row.clientUserId !== user.sub)) {
      return { errorStatus: 404, errorMessage: 'Payment record not found.' };
    }
    if (row.status !== 'paid') {
      return { errorStatus: 409, errorMessage: 'A PDF receipt is available once this milestone payment is completed.' };
    }

    const [paymentRows] = await pool.execute(
      `SELECT id, provider, provider_reference AS providerReference, amount, currency, status, paid_at AS paidAt
       FROM payments
       WHERE milestone_id = ? AND status = 'paid'
       ORDER BY COALESCE(paid_at, created_at) DESC
       LIMIT 1`,
      [row.id]
    );
    const latestPayment = paymentRows[0] || null;

    const [projectMilestones] = await pool.execute(
      `SELECT id, title, amount, currency, status
       FROM project_milestones
       WHERE project_id = ?
       ORDER BY sort_order ASC, created_at ASC`,
      [row.projectId]
    );

    const milestoneIndex = Math.max(1, projectMilestones.findIndex((m) => m.id === row.id) + 1);
    const milestoneCount = Math.max(1, projectMilestones.length);
    const currency = String(latestPayment?.currency || row.currency || 'EUR').toUpperCase();
    const paidAmount = Number(latestPayment?.amount ?? row.amount ?? 0);
    const sameCurrencyMilestones = projectMilestones.filter(
      (m) => String(m.currency || currency).toUpperCase() === currency
    );
    const projectMilestonesTotal = sameCurrencyMilestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const projectPaidTotal = sameCurrencyMilestones
      .filter((m) => m.status === 'paid')
      .reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const projectRemainingTotal = Math.max(0, projectMilestonesTotal - projectPaidTotal);
    const paidAt = latestPayment?.paidAt || row.paidAt;
    const provider = latestPayment?.provider || row.paymentProvider || 'manual';
    const providerReference = latestPayment?.providerReference || row.paymentReference || row.id.slice(0, 12).toUpperCase();

    return {
      receipt: {
        receiptNumber: buildReceiptNumber('MS', row.id, paidAt),
        type: 'milestone',
        typeLabel: 'Project Milestone Payment',
        itemId: row.id,
        itemTitle: row.title,
        itemDescription: row.description || `Milestone ${milestoneIndex} of ${milestoneCount} deliverable settlement`,
        projectName: row.projectName,
        referenceCode: `MS-${String(milestoneIndex).padStart(2, '0')} / ${row.id.slice(0, 8).toUpperCase()}`,
        amount: paidAmount,
        currency,
        currencyLabel: getCurrencyLabel(currency),
        status: 'PAID',
        paidAt,
        dueDate: row.dueDate,
        periodText: null,
        paymentProvider: provider,
        paymentMethodLabel: formatProviderLabel(provider),
        transactionReference: providerReference,
        milestoneBreakdown: {
          milestoneNumber: milestoneIndex,
          milestoneCount,
          milestoneAmount: paidAmount,
          projectMilestonesTotal,
          projectPaidTotal,
          projectRemainingTotal
        },
        client: {
          companyName: row.companyName,
          contactName: row.contactName,
          email: row.clientEmail,
          phone: row.clientPhone,
          country: row.clientCountry,
          address: row.clientAddress,
          city: row.clientCity,
          postalCode: row.clientPostalCode
        },
        company
      }
    };
  }

  if (normalizedType === 'invoice') {
    const [rows] = await pool.execute(
      `SELECT i.id, i.project_id AS projectId, i.invoice_number AS invoiceNumber, i.description,
              i.amount, i.currency, i.status, i.due_date AS dueDate, i.paid_at AS paidAt,
              p.name AS projectName,
              c.id AS clientId, c.user_id AS clientUserId, c.company_name AS companyName,
              c.contact_name AS contactName, c.email AS clientEmail, c.phone AS clientPhone,
              c.country AS clientCountry,
              cp.address AS clientAddress, cp.city AS clientCity, cp.postal_code AS clientPostalCode
       FROM invoices i
       JOIN projects p ON p.id = i.project_id
       JOIN clients c ON c.id = i.client_id
       LEFT JOIN client_profiles cp ON cp.client_id = c.id
       WHERE i.id = ?
       LIMIT 1`,
      [id]
    );
    const row = rows[0];
    if (!row || (!isStaff && row.clientUserId !== user.sub)) {
      return { errorStatus: 404, errorMessage: 'Invoice record not found.' };
    }
    if (row.status !== 'paid') {
      return { errorStatus: 409, errorMessage: 'A PDF receipt is available once this invoice is marked paid.' };
    }

    const currency = String(row.currency || 'EUR').toUpperCase();
    return {
      receipt: {
        receiptNumber: buildReceiptNumber('INV', row.id, row.paidAt, row.invoiceNumber),
        type: 'invoice',
        typeLabel: 'Project Invoice Payment',
        itemId: row.id,
        itemTitle: row.invoiceNumber,
        itemDescription: row.description,
        projectName: row.projectName,
        referenceCode: row.invoiceNumber,
        amount: Number(row.amount || 0),
        currency,
        currencyLabel: getCurrencyLabel(currency),
        status: 'PAID',
        paidAt: row.paidAt,
        dueDate: row.dueDate,
        periodText: null,
        paymentProvider: 'manual',
        paymentMethodLabel: formatProviderLabel('manual'),
        transactionReference: row.invoiceNumber,
        milestoneBreakdown: null,
        client: {
          companyName: row.companyName,
          contactName: row.contactName,
          email: row.clientEmail,
          phone: row.clientPhone,
          country: row.clientCountry,
          address: row.clientAddress,
          city: row.clientCity,
          postalCode: row.clientPostalCode
        },
        company
      }
    };
  }

  const [rows] = await pool.execute(
    `SELECT i.id, i.contract_id AS contractId, i.invoice_number AS invoiceNumber,
            i.period_start AS periodStart, i.period_end AS periodEnd,
            i.amount, i.currency, i.status, i.due_date AS dueDate, i.paid_at AS paidAt,
            i.provider, i.provider_reference AS providerReference,
            m.title AS contractTitle, m.description AS contractDescription, m.billing_type AS billingType,
            p.name AS projectName,
            c.id AS clientId, c.user_id AS clientUserId, c.company_name AS companyName,
            c.contact_name AS contactName, c.email AS clientEmail, c.phone AS clientPhone,
            c.country AS clientCountry,
            cp.address AS clientAddress, cp.city AS clientCity, cp.postal_code AS clientPostalCode
     FROM maintenance_invoices i
     JOIN maintenance_contracts m ON m.id = i.contract_id
     LEFT JOIN projects p ON p.id = m.project_id
     JOIN clients c ON c.id = i.client_id
     LEFT JOIN client_profiles cp ON cp.client_id = c.id
     WHERE i.id = ?
     LIMIT 1`,
    [id]
  );
  const row = rows[0];
  if (!row || (!isStaff && row.clientUserId !== user.sub)) {
    return { errorStatus: 404, errorMessage: 'Maintenance invoice not found.' };
  }
  if (row.status !== 'paid') {
    return { errorStatus: 409, errorMessage: 'A PDF receipt is available once this maintenance invoice is paid.' };
  }

  const currency = String(row.currency || 'EUR').toUpperCase();
  const periodText = row.periodStart && row.periodEnd
    ? `${formatDateText(row.periodStart)} to ${formatDateText(row.periodEnd)}`
    : `${String(row.billingType || 'monthly').replaceAll('_', ' ')} retainer`;

  return {
    receipt: {
      receiptNumber: buildReceiptNumber('MNT', row.id, row.paidAt, row.invoiceNumber),
      type: 'maintenance',
      typeLabel: 'Maintenance & Retainer Payment',
      itemId: row.id,
      itemTitle: row.contractTitle,
      itemDescription: row.contractDescription || `Maintenance retainer settlement (${periodText})`,
      projectName: row.projectName || 'Account-wide Retainer',
      referenceCode: row.invoiceNumber,
      amount: Number(row.amount || 0),
      currency,
      currencyLabel: getCurrencyLabel(currency),
      status: 'PAID',
      paidAt: row.paidAt,
      dueDate: row.dueDate,
      periodText,
      paymentProvider: row.provider || 'manual',
      paymentMethodLabel: formatProviderLabel(row.provider || 'manual'),
      transactionReference: row.providerReference || row.invoiceNumber,
      milestoneBreakdown: null,
      client: {
        companyName: row.companyName,
        contactName: row.contactName,
        email: row.clientEmail,
        phone: row.clientPhone,
        country: row.clientCountry,
        address: row.clientAddress,
        city: row.clientCity,
        postalCode: row.clientPostalCode
      },
      company
    }
  };
}

function drawBusinessEmblem(doc, x, y, size = 36) {
  const s = size / 36;
  doc.save();
  doc.translate(x, y);
  doc.scale(s);

  // Outer squircle box matching favicon.svg & portal emblem
  doc.roundedRect(1, 1, 34, 34, 9).fillAndStroke('#0b1320', '#10b981');

  // Precision circuit accent trace & cyan node
  doc.lineWidth(1.3).lineCap('round').strokeColor('#38bdf8');
  doc.moveTo(22, 8).lineTo(26, 8).stroke();
  doc.circle(28, 8, 1.75).fill('#38bdf8');

  // Bold geometric 'R'
  doc.lineWidth(2.4).lineCap('round').lineJoin('round').strokeColor('#ffffff');
  doc.moveTo(9, 26)
    .lineTo(9, 10)
    .lineTo(16, 10)
    .bezierCurveTo(18.6, 10, 20.5, 11.9, 20.5, 14.5)
    .bezierCurveTo(20.5, 17.1, 18.6, 19, 16, 19)
    .lineTo(9, 19)
    .stroke();
  doc.moveTo(14.5, 19).lineTo(21, 26).stroke();

  // Flowing emerald 'S'
  doc.lineWidth(2.2).lineCap('round').lineJoin('round').strokeColor('#34d399');
  doc.moveTo(23, 13)
    .bezierCurveTo(24.8, 13, 26.6, 13.3, 27, 14.2)
    .bezierCurveTo(27.6, 15.4, 26.4, 17, 24.8, 17.6)
    .bezierCurveTo(22.8, 18.2, 21.8, 19.8, 22.8, 21.2)
    .bezierCurveTo(23.8, 22.6, 26.5, 22.5, 27.5, 22)
    .stroke();

  doc.restore();
}

export function streamReceiptPdf(receipt, res) {
  const safeFilename = `${receipt.receiptNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.setHeader('Cache-Control', 'no-store');

  const doc = new PDFDocument({
    size: 'A4',
    margin: 44,
    info: {
      Title: `Payment Receipt ${receipt.receiptNumber} — ${receipt.company.companyName}`,
      Author: receipt.company.companyName,
      Subject: `${receipt.typeLabel}: ${receipt.itemTitle}`
    }
  });

  doc.pipe(res);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const left = 44;
  const right = pageWidth - 44;
  const contentWidth = right - left;

  const colors = {
    ink: '#0f172a',
    secondary: '#334155',
    muted: '#64748b',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',
    surface: '#f8fafc',
    emerald: '#059669',
    emeraldSoft: '#ecfdf5',
    emeraldBorder: '#a7f3d0'
  };

  // 1. Header with RSTechwerk Emblem, Wordmark, and PAID Receipt Metadata
  let y = 42;
  drawBusinessEmblem(doc, left, y, 38);

  doc.font('Helvetica-Bold').fontSize(17).fillColor(colors.emerald).text('RS', left + 48, y + 3, { continued: true });
  doc.fillColor(colors.ink).text('Techwerk');
  doc.font('Helvetica').fontSize(8.5).fillColor(colors.muted)
    .text(`Software Engineering & Digital Delivery · ${receipt.company.companyWebsite.replace(/^https?:\/\//, '')}`, left + 48, y + 23);

  doc.font('Helvetica-Bold').fontSize(15).fillColor(colors.ink)
    .text('PAYMENT RECEIPT', right - 210, y + 1, { width: 210, align: 'right' });

  // Verified PAID stamp badge
  doc.roundedRect(right - 102, y + 23, 102, 18, 4)
    .fillAndStroke(colors.emeraldSoft, colors.emeraldBorder);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.emerald)
    .text('PAID · VERIFIED', right - 102, y + 28, { width: 102, align: 'center' });

  y += 56;
  doc.moveTo(left, y).lineTo(right, y).lineWidth(1).strokeColor(colors.borderLight).stroke();

  // 2. Hero Proof Summary Card (4 clear proof cells)
  y += 14;
  const heroHeight = 64;
  doc.roundedRect(left, y, contentWidth, heroHeight, 8).fillAndStroke(colors.surface, colors.border);

  const colW = contentWidth / 4;
  const heroCols = [
    { label: 'TOTAL AMOUNT PAID', value: formatMoneyText(receipt.amount, receipt.currency), sub: receipt.currencyLabel, accent: true },
    { label: 'PAYMENT PURPOSE', value: receipt.typeLabel, sub: receipt.projectName || 'Client Workspace' },
    { label: 'PAYMENT METHOD', value: receipt.paymentMethodLabel, sub: `Ref: ${String(receipt.transactionReference).slice(0, 24)}` },
    { label: 'PAID DATE & TIME', value: formatDateText(receipt.paidAt, false), sub: formatDateText(receipt.paidAt, true).split('·')[1]?.trim() || 'Verified' }
  ];

  heroCols.forEach((col, idx) => {
    const cx = left + idx * colW;
    if (idx > 0) {
      doc.moveTo(cx, y + 10).lineTo(cx, y + heroHeight - 10).lineWidth(0.75).strokeColor(colors.borderLight).stroke();
    }
    doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.muted)
      .text(col.label, cx + 10, y + 10, { width: colW - 20 });
    doc.font('Helvetica-Bold').fontSize(idx === 0 ? 11.5 : 9.2).fillColor(col.accent ? colors.emerald : colors.ink)
      .text(col.value, cx + 10, y + 23, { width: colW - 20, ellipsis: true, lineBreak: false });
    doc.font('Helvetica').fontSize(7.5).fillColor(colors.muted)
      .text(col.sub || '', cx + 10, y + 40, { width: colW - 20, ellipsis: true, lineBreak: false });
  });

  // 3. Two-Column Received From (Client) & Payment Metadata
  y += heroHeight + 20;
  const halfW = (contentWidth - 24) / 2;
  const rightColX = left + halfW + 24;

  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.muted).text('RECEIVED FROM (CLIENT)', left, y);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.muted).text('RECEIPT & ISSUER DETAILS', rightColX, y);

  y += 14;
  const clientLines = [
    { text: receipt.client.companyName, bold: true },
    { text: `Attn: ${receipt.client.contactName}` },
    { text: receipt.client.email },
    receipt.client.phone ? { text: `Phone: ${receipt.client.phone}` } : null,
    [receipt.client.address, receipt.client.postalCode, receipt.client.city, receipt.client.country].filter(Boolean).length
      ? { text: [receipt.client.address, receipt.client.postalCode, receipt.client.city, receipt.client.country].filter(Boolean).join(', ') }
      : null
  ].filter(Boolean);

  let leftY = y;
  clientLines.forEach((line) => {
    doc.font(line.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(line.bold ? 10.5 : 9).fillColor(line.bold ? colors.ink : colors.secondary)
      .text(line.text, left, leftY, { width: halfW });
    leftY = doc.y + 3;
  });

  const metaRows = [
    ['Receipt No.', receipt.receiptNumber],
    ['Reference ID', receipt.referenceCode],
    ['Currency', receipt.currencyLabel],
    ['Payment Gateway', receipt.paymentMethodLabel],
    ['Transaction Ref', String(receipt.transactionReference)],
    ['Issuer Email', receipt.company.companyEmail]
  ];

  let rightY = y;
  metaRows.forEach(([k, v]) => {
    doc.font('Helvetica').fontSize(8.5).fillColor(colors.muted).text(k, rightColX, rightY, { width: 92 });
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.ink).text(v, rightColX + 94, rightY, { width: halfW - 94, align: 'right' });
    rightY = Math.max(rightY + 14, doc.y + 3);
  });

  y = Math.max(leftY, rightY) + 18;

  // 4. Itemized Payment Breakdown Table
  const tableHeaderH = 26;
  doc.roundedRect(left, y, contentWidth, tableHeaderH, 4).fill('#0f172a');
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff');
  doc.text('ITEM & DESCRIPTION', left + 12, y + 9, { width: 250 });
  doc.text('TYPE / CURRENCY', left + 270, y + 9, { width: 95 });
  doc.text('DUE / PERIOD', left + 370, y + 9, { width: 70 });
  doc.text('PAID AMOUNT', right - 102, y + 9, { width: 90, align: 'right' });

  y += tableHeaderH + 10;
  const itemStartY = y;
  doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.ink)
    .text(receipt.itemTitle, left + 12, y, { width: 248 });
  const titleEndY = doc.y;
  doc.font('Helvetica').fontSize(8.5).fillColor(colors.secondary)
    .text(`${receipt.projectName}${receipt.itemDescription ? ` — ${receipt.itemDescription}` : ''}`, left + 12, titleEndY + 3, { width: 248 });
  const rowBottomY = Math.max(doc.y, itemStartY + 34);

  doc.font('Helvetica').fontSize(8.5).fillColor(colors.secondary)
    .text(receipt.type === 'milestone' ? 'Milestone' : receipt.type === 'maintenance' ? 'Retainer' : 'Invoice', left + 270, itemStartY, { width: 95 });
  doc.font('Helvetica').fontSize(8).fillColor(colors.muted)
    .text(receipt.currency, left + 270, itemStartY + 13, { width: 95 });

  doc.font('Helvetica').fontSize(8.5).fillColor(colors.secondary)
    .text(receipt.periodText || formatDateText(receipt.dueDate), left + 370, itemStartY, { width: 75 });

  doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.ink)
    .text(formatMoneyText(receipt.amount, receipt.currency), right - 105, itemStartY + 2, { width: 93, align: 'right' });

  y = rowBottomY + 12;
  doc.moveTo(left, y).lineTo(right, y).lineWidth(0.75).strokeColor(colors.borderLight).stroke();

  // 5. Milestone Progress Breakdown OR Totals Summary
  y += 14;
  if (receipt.milestoneBreakdown) {
    const mb = receipt.milestoneBreakdown;
    doc.roundedRect(left, y, 275, 62, 6).fillAndStroke(colors.surface, colors.borderLight);
    doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.ink)
      .text(`PROJECT MILESTONE SCHEDULE (${mb.milestoneNumber} OF ${mb.milestoneCount})`, left + 12, y + 10);
    doc.font('Helvetica').fontSize(8.5).fillColor(colors.secondary)
      .text(`This milestone settled: ${formatMoneyText(mb.milestoneAmount, receipt.currency)}`, left + 12, y + 24);
    doc.text(
      `Total project milestones: ${formatMoneyText(mb.projectMilestonesTotal, receipt.currency)} · Paid to date: ${formatMoneyText(mb.projectPaidTotal, receipt.currency)}`,
      left + 12,
      y + 38,
      { width: 251 }
    );
  }

  // Right Totals Box
  const totalsX = right - 210;
  doc.font('Helvetica').fontSize(9).fillColor(colors.muted).text('Subtotal', totalsX, y);
  doc.font('Helvetica').fontSize(9).fillColor(colors.ink).text(formatMoneyText(receipt.amount, receipt.currency), totalsX, y, { width: 210, align: 'right' });

  doc.font('Helvetica').fontSize(9).fillColor(colors.muted).text('Currency Settled', totalsX, y + 16);
  doc.font('Helvetica').fontSize(9).fillColor(colors.ink).text(receipt.currency, totalsX, y + 16, { width: 210, align: 'right' });

  doc.moveTo(totalsX, y + 32).lineTo(right, y + 32).lineWidth(0.75).strokeColor(colors.border).stroke();

  doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.ink).text('Total Paid', totalsX, y + 40);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.emerald)
    .text(formatMoneyText(receipt.amount, receipt.currency), totalsX, y + 39, { width: 210, align: 'right' });

  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.emerald)
    .text('Status: Paid in Full · Balance Due: 0.00', totalsX, y + 58, { width: 210, align: 'right' });

  y += 88;

  // 6. Verification Note
  doc.roundedRect(left, y, contentWidth, 44, 6).fillAndStroke(colors.emeraldSoft, colors.emeraldBorder);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.emerald)
    .text('Official Payment Confirmation', left + 12, y + 10);
  doc.font('Helvetica').fontSize(8).fillColor(colors.secondary)
    .text(
      `This document confirms that ${receipt.company.companyName} received ${formatMoneyText(receipt.amount, receipt.currency)} via ${receipt.paymentMethodLabel} for "${receipt.itemTitle}" (${receipt.projectName}). Keep this PDF for your accounting and audit records.`,
      left + 12,
      y + 22,
      { width: contentWidth - 24 }
    );

  // 7. Dynamic Office Locations Footer
  const footerY = pageHeight - 98;
  doc.moveTo(left, footerY).lineTo(right, footerY).lineWidth(0.75).strokeColor(colors.borderLight).stroke();

  const offices = receipt.company.offices.slice(0, 3);
  if (offices.length) {
    const officeColW = contentWidth / offices.length;
    offices.forEach((office, idx) => {
      const ox = left + idx * officeColW;
      doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.ink)
        .text(`${office.officeLabel} (${office.country})`, ox, footerY + 10, { width: officeColW - 12 });
      doc.font('Helvetica').fontSize(7.5).fillColor(colors.muted)
        .text([office.streetAddress, office.postalCity].filter(Boolean).join(', '), ox, footerY + 21, { width: officeColW - 12 });
      const contactLine = [office.phone, office.email].filter(Boolean).join(' · ');
      if (contactLine) {
        doc.text(contactLine, ox, footerY + 32, { width: officeColW - 12 });
      }
    });
  } else {
    doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.ink).text(receipt.company.companyName, left, footerY + 12);
    doc.font('Helvetica').fontSize(7.5).fillColor(colors.muted)
      .text(`${receipt.company.companyEmail} · ${receipt.company.companyWebsite}`, left, footerY + 23);
  }

  doc.font('Helvetica').fontSize(7).fillColor(colors.muted)
    .text(
      `Generated electronically by ${receipt.company.companyName} Client Portal · Receipt ${receipt.receiptNumber}`,
      left,
      pageHeight - 38,
      { width: contentWidth, align: 'center' }
    );

  doc.end();
}
