import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getUserGyms } from "@/lib/rbac/permissions";
import { adminDb } from "@/lib/firebase/admin";
import { collections } from "@/lib/firestore/collections";
import type { GymDoc } from "@/lib/firestore/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

function requireAdminDb() {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminDb;
}

export default async function SelectGymPage() {
  console.log("[SelectGymPage] Page rendering started");
  
  // Check authentication
  const session = await getSession();
  console.log("[SelectGymPage] Session:", session ? "exists" : "missing");
  
  if (!session) {
    console.log("[SelectGymPage] No session, redirecting to signin");
    redirect("/signin");
  }

  try {
    console.log(`[SelectGymPage] Getting gyms for user ${session.userId}`);
    
    // Get user's gym IDs
    const gymIds = await getUserGyms(session.userId);
    console.log(`[SelectGymPage] Found ${gymIds.length} gym IDs:`, gymIds);

    if (gymIds.length === 0) {
      console.log("[SelectGymPage] No gyms found, redirecting to signin");
      // Gym owners should always have a gym (created by admin)
      // If they don't, something went wrong - redirect to signin
      redirect("/signin");
    }

    if (gymIds.length === 1) {
      // If only one gym, redirect directly to it
      console.log(`[SelectGymPage] Only one gym, redirecting to ${gymIds[0]}/dashboard`);
      redirect(`/app/${gymIds[0]}/dashboard`);
    }

    console.log(`[SelectGymPage] Fetching ${gymIds.length} gym documents`);
    
    // Fetch gym documents
    const db = requireAdminDb();
    const gymPromises = gymIds.map(async (gymId) => {
      try {
        const gymDoc = await db.doc(collections.gym(gymId)).get();
        if (!gymDoc.exists) {
          console.warn(`[SelectGymPage] Gym ${gymId} does not exist`);
          return null;
        }
        const data = gymDoc.data() as GymDoc;
        console.log(`[SelectGymPage] Loaded gym ${gymId}: ${data.name}`);
        return {
          id: gymId,
          name: data.name,
          address: data.address,
          phone: data.phone,
        };
      } catch (error) {
        console.error(`[SelectGymPage] Error loading gym ${gymId}:`, error);
        return null;
      }
    });

    const gyms = (await Promise.all(gymPromises)).filter(
      (gym) => gym !== null
    ) as Array<{ id: string; name: string; address?: string; phone?: string }>;

    console.log(`[SelectGymPage] Successfully loaded ${gyms.length} gym documents`);

    if (gyms.length === 0) {
      console.log("[SelectGymPage] No valid gyms after filtering, redirecting to signin");
      // Gym owners should always have a gym (created by admin)
      // If they don't, something went wrong - redirect to signin
      redirect("/signin");
    }
    
    console.log(`[SelectGymPage] Rendering gym list with ${gyms.length} gyms`);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Select a Gym</CardTitle>
            <CardDescription>
              You have access to multiple gyms. Choose one to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gyms.map((gym) => (
                <Button
                  key={gym.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-4"
                  asChild
                >
                  <Link href={`/app/${gym.id}/dashboard`}>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold">{gym.name}</span>
                      {gym.address && (
                        <span className="text-sm text-muted-foreground">
                          {gym.address}
                        </span>
                      )}
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("[SelectGymPage] Error:", error);
    // If there's an error, redirect to signin
    redirect("/signin");
  }
}

