
// app/dashboard/components/InvoicesView.tsx
'use client';

import { useState } from 'react';
import {
     PlusIcon,
     MagnifyingGlassIcon,
     FunnelIcon,
     ChevronDownIcon,
     EyeIcon,
     PencilIcon,
     TrashIcon,
     ArrowDownTrayIcon,
     PrinterIcon,
     CheckCircleIcon,    
     ClockIcon,
     ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface Invoice {
     id: string;
     client: string;
     amount: number;
     status: 'paid' | 'pending' | 'overdue' | 'draft';
     date: string;
     dueDate: string;
     number: string;
}

export default function InvoicesView() {
     const [searchTerm, setSearchTerm] = useState('');
     const [filterStatus, setFilterStatus] = useState('all');
     const [sortBy, setSortBy] = useState('date');
     const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

     // Mock data
     const invoices: Invoice[] = [
          {
               id: '1',
               client: 'TechCorp Inc.',
               amount: 4250.00,
               status: 'pending',
               date: '2024-01-15',
               dueDate: '2024-02-14',
               number: 'INV-2024-001',
          },
          {
               id: '2',
               client: 'DesignStudio Ltd.',
               amount: 1875.00,
               status: 'paid',
               date: '2024-01-10',
               dueDate: '2024-02-09',
               number: 'INV-2024-002',
          },
          {
               id: '3',
               client: 'CyberSphere',
               amount: 6800.00,
               status: 'overdue',
               date: '2024-01-05',
               dueDate: '2024-02-04',
               number: 'INV-2024-003',
          },
          {
               id: '4',
               client: 'CloudSync Solutions',
               amount: 3200.00,
               status: 'draft',
               date: '2024-01-20',
               dueDate: '2024-02-19',
               number: 'INV-2024-004',
          },
     ];

     const statusColors = {
          paid: 'bg-emerald-100 text-emerald-700',
          pending: 'bg-amber-100 text-amber-700',
          overdue: 'bg-red-100 text-red-700',
          draft: 'bg-gray-100 text-gray-700',
     };

     const statusIcons = {
          paid: CheckCircleIcon,
          pending: ClockIcon,
          overdue: ExclamationCircleIcon,
          draft: ClockIcon,
     };

     const getStatusBadge = (status: Invoice['status']) => {
          const Icon = statusIcons[status];
          return (
               <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-font-size-caption font-medium ${statusColors[status]}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
               </span>
          );
     };

     const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
     const pendingAmount = invoices
          .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
          .reduce((sum, inv) => sum + inv.amount, 0);

     return (
          <div className="space-y-6">
               {/* Header */}
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                         <h2 className="text-font-size-headline-lg font-bold text-text-primary">
                              Invoices
                         </h2>
                         <p className="text-font-size-body text-text-muted mt-1">
                              Manage and track all your invoices
                         </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-text-inverse rounded-lg font-medium transition-colors">
                         <PlusIcon className="h-5 w-5" />
                         Create Invoice
                    </button>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-bg-card rounded-xl border border-border-default p-4">
                         <p className="text-font-size-caption text-text-muted font-medium">Total Invoices</p>
                         <p className="text-font-size-headline font-bold text-text-primary mt-1">{invoices.length}</p>
                    </div>
                    <div className="bg-bg-card rounded-xl border border-border-default p-4">
                         <p className="text-font-size-caption text-text-muted font-medium">Total Amount</p>
                         <p className="text-font-size-headline font-bold text-text-primary mt-1">${totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-bg-card rounded-xl border border-border-default p-4">
                         <p className="text-font-size-caption text-text-muted font-medium">Pending Payments</p>
                         <p className="text-font-size-headline font-bold text-amber-600 mt-1">${pendingAmount.toFixed(2)}</p>
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
                                   placeholder="Search invoices..."
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
                                   <option value="paid">Paid</option>
                                   <option value="pending">Pending</option>
                                   <option value="overdue">Overdue</option>
                                   <option value="draft">Draft</option>
                              </select>

                              <select
                                   value={sortBy}
                                   onChange={(e) => setSortBy(e.target.value)}
                                   className="px-3 py-2 bg-bg-subtle border border-border-default rounded-lg text-font-size-ui text-text-body focus:outline-none focus:ring-2 focus:ring-focus-ring transition-all"
                              >
                                   <option value="date">Sort by Date</option>
                                   <option value="amount">Sort by Amount</option>
                                   <option value="client">Sort by Client</option>
                              </select>

                              <button className="px-3 py-2 bg-bg-subtle border border-border-default rounded-lg hover:bg-bg-card transition-colors">
                                   <FunnelIcon className="h-5 w-5 text-text-body" />
                              </button>
                         </div>
                    </div>
               </div>

               {/* Table */}
               <div className="bg-bg-card rounded-xl border border-border-default overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="w-full">
                              <thead>
                                   <tr className="bg-bg-subtle border-b border-border-default">
                                        <th className="px-6 py-3 text-left text-font-size-caption font-medium text-text-muted uppercase tracking-wider">
                                             <input type="checkbox" className="rounded border-border-strong text-accent focus:ring-accent" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-font-size-caption font-medium text-text-muted uppercase tracking-wider">
                                             Invoice
                                        </th>
                                        <th className="px-6 py-3 text-left text-font-size-caption font-medium text-text-muted uppercase tracking-wider">
                                             Client
                                        </th>
                                        <th className="px-6 py-3 text-left text-font-size-caption font-medium text-text-muted uppercase tracking-wider">
                                             Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-font-size-caption font-medium text-text-muted uppercase tracking-wider">
                                             Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-font-size-caption font-medium text-text-muted uppercase tracking-wider">
                                             Due Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-font-size-caption font-medium text-text-muted uppercase tracking-wider">
                                             Actions
                                        </th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-border-subtle">
                                   {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-bg-subtle transition-colors">
                                             <td className="px-6 py-4">
                                                  <input type="checkbox" className="rounded border-border-strong text-accent focus:ring-accent" />
                                             </td>
                                             <td className="px-6 py-4">
                                                  <span className="text-font-size-body-sm font-medium text-text-primary">
                                                       {invoice.number}
                                                  </span>
                                             </td>
                                             <td className="px-6 py-4 text-font-size-body-sm text-text-body">
                                                  {invoice.client}
                                             </td>
                                             <td className="px-6 py-4 text-font-size-body-sm font-semibold text-text-primary">
                                                  ${invoice.amount.toFixed(2)}
                                             </td>
                                             <td className="px-6 py-4">
                                                  {getStatusBadge(invoice.status)}
                                             </td>
                                             <td className="px-6 py-4 text-font-size-body-sm text-text-muted">
                                                  {new Date(invoice.dueDate).toLocaleDateString()}
                                             </td>
                                             <td className="px-6 py-4">
                                                  <div className="flex items-center justify-end gap-1">
                                                       <button className="p-1.5 rounded-lg hover:bg-bg-card transition-colors text-text-muted hover:text-text-body">
                                                            <EyeIcon className="h-4 w-4" />
                                                       </button>
                                                       <button className="p-1.5 rounded-lg hover:bg-bg-card transition-colors text-text-muted hover:text-text-body">
                                                            <PencilIcon className="h-4 w-4" />
                                                       </button>
                                                       <button className="p-1.5 rounded-lg hover:bg-bg-card transition-colors text-text-muted hover:text-red-600">
                                                            <TrashIcon className="h-4 w-4" />
                                                       </button>
                                                       <button className="p-1.5 rounded-lg hover:bg-bg-card transition-colors text-text-muted hover:text-text-body">
                                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                                       </button>
                                                  </div>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-border-default bg-bg-subtle flex items-center justify-between">
                         <p className="text-font-size-caption text-text-muted">
                              Showing {invoices.length} invoices
                         </p>
                         <div className="flex gap-2">
                              <button className="px-3 py-1 text-font-size-ui text-text-muted hover:text-text-body border border-border-default rounded-lg hover:bg-bg-card transition-colors">
                                   Previous
                              </button>
                              <button className="px-3 py-1 text-font-size-ui bg-accent text-text-inverse rounded-lg">
                                   1
                              </button>
                              <button className="px-3 py-1 text-font-size-ui text-text-muted hover:text-text-body border border-border-default rounded-lg hover:bg-bg-card transition-colors">
                                   Next
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
}