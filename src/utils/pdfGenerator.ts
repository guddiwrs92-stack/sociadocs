import { jsPDF } from 'jspdf';
import { AgencyConfig, ClientProfile, InvoiceItem } from '../types';
import {
  AGENCY_CONFIG,
  CLIENT_CONFIG,
  calculateLineGross,
  calculateLineNet,
  calculateInvoiceSubtotal,
  calculateInvoiceDiscount,
  calculateInvoiceTotal,
  formatINR,
} from '../data/portalData';

/**
 * Generates a clean, branded PDF invoice according to exact requirements:
 * - Header: "SocialDocs" and phone +91 99832 66017 only.
 * - Top right: "INVOICE", invoice number, invoice date, due date, billing period.
 * - Status badge: "PAYMENT DUE" in amber when status is Pending, "PAID" in green when Paid, "OVERDUE" in red when Overdue.
 * - Billed To: Kaushal Harwani, kaushalharwani750@gmail.com, +91 93511 16059, Jodhpur, Rajasthan, India.
 * - Table columns: Description | Rate | Qty | Discount | Amount.
 * - Subtotal, Discount (green with minus sign), highlighted "Total Payable: ₹5,000" row.
 * - Footer: "For billing queries, contact SocialDocs at +91 99832 66017."
 * - No bank box, no GSTIN, no address, no taxes line, no agency email, no invented reference number.
 */
