import React, { useState } from 'react';
import {
  Instagram,
  Palette,
  Megaphone,
  Video,
  TrendingUp,
  Search,
  CheckCircle2,
  Sparkles,
  PlayCircle,
  MessageCircle,
  HelpCircle,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { ClientProfile, AgencyInfo, ServiceItem, ServiceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface ServicesPageProps {
  client: ClientProfile;
  agency: AgencyInfo;
  onRequestResume: (service: ServiceItem) => void;
  onEnquireService: (service: ServiceItem) => void;
  onContactSupport: (serviceName?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  client,
  agency,
  onRequestResume,
  onEnquireService,
  onContactSupport,
}) => {
  const [filter, setFilter] = useState<'All' | ServiceStatus>('All');

  const filteredServices = client.services.filter((s) => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Instagram':
        return <Instagram className="h-6 w-6" />;
      case 'Palette':
        return <Palette className="h-6 w-6" />;
      case 'Megaphone':
        return <Megaphone className="h-6 w-6" />;
      case 'Video':
        return <Video className="h-6 w-6" />;
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  const activeCount = client.services.filter((s) => s.status === 'Active').length;
  const pausedCount = client.services.filter((s) => s.status === 'Paused').length;
  const notSubscribedCount = client.services.filter((s) => s.status === 'Not Subscribed').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            Agency Retainers & Marketing Services
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {client.services.length} services configured for {client.name}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/80">
          {(['All', 'Active', 'Paused', 'Not Subscribed'] as const).map((tab) => {
            const isSelected = filter === tab;
            let count = client.services.length;
            if (tab === 'Active') count = activeCount;
            if (tab === 'Paused') count = pausedCount;
            if (tab === 'Not Subscribed') count = notSubscribedCount;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredServices.map((service) => {
          const isNotSubscribed = service.status === 'Not Subscribed';
          const isPaused = service.status === 'Paused';
          const isActive = service.status === 'Active';

          return (
            <div
              key={service.id}
              className={`flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 hover:shadow-md ${
                isNotSubscribed
                  ? 'border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40'
                  : isPaused
                  ? 'border-amber-200/80 bg-white dark:border-amber-900/40 dark:bg-slate-900'
                  : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs'
              }`}
            >
              <div>
                {/* Top service header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400'
                          : isPaused
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                          : 'bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {service.name}
                      </h3>
                      {service.planName && (
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {service.planName}
                        </p>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={service.status} />
                </div>

                {/* Description */}
                <p className="mt-4 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                  {service.description}
                </p>

                {/* Deliverables / Feature Highlights */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="mt-4 space-y-1.5 rounded-2xl bg-slate-50/80 p-3.5 dark:bg-slate-800/40">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Deliverables & Scope:
                    </p>
                    <ul className="space-y-1">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer with Action Buttons */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    {service.monthlyFee ? (
                      <div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          ₹{service.monthlyFee.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400"> / month</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Custom retainer pricing</span>
                    )}
                    {service.startDate && (
                      <p className="text-[10px] text-slate-400">
                        Active since {service.startDate}
                      </p>
                    )}
                  </div>

                  {/* Actions for different statuses */}
                  <div className="flex items-center gap-2">
                    {/* For Not Subscribed services: show an "Enquire / Get Started" button */}
                    {isNotSubscribed && (
                      <button
                        onClick={() => onEnquireService(service)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Enquire / Get Started</span>
                      </button>
                    )}

                    {/* For Paused services: show a "Request Resume" button */}
                    {isPaused && (
                      <button
                        onClick={() => onRequestResume(service)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 active:scale-95 transition"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>Request Resume</span>
                      </button>
                    )}

                    {/* For Active services: show contact/support button */}
                    {isActive && (
                      <button
                        onClick={() => onContactSupport(service.name)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Request Scope Change</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
