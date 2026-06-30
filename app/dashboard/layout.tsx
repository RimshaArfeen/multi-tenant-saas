// app/dashboard/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// Icon imports
import {
     HomeIcon,
     DocumentTextIcon,
     UserGroupIcon,
     Cog6ToothIcon,
     BellIcon,
     MagnifyingGlassIcon,
     ChevronDownIcon,
     PlusIcon,
     ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import {
     HomeIcon as HomeIconSolid,
     DocumentTextIcon as DocumentTextIconSolid,
     UserGroupIcon as UserGroupIconSolid,
} from '@heroicons/react/24/solid';

interface NavItem {
     name: string;
     href: string;
     icon: any;
     iconActive: any;
     current: boolean;
}

export default function DashboardLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     const pathname = usePathname();
     const router = useRouter();
     const { data: session, status } = useSession();
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
     const [searchQuery, setSearchQuery] = useState('');
     const [isClient, setIsClient] = useState(false);

     // Set client-side flag
     useEffect(() => {
          setIsClient(true);
     }, []);

     // Handle session loading and redirect
     useEffect(() => {
          // Only run on client-side
          if (!isClient) return;

          // If session is loading, wait
          if (status === 'loading') return;

          // If no session, redirect to login
          if (status === 'unauthenticated') {
               router.push('/signin');
               return;
          }

          // Session is authenticated
          console.log('Session loaded:', session);
     }, [status, session, router, isClient]);

     // Navigation items with active states
     const navigation: NavItem[] = [
          {
               name: 'Home',
               href: '/dashboard',
               icon: HomeIcon,
               iconActive: HomeIconSolid,
               current: pathname === '/dashboard',
          },
          {
               name: 'Invoices',
               href: '/dashboard/invoices',
               icon: DocumentTextIcon,
               iconActive: DocumentTextIconSolid,
               current: pathname === '/dashboard/invoices',
          },
          {
               name: 'Clients',
               href: '/dashboard/clients',
               icon: UserGroupIcon,
               iconActive: UserGroupIconSolid,
               current: pathname === '/dashboard/clients',
          },
     ];

     // Loading state
     if (status === 'loading') {
          return (
               <div className="min-h-screen flex items-center justify-center bg-bg-page">
                    <div className="text-center">
                         <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
                         <p className="mt-4 text-text-muted text-font-size-body">Loading your dashboard...</p>
                    </div>
               </div>
          );
     }

     // If not authenticated, show nothing (will redirect)
     if (status === 'unauthenticated') {
          return null;
     }

     // Get user initials for avatar
     const getUserInitials = () => {
          if (!session?.user?.name) return 'U';
          return session.user.name
               .split(' ')
               .map((part) => part[0])
               .join('')
               .slice(0, 2)
               .toUpperCase();
     };

     const handleLogout = async () => {
          await signOut({
               callbackUrl: '/signin',
               redirect: true
          });
     };

     return (
          <div className="min-h-screen bg-bg-page">
               {/* Mobile Header */}
               <div className="lg:hidden bg-bg-surface border-b border-border-default px-4 py-3 flex items-center justify-between">
                    <span className="text-font-size-headline font-bold text-text-primary tracking-tight">
                         MultiTenant<span className="text-accent">SaaS</span>
                    </span>
                    <button
                         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                         className="p-2 rounded-lg hover:bg-bg-subtle transition-colors"
                    >
                         <svg className="w-6 h-6 text-text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                         </svg>
                    </button>
               </div>

               <div className="flex h-screen overflow-hidden">
                    {/* Sidebar */}
                    <aside className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:sticky top-0 left-0
          w-72 h-full bg-bg-surface border-r border-border-default
          flex flex-col justify-between shrink-0
          transition-transform duration-300 ease-in-out
          z-50
        `}>
                         {/* Top Section */}
                         <div className="flex flex-col flex-1 overflow-y-auto">
                              {/* Branding */}
                              <div className="pt-8 pb-6 px-6 border-b border-border-subtle">
                                   <div className="flex items-center justify-between">
                                        <span className="text-font-size-headline font-bold text-text-primary tracking-tight">
                                             MultiTenant<span className="text-accent">SaaS</span>
                                        </span>
                                        <button
                                             onClick={() => setIsMobileMenuOpen(false)}
                                             className="p-1.5 rounded-lg hover:bg-bg-subtle transition-colors lg:hidden"
                                        >
                                             <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                             </svg>
                                        </button>
                                   </div>
                                   <p className="text-font-size-caption text-text-muted mt-1">
                                        Enterprise Management
                                   </p>
                              </div>

                              {/* Search */}
                              <div className="px-4 py-4">
                                   <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                             <MagnifyingGlassIcon className="h-5 w-5 text-text-muted" />
                                        </div>
                                        <input
                                             type="search"
                                             placeholder="Search..."
                                             value={searchQuery}
                                             onChange={(e) => setSearchQuery(e.target.value)}
                                             className="w-full pl-10 pr-4 py-2 text-font-size-ui bg-bg-subtle border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent transition-all"
                                        />
                                        <kbd className="absolute inset-y-0 right-0 pr-3 flex items-center text-font-size-caption text-text-muted bg-bg-subtle">
                                             ⌘K
                                        </kbd>
                                   </div>
                              </div>

                              {/* Navigation */}
                              <nav className="flex-1 px-4 py-2 space-y-1" aria-label="Main Navigation">
                                   <div className="text-font-size-caption text-text-muted px-3 py-2 font-medium tracking-wide uppercase">
                                        Main Menu
                                   </div>
                                   {navigation.map((item) => {
                                        const Icon = item.current ? item.iconActive : item.icon;
                                        return (
                                             <Link
                                                  key={item.name}
                                                  href={item.href}
                                                  className={`
                      group flex items-center px-3 py-2.5 rounded-lg text-font-size-ui font-medium
                      transition-all duration-200 relative
                      ${item.current
                                                            ? 'bg-accent-muted text-accent'
                                                            : 'text-text-body hover:bg-bg-subtle hover:text-text-primary'
                                                       }
                    `}
                                             >
                                                  <Icon className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${item.current ? 'text-accent' : 'text-text-muted group-hover:text-text-body'}
                    `} />
                                                  {item.name}
                                                  {item.current && (
                                                       <span className="absolute right-3 w-1.5 h-8 bg-accent rounded-full" />
                                                  )}
                                             </Link>
                                        );
                                   })}

                                   <div className="pt-4 mt-4 border-t border-border-subtle">
                                        <div className="text-font-size-caption text-text-muted px-3 py-2 font-medium tracking-wide uppercase">
                                             Quick Actions
                                        </div>
                                        <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-font-size-ui text-text-body hover:bg-bg-subtle transition-colors">
                                             <PlusIcon className="mr-3 h-5 w-5 text-text-muted" />
                                             New Invoice
                                        </button>
                                        <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-font-size-ui text-text-body hover:bg-bg-subtle transition-colors">
                                             <UserGroupIcon className="mr-3 h-5 w-5 text-text-muted" />
                                             Add Client
                                        </button>
                                   </div>
                              </nav>
                         </div>

                         {/* Footer - User Profile & Settings */}
                         <div className="border-t border-border-default bg-bg-subtle p-4">
                              <div className="flex items-center gap-3 mb-3">
                                   <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-text-inverse font-medium text-font-size-ui ring-2 ring-white">
                                             {getUserInitials()}
                                        </div>
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                        <p className="text-font-size-ui font-medium text-text-primary truncate">
                                             {session?.user?.name || 'User'}
                                        </p>
                                        <p className="text-font-size-caption text-text-muted truncate">
                                             {session?.user?.email || 'No email'}
                                        </p>
                                   </div>
                                   <button className="p-1.5 rounded-lg hover:bg-bg-card transition-colors">
                                        <ChevronDownIcon className="h-5 w-5 text-text-muted" />
                                   </button>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                                   <Link
                                        href="/dashboard/settings"
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-card transition-colors text-font-size-ui text-text-muted"
                                   >
                                        <Cog6ToothIcon className="h-4 w-4" />
                                        Settings
                                   </Link>
                                   <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-card transition-colors text-font-size-ui text-text-muted hover:text-red-600"
                                   >
                                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                        Logout
                                   </button>
                              </div>
                         </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 overflow-y-auto bg-bg-page">
                         {/* Top Bar */}
                         <div className="sticky top-0 z-40 bg-bg-page/80 backdrop-blur-md border-b border-border-default px-6 py-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                   <h1 className="text-font-size-headline font-semibold text-text-primary">
                                        Dashboard
                                   </h1>
                                   <span className="px-2.5 py-0.5 rounded-full bg-accent-muted text-accent text-font-size-caption font-medium">
                                        v2.0
                                   </span>
                              </div>

                              <div className="flex items-center gap-3">
                                   <button className="relative p-2 rounded-lg hover:bg-bg-subtle transition-colors">
                                        <BellIcon className="h-5 w-5 text-text-body" />
                                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-secondary ring-2 ring-bg-page" />
                                   </button>
                                   <button className="p-2 rounded-lg hover:bg-bg-subtle transition-colors">
                                        <svg className="h-5 w-5 text-text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                   </button>
                              </div>
                         </div>

                         {/* Page Content */}
                         <div className="p-6">
                              {children}
                         </div>
                    </main>
               </div>

               {/* Mobile overlay */}
               {isMobileMenuOpen && (
                    <div
                         className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
                         onClick={() => setIsMobileMenuOpen(false)}
                    />
               )}
          </div>
     );
}