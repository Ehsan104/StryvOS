import { adminDb } from "@/lib/firebase/admin";
import { collections } from "@/lib/firestore/collections";
import type { UserDoc } from "@/lib/firestore/types";

// Helper to check if Admin SDK is available
function requireAdminDb() {
  if (!adminDb) {
    throw new Error(
      "Firebase Admin SDK is not configured. Please add Admin SDK credentials to .env.local"
    );
  }
  return adminDb;
}

/**
 * Check if a user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const db = requireAdminDb();
    const userDoc = await db.doc(collections.users(userId)).get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    const userData = userDoc.data() as UserDoc;
    return userData.isAdmin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Require admin access (throws if user is not admin)
 */
export async function requireAdmin(userId: string): Promise<void> {
  const isUserAdmin = await isAdmin(userId);
  if (!isUserAdmin) {
    throw new Error(`User ${userId} is not an admin`);
  }
}
