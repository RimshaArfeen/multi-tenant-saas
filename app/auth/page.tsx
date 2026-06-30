// app/auth/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn as clientSignIn, useSession } from "next-auth/react";
import { signUpAction, signInAction } from "@/app/actions/auth";

function AuthFormContent() {
     const searchParams = useSearchParams();
     const router = useRouter();
     const { data: session, status, update } = useSession();
     const [mode, setMode] = useState<"signin" | "signup">("signin");
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     // Handle mode from URL params
     useEffect(() => {
          const modeParam = searchParams.get("mode");
          if (modeParam === "signup" || modeParam === "signin") {
               setMode(modeParam);
          }
     }, [searchParams]);

     // Handle redirect when authenticated
     useEffect(() => {
          if (status === "authenticated" && session) {
               const hasCompany = (session.user as any)?.companyId || (session.user as any)?.hasCompany;
               if (hasCompany) {
                    router.push("/dashboard");
               } else {
                    router.push("/auth/setup");
               }
          }
     }, [status, session, router]);

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setIsLoading(true);
          setError(null);

          const formData = new FormData(e.currentTarget);
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;

          try {
               if (mode === "signin") {
                    const result = await signInAction(formData);

                    if (result?.error) {
                         setError(result.error);
                         setIsLoading(false);
                         return;
                    }

                    if (result?.success) {
                         const res = await clientSignIn("credentials", {
                              email,
                              password,
                              redirect: false,
                         });

                         if (res?.error) {
                              setError("Authentication failed");
                              setIsLoading(false);
                              return;
                         }

                         await new Promise(resolve => setTimeout(resolve, 500));
                         await update();

                         const hasCompany = (session?.user as any)?.companyId || (session?.user as any)?.hasCompany;
                         router.push(hasCompany ? "/dashboard" : "/auth/setup");
                         router.refresh();
                         setIsLoading(false);
                         return;
                    }
               } else {
                    const result = await signUpAction(formData);

                    if (result?.error) {
                         setError(result.error);
                         setIsLoading(false);
                         return;
                    }

                    if (result?.success) {
                         const res = await clientSignIn("credentials", {
                              email,
                              password,
                              redirect: false,
                         });

                         if (res?.error) {
                              setError("Authentication failed after account creation");
                              setIsLoading(false);
                              return;
                         }

                         await new Promise(resolve => setTimeout(resolve, 500));
                         await update();

                         router.push("/dashboard");
                         router.refresh();
                         setIsLoading(false);
                         return;
                    }
               }
          } catch (err) {
               console.error("Submit error:", err);
               setError("An unexpected error occurred");
               setIsLoading(false);
          }
     };

     const handleGoogleAuth = async () => {
          setIsLoading(true);
          setError(null);

          try {
               const result = await clientSignIn("google");
               if (result && (result as any).error) {
                    setError("Google sign-in failed");
                    setIsLoading(false);
               }
          } catch (err) {
               console.error("Google sign-in error:", err);
               setError("Google sign-in failed");
               setIsLoading(false);
          }
     };

     return (
          <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
               {/* LEFT COLUMN: FORM */}
               <main className="col-span-1 lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 md:p-20">
                    <div className="flex items-center gap-2">
                         <div className="h-5 w-5 rounded-md bg-neutral-900 dark:bg-white" />
                         <span className="text-sm font-bold tracking-tight">MultiTenant SaaS</span>
                    </div>

                    <div className="w-full max-w-sm mx-auto my-auto py-12">
                         <header className="space-y-2 mb-8">
                              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                   {mode === "signin" ? "Welcome back" : "Create an account"}
                              </h1>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                   {mode === "signin"
                                        ? "Enter your credentials to access your dashboard."
                                        : "Get started with your isolated organizational sandbox today."}
                              </p>
                         </header>

                         {error && (
                              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                                   <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                              </div>
                         )}

                         {/* Google Sign-in */}
                         {mode === "signin" && (
                              <>
                                   <div className="space-y-4 mb-5">
                                        <button
                                             type="button"
                                             onClick={handleGoogleAuth}
                                             disabled={isLoading}
                                             className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)] px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                             <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                             </svg>
                                             <span>{isLoading ? "Loading..." : "Sign in with Google"}</span>
                                        </button>

                                        <div className="relative flex items-center justify-center my-4">
                                             <div className="absolute inset-0 flex items-center">
                                                  <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                                             </div>
                                             <span className="relative bg-[var(--color-background)] px-3 text-xs text-neutral-400 uppercase tracking-wider">
                                                  or continue with
                                             </span>
                                        </div>
                                   </div>
                              </>
                         )}

                         <form onSubmit={handleSubmit} className="space-y-4">
                              {mode === "signup" && (
                                   <div className="space-y-1.5">
                                        <label htmlFor="org-name" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                             Organization Name
                                        </label>
                                        <input
                                             id="org-name"
                                             name="organizationName"
                                             type="text"
                                             placeholder="Acme Corp"
                                             required
                                             disabled={isLoading}
                                             className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3.5 py-2.5 text-sm outline-hidden focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                   </div>
                              )}

                              <div className="space-y-1.5">
                                   <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        Email Address
                                   </label>
                                   <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        required
                                        disabled={isLoading}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3.5 py-2.5 text-sm outline-hidden focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                   />
                              </div>

                              <div className="space-y-1.5">
                                   <div className="flex justify-between items-center">
                                        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                             Password
                                        </label>
                                        {mode === "signin" && (
                                             <button
                                                  type="button"
                                                  className="text-xs text-neutral-500 hover:text-[var(--color-foreground)] transition-colors"
                                             >
                                                  Forgot?
                                             </button>
                                        )}
                                   </div>
                                   <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
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
                                   {isLoading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
                              </button>
                         </form>

                         <footer className="mt-6 text-center text-sm text-neutral-500">
                              {mode === "signin" ? (
                                   <>
                                        New to the platform?{" "}
                                        <button
                                             onClick={() => setMode("signup")}
                                             disabled={isLoading}
                                             className="font-semibold text-neutral-900 dark:text-white underline underline-offset-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                             Create a tenant
                                        </button>
                                   </>
                              ) : (
                                   <>
                                        Already have a workspace?{" "}
                                        <button
                                             onClick={() => setMode("signin")}
                                             disabled={isLoading}
                                             className="font-semibold text-neutral-900 dark:text-white underline underline-offset-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                             Sign in
                                        </button>
                                   </>
                              )}
                         </footer>
                    </div>

                    <div className="text-center lg:text-left text-xs text-neutral-400">
                         By continuing, you agree to our Terms of Service and Privacy Policy.
                    </div>
               </main>

               {/* RIGHT COLUMN: BRAND SHOWCASE */}
               <section className="hidden lg:col-span-7 bg-neutral-50 dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 lg:flex flex-col justify-center items-center p-12 relative overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-neutral-200/40 dark:bg-neutral-900/40 blur-3xl -z-10" />
                    <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)] p-6 shadow-xl space-y-6">
                         <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4">
                              <div className="space-y-1">
                                   <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Active Node Matrix</span>
                                   <h2 className="text-sm font-bold">Multi-Tenant Routing Engine</h2>
                              </div>
                              <div className="flex gap-1">
                                   <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                   <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                   <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
                              </div>
                         </div>

                         <div className="space-y-3">
                              <div className="rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30 p-3 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">tenant_alpha.db.saas</span>
                                   </div>
                                   <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-sm">Isolated</span>
                              </div>

                              <div className="rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30 p-3 flex items-center justify-between opacity-70">
                                   <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">tenant_beta.db.saas</span>
                                   </div>
                                   <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-sm">Isolated</span>
                              </div>
                         </div>
                         <p className="text-xs text-neutral-400 leading-relaxed text-center pt-2">
                              Every workspace deployment invokes customized routing keys, guaranteeing total logical separation of critical application states natively.
                         </p>
                    </div>
               </section>
          </div>
     );
}

export default function AuthPage() {
     return (
          <Suspense
               fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                         <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 dark:border-white border-t-transparent" />
                    </div>
               }
          >
               <AuthFormContent />
          </Suspense>
     );
}