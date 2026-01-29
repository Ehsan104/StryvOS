import { getSession } from "@/lib/auth/session";
import { requireGymMembership } from "@/lib/rbac/permissions";
import { adminDb } from "@/lib/firebase/admin";

function requireAdminDb() {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminDb;
}
import { collections } from "@/lib/firestore/collections";
import type { GymDoc } from "@/lib/firestore/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardPageProps {
  params: Promise<{ gymId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { gymId } = await params;

  // Check authentication and gym membership
  const session = await getSession();
  if (!session) {
    return null; // Middleware will redirect
  }

  try {
    await requireGymMembership(gymId, session.userId);
  } catch (error) {
    return null; // Middleware will redirect
  }

  // Fetch gym data
  let gym: GymDoc | null = null;
  try {
    if (adminDb) {
      const db = requireAdminDb();
      const gymDoc = await db.doc(collections.gym(gymId)).get();
      if (gymDoc.exists) {
        gym = gymDoc.data() as GymDoc;
      }
    }
    } catch (error) {
      console.error("Error fetching gym:", error);
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to {gym?.name || "your gym"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Total active members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground mt-1">
              Coming in Milestone 2
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plans</CardTitle>
            <CardDescription>Active membership plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground mt-1">
              Coming in Milestone 2
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$0</div>
            <p className="text-sm text-muted-foreground mt-1">
              Coming in Milestone 2
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Member management (Coming in Milestone 2)</p>
            <p>• Plan creation (Coming in Milestone 2)</p>
            <p>• Staff management (Coming soon)</p>
            <p>• Analytics & reports (Coming soon)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

