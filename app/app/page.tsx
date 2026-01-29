import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getUserGyms } from "@/lib/rbac/permissions";
import { isAdmin } from "@/lib/auth/admin";

export default async function AppPage() {
  // Check authentication
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  // Check if user is admin - admins should use /admin instead
  const userIsAdmin = await isAdmin(session.userId);
  if (userIsAdmin) {
    redirect("/admin");
  }

  try {
    // Try to get user's gyms
    console.log(`[AppPage] Getting gyms for user ${session.userId}...`);
    const gyms = await getUserGyms(session.userId);

    console.log(`[AppPage] Found ${gyms.length} gyms for user ${session.userId}:`, gyms);
    
    if (gyms.length === 0) {
      // No gyms - gym owners should always have a gym (created by admin)
      // This shouldn't happen, but redirect to signin if it does
      console.warn(`[AppPage] User ${session.userId} has no gyms. This shouldn't happen for gym owners.`);
      console.warn(`[AppPage] This might mean:`);
      console.warn(`  - The gym owner account was created but the staff document wasn't created`);
      console.warn(`  - The staff document status is not "active"`);
      console.warn(`  - There's an issue with the getUserGyms function`);
      redirect("/signin");
    } else if (gyms.length === 1) {
      // One gym, redirect directly to dashboard
      console.log(`[AppPage] Redirecting to gym dashboard: ${gyms[0]}/dashboard`);
      redirect(`/app/${gyms[0]}/dashboard`);
    } else {
      // Multiple gyms, redirect to select-gym
      console.log(`[AppPage] Multiple gyms found, redirecting to select-gym`);
      redirect("/app/select-gym");
    }
  } catch (error) {
    // Next.js redirects throw a special error - don't catch those
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw redirect errors
    }
    
    // If Admin SDK is not available or there's an error
    console.error("[AppPage] Error getting user gyms:", error);
    if (error instanceof Error) {
      console.error("[AppPage] Error message:", error.message);
    }
    redirect("/signin");
  }
}

