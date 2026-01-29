import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { requireGymMembership } from "@/lib/rbac/permissions";
import { Sidebar } from "@/components/app/sidebar";
import { adminDb } from "@/lib/firebase/admin";

function requireAdminDb() {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminDb;
}
import { collections } from "@/lib/firestore/collections";
import type { GymDoc } from "@/lib/firestore/types";

interface ShellLayoutProps {
  children: React.ReactNode;
  params: Promise<{ gymId: string }>;
}

export default async function ShellLayout({
  children,
  params,
}: ShellLayoutProps) {
  const { gymId } = await params;

  // Check authentication
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  // Verify user is a member of this gym
  try {
    await requireGymMembership(gymId, session.userId);
  } catch (error) {
    console.error("Gym membership check failed:", error);
    redirect("/app/select-gym");
  }

  // Fetch gym data for sidebar
  let gymName = "Gym";
  try {
    if (adminDb) {
      const db = requireAdminDb();
      const gymDoc = await db.doc(collections.gym(gymId)).get();
      if (gymDoc.exists) {
        const gymData = gymDoc.data() as GymDoc;
        gymName = gymData.name;
      }
    }
    } catch (error) {
      console.error("Error fetching gym:", error);
    }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar gymId={gymId} gymName={gymName} />
      <main className="flex-1 overflow-y-auto bg-background md:ml-64">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}

