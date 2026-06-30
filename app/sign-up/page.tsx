
import React from "react";

export default function SignUpPage() {
     return (
          <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">

               {/* LEFT COLUMN: BRANDED ARCHITECTURE PANEL */}
               <div className="hidden lg:col-span-7 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 lg:flex flex-col justify-center items-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] dark:bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

                    <div className="relative w-full max-w-md text-left space-y-6">
                         <h2 className="text-3xl font-bold tracking-tight balance">
                              Deploy automated enterprise-ready environments in seconds.
                         </h2>
                         <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                              Signing up initializes a clean, distinct instance routing pool. Complete isolation via automated Prisma middleware parameters ensures absolute client security compliance.
                         </p>
                    </div>
               </div>

               {/* RIGHT COLUMN: FORM */}
               <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12 md:p-20">
                    {/* Header/Logo */}
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-md bg-neutral-900 dark:bg-white" />
                              <span className="text-lg font-bold tracking-tight">MultiTenant</span>
                         </div>
                         <a href="/signin" className="text-xs font-medium text-neutral-500 hover:text-[var(--color-foreground)] transition-colors">
                              Sign In instead
                         </a>
                    </div>

                    {/* Central Card */}
                    <div className="w-full max-w-sm mx-auto my-auto py-8">
                         <div className="space-y-2 text-center lg:text-left">
                              <h1 className="text-2xl font-bold tracking-tight">Create your organization</h1>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                   Set up your high-performance multi-tenant node.
                              </p>
                         </div>

                         <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1.5">
                                        <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                             First Name
                                        </label>
                                        <input
                                             id="firstName"
                                             type="text"
                                             required
                                             placeholder="Alex"
                                             className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)] px-4 py-3 text-sm placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-all"
                                        />
                                   </div>
                                   <div className="space-y-1.5">
                                        <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                             Last Name
                                        </label>
                                        <input
                                             id="lastName"
                                             type="text"
                                             required
                                             placeholder="Rivera"
                                             className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)] px-4 py-3 text-sm placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-all"
                                        />
                                   </div>
                              </div>

                              <div className="space-y-1.5">
                                   <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        Work Email
                                   </label>
                                   <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="alex@company.com"
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)] px-4 py-3 text-sm placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-all"
                                   />
                              </div>

                              <div className="space-y-1.5">
                                   <label htmlFor="workspace" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        Desired Workspace URL
                                   </label>
                                   <div className="relative flex items-center">
                                        <input
                                             id="workspace"
                                             type="text"
                                             required
                                             placeholder="my-team"
                                             className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)] pl-4 pr-24 py-3 text-sm placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-all font-mono"
                                        />
                                        <span className="absolute right-4 text-xs font-mono text-neutral-400 pointer-events-none select-none">
                                             .saas.com
                                        </span>
                                   </div>
                              </div>

                              <div className="space-y-1.5">
                                   <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        Choose Password
                                   </label>
                                   <input
                                        id="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)] px-4 py-3 text-sm placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-all"
                                   />
                              </div>

                              <button
                                   type="submit"
                                   className="w-full mt-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black py-3 text-sm font-semibold shadow-xs hover:opacity-90 active:scale-[0.99] transition-all"
                              >
                                   Provision Workspace
                              </button>
                         </form>

                         <p className="mt-4 text-center text-[11px] text-neutral-400 leading-normal">
                              By clicking provision, you agree to automatic computing scaling provisions and security processing terms.
                         </p>
                    </div>

                    {/* Footer info */}
                    <div className="text-center lg:text-left text-xs text-neutral-400">
                         Compliant with SOC2 and international privacy standards.
                    </div>
               </div>

          </div>
     );
}