import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  variant?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose';
  badgeText?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  variant = 'indigo',
  badgeText,
  onClick,
}) => {
  const variantStyles = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
      borderGlow: 'hover:border-indigo-300 dark:hover:border-indigo-800',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
      borderGlow: 'hover:border-emerald-300 dark:hover:border-emerald-800',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
      borderGlow: 'hover:border-amber-300 dark:hover:border-amber-800',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
      borderGlow: 'hover:border-purple-300 dark:hover:border-purple-800',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
      borderGlow: 'hover:border-rose-300 dark:hover:border-rose-800',
    },
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900 ${
        variantStyles.borderGlow
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {value}
            </span>
            {badgeText && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {badgeText}
              </span>
            )}
          </div>
          {subValue && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subValue}
            </p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${variantStyles.iconBg}`}
        >
          <Icon className="h-6 w-6 stroke-[1.8]" />
        </div>
      </div>
    </div>
  );
};
