import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    info: <Info className="h-5 w-5 text-indigo-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900',
    info: 'border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900',
    warning: 'border-amber-200 dark:border-amber-900 bg-white dark:bg-slate-900',
    error: 'border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div
        className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl ${borders[toast.type]}`}
      >
        <div className="shrink-0">{icons[toast.type]}</div>
        <div className="flex-1 pr-2">
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {toast.title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
