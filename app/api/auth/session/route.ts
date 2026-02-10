import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyIdToken } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";

function requireAdminDb() {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK is not configured");
  }
  return adminDb;
}
import { collections } from "@/lib/firestore/collections";
import type { UserDoc } from "@/lib/firestore/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email not found in token" },
        { status: 400 }
      );
    }

    // Create or update user document
    const db = requireAdminDb();
    const userRef = db.doc(collections.users(userId));
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create user document
      const userData: UserDoc = {
        email,
        createdAt: new Date() as any, // Firestore will convert this
      };
      await userRef.set(userData);
    } else {
      // Update email if it changed
      const userData = userDoc.data() as UserDoc;
      if (userData.email !== email) {
        await userRef.update({ email });
      }
    }

    // Create session cookie
    await createSession(idToken);

    return NextResponse.json({ 
      success: true,
      userId,
      email,
    });
  } catch (error) {
    console.error("Session creation error:", error);
    
    if (error instanceof Error) {
      // Check for Admin SDK configuration error
      if (error.message.includes("Firebase Admin SDK is not configured")) {
        return NextResponse.json(
          { 
            error: "Server configuration error: Firebase Admin SDK is not set up. Please add Admin SDK credentials to Vercel environment variables.",
            details: "Missing FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, or FIREBASE_ADMIN_PRIVATE_KEY"
          },
          { status: 500 }
        );
      }
      
      // Check for token errors
      if (error.message.includes("token") || error.message.includes("Token")) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
      
      // Return the actual error message for debugging
      return NextResponse.json(
        { 
          error: "Failed to create session",
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

