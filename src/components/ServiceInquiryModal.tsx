import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  Send,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { ServiceItem, ClientProfile, AgencyConfig } from '../types';
import { AGENCY_CONFIG, CLIENT_CONFIG } from '../data/portalData';

interface ServiceInquiryModalProps {
  service: ServiceItem | null;
  mode: 'resume' | 'enquire';
  client?: ClientProfile;
  agency?: AgencyConfig;
  onClose: () => void;
  onSubmit: (title: string, message: string) => void;
}

export const ServiceInquiryModal: React.FC<ServiceInquiryModalProps> = ({
  service,
  mode,
  client,
  agency,
  onClose,
  onSubmit,
}) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!service) return null;

  const activeAgency = agency || AGENCY_CONFIG;
  const activeClientName = client?.name || CLIENT_CONFIG.name;

  const isResume = mode === 'resume';

  const defaultWhatsappMessage = isResume
    ? `Hello ${activeAgency.name}! This is ${activeClientName}. I would like to request resuming our "${service.name}" service. Please let me know the reactivation schedule.`
    : `Hello ${activeAgency.name}! This is ${activeClientName}. I am interested in getting started with "${service.name}". Please share details.`;

  const handleSubmitInApp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      if (isResume) {
        onSubmit(
          `Resume Request Sent for ${service.name}`,
          `Our ${activeAgency.name} team has received your resume request and will connect with you at ${CLIENT_CONFIG.phone}.`
        );
      } else {
        onSubmit(
          `Inquiry Logged for ${service.name}`,
          `Thanks for your interest! We will contact you at ${CLIENT_CONFIG.phone}.`
        );
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                isResume
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
              }`}
            >
              {isResume ? <PlayCircle className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isResume ? `Resume ${service.name}` : `Get Started with ${service.name}`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct request to {activeAgency.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Contact Buttons (WhatsApp & Phone) */}
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Instant Contact
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`https://wa.me/${activeAgency.whatsappNumber}?text=${encodeURIComponent(
                defaultWhatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={`tel:${activeAgency.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Phone className="h-4 w-4 text-indigo-500" />
              <span>Call: {activeAgency.phone}</span>
            </a>
          </div>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2 text-slate-400 dark:bg-slate-900">
              Or submit in-portal request
            </span>
          </div>
        </div>

        {/* In-portal Form */}
        <form onSubmit={handleSubmitInApp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Service
            </label>
            <input
              type="text"
              readOnly
              value={service.name}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isResume ? 'Reactivation Notes' : 'Requirements / Scope Notes'}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isResume
                  ? 'E.g., Please resume service starting from next week.'
                  : 'E.g., We would like to add this service to our active package.'
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Submitting...' : isResume ? 'Submit Resume Request' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
