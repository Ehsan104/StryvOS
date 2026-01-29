import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

function requireAdminDb() {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminDb;
}
import { collections } from "@/lib/firestore/collections";
import { createGymSchema } from "@/lib/validators/gyms";
import type { GymDoc, StaffDoc, PermissionSetDoc } from "@/lib/firestore/types";

export async function POST(request: NextRequest) {
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

    // Check if user already has a gym (for now, allow multiple gyms)
    // In the future, you might want to limit this

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createGymSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create gym document
    const db = requireAdminDb();
    const gymRef = db.collection(collections.gyms()).doc();
    const gymId = gymRef.id;

    const now = Timestamp.now();
    const gymData: GymDoc = {
      name: data.name,
      address: data.address || "", // Now required, but keep fallback
      phone: data.phone || "", // Now required, but keep fallback
      ownerUserId: userId,
      createdAt: now,
    };

    await gymRef.set(gymData);

    // Create staff document (OWNER role)
    const staffRef = db.doc(collections.staffMember(gymId, userId));
    const staffData: StaffDoc = {
      userId: userId, // Store userId in document for collectionGroup queries
      role: "OWNER",
      status: "active",
      createdAt: now,
    };
    await staffRef.set(staffData);

    // Create default permission sets document
    const permissionSetRef = db.doc(collections.permissionSet(gymId));
    const permissionSetData: PermissionSetDoc = {
      managerPermissions: {
        // Default permissions for managers (all enabled by default)
        "members.manage": true,
        "members.create": true,
        "members.edit": true,
        "members.delete": true,
        "plans.manage": true,
        "plans.create": true,
        "plans.edit": true,
        "plans.delete": true,
        "staff.manage": false, // Only owner can manage staff initially
        "staff.invite": true,
        "billing.view": true,
        "billing.manage": false,
        "analytics.view": true,
        "classes.manage": false,
      },
      employeePermissions: {
        // Default permissions for employees (limited)
        "members.create": true,
        "members.edit": true,
        "members.delete": false,
        "members.manage": false,
        "plans.manage": false,
        "plans.create": false,
        "plans.edit": false,
        "plans.delete": false,
        "staff.manage": false,
        "staff.invite": false,
        "billing.view": false,
        "billing.manage": false,
        "analytics.view": false,
        "classes.manage": false,
      },
      updatedAt: now,
    };
    await permissionSetRef.set(permissionSetData);

    return NextResponse.json({
      success: true,
      gymId,
      gym: {
        id: gymId,
        ...gymData,
      },
    });
  } catch (error) {
    console.error("Create gym error:", error);
    
    let errorMessage = "Failed to create gym";
    if (error instanceof Error) {
      if (error.message.includes("Firebase Admin SDK is not configured")) {
        errorMessage = "Firebase Admin SDK is not configured. Please add Admin SDK credentials to .env.local. See FIREBASE_PERSONAL_SETUP.md for instructions.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

