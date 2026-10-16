import React, { useState } from 'react';
import {
  Menu,
  Moon,
  Sun,
  MessageCircle,
  ChevronDown,
  Building,
  UserCheck,
  Check,
  Bell,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ClientProfile, AgencyInfo } from '../types';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  clients: ClientProfile[];
  currentClient: ClientProfile;
  onSelectClient: (client: ClientProfile) => void;
  onOpenMobileMenu: () => void;
  agency: AgencyInfo;
  onNavigateTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  clients,
  currentClient,
  onSelectClient,
  onOpenMobileMenu,
  agency,
  onNavigateTab,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Client Overview',
      subtitle: `Welcome back, ${currentClient.name}`,
    },
    services: {
      title: 'Marketing Services',
      subtitle: 'Managed retainers, active tiers, and growth capabilities',
    },
    instagram: {
      title: 'Instagram Accounts',
      subtitle: 'Live status, analytics, and social handles managed by SocialDocs',
    },
    invoices: {
      title: 'Billing & Invoices',
      subtitle: 'Retainer invoices, payment status, and branded PDF downloads',
    },
    support: {
      title: 'Agency Support',
      subtitle: 'Direct WhatsApp hotline, email queries, and request tickets',
    },
  };

  const pendingCount = currentClient.invoices.filter(
    (i) => i.status === 'Pending' || i.status === 'Overdue'
  ).length;

  return (
    <header className="sticky top-0 z-20 flex h-18 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {tabTitles[currentTab].title}
          </h1>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            {tabTitles[currentTab].subtitle}
          </p>
        </div>
      </div>

      {/* Right: Client Switcher, WhatsApp Button, Theme Toggle, Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Multi-client Switcher Dropdown (Structured for easy multi-client support) */}
        <div className="relative">
          <button
            onClick={() => setShowClientDropdown(!showClientDropdown)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
            title="Switch Client Account"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              <Building className="h-3 w-3" />
            </div>
            <span className="max-w-[100px] truncate sm:max-w-[140px]">
              {currentClient.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showClientDropdown && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowClientDropdown(false)}
              />
              <div className="absolute right-0 top-full z-40 mt-1.5 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Active Client
                </div>
                <div className="space-y-1">
                  {clients.map((c) => {
                    const isSelected = c.id === currentClient.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectClient(c);
                          setShowClientDropdown(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {c.name}
                          </p>
                          <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {c.location}
                          </p>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* WhatsApp Direct Chat Button */}
        <a
          href={`https://wa.me/${agency.whatsappNumber}?text=${encodeURIComponent(
            `Hi ${agency.name}, this is ${currentClient.name}. I have a query regarding my active services.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>Agency WhatsApp</span>
        </a>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {pendingCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full z-40 mt-1.5 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  <span className="text-[10px] text-slate-400">SocialDocs Feed</span>
                </div>

                <div className="mt-2 space-y-2">
                  {pendingCount > 0 ? (
                    <div
                      onClick={() => {
                        onNavigateTab('invoices');
                        setShowNotifications(false);
                      }}
                      className="cursor-pointer rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-200"
                    >
                      <p className="font-semibold">Invoice Due Reminder</p>
                      <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-300">
                        You have {pendingCount} invoice(s) awaiting payment. Click to review.
                      </p>
                    </div>
                  ) : null}

                  <div className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                    <p className="font-semibold">Weekly Report Updated</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Instagram engagement jumped +14% for @samarohgreen_hotel this week!
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600" />
          )}
        </button>
      </div>
    </header>
  );
};
