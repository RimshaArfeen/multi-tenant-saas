// app/dashboard/components/HomeView.tsx
'use client';

import { useState } from 'react';
import {
     ArrowTrendingUpIcon,
     CurrencyDollarIcon,
     UserGroupIcon,
     DocumentTextIcon,
     ArrowUpIcon,
     ArrowDownIcon,
CircleStackIcon,
     EyeIcon,
     ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface MetricCard {
     title: string;
     value: string | number;
     change: number;
     icon: any;
     color: string;
}

interface RecentActivity {
     id: string;
     type: 'invoice' | 'client' | 'payment';
     description: string;
     timestamp: string;
     amount?: string;
     status?: 'paid' | 'pending' | 'overdue';
}

export default function HomeView() {
     const [timeRange, setTimeRange] = useState('weekly');

     // Metric Cards Data
     const metrics: MetricCard[] = [
          {
               title: 'Total Revenue',
               value: '$48,295',
               change: 12.5,
               icon: CurrencyDollarIcon,
               color: 'text-accent',
          },
          {
               title: 'Active Clients',
               value: '847',
               change: 8.2,
               icon: UserGroupIcon,
               color: 'text-blue-500',
          },
          {
               title: 'Invoices Sent',
               value: '1,293',
               change: -2.4,
               icon: DocumentTextIcon,
               color: 'text-purple-500',
          },
          {
               title: 'Conversion Rate',
               value: '23.8%',
               change: 4.1,
               icon: ArrowTrendingUpIcon,
               color: 'text-emerald-500',
          },
     ];

     // Recent Activities Data
     const activities: RecentActivity[] = [
          {
               id: '1',
               type: 'invoice',
               description: 'Invoice #INV-2024-001 created for TechCorp Inc.',
               timestamp: '2 hours ago',
               amount: '$4,250.00',
               status: 'pending',
          },
          {
               id: '2',
               type: 'payment',
               description: 'Payment received from DesignStudio Ltd.',
               timestamp: '4 hours ago',
               amount: '$1,875.00',
               status: 'paid',
          },
          {
               id: '3',
               type: 'client',
               description: 'New client: CloudSync Solutions',
               timestamp: '1 day ago',
          },
          {
               id: '4',
               type: 'invoice',
               description: 'Invoice #INV-2024-002 overdue for CyberSphere',
               timestamp: '2 days ago',
               amount: '$6,800.00',
               status: 'overdue',
          },
     ];

     return (
          <div className="space-y-6">
               {/* Page Header */}
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                         <h2 className="text-font-size-headline-lg font-bold text-text-primary">
                              Welcome back, Jane 👋
                         </h2>
                         <p className="text-font-size-body text-text-muted mt-1">
                              Here's what's happening with your business today
                         </p>
                    </div>
                    <div className="flex items-center gap-3">
                         <select
                              value={timeRange}
                              onChange={(e) => setTimeRange(e.target.value)}
                              className="px-3 py-1.5 bg-bg-surface border border-border-default rounded-lg text-font-size-ui text-text-body focus:outline-none focus:ring-2 focus:ring-focus-ring transition-all"
                         >
                              <option value="daily">Today</option>
                              <option value="weekly">This Week</option>
                              <option value="monthly">This Month</option>
                              <option value="yearly">This Year</option>
                         </select>
                         <button className="px-4 py-1.5 bg-accent hover:bg-accent-hover text-text-inverse rounded-lg text-font-size-ui font-medium transition-colors">
                              Export Report
                         </button>
                    </div>
               </div>

               {/* Metrics Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {metrics.map((metric, index) => {
                         const Icon = metric.icon;
                         const isPositive = metric.change > 0;
                         return (
                              <div key={index} className="bg-bg-card rounded-xl border border-border-default p-5 hover:shadow-md transition-shadow">
                                   <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                             <p className="text-font-size-caption text-text-muted font-medium">
                                                  {metric.title}
                                             </p>
                                             <p className="text-font-size-headline font-bold text-text-primary">
                                                  {metric.value}
                                             </p>
                                        </div>
                                        <div className={`p-2.5 rounded-lg bg-bg-subtle ${metric.color}`}>
                                             <Icon className="h-5 w-5" />
                                        </div>
                                   </div>
                                   <div className="flex items-center gap-1.5 mt-3">
                                        <span className={`inline-flex items-center text-font-size-caption font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                             {isPositive ? (
                                                  <ArrowUpIcon className="h-3.5 w-3.5 mr-0.5" />
                                             ) : (
                                                  <ArrowDownIcon className="h-3.5 w-3.5 mr-0.5" />
                                             )}
                                             {Math.abs(metric.change)}%
                                        </span>
                                        <span className="text-font-size-caption text-text-muted">
                                             vs last period
                                        </span>
                                   </div>
                              </div>
                         );
                    })}
               </div>

               {/* Charts & Activity Row */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-bg-card rounded-xl border border-border-default p-5">
                         <div className="flex items-center justify-between mb-4">
                              <div>
                                   <h3 className="text-font-size-ui font-semibold text-text-primary">
                                        Revenue Overview
                                   </h3>
                                   <p className="text-font-size-caption text-text-muted">
                                        Weekly revenue trends
                                   </p>
                              </div>
                              <button className="p-1.5 rounded-lg hover:bg-bg-subtle transition-colors">
                                   <CircleStackIcon className="h-5 w-5 text-text-muted" />
                              </button>
                         </div>
                         <div className="h-48 flex items-center justify-center bg-bg-subtle rounded-lg border border-border-subtle">
                              <p className="text-text-muted text-font-size-caption">
                                   📊 Chart visualization placeholder
                              </p>
                         </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-bg-card rounded-xl border border-border-default p-5">
                         <div className="flex items-center justify-between mb-4">
                              <div>
                                   <h3 className="text-font-size-ui font-semibold text-text-primary">
                                        Recent Activity
                                   </h3>
                                   <p className="text-font-size-caption text-text-muted">
                                        Latest updates
                                   </p>
                              </div>
                              <button className="text-font-size-caption text-accent hover:text-accent-hover font-medium transition-colors">
                                   View All
                              </button>
                         </div>
                         <div className="space-y-3">
                              {activities.map((activity) => (
                                   <div key={activity.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-bg-subtle transition-colors">
                                        <div className={`
                  w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0
                  ${activity.status === 'paid' ? 'bg-emerald-500' : ''}
                  ${activity.status === 'pending' ? 'bg-amber-500' : ''}
                  ${activity.status === 'overdue' ? 'bg-red-500' : ''}
                  ${!activity.status ? 'bg-blue-500' : ''}
                `} />
                                        <div className="flex-1 min-w-0">
                                             <p className="text-font-size-body-sm text-text-body line-clamp-2">
                                                  {activity.description}
                                             </p>
                                             <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-font-size-caption text-text-muted">
                                                       {activity.timestamp}
                                                  </span>
                                                  {activity.amount && (
                                                       <>
                                                            <span className="w-1 h-1 rounded-full bg-text-muted" />
                                                            <span className="text-font-size-caption font-medium text-text-primary">
                                                                 {activity.amount}
                                                            </span>
                                                       </>
                                                  )}
                                             </div>
                                        </div>
                                        {activity.status && (
                                             <span className={`
                    px-2 py-0.5 rounded-full text-font-size-caption font-medium flex-shrink-0
                    ${activity.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : ''}
                    ${activity.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                    ${activity.status === 'overdue' ? 'bg-red-100 text-red-700' : ''}
                  `}>
                                                  {activity.status}
                                             </span>
                                        )}
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>

               {/* Quick Actions */}
               <div className="bg-bg-card rounded-xl border border-border-default p-5">
                    <h3 className="text-font-size-ui font-semibold text-text-primary mb-3">
                         Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                         {['Create Invoice', 'Add Client', 'View Reports', 'Manage Team'].map((action) => (
                              <button
                                   key={action}
                                   className="p-3 rounded-lg border border-border-default hover:border-accent hover:bg-accent-muted transition-all group"
                              >
                                   <p className="text-font-size-body-sm font-medium text-text-body group-hover:text-accent transition-colors">
                                        {action}
                                   </p>
                              </button>
                         ))}
                    </div>
               </div>
          </div>
     );
}