export function generateInvoicePDF(
  invoice: InvoiceItem,
  client?: ClientProfile,
  agency?: AgencyConfig
): void {
  const activeAgency = agency || AGENCY_CONFIG;
  const activeClientName = client?.name || CLIENT_CONFIG.name;
  const activeClientEmail = client?.email || CLIENT_CONFIG.email;
  const activeClientPhone = client?.phone || CLIENT_CONFIG.phone;
  const activeClientLocation = client?.location || CLIENT_CONFIG.location;

  const subtotal = calculateInvoiceSubtotal(invoice);
  const discountTotal = calculateInvoiceDiscount(invoice);
  const totalPayable = calculateInvoiceTotal(invoice);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Top accent bar
  doc.setFillColor(79, 70, 229); // Deep Indigo
  doc.rect(0, 0, pageWidth, 6, 'F');

  // --- HEADER (LEFT) ---
  // "SocialDocs" and phone only
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 27, 75);
  doc.text(activeAgency.name, margin, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Phone: ${activeAgency.phone}`, margin, 31);

  // --- HEADER (RIGHT): "INVOICE", number, date, due date, billing period ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 27, 75);
  doc.text('INVOICE', pageWidth - margin, 24, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  let metaY = 30;
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, pageWidth - margin, metaY, { align: 'right' });
  metaY += 5;
  doc.text(`Invoice Date: ${invoice.date}`, pageWidth - margin, metaY, { align: 'right' });
  metaY += 5;
  doc.text(`Due Date: ${invoice.dueDate}`, pageWidth - margin, metaY, { align: 'right' });
  if (invoice.billingPeriod) {
    metaY += 5;
    doc.text(`Billing Period: ${invoice.billingPeriod}`, pageWidth - margin, metaY, { align: 'right' });
  }

  // --- STATUS BADGE ---
  // "PAYMENT DUE" in amber when status is Pending, "PAID" in green when Paid, "OVERDUE" in red when Overdue.
  let badgeBg = [245, 158, 11]; // Amber
  let badgeLabel = 'PAYMENT DUE';

  if (invoice.status === 'Paid') {
    badgeBg = [16, 185, 129]; // Green
    badgeLabel = 'PAID';
  } else if (invoice.status === 'Overdue') {
    badgeBg = [239, 68, 68]; // Red
    badgeLabel = 'OVERDUE';
  }

  metaY += 4;
  const badgeWidth = 36;
  const badgeHeight = 7;
  doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
  doc.roundedRect(pageWidth - margin - badgeWidth, metaY, badgeWidth, badgeHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(badgeLabel, pageWidth - margin - badgeWidth / 2, metaY + 4.8, { align: 'center' });

  // Divider
  const headerDividerY = Math.max(metaY + 12, 58);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, headerDividerY, pageWidth - margin, headerDividerY);

  // --- BILLED TO SECTION ---
  // Kaushal Harwani, kaushalharwani750@gmail.com, +91 93511 16059, Jodhpur, Rajasthan, India
  let billedY = headerDividerY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(99, 102, 241); // Indigo
  doc.text('BILLED TO', margin, billedY);

  billedY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(activeClientName, margin, billedY);

  billedY += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(activeClientEmail, margin, billedY);

  billedY += 5;
  doc.text(`Phone: ${activeClientPhone}`, margin, billedY);

  billedY += 5;
  doc.text(`Location: ${activeClientLocation}`, margin, billedY);

  // --- TABLE COLUMNS: Description | Rate | Qty | Discount | Amount ---
  const tableTopY = billedY + 9;
  const colX = {
    desc: margin + 3,
    rate: margin + 92,
    qty: margin + 118,
    discount: margin + 144,
    amount: pageWidth - margin - 3,
  };

  // Table header background
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, tableTopY, contentWidth, 8.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('DESCRIPTION', colX.desc, tableTopY + 5.5);
  doc.text('RATE', colX.rate, tableTopY + 5.5, { align: 'right' });
  doc.text('QTY', colX.qty, tableTopY + 5.5, { align: 'center' });
  doc.text('DISCOUNT', colX.discount, tableTopY + 5.5, { align: 'right' });
  doc.text('AMOUNT', colX.amount, tableTopY + 5.5, { align: 'right' });

  // --- TABLE ROWS ---
  let currRowY = tableTopY + 14;

  invoice.lineItems.forEach((item) => {
    // Description title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.description, colX.desc, currRowY);

    // Rate
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Rs. ${item.rate.toLocaleString('en-IN')}`, colX.rate, currRowY, { align: 'right' });

    // Qty
    doc.text(String(item.quantity), colX.qty, currRowY, { align: 'center' });

    // Discount
    if (item.discount > 0) {
      doc.setTextColor(16, 185, 129); // Green
      doc.text(`-Rs. ${item.discount.toLocaleString('en-IN')}`, colX.discount, currRowY, { align: 'right' });
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text('-', colX.discount, currRowY, { align: 'right' });
    }

    // Line Net Amount
    const net = calculateLineNet(item);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Rs. ${net.toLocaleString('en-IN')}`, colX.amount, currRowY, { align: 'right' });

    // Detail text in small grey text under the description
    if (item.detail) {
      currRowY += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(item.detail, colX.desc, currRowY);
    }

    currRowY += 9;
  });

  // Table bottom divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, currRowY, pageWidth - margin, currRowY);

  // --- TOTALS SECTION ---
  // Subtotal, Discount (shown in green with minus sign), highlighted "Total Payable: ₹5,000" row
  const totalsX = pageWidth - margin - 85;
  let summaryY = currRowY + 7;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal:', totalsX, summaryY);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, pageWidth - margin - 3, summaryY, { align: 'right' });

  // Discount
  if (discountTotal > 0) {
    summaryY += 6.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Discount:', totalsX, summaryY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // Green
    doc.text(`-Rs. ${discountTotal.toLocaleString('en-IN')}`, pageWidth - margin - 3, summaryY, { align: 'right' });
  }

  // Highlighted Total Payable row
  summaryY += 8.5;
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalsX - 4, summaryY - 5, 89, 12, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229); // Brand Indigo
  doc.text('Total Payable:', totalsX, summaryY + 2.5);
  doc.text(`Rs. ${totalPayable.toLocaleString('en-IN')}`, pageWidth - margin - 3, summaryY + 2.5, { align: 'right' });

  // --- FOOTER ---
  // "For billing queries, contact SocialDocs at +91 99832 66017."
  const footerY = 250;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `For billing queries, contact ${activeAgency.name} at ${activeAgency.phone}.`,
    pageWidth / 2,
    footerY + 8,
    { align: 'center' }
  );

  doc.save(`${activeAgency.name}-Invoice-${invoice.invoiceNumber}.pdf`);
}
