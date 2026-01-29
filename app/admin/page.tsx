import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/admin";
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
import { Plus } from "lucide-react";

function requireAdminDb() {
  if (!adminDb) {
    throw new Error(
      "Firebase Admin SDK is not configured. Please add Admin SDK credentials to .env.local"
    );
  }
  return adminDb;
}

export default async function AdminDashboardPage() {
  // Check authentication
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Check if user is admin
  const userIsAdmin = await isAdmin(session.userId);
  if (!userIsAdmin) {
    redirect("/app");
  }

  // Fetch all gyms
  const db = requireAdminDb();
  const gymsSnapshot = await db.collection(collections.gyms()).get();
  
  const gyms: Array<{
    id: string;
    name: string;
    address?: string;
    phone?: string;
    ownerUserId: string;
    createdAt: Date;
  }> = [];

  for (const gymDoc of gymsSnapshot.docs) {
    const data = gymDoc.data() as GymDoc;
    gyms.push({
      id: gymDoc.id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      ownerUserId: data.ownerUserId,
      createdAt: data.createdAt.toDate(),
    });
  }

  // Sort by creation date (newest first)
  gyms.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage gym owners and gyms
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/create-gym-owner">
              <Plus className="mr-2 h-4 w-4" />
              Create Gym Owner
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Gyms ({gyms.length})</CardTitle>
            <CardDescription>
              View and manage all gyms in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gyms.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="mb-4">No gyms found.</p>
                <Button asChild>
                  <Link href="/admin/create-gym-owner">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Gym Owner
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {gyms.map((gym) => (
                  <div
                    key={gym.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{gym.name}</h3>
                      {gym.address && (
                        <p className="text-sm text-muted-foreground">
                          {gym.address}
                        </p>
                      )}
                      {gym.phone && (
                        <p className="text-sm text-muted-foreground">
                          {gym.phone}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        Owner ID: {gym.ownerUserId}
                      </p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/app/${gym.id}/dashboard`}>
                        View Gym
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
