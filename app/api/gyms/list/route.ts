import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserGyms } from "@/lib/rbac/permissions";
import { adminDb } from "@/lib/firebase/admin";

function requireAdminDb() {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminDb;
}
import { collections } from "@/lib/firestore/collections";
import type { GymDoc } from "@/lib/firestore/types";

export async function GET() {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // Get all gyms the user belongs to
    const gymIds = await getUserGyms(userId);

    if (gymIds.length === 0) {
      return NextResponse.json({ gyms: [] });
    }

    // Fetch gym documents
    const db = requireAdminDb();
    const gymPromises = gymIds.map(async (gymId) => {
      const gymDoc = await db.doc(collections.gym(gymId)).get();
      if (!gymDoc.exists) {
        return null;
      }
      const data = gymDoc.data() as GymDoc;
      return {
        id: gymId,
        name: data.name,
        address: data.address,
        phone: data.phone,
      };
    });

    const gyms = (await Promise.all(gymPromises)).filter(
      (gym) => gym !== null
    ) as Array<{ id: string; name: string; address?: string; phone?: string }>;

    return NextResponse.json({ gyms });
  } catch (error) {
    console.error("List gyms error:", error);
    return NextResponse.json(
      { error: "Failed to load gyms" },
      { status: 500 }
    );
  }
}

