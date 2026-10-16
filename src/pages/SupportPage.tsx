import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Send,
  Headphones,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ClientProfile, AgencyConfig, SupportTicket } from '../types';
import { AGENCY_CONFIG, CLIENT_CONFIG } from '../data/portalData';

interface SupportPageProps {
  client?: ClientProfile;
  agency?: AgencyConfig;
  initialService?: string;
  onTicketSubmitted: (ticket: SupportTicket) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({
  client,
  agency,
  initialService = '',
  onTicketSubmitted,
}) => {
  const activeAgency = agency || AGENCY_CONFIG;
  const activeClientName = client?.name || CLIENT_CONFIG.name;
  const servicesList = client?.services || [];

  const [selectedService, setSelectedService] = useState(
    initialService || (servicesList[0]?.name ?? 'Instagram Management')
  );
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local ticket history
  const [submittedTickets, setSubmittedTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-1001',
      clientName: activeClientName,
      service: 'Instagram Management',
      subject: 'Weekly Review and Feed Updates',
      message: 'Discussion regarding active Instagram pages content calendar.',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '14 Oct 2026',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: activeClientName,
        service: selectedService,
        subject: subject.trim() || `${selectedService} Request`,
        message: message.trim(),
        priority,
        status: 'Open',
        createdAt: 'Just now',
      };

      setSubmittedTickets([newTicket, ...submittedTickets]);
      onTicketSubmitted(newTicket);
      setMessage('');
      setSubject('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Support & Communication
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Reach {activeAgency.name} directly via WhatsApp or phone, or submit a request ticket.
        </p>
      </div>

      {/* Contact Cards: WhatsApp and Phone (No invented emails or addresses) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* WhatsApp Card */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-xs dark:border-emerald-950/60 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
              <MessageCircle className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Fastest Response
            </span>
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            WhatsApp Hotline
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Direct chat with {activeAgency.name} for quick updates, inquiries, and coordination.
          </p>

          <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
              {activeAgency.phone}
            </span>
            <a
              href={`https://wa.me/${activeAgency.whatsappNumber}?text=${encodeURIComponent(
                `Hello ${activeAgency.name}, this is ${activeClientName}. I have a query regarding my active services.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Phone Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Phone className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Direct Call
            </span>
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            Direct Phone Line
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Call {activeAgency.name} directly for voice communication and immediate assistance.
          </p>

          <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
              {activeAgency.phone}
            </span>
            <a
              href={`tel:${activeAgency.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Support Form & Ticket History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form Container (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Raise a Request
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send instructions or requests to {activeAgency.name}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Client Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeClientName}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
                />
              </div>

              {/* Service Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Related Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.status})
                    </option>
                  ))}
                  <option value="Billing & Invoices">Billing & Invoices</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <input
                type="text"
                placeholder="Brief summary of your request"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <div className="mt-1.5 flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                      priority === p
                        ? p === 'High'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : p === 'Medium'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-700 text-white shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Describe your request for ${activeAgency.name}...`}
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-98 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Contact Details & History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Agency Details
            </h4>
            <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                {activeAgency.name}
              </p>
              <p>Phone: {activeAgency.phone}</p>
            </div>
          </div>

          {/* Submitted Request History */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Request History ({submittedTickets.length})
              </h4>
              <span className="text-[11px] text-slate-400">Status</span>
            </div>

            <div className="mt-3 space-y-3">
              {submittedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800/60 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {ticket.id}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        ticket.status === 'Open'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : ticket.status === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-100">
                    {ticket.subject}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">
                    {ticket.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Service: {ticket.service}</span>
                    <span>{ticket.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
