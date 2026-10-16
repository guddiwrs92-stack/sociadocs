import React from 'react';
import { ServiceStatus, PageStatus, InvoiceStatus } from '../types';

interface StatusBadgeProps {
  status: ServiceStatus | PageStatus | InvoiceStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
}) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700';
  let dotColor = 'bg-slate-400';

  const normalized = status.toLowerCase();

  if (normalized === 'active' || normalized === 'paid') {
    colorClasses =
      'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60';
    dotColor = 'bg-emerald-500';
  } else if (normalized === 'paused' || normalized === 'pending') {
    colorClasses =
      'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'overdue') {
    colorClasses =
      'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60';
    dotColor = 'bg-rose-500';
  } else if (normalized === 'not subscribed') {
    colorClasses =
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700/80';
    dotColor = 'bg-slate-400';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide transition-colors ${sizeClasses} ${colorClasses}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColor} ${
            normalized === 'active' ? 'animate-pulse' : ''
          }`}
        />
      )}
      {status}
    </span>
  );
};
