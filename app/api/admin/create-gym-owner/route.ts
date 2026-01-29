import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/admin";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { collections } from "@/lib/firestore/collections";
import { createGymOwnerSchema } from "@/lib/validators/admin";
import { Timestamp } from "firebase-admin/firestore";

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

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    await requireAdmin(session.userId);

    // Parse and validate request body
    const body = await request.json();
    const data = createGymOwnerSchema.parse(body);

    const auth = requireAdminAuth();
    const db = requireAdminDb();

    // 1. Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    const userId = userRecord.uid;

    // 2. Create user document in Firestore
    await db.doc(collections.users(userId)).set({
      email: data.email,
      name: data.name,
      createdAt: Timestamp.now(),
      isAdmin: false, // Gym owners are not admins
    });

    // 3. Create gym document
    const gymRef = db.collection(collections.gyms()).doc();
    const gymId = gymRef.id;

    await gymRef.set({
      name: data.gymName,
      address: data.gymAddress,
      phone: data.gymPhone,
      createdAt: Timestamp.now(),
      ownerUserId: userId,
    });

    // 4. Create staff document (owner role)
    await db.doc(collections.staffMember(gymId, userId)).set({
      userId: userId,
      role: "OWNER",
      createdAt: Timestamp.now(),
      status: "active",
    });

    // 5. Create default permission set for the gym
    await db.doc(collections.permissionSet(gymId)).set({
      managerPermissions: {
        // Add default manager permissions here if needed
      },
      employeePermissions: {
        // Add default employee permissions here if needed
      },
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      userId,
      gymId,
      message: "Gym owner created successfully",
    });
  } catch (error) {
    console.error("Error creating gym owner:", error);

    if (error instanceof Error) {
      // Handle specific Firebase errors
      if (error.message.includes("email-already-exists")) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }
      if (error.message.includes("invalid-email")) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
      if (error.message.includes("weak-password")) {
        return NextResponse.json(
          { error: "Password is too weak" },
          { status: 400 }
        );
      }
      if (error.message.includes("is not an admin")) {
        return NextResponse.json(
          { error: "Unauthorized: Admin access required" },
          { status: 403 }
        );
      }
      if (error.message.includes("Firebase Admin SDK is not configured")) {
        return NextResponse.json(
          { error: "Server configuration error: Admin SDK not available" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
