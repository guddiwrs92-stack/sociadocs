import {
  PortalData,
  InstagramPageItem,
  AgencyConfig,
  ClientConfig,
  ClientProfile,
  InvoiceItem,
  InvoiceLineItem,
} from '../types';

/**
 * ============================================================================
 * EDIT AGENCY DETAILS HERE
 * Master agency configuration. All components read from this object.
 * ============================================================================
 */
export const AGENCY_CONFIG: AgencyConfig = {
  name: 'SocialDocs',
  phone: '+91 99832 66017',
  whatsappNumber: '919983266017',
};

/**
 * ============================================================================
 * EDIT CLIENT DETAILS HERE
 * Master client configuration. All components read from this object.
 * ============================================================================
 */
export const CLIENT_CONFIG: ClientConfig = {
  name: 'Kaushal Harwani',
  email: 'kaushalharwani750@gmail.com',
  phone: '+91 93511 16059',
  location: 'Jodhpur, Rajasthan, India',
};

/**
 * ============================================================================
 * EDIT INVOICES HERE
 * Single real invoice data for SocialDocs client portal.
 * Computed in code:
 * - Line gross = rate × quantity
 * - Line net = gross − discount
 * - Subtotal = sum of gross amounts (₹7,500)
 * - Total discount = sum of discounts (₹2,500)
 * - Total payable = Subtotal − Total discount (₹5,000)
 * ============================================================================
 */
export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    invoiceNumber: 'SD-2026-001',
    date: '15 Oct 2026',
    dueDate: '25 Oct 2026',
    status: 'Pending',
    billingPeriod: 'October 2026',
    lineItems: [
      {
        description: 'Instagram Management',
        detail: '2 active pages: samarohgreen_hotel, royalgroupofhotels01',
        rate: 3000,
        quantity: 2,
        discount: 2000,
      },
      {
        description: 'Brand Design',
        rate: 1500,
        quantity: 1,
        discount: 500,
      },
    ],
  },
];

/**
 * Calculation helper functions (never hardcoded)
 */
export const calculateLineGross = (item: InvoiceLineItem): number => {
  return item.rate * item.quantity;
};

export const calculateLineNet = (item: InvoiceLineItem): number => {
  return item.rate * item.quantity - (item.discount || 0);
};

export const calculateInvoiceSubtotal = (invoice: InvoiceItem): number => {
  return invoice.lineItems.reduce((acc, item) => acc + calculateLineGross(item), 0);
};

export const calculateInvoiceDiscount = (invoice: InvoiceItem): number => {
  return invoice.lineItems.reduce((acc, item) => acc + (item.discount || 0), 0);
};

export const calculateInvoiceTotal = (invoice: InvoiceItem): number => {
  return calculateInvoiceSubtotal(invoice) - calculateInvoiceDiscount(invoice);
};

export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getDueDateCountdown = (dueDateStr: string): { label: string; isOverdue: boolean } => {
  const due = new Date(dueDateStr);
  const today = new Date('2026-10-16T00:00:00');
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`,
      isOverdue: true,
    };
  } else if (diffDays === 0) {
    return { label: 'Due today', isOverdue: false };
  } else {
    return {
      label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
      isOverdue: false,
    };
  }
};

/**
 * ============================================================================
 * EDIT PAGE STATS HERE
 * Master Instagram Pages Configuration for SocialDocs Clients
 * ============================================================================
 */
export const INITIAL_INSTAGRAM_PAGES: InstagramPageItem[] = [
  {
    id: 'ig-1',
    handle: 'hotel_the_heaven_inn',
    displayName: 'HOTEL THE HEAVEN INN JODHPUR',
    category: 'Hotel',
    posts: 99,
    followers: 5335,
    following: 69,
    status: 'Paused',
    bio: 'Your Home Away From Home. Relax, Rewind, Recharge. Ocean Views, Luxe Comforts. Near Raj Bagh Dali B Circle, Jodhpur',
    lastUpdated: '15 Oct 2026',
    avatarUrl: '',
  },
  {
    id: 'ig-2',
    handle: 'samarohgreen_stays',
    displayName: 'Hotel Samaroh Green',
    category: 'Hotel',
    posts: 33,
    followers: 1288,
    following: 7,
    status: 'Paused',
    bio: 'Samaroh Green Stay. Comfort, Convenience, Hospitality. Premium Rooms for Families & Travelers. Free Parking. Jodhpur, Rajasthan 342008',
    lastUpdated: '15 Oct 2026',
    avatarUrl: '',
  },
  {
    id: 'ig-3',
    handle: 'samarohgreen_hotel',
    displayName: 'Samaroh Green',
    category: 'Hotel',
    posts: 34,
    followers: 1382,
    following: 298,
    status: 'Active',
    bio: 'Where Dreams Turn Into Celebrations. Hotel + Marriage Garden. Weddings | Receptions | Parties',
    lastUpdated: '15 Oct 2026',
    avatarUrl: '',
  },
  {
    id: 'ig-4',
    handle: 'royalgroupofhotels01',
    displayName: 'Royal Group',
    category: 'Hotel',
    posts: 2,
    followers: 0,
    following: 0,
    status: 'Active',
    bio: 'Room property requirement for hotel and guest house',
    lastUpdated: '15 Oct 2026',
    avatarUrl: '',
  },
];

const activePagesCount = INITIAL_INSTAGRAM_PAGES.filter((p) => p.status === 'Active').length;

export const clientProfileData: ClientProfile = {
  id: 'client-kaushal-harwani',
  name: CLIENT_CONFIG.name,
  email: CLIENT_CONFIG.email,
  phone: CLIENT_CONFIG.phone,
  location: CLIENT_CONFIG.location,
  currency: 'INR',
  currencySymbol: '₹',

  services: [
    {
      id: 'srv-1',
      name: 'Instagram Management',
      status: 'Active',
      description: `Full social media strategy, content curation, and community engagement for ${activePagesCount} active pages.`,
      iconName: 'Instagram',
      planName: `Management (${activePagesCount} Active Pages)`,
      monthlyFee: 4000,
    },
    {
      id: 'srv-2',
      name: 'Brand Design',
      status: 'Active',
      description: 'Visual identity collaterals, promotional graphics, and brand creative assets.',
      iconName: 'Palette',
      planName: 'Design Retainer',
      monthlyFee: 1000,
    },
    {
      id: 'srv-3',
      name: 'Meta Ads',
      status: 'Paused',
      description: 'Paid advertising campaigns across Facebook & Instagram.',
      iconName: 'Megaphone',
      planName: 'Performance Ads Retainer',
    },
    {
      id: 'srv-4',
      name: 'Reels & Video Editing',
      status: 'Not Subscribed',
      description: 'Short-form vertical video editing and Reels production.',
      iconName: 'Video',
      planName: 'Reels Retainer',
    },
  ],

  instagramPages: INITIAL_INSTAGRAM_PAGES,
  invoices: INITIAL_INVOICES,
};

export const portalMasterData: PortalData = {
  agency: AGENCY_CONFIG,
  clients: [clientProfileData],
};
