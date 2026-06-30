
// lib/session.ts
export async function refreshSession() {
  try {
    // Force a session refresh
    await fetch("/api/auth/session?update", {
      method: "GET",
      cache: "no-store",
    });
    
    // Small delay to ensure session is updated
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  } catch (error) {
    console.error("Failed to refresh session:", error);
    return false;
  }
}