import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Instagram,
  Receipt,
  Headphones,
  Moon,
  Sun,
  LogOut,
  X,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ClientProfile } from '../types';

export type NavTab = 'overview' | 'services' | 'instagram' | 'invoices' | 'support';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  client: ClientProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  agencyName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  client,
  isOpenMobile,
  onCloseMobile,
  agencyName,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  const pendingInvoicesCount = client.invoices.filter(
    (inv) => inv.status === 'Pending' || inv.status === 'Overdue'
  ).length;

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Layers, badge: `${client.services.filter(s => s.status === 'Active').length} Active` },
    { id: 'instagram', label: 'Instagram Pages', icon: Instagram, badge: client.instagramPages.length },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: Receipt,
      badge: pendingInvoicesCount > 0 ? `${pendingInvoicesCount} Due` : undefined,
    },
    { id: 'support', label: 'Support & Help', icon: Headphones },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-slate-800 transition-colors duration-200 dark:bg-slate-900 dark:text-slate-200">
      {/* Top Branding Section */}
      <div>
        <div className="flex h-18 items-center justify-between border-b border-slate-100 px-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white">
              <span className="font-bold text-lg tracking-tight">SD</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  {agencyName}
                </span>
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  Portal
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Client Marketing Suite</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Client Context Banner */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Active Client
              </p>
              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                {client.name}
              </p>
            </div>
          </div>
          <p className="mt-1.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {client.location}
          </p>
        </div>

        {/* Navigation Menu Links */}
        <nav className="mt-2 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 dark:bg-indigo-600 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'invoices' && pendingInvoicesCount > 0
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions (Theme, User, Agency Info) */}
      <div className="border-t border-slate-100 p-3 space-y-2 dark:border-slate-800">
        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-mono">{theme}</span>
        </button>

        {/* User Card & Sign Out */}
        <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white uppercase">
                {user?.name ? user.name.charAt(0) : 'K'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user?.name || client.name}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  Client Account
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out of Portal"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-rose-600 dark:hover:bg-slate-700/60 dark:hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Powered by SocialDocs */}
        <div className="text-center pt-1">
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-400">
            Powered by <span className="font-semibold text-indigo-600 dark:text-indigo-400">SocialDocs</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed left) */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-64 md:flex-col md:border-r md:border-slate-200/80 dark:md:border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-in) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="relative flex w-72 max-w-[85vw] flex-1 flex-col shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
