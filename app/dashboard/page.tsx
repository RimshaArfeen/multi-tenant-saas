// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import HomeView from '../components/dashboard/HomeView';
import InvoicesView from '../components/dashboard/InvoicesView';
import ClientsView from '../components/dashboard/ClientsView';

export default function DashboardPage() {
  // Simple view management engine (expandable via query parameters or Context)
  const [currentView, setCurrentView] = useState<'home' | 'invoices' | 'clients'>('home');

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Dynamic Subview Portal */}
      <div className="flex-1 overflow-y-auto p-spacing-6">
        {currentView === 'home' && <HomeView />}
        {currentView === 'invoices' && <InvoicesView />}
        {currentView === 'clients' && <ClientsView />}
      </div>
    </div>
  );
}