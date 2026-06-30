

import type { Metadata } from "next";
import * as authModule from "./lib/auth";
import "./globals.css";
import { SessionProviderWrapper } from "./components/providers/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "Multi-Tenant SaaS",
  description: "Multi-tenant SaaS application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session on the server
  const authHandler = (authModule as {
    auth?: () => Promise<unknown>;
    default?: () => Promise<unknown>;
  }).auth ?? (authModule as {
    auth?: () => Promise<unknown>;
    default?: () => Promise<unknown>;
  }).default;
  const session = (authHandler ? await authHandler() : null) as any;

  return (
    <html lang="en">
      <body>
        {/* We need to use a client component for SessionProvider */}
        <SessionProviderWrapper session={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}