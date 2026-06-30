// app/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard or setup
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

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-800 dark:border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased selection:bg-neutral-500/30">
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)]/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-neutral-900 dark:bg-white" />
            <span className="text-lg font-bold tracking-tight">MultiTenant</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <a href="#features" className="hover:text-[var(--color-foreground)] transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-[var(--color-foreground)] transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-[var(--color-foreground)] transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {status === "authenticated" ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium shadow-xs hover:opacity-90 transition-opacity"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth?mode=signin"
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium shadow-xs hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="mx-auto max-w-7xl px-6 pt-20 pb-16 text-center lg:pt-32">
        <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-900 px-3 py-1 text-xs font-medium border border-neutral-200 dark:border-neutral-800 tracking-wide">
          Next.js 15 & Prisma Optimized
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-4xl mx-auto balance leading-tight">
          Scale your SaaS infrastructure with{" "}
          <span className="bg-gradient-to-r from-neutral-500 via-neutral-800 to-neutral-900 dark:from-neutral-400 dark:via-neutral-200 dark:to-neutral-100 bg-clip-text text-transparent">
            isolated tenancy.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Instantly provision secure workspaces, independent databases, and custom subdomains for your enterprise clients. Beautifully designed dashboard interfaces out of the box.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className="rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black px-6 py-3 text-sm font-semibold shadow-md hover:opacity-95 transition-all transform hover:-translate-y-0.5"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/auth?mode=signup"
              className="rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black px-6 py-3 text-sm font-semibold shadow-md hover:opacity-95 transition-all transform hover:-translate-y-0.5"
            >
              Deploy New Tenant
            </Link>
          )}
          <Link
            href="/docs"
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-6 py-3 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            Read Docs
          </Link>
        </div>

        {/* Rest of your hero section... */}
      </main>
    </div>
  );
}