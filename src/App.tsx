/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { portalMasterData } from './data/portalData';
import { ClientProfile, InvoiceItem, ServiceItem, SupportTicket } from './types';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast, ToastMessage } from './components/Toast';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { ServiceInquiryModal } from './components/ServiceInquiryModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { ServicesPage } from './pages/ServicesPage';
import { InstagramPagesPage } from './pages/InstagramPagesPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { SupportPage } from './pages/SupportPage';
import { LoginPage } from './pages/LoginPage';

// PDF Generator utility
import { generateInvoicePDF } from './utils/pdfGenerator';

/**
 * Main Portal Shell (rendered when authenticated)
 */
function PortalDashboard() {
  const { user } = useAuth();

  // Active client selection state (defaults to Kaushal Harwani, can switch to other demo clients)
  const [selectedClientId, setSelectedClientId] = useState<string>(
    portalMasterData.clients[0].id
  );

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modals state
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<InvoiceItem | null>(null);
  const [serviceModalConfig, setServiceModalConfig] = useState<{
    service: ServiceItem | null;
    mode: 'resume' | 'enquire';
  }>({ service: null, mode: 'enquire' });

  // Support pre-filled service if navigated from Services page
  const [supportPreselectedService, setSupportPreselectedService] = useState<string>('');

  // Downloading invoice tracker
  const [downloadingInvoiceNo, setDownloadingInvoiceNo] = useState<string | null>(null);

  // Get current active client object from master repository
  const currentClient: ClientProfile =
    portalMasterData.clients.find((c) => c.id === selectedClientId) ||
    portalMasterData.clients[0];

  const agency = portalMasterData.agency;

  const showToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    setToast({
      id: String(Date.now()),
      type,
      title,
      message,
    });
  };

  // PDF Download Handler
  const handleDownloadInvoice = (invoice: InvoiceItem) => {
    setDownloadingInvoiceNo(invoice.invoiceNumber);
    try {
      generateInvoicePDF(invoice, currentClient, agency);
      showToast(
        'success',
        'Invoice Downloaded',
        `SocialDocs-Invoice-${invoice.invoiceNumber}.pdf has been saved to your downloads.`
      );
    } catch (error) {
      console.error('PDF generation error', error);
      showToast('error', 'Download Error', 'Could not generate invoice PDF. Please try again.');
    } finally {
      setTimeout(() => setDownloadingInvoiceNo(null), 500);
    }
  };

  const handleRequestResume = (service: ServiceItem) => {
    setServiceModalConfig({ service, mode: 'resume' });
  };

  const handleEnquireService = (service: ServiceItem) => {
    setServiceModalConfig({ service, mode: 'enquire' });
  };

  const handleContactSupportWithService = (serviceName?: string) => {
    if (serviceName) setSupportPreselectedService(serviceName);
    setCurrentTab('support');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
      <div>
        {/* Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          client={currentClient}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          agencyName={agency.name}
        />

        {/* Main Content Area (Offset for desktop sidebar) */}
        <div className="flex flex-1 flex-col md:pl-64">
          {/* Top Sticky Header */}
          <Header
            currentTab={currentTab}
            clients={portalMasterData.clients}
            currentClient={currentClient}
            onSelectClient={(newClient) => {
              setSelectedClientId(newClient.id);
              showToast('info', 'Client Switched', `Now viewing portal for ${newClient.name}`);
            }}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            agency={agency}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'overview' && (
              <OverviewPage
                client={currentClient}
                agency={agency}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onViewInvoice={(inv) => setSelectedInvoiceForModal(inv)}
                onDownloadInvoice={handleDownloadInvoice}
                onRequestResume={handleRequestResume}
                onEnquireService={handleEnquireService}
              />
            )}

            {currentTab === 'services' && (
              <ServicesPage
                client={currentClient}
                agency={agency}
                onRequestResume={handleRequestResume}
                onEnquireService={handleEnquireService}
                onContactSupport={handleContactSupportWithService}
              />
            )}

            {currentTab === 'instagram' && (
              <InstagramPagesPage
                client={currentClient}
                agency={agency}
                onCopyNotice={(handle) =>
                  showToast('info', 'Handle Copied', `${handle} copied to clipboard!`)
                }
              />
            )}

            {currentTab === 'invoices' && (
              <InvoicesPage
                client={currentClient}
                agency={agency}
                onViewInvoice={(inv) => setSelectedInvoiceForModal(inv)}
                onDownloadInvoice={handleDownloadInvoice}
                downloadingInvoiceNo={downloadingInvoiceNo}
              />
            )}

            {currentTab === 'support' && (
              <SupportPage
                client={currentClient}
                agency={agency}
                initialService={supportPreselectedService}
                onTicketSubmitted={(ticket) =>
                  showToast(
                    'success',
                    'Request Submitted',
                    `Your ticket #${ticket.id} has been logged with SocialDocs support.`
                  )
                }
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Agency Footer */}
      <footer className="md:pl-64 border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} {agency.name}. All rights reserved.</p>
          <p className="font-medium">
            Powered by <span className="font-bold text-indigo-600 dark:text-indigo-400">{agency.name}</span>
          </p>
        </div>
      </footer>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoiceForModal}
        client={currentClient}
        agency={agency}
        onClose={() => setSelectedInvoiceForModal(null)}
        onDownloaded={(invNo) => {
          showToast('success', 'PDF Saved', `Invoice ${invNo} downloaded successfully.`);
        }}
      />

      {/* Service Inquiry / Resume Modal */}
      <ServiceInquiryModal
        service={serviceModalConfig.service}
        mode={serviceModalConfig.mode}
        client={currentClient}
        agency={agency}
        onClose={() => setServiceModalConfig({ service: null, mode: 'enquire' })}
        onSubmit={(title, message) => showToast('success', title, message)}
      />

      {/* Global Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

/**
 * Root Application Component with Auth Routing
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage agency={portalMasterData.agency} />;
  }

  return <PortalDashboard />;
}
