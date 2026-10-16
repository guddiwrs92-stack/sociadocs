import React, { useMemo } from 'react';
import {
  Layers,
  PauseCircle,
  Instagram,
  Receipt,
  ArrowRight,
  Download,
  ExternalLink,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { ClientProfile, AgencyInfo, InvoiceItem, ServiceItem } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { NavTab } from '../components/Sidebar';
import {
  calculateInvoiceTotal,
  formatINR,
  getDueDateCountdown,
} from '../data/portalData';

interface OverviewPageProps {
  client: ClientProfile;
  agency: AgencyInfo;
  onNavigateTab: (tab: NavTab) => void;
  onViewInvoice: (invoice: InvoiceItem) => void;
  onDownloadInvoice: (invoice: InvoiceItem) => void;
  onRequestResume: (service: ServiceItem) => void;
  onEnquireService: (service: ServiceItem) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  client,
  agency,
  onNavigateTab,
  onViewInvoice,
  onDownloadInvoice,
  onRequestResume,
  onEnquireService,
}) => {
  // Calculations for summary cards
  const activeServicesCount = client.services.filter((s) => s.status === 'Active').length;
  const pausedServicesCount = client.services.filter((s) => s.status === 'Paused').length;
  const totalInstagramPages = client.instagramPages.length;

  // Total followers across all managed pages
  const totalFollowersAcrossPages = useMemo(() => {
    return client.instagramPages.reduce((sum, p) => sum + (p.followers || 0), 0);
  }, [client.instagramPages]);

  // Computed pending invoice amount from invoices array (shows ₹5,000)
  const pendingInvoiceAmount = useMemo(() => {
    return client.invoices
      .filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue')
      .reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
  }, [client.invoices]);

  const activeServices = client.services.filter((s) => s.status === 'Active');

  // Chart data for comparing followers per page
  const barChartData = useMemo(() => {
    return client.instagramPages.map((page) => ({
      name:
        page.displayName.length > 18
          ? page.displayName.slice(0, 16) + '...'
          : page.displayName,
      fullName: page.displayName,
      handle: `@${page.handle}`,
      followers: page.followers || 0,
      posts: page.posts || 0,
      status: page.status,
    }));
  }, [client.instagramPages]);

  // Colors for the bars in the chart
  const barColors = ['#4f46e5', '#7c3aed', '#a855f7', '#6366f1'];

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {data.fullName}
          </p>
          <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
            {data.handle}
          </p>
          <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-100 pt-1.5 text-xs dark:border-slate-800">
            <span className="text-slate-500">Followers:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {Number(data.followers).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-slate-500">Posts:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {Number(data.posts).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-4 text-[11px]">
            <span className="text-slate-500">Status:</span>
            <span
              className={`font-semibold ${
                data.status === 'Active'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {data.status}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SocialDocs Agency Active Portal</span>
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Welcome back, {client.name}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Here is your live agency marketing dashboard. Track active
            service deliverables, monitored Instagram handles, and billing in one place.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('services')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-950 shadow-md transition hover:bg-indigo-50 active:scale-95"
            >
              <span>Explore Services</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigateTab('instagram')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600/60 px-4 py-2.5 text-xs font-bold text-white shadow-md backdrop-blur-md transition hover:bg-indigo-600 active:scale-95"
            >
              <Instagram className="h-4 w-4 text-white" />
              <span>View Instagram Hub</span>
            </button>

            <a
              href={`https://wa.me/${agency.whatsappNumber}?text=${encodeURIComponent(
                `Hi ${agency.name}, this is ${client.name}. I need an update on my account marketing campaigns.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>WhatsApp: {agency.phone}</span>
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-10 right-40 h-48 w-48 rounded-full bg-violet-400/20 blur-2xl" />
      </div>

      {/* Summary KPI Cards (Pending Invoice Amount calculated from invoices array -> ₹5,000) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        {/* 1. Active Services count */}
        <StatCard
          title="Active Services"
          value={activeServicesCount}
          subValue="Live retainers"
          icon={Layers}
          variant="indigo"
          badgeText="Active"
          onClick={() => onNavigateTab('services')}
        />

        {/* 2. Paused Services count */}
        <StatCard
          title="Paused Services"
          value={pausedServicesCount}
          subValue="Ready to resume"
          icon={PauseCircle}
          variant="amber"
          badgeText="On Hold"
          onClick={() => onNavigateTab('services')}
        />

        {/* 3. Total Instagram Pages */}
        <StatCard
          title="Total IG Pages"
          value={totalInstagramPages}
          subValue={`${client.instagramPages.filter((p) => p.status === 'Active').length} active handles`}
          icon={Instagram}
          variant="purple"
          badgeText="Hospitality"
          onClick={() => onNavigateTab('instagram')}
        />

        {/* 4. Total Followers Across Pages */}
        <StatCard
          title="Total Followers"
          value={totalFollowersAcrossPages.toLocaleString('en-IN')}
          subValue="Across 4 hospitality pages"
          icon={Users}
          variant="purple"
          badgeText="Audience"
          onClick={() => onNavigateTab('instagram')}
        />

        {/* 5. Pending Invoice Amount (Calculated: ₹5,000) */}
        <div className="col-span-2 sm:col-span-1">
          <StatCard
            title="Pending Invoices"
            value={formatINR(pendingInvoiceAmount)}
            subValue={
              pendingInvoiceAmount > 0
                ? 'Payment due for October 2026'
                : 'All invoices settled'
            }
            icon={Receipt}
            variant={pendingInvoiceAmount > 0 ? 'amber' : 'emerald'}
            badgeText={pendingInvoiceAmount > 0 ? 'Due Soon' : 'Settled'}
            onClick={() => onNavigateTab('invoices')}
          />
        </div>
      </div>

      {/* Followers Comparison Bar Chart */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                Followers Comparison Across Instagram Pages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live audience size per hospitality profile managed by SocialDocs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
              <span className="text-slate-500 dark:text-slate-400">
                Total: <strong className="text-slate-800 dark:text-white">{totalFollowersAcrossPages.toLocaleString('en-IN')}</strong> followers
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('instagram')}
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>Manage Pages</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Small Responsive Bar Chart */}
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
              <XAxis
                dataKey="handle"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: 'rgba(156, 163, 175, 0.2)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="followers" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {barChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Quick Active Services & Quick Instagram Pages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick List of Active Services */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                Active Agency Services
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Currently executed deliverables by SocialDocs
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('services')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-slate-50 hover:shadow-xs dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/70"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                        {service.name}
                      </h4>
                      <StatusBadge status={service.status} size="sm" />
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 sm:text-right shrink-0">
                  {service.monthlyFee && (
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {formatINR(service.monthlyFee)}/mo
                    </span>
                  )}
                  <p className="text-[11px] text-slate-400">Active Retainer</p>
                </div>
              </div>
            ))}

            {/* Quick action for Paused services */}
            {client.services.some((s) => s.status === 'Paused') && (
              <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                      You have paused campaigns (Meta Ads)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const pausedSrv = client.services.find((s) => s.status === 'Paused');
                      if (pausedSrv) onRequestResume(pausedSrv);
                    }}
                    className="text-xs font-bold text-amber-700 underline hover:text-amber-800 dark:text-amber-300"
                  >
                    Resume Campaign
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick View of Instagram Pages */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                Managed Instagram Pages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {totalInstagramPages} Hospitality handles under management
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('instagram')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {client.instagramPages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xs">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                        @{page.handle}
                      </span>
                      <StatusBadge status={page.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {page.displayName} • {(page.followers || 0).toLocaleString('en-IN')} followers
                    </p>
                  </div>
                </div>

                <a
                  href={`https://instagram.com/${page.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="hidden sm:inline">Open</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
              Current Retainer Invoice
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active statement billed by {agency.name}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('invoices')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View Full Invoice Page</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="pb-3 font-semibold">INVOICE NO</th>
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold">DUE DATE</th>
                <th className="pb-3 font-semibold">SERVICES BILLED</th>
                <th className="pb-3 font-semibold">AMOUNT</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 text-right font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {client.invoices.map((inv) => {
                const total = calculateInvoiceTotal(inv);
                const countdown = getDueDateCountdown(inv.dueDate);
                const payWhatsappUrl = `https://wa.me/${agency.whatsappNumber}?text=${encodeURIComponent(
                  `Hi ${agency.name}, I want to pay invoice ${inv.invoiceNumber} (${formatINR(total)}).`
                )}`;

                return (
                  <tr key={inv.invoiceNumber} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">
                      {inv.date}
                    </td>
                    <td className="py-3.5">
                      <p className="text-slate-600 dark:text-slate-300">{inv.dueDate}</p>
                      <span
                        className={`text-[10px] font-bold ${
                          countdown.isOverdue ? 'text-rose-500' : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {countdown.label}
                      </span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {inv.lineItems.map((li) => li.description).join(' + ')}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                      {formatINR(total)}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {inv.status === 'Pending' && (
                        <a
                          href={payWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>Pay Now</span>
                        </a>
                      )}
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onDownloadInvoice(inv)}
                        title="Download PDF"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
