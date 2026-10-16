import React, { useState } from 'react';
import {
  X,
  Download,
  Calendar,
  Receipt,
  MessageCircle,
  Clock,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { InvoiceItem, ClientProfile, AgencyConfig } from '../types';
import { StatusBadge } from './StatusBadge';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import {
  AGENCY_CONFIG,
  CLIENT_CONFIG,
  calculateLineGross,
  calculateLineNet,
  calculateInvoiceSubtotal,
  calculateInvoiceDiscount,
  calculateInvoiceTotal,
  formatINR,
  getDueDateCountdown,
} from '../data/portalData';

interface InvoiceDetailModalProps {
  invoice: InvoiceItem | null;
  client?: ClientProfile;
  agency?: AgencyConfig;
  onClose: () => void;
  onDownloaded?: (invoiceNo: string) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  client,
  agency,
  onClose,
  onDownloaded,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!invoice) return null;

  const activeAgency = agency || AGENCY_CONFIG;
  const activeClient = client || {
    name: CLIENT_CONFIG.name,
    email: CLIENT_CONFIG.email,
    phone: CLIENT_CONFIG.phone,
    location: CLIENT_CONFIG.location,
  };

  const subtotal = calculateInvoiceSubtotal(invoice);
  const discountTotal = calculateInvoiceDiscount(invoice);
  const totalPayable = calculateInvoiceTotal(invoice);
  const countdown = getDueDateCountdown(invoice.dueDate);

  const payWhatsappUrl = `https://wa.me/${activeAgency.whatsappNumber}?text=${encodeURIComponent(
    `Hi ${activeAgency.name}, I want to pay invoice ${invoice.invoiceNumber} (${formatINR(totalPayable)}).`
  )}`;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      generateInvoicePDF(invoice, client, activeAgency);
      setIsDownloading(false);
      if (onDownloaded) {
        onDownloaded(invoice.invoiceNumber);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Invoice {invoice.invoiceNumber}
                </h3>
                <StatusBadge status={invoice.status} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Issued by {activeAgency.name} • {invoice.billingPeriod || 'Current Retainer'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Invoice Key Meta */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/40">
            <p className="text-[11px] font-medium text-slate-400">Date Issued</p>
            <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
              {invoice.date}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/40">
            <p className="text-[11px] font-medium text-slate-400">Due Date</p>
            <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
              {invoice.dueDate}
            </p>
            <span
              className={`mt-1 inline-block text-[10px] font-bold ${
                countdown.isOverdue ? 'text-rose-500' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {countdown.label}
            </span>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/40">
            <p className="text-[11px] font-medium text-slate-400">Billing Period</p>
            <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
              {invoice.billingPeriod || 'October 2026'}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/40">
            <p className="text-[11px] font-medium text-slate-400">Total Payable</p>
            <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {formatINR(totalPayable)}
            </p>
          </div>
        </div>

        {/* Billed To Info */}
        <div className="mt-4 rounded-2xl bg-slate-50/70 p-3.5 text-xs dark:bg-slate-800/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Billed To
          </p>
          <p className="mt-1 font-bold text-slate-900 dark:text-white">
            {activeClient.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>{activeClient.email}</span>
            <span>•</span>
            <span>{activeClient.phone}</span>
            <span>•</span>
            <span>{activeClient.location}</span>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="mt-5 rounded-2xl border border-slate-200/80 overflow-hidden dark:border-slate-800">
          <div className="bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 grid grid-cols-12 gap-2">
            <div className="col-span-6 sm:col-span-7">Description</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-3 sm:col-span-2 text-right">Net Amount</div>
          </div>

          <div className="divide-y divide-slate-100 p-4 space-y-3 dark:divide-slate-800">
            {invoice.lineItems.map((item, idx) => {
              const lineNet = calculateLineNet(item);
              return (
                <div key={idx} className="pt-2 first:pt-0 grid grid-cols-12 gap-2 text-xs items-start">
                  <div className="col-span-6 sm:col-span-7">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {item.description}
                    </p>
                    {item.detail && (
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {item.detail}
                      </p>
                    )}
                    {item.discount > 0 && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <Tag className="h-3 w-3" />
                        Discount: −{formatINR(item.discount)}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-right text-slate-600 dark:text-slate-300">
                    {formatINR(item.rate)}
                  </div>
                  <div className="col-span-1 text-center font-medium text-slate-700 dark:text-slate-300">
                    {item.quantity}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right font-bold text-slate-900 dark:text-white">
                    {formatINR(lineNet)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtotal, Discount, and Highlighted Total */}
          <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatINR(subtotal)}
              </span>
            </div>

            {discountTotal > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount</span>
                <span>−{formatINR(discountTotal)}</span>
              </div>
            )}

            <div className="border-t border-slate-200/80 pt-2.5 flex justify-between items-center text-sm font-bold dark:border-slate-700">
              <span className="text-slate-900 dark:text-white">Total Payable</span>
              <span className="text-base text-indigo-600 dark:text-indigo-400">
                {formatINR(totalPayable)}
              </span>
            </div>
          </div>
        </div>

        {/* Pay Now Button & Contact Line */}
        {invoice.status === 'Pending' && (
          <div className="mt-5 rounded-2xl bg-amber-50/80 p-4 border border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Payment Pending: {formatINR(totalPayable)}
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                Confirm payment with {activeAgency.name} via WhatsApp
              </p>
            </div>
            <a
              href={payWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Pay Now / Confirm Payment</span>
            </a>
          </div>
        )}

        {/* Footer query text */}
        <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          For billing queries, contact {activeAgency.name} at {activeAgency.phone}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download PDF Invoice'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
