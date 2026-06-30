
// app/dashboard/components/ClientsView.tsx
'use client';

import { useState } from 'react';
import {
     PlusIcon,
     MagnifyingGlassIcon,
     UserGroupIcon,
     EnvelopeIcon,
     PhoneIcon,
     MapPinIcon,
     EllipsisHorizontalIcon,
     PencilIcon,
     TrashIcon,
     ChartBarIcon,
     DocumentTextIcon,
     ArrowUpIcon,
     ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface Client {
     id: string;
     name: string;
     email: string;
     phone: string;
     company: string;
     status: 'active' | 'inactive' | 'pending';
     totalSpent: number;
     invoices: number;
     lastActive: string;
     avatar?: string;
}

export default function ClientsView() {
     const [searchTerm, setSearchTerm] = useState('');
     const [filterStatus, setFilterStatus] = useState('all');
     const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

     // Mock data
     const clients: Client[] = [
          {
               id: '1',
               name: 'Sarah Johnson',
               email: 'sarah@techcorp.com',
               phone: '+1 (555) 123-4567',
               company: 'TechCorp Inc.',
               status: 'active',
               totalSpent: 42500.00,
               invoices: 24,
               lastActive: '2 days ago',
          },
          {
               id: '2',
               name: 'Michael Chen',
               email: 'michael@designstudio.com',
               phone: '+1 (555) 234-5678',
               company: 'DesignStudio Ltd.',
               status: 'active',
               totalSpent: 18750.00,
               invoices: 12,
               lastActive: '5 hours ago',
          },
          {
               id: '3',
               name: 'Emily Rodriguez',
               email: 'emily@cybersphere.com',
               phone: '+1 (555) 345-6789',
               company: 'CyberSphere',
               status: 'inactive',
               totalSpent: 6800.00,
               invoices: 7,
               lastActive: '2 weeks ago',
          },
          {
               id: '4',
               name: 'David Park',
               email: 'david@cloudsync.com',
               phone: '+1 (555) 456-7890',
               company: 'CloudSync Solutions',
               status: 'pending',
               totalSpent: 3200.00,
               invoices: 4,
               lastActive: '1 day ago',
          },
     ];

     const statusColors = {
          active: 'bg-emerald-100 text-emerald-700',
          inactive: 'bg-gray-100 text-gray-700',
          pending: 'bg-amber-100 text-amber-700',
     };

     const getStatusBadge = (status: Client['status']) => {
          return (
               <span className={`px-2.5 py-1 rounded-full text-font-size-caption font-medium ${statusColors[status]}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
               </span>
          );
     };

     return (
          <div className="space-y-6">
               {/* Header */}
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                         <h2 className="text-font-size-headline-lg font-bold text-text-primary">
                              Clients
                         </h2>
                         <p className="text-font-size-body text-text-muted mt-1">
                              Manage your client relationships
                         </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-text-inverse rounded-lg font-medium transition-colors">
                         <PlusIcon className="h-5 w-5" />
                         Add Client
                    </button>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-bg-card rounded-xl border border-border-default p-4">
                         <p className="text-font-size-caption text-text-muted font-medium">Total Clients</p>
                         <p className="text-font-size-headline font-bold text-text-primary mt-1">{clients.length}</p>
                    </div>
                    <div className="bg-bg-card rounded-xl border border-border-default p-4">
                         <p className="text-font-size-caption text-text-muted font-medium">Active</p>
                         <p className="text-font-size-headline font-bold text-emerald-600 mt-1">
                              {clients.filter(c => c.status === 'active').length}
                         </p>
                    </div>
                    <div className="bg-bg-card rounded-xl border border-border-default p-4">
                         <p className="text-font-size-caption text-text-muted font-medium">Total Revenue</p>
                         <p className="text-font-size-headline font-bold text-text-primary mt-1">
                              ${clients.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(0)}
                         </p>
                    </div>
                    <div className="bg-bg-card rounded-xl border border-border-default p-4">
                         <p className="text-font-size-caption text-text-muted font-medium">Avg. Spend</p>
                         <p className="text-font-size-headline font-bold text-text-primary mt-1">
                              ${(clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length).toFixed(0)}
                         </p>
                    </div>
               </div>

               {/* Filters & Search */}
               <div className="bg-bg-card rounded-xl border border-border-default p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                         <div className="flex-1 relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                   <MagnifyingGlassIcon className="h-5 w-5 text-text-muted" />
                              </div>
                              <input
                                   type="text"
                                   placeholder="Search clients..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   className="w-full pl-10 pr-4 py-2 bg-bg-subtle border border-border-default rounded-lg text-font-size-ui focus:outline-none focus:ring-2 focus:ring-focus-ring transition-all"
                              />
                         </div>

                         <div className="flex gap-2">
                              <select
                                   value={filterStatus}
                                   onChange={(e) => setFilterStatus(e.target.value)}
                                   className="px-3 py-2 bg-bg-subtle border border-border-default rounded-lg text-font-size-ui text-text-body focus:outline-none focus:ring-2 focus:ring-focus-ring transition-all"
                              >
                                   <option value="all">All Status</option>
                                   <option value="active">Active</option>
                                   <option value="inactive">Inactive</option>
                                   <option value="pending">Pending</option>
                              </select>

                              <div className="flex border border-border-default rounded-lg overflow-hidden">
                                   <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-2 transition-colors ${viewMode === 'grid'
                                                  ? 'bg-accent text-text-inverse'
                                                  : 'bg-bg-subtle text-text-muted hover:text-text-body'
                                             }`}
                                   >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                   </button>
                                   <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-2 transition-colors ${viewMode === 'list'
                                                  ? 'bg-accent text-text-inverse'
                                                  : 'bg-bg-subtle text-text-muted hover:text-text-body'
                                             }`}
                                   >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Client Grid */}
               <div className={`
        grid gap-4
        ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}
      `}>
                    {clients.map((client) => (
                         <div key={client.id} className="bg-bg-card rounded-xl border border-border-default p-5 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                   <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-accent-muted flex items-center justify-center text-accent font-semibold text-font-size-headline">
                                             {client.name.charAt(0)}
                                        </div>
                                        <div>
                                             <h3 className="text-font-size-ui font-semibold text-text-primary">
                                                  {client.name}
                                             </h3>
                                             <p className="text-font-size-caption text-text-muted">
                                                  {client.company}
                                             </p>
                                        </div>
                                   </div>
                                   <button className="p-1 rounded-lg hover:bg-bg-subtle transition-colors">
                                        <EllipsisHorizontalIcon className="h-5 w-5 text-text-muted" />
                                   </button>
                              </div>

                              <div className="space-y-2 mb-3">
                                   <div className="flex items-center gap-2 text-font-size-body-sm text-text-muted">
                                        <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">{client.email}</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-font-size-body-sm text-text-muted">
                                        <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                                        <span>{client.phone}</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-font-size-body-sm text-text-muted">
                                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                                        <span>{client.company}</span>
                                   </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                                   <div className="flex gap-4">
                                        <div>
                                             <p className="text-font-size-caption text-text-muted">Spent</p>
                                             <p className="text-font-size-body-sm font-semibold text-text-primary">
                                                  ${client.totalSpent.toFixed(0)}
                                             </p>
                                        </div>
                                        <div>
                                             <p className="text-font-size-caption text-text-muted">Invoices</p>
                                             <p className="text-font-size-body-sm font-semibold text-text-primary">
                                                  {client.invoices}
                                             </p>
                                        </div>
                                   </div>
                                   {getStatusBadge(client.status)}
                              </div>

                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
                                   <span className="text-font-size-caption text-text-muted">
                                        Last active: {client.lastActive}
                                   </span>
                                   <div className="flex gap-1">
                                        <button className="p-1.5 rounded-lg hover:bg-bg-subtle transition-colors text-text-muted hover:text-text-body">
                                             <ChartBarIcon className="h-4 w-4" />
                                        </button>
                                        <button className="p-1.5 rounded-lg hover:bg-bg-subtle transition-colors text-text-muted hover:text-text-body">
                                             <DocumentTextIcon className="h-4 w-4" />
                                        </button>
                                        <button className="p-1.5 rounded-lg hover:bg-bg-subtle transition-colors text-text-muted hover:text-accent">
                                             <PencilIcon className="h-4 w-4" />
                                        </button>
                                   </div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}