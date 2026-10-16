import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  MessageCircle,
  Tag,
  Calendar,
} from 'lucide-react';
import { ClientProfile, AgencyInfo, InvoiceItem, InvoiceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import {
  calculateInvoiceSubtotal,
  calculateInvoiceDiscount,
  calculateInvoiceTotal,
  formatINR,
  getDueDateCountdown,
  calculateLineNet,
} from '../data/portalData';

interface InvoicesPageProps {
  client: ClientProfile;
  agency: AgencyInfo;
  onViewInvoice: (invoice: InvoiceItem) => void;
  onDownloadInvoice: (invoice: InvoiceItem) => void;
  downloadingInvoiceNo?: string | null;
}

export const InvoicesPage: React.FC<InvoicesPageProps> = ({
  client,
  agency,
  onViewInvoice,
  onDownloadInvoice,
  downloadingInvoiceNo,
}) => {
  const [filter, setFilter] = useState<'All' | InvoiceStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations computed dynamically from invoices array (never hardcoded)
  const totalPaid = useMemo(() => {
    return client.invoices
      .filter((inv) => inv.status === 'Paid')
      .reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
  }, [client.invoices]);

  const totalPending = useMemo(() => {
    return client.invoices
      .filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue')
      .reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
  }, [client.invoices]);

  const totalBilled = useMemo(() => {
    return client.invoices.reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
  }, [client.invoices]);

  // Filtered invoices
  const filteredInvoices = client.invoices.filter((inv) => {
    const matchesFilter = filter === 'All' || inv.status === filter;
    const servicesText = inv.lineItems.map((l) => `${l.description} ${l.detail || ''}`).join(' ');
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      servicesText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.date.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Billing & Invoices
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Official retainer statements and payment portal for {client.name}
        </p>
      </div>

      {/* Top Summary Cards (Total Paid = ₹0, Total Pending = ₹5,000) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Paid"
          value={formatINR(totalPaid)}
          subValue={`${client.invoices.filter((i) => i.status === 'Paid').length} invoices settled`}
          icon={CheckCircle2}
          variant="emerald"
          badgeText="Settled"
        />

        <StatCard
          title="Total Pending"
          value={formatINR(totalPending)}
          subValue={
            totalPending > 0
              ? `${client.invoices.filter((i) => i.status !== 'Paid').length} invoice awaiting payment`
              : 'Zero pending dues'
          }
          icon={Clock}
          variant={totalPending > 0 ? 'amber' : 'emerald'}
          badgeText={totalPending > 0 ? 'Payment Due' : 'Up to Date'}
        />

        <StatCard
          title="Total Billed"
          value={formatINR(totalBilled)}
          subValue={`${client.invoices.length} active statement`}
          icon={Receipt}
          variant="indigo"
          badgeText="October 2026"
        />
      </div>

      {/* Invoices Container */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        {/* Controls Bar: Search & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice number or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((tab) => {
              const count =
                tab === 'All'
                  ? client.invoices.length
                  : client.invoices.filter((i) => i.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    filter === tab
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Invoice Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="py-3 font-semibold">INVOICE NO.</th>
                <th className="py-3 font-semibold">DATE</th>
                <th className="py-3 font-semibold">SERVICES & DETAILS</th>
                <th className="py-3 font-semibold">DUE DATE</th>
                <th className="py-3 font-semibold">TOTAL PAYABLE</th>
                <th className="py-3 font-semibold">STATUS</th>
                <th className="py-3 text-right font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => {
                const total = calculateInvoiceTotal(inv);
                const subtotal = calculateInvoiceSubtotal(inv);
                const discount = calculateInvoiceDiscount(inv);
                const countdown = getDueDateCountdown(inv.dueDate);
                const isDownloading = downloadingInvoiceNo === inv.invoiceNumber;

                // WhatsApp Pay Now link: https://wa.me/919983266017?text=Hi SocialDocs, I want to pay invoice SD-2026-001 (₹5,000).
                const payWhatsappUrl = `https://wa.me/${agency.whatsappNumber}?text=${encodeURIComponent(
                  `Hi ${agency.name}, I want to pay invoice ${inv.invoiceNumber} (${formatINR(total)}).`
                )}`;

                return (
                  <tr
                    key={inv.invoiceNumber}
                    className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 font-mono font-bold text-slate-900 dark:text-white">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {inv.invoiceNumber}
                      </button>
                      <p className="text-[10px] text-slate-400 font-sans font-normal">
                        {inv.billingPeriod || 'Oct 2026'}
                      </p>
                    </td>

                    <td className="py-4 text-slate-600 dark:text-slate-300">
                      {inv.date}
                    </td>

                    <td className="py-4 max-w-sm">
                      <div className="space-y-1.5">
                        {inv.lineItems.map((item, idx) => (
                          <div key={idx}>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.description}
                            </p>
                            {item.detail && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.detail}
                              </p>
                            )}
                          </div>
                        ))}
                        {discount > 0 && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] text-slate-400">
                              Subtotal: {formatINR(subtotal)}
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <Tag className="h-2.5 w-2.5" />
                              Discount: −{formatINR(discount)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4">
                      <p className="text-slate-700 font-medium dark:text-slate-300">
                        {inv.dueDate}
                      </p>
                      <span
                        className={`inline-block mt-0.5 text-[10px] font-bold ${
                          countdown.isOverdue
                            ? 'text-rose-500'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {countdown.label}
                      </span>
                    </td>

                    <td className="py-4 font-bold text-slate-900 dark:text-white sm:text-base">
                      {formatINR(total)}
                    </td>

                    <td className="py-4">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>

                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Pay Now / Confirm Payment Button (Requested WhatsApp link) */}
                        {inv.status === 'Pending' && (
                          <a
                            href={payWhatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>Pay Now</span>
                          </a>
                        )}

                        <button
                          onClick={() => onViewInvoice(inv)}
                          title="View Details"
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onDownloadInvoice(inv)}
                          disabled={isDownloading}
                          title="Download PDF Invoice"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="py-12 text-center">
            <Receipt className="mx-auto h-8 w-8 text-slate-400" />
            <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching invoices found
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Try modifying your search query or status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
