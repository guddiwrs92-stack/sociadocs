/**
 * ============================================================================
 * EDIT YOUR REAL AGENCY DETAILS HERE
 * All contact details, bank details, and branding across the entire app
 * (PDF invoices, support page, footer, buttons, and links) read from this object.
 * ============================================================================
 */
export const AGENCY_CONFIG = {
  name: 'SocialDocs',
  tagline: '',
  address: 'YOUR_AGENCY_ADDRESS_HERE',
  email: 'YOUR_AGENCY_EMAIL_HERE',
  phone: 'YOUR_AGENCY_PHONE_HERE',
  website: '',
  gstin: '',
  bank: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    upi: '',
  },
};

/**
 * ============================================================================
 * CLIENT_CONFIG (Real Client Data)
 * Single source of truth for client profile information.
 * ============================================================================
 */
export const CLIENT_CONFIG = {
  name: 'Kaushal Harwani',
  businessName: '', // Left empty; do NOT invent a company name
  email: 'kaushalharwani750@gmail.com',
  phone: '+91 93511 16059',
  location: 'Jodhpur, Rajasthan, India',
};

/**
 * Utility helper to determine if a string value is empty or a placeholder
 */
export function isPlaceholderOrEmpty(val: string | undefined | null): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  if (trimmed === '') return true;
  if (trimmed.startsWith('YOUR_')) return true;
  return false;
}

/**
 * Formats a phone number for WhatsApp links (digits only)
 * Returns null if the phone is a placeholder or invalid
 */
export function getCleanWhatsAppDigits(phone: string): string | null {
  if (isPlaceholderOrEmpty(phone)) return null;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 ? digits : null;
}
