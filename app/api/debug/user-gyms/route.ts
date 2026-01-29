import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserGyms } from "@/lib/rbac/permissions";
import { adminDb } from "@/lib/firebase/admin";
import { collections } from "@/lib/firestore/collections";

function requireAdminDb() {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminDb;
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = requireAdminDb();
    
    // Get all gyms
    const allGyms = await db.collection(collections.gyms()).get();
    const gymsData = [];
    
    for (const gymDoc of allGyms.docs) {
      const gymId = gymDoc.id;
      const gymData = gymDoc.data();
      
      // Check staff document
      const staffDoc = await db.doc(collections.staffMember(gymId, session.userId)).get();
      
      gymsData.push({
        gymId,
        gymName: gymData.name,
        ownerUserId: gymData.ownerUserId,
        hasStaffDoc: staffDoc.exists,
        staffData: staffDoc.exists ? staffDoc.data() : null,
      });
    }

    const gymIds = await getUserGyms(session.userId);

    return NextResponse.json({
      userId: session.userId,
      email: session.email,
      gymsFound: gymIds.length,
      gymIds,
      allGyms: gymsData,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
