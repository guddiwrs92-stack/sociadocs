export type ServiceStatus = 'Active' | 'Paused' | 'Not Subscribed';
export type PageStatus = 'Active' | 'Paused';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface ServiceItem {
  id: string;
  name: string;
  status: ServiceStatus;
  description: string;
  iconName: 'Instagram' | 'Palette' | 'Megaphone' | 'Video' | 'TrendingUp' | 'Search';
  planName?: string;
  monthlyFee?: number;
  startDate?: string;
  deliverables?: string[];
}

export interface InstagramPageItem {
  id: string;
  handle: string;
  displayName: string;
  status: PageStatus;
  category: string;
  posts: number;
  followers: number;
  following: number;
  bio: string;
  lastUpdated: string; // e.g. "15 Oct 2026"
  avatarUrl?: string;
}

export interface InvoiceLineItem {
  description: string;
  detail?: string;
  rate: number;
  quantity: number;
  discount: number;
}

export interface InvoiceItem {
  invoiceNumber: string; // e.g. "SD-2026-001"
  date: string; // e.g. "15 Oct 2026"
  dueDate: string; // e.g. "25 Oct 2026"
  status: InvoiceStatus;
  billingPeriod?: string; // e.g. "October 2026"
  lineItems: InvoiceLineItem[];
  paymentRef?: string; // Only shown if provided; no fake ref numbers
  notes?: string;
}

export interface AgencyConfig {
  name: string;
  phone: string;
  whatsappNumber: string;
}

export interface ClientConfig {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currency: string; // "INR"
  currencySymbol: string; // "₹"
  services: ServiceItem[];
  instagramPages: InstagramPageItem[];
  invoices: InvoiceItem[];
}

export type AgencyInfo = AgencyConfig;

export interface PortalData {
  agency: AgencyConfig;
  clients: ClientProfile[];
}

export interface SupportTicket {
  id: string;
  clientName: string;
  service: string;
  subject: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}
