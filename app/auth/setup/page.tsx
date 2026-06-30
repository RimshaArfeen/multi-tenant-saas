
// app/auth/setup/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { refreshSession } from "../../lib/session";

type ExtendedSession = Session & {
     user: Session["user"] & {
          companyId?: string | null;
     };
};

function CompanySetupContent() {
     const router = useRouter();
     const { data, status } = useSession();
     const session = data as ExtendedSession | null;
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [logoPreview, setLogoPreview] = useState<string | null>(null);
     const [companyNameError, setCompanyNameError] = useState("");

     const checkCompanyName = async (name: string) => {
          if (name.length < 2) {
               setCompanyNameError("Company name must be at least 2 characters");
               return;
          }

          try {
               const response = await fetch(`/api/company/check-name?name=${encodeURIComponent(name)}`);
               const data = await response.json();

               if (!data.available) {
                    setCompanyNameError("This company name is already taken");
               } else {
                    setCompanyNameError("");
               }
          } catch (error) {
               console.error("Error checking company name:", error);
          }
     };

     // Redirect if not authenticated or if user already has a company
     useEffect(() => {
          if (status === "unauthenticated") {
               router.push("/auth?mode=signin");
               return;
          }

          // If user already has a company, redirect to dashboard
          if (status === "authenticated" && session?.user?.companyId) {
               router.push("/dashboard");
               return;
          }
     }, [status, session, router]);

     const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
               const reader = new FileReader();
               reader.onloadend = () => {
                    setLogoPreview(reader.result as string);
               };
               reader.readAsDataURL(file);
          }
     };

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setIsLoading(true);
          setError(null);

          const formData = new FormData(e.currentTarget);
          const name = formData.get("companyName") as string;
          const currency = formData.get("currency") as string;
          const country = formData.get("country") as string;
          const logo = formData.get("logo") as File;

          try {
               let logoUrl = null;
               if (logo && logo.size > 0) {
                    const reader = new FileReader();
                    const logoData = await new Promise<string>((resolve) => {
                         reader.onloadend = () => resolve(reader.result as string);
                         reader.readAsDataURL(logo);
                    });
                    logoUrl = logoData;
               }

               const response = await fetch("/api/company/setup", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         name,
                         currency,
                         country,
                         logo: logoUrl,
                    }),
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || "Failed to setup company");
               }

               // If company already exists or was created successfully
               if (data.success) {
                    // Refresh session to get updated company data
                    await fetch("/api/auth/session?update");
                    await refreshSession();
                    router.push("/dashboard");
                    router.refresh();

               }
          } catch (err) {
               setError(err instanceof Error ? err.message : "An unexpected error occurred");
               setIsLoading(false);
          }
     };

     if (status === "loading") {
          return (
               <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 dark:border-white border-t-transparent" />
               </div>
          );
     }

     // If authenticated with company, show loading while redirecting
     if (status === "authenticated" && session?.user?.companyId) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 dark:border-white border-t-transparent" />
               </div>
          );
     }

     return (
          <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
               <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                         <div className="flex items-center justify-center gap-2 mb-4">
                              <div className="h-8 w-8 rounded-md bg-neutral-900 dark:bg-white" />
                              <span className="text-lg font-bold tracking-tight">MultiTenant SaaS</span>
                         </div>
                         <h1 className="text-2xl font-bold tracking-tight mb-2">
                              Set up your company
                         </h1>
                         <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              Tell us about your business to get started
                         </p>
                    </div>

                    {error && (
                         <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                         </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                         {/* Logo Upload */}
                         <div className="space-y-1.5">
                              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                                   Company Logo
                              </label>
                              <div className="flex items-center gap-4">
                                   <div className="h-20 w-20 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-900/50">
                                        {logoPreview ? (
                                             <img
                                                  src={logoPreview}
                                                  alt="Logo preview"
                                                  className="h-full w-full object-contain"
                                             />
                                        ) : (
                                             <svg
                                                  className="h-8 w-8 text-neutral-400"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth={1.5}
                                                       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                  />
                                             </svg>
                                        )}
                                   </div>
                                   <input
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-900 file:text-white dark:file:bg-white dark:file:text-black hover:file:opacity-90 cursor-pointer"
                                   />
                              </div>
                         </div>

                         {/* Company Name */}
                         <div className="space-y-1.5">
                              <label htmlFor="companyName" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                   Company Name
                              </label>
                              <input
                                   id="companyName"
                                   name="companyName"
                                   type="text"
                                   placeholder="Acme Corp"
                                   required
                                   disabled={isLoading}
                                   onChange={(e) => checkCompanyName(e.target.value)}
                                   className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3.5 py-2.5 text-sm outline-hidden focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              {companyNameError && (
                                   <p className="text-sm text-red-600 dark:text-red-400 mt-1">{companyNameError}</p>
                              )}
                         </div>

                         {/* Currency */}
                         <div className="space-y-1.5">
                              <label htmlFor="currency" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                   Currency
                              </label>
                              <select
                                   id="currency"
                                   name="currency"
                                   required
                                   disabled={isLoading}
                                   className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3.5 py-2.5 text-sm outline-hidden focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                   <option value="">Select currency</option>
                                   <option value="USD">USD - US Dollar</option>
                                   <option value="EUR">EUR - Euro</option>
                                   <option value="GBP">GBP - British Pound</option>
                                   <option value="CAD">CAD - Canadian Dollar</option>
                                   <option value="AUD">AUD - Australian Dollar</option>
                                   <option value="PKR">PKR - Pakistani Rupee</option>
                              </select>
                         </div>

                         {/* Country */}
                         <div className="space-y-1.5">
                              <label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                   Country
                              </label>
                              <input
                                   id="country"
                                   name="country"
                                   type="text"
                                   placeholder="United States"
                                   required
                                   disabled={isLoading}
                                   className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3.5 py-2.5 text-sm outline-hidden focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                         </div>

                         <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black py-3 text-sm font-semibold shadow-xs hover:opacity-90 active:scale-[0.99] transition-all mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                              {isLoading ? "Setting up..." : "Complete Setup"}
                         </button>
                    </form>
               </div>
          </div>
     );
}

export default function CompanySetupPage() {
     return (
          <Suspense
               fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                         <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 dark:border-white border-t-transparent" />
                    </div>
               }
          >
               <CompanySetupContent />
          </Suspense>
     );
}