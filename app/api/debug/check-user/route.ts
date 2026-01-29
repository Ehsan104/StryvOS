import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/admin";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { collections } from "@/lib/firestore/collections";

function requireAdminAuth() {
  if (!adminAuth) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminAuth;
}

function requireAdminDb() {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminDb;
}

export async function GET(request: Request) {
  try {
    // Check if user is admin
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireAdmin(session.userId);

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    const auth = requireAdminAuth();
    const db = requireAdminDb();

    // Try to get user by email
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error: any) {
      if (error?.code === "auth/user-not-found") {
        return NextResponse.json({
          exists: false,
          message: "User not found in Firebase Auth",
        });
      }
      throw error;
    }

    // Get user document from Firestore
    const userDoc = await db.doc(collections.users(userRecord.uid)).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // Get gyms for this user
    const allGyms = await db.collection(collections.gyms()).get();
    const gyms = [];
    const staffMemberships = [];

    for (const gymDoc of allGyms.docs) {
      const gymId = gymDoc.id;
      const gymData = gymDoc.data();
      
      if (gymData.ownerUserId === userRecord.uid) {
        gyms.push({
          gymId,
          name: gymData.name,
          isOwner: true,
        });
      }

      // Check staff membership
      const staffDoc = await db.doc(collections.staffMember(gymId, userRecord.uid)).get();
      if (staffDoc.exists) {
        staffMemberships.push({
          gymId,
          gymName: gymData.name,
          staffData: staffDoc.data(),
        });
      }
    }

    return NextResponse.json({
      exists: true,
      userId: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      userDoc: userData,
      gymsOwned: gyms,
      staffMemberships,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
