import { adminDb } from "@/lib/firebase/admin";

// Helper to check if Admin SDK is available
function requireAdminDb() {
  if (!adminDb) {
    throw new Error(
      "Firebase Admin SDK is not configured. Please add Admin SDK credentials to .env.local"
    );
  }
  return adminDb;
}
import { collections } from "@/lib/firestore/collections";
import type { UserRole, PermissionKey, PermissionCheck, PermissionContext } from "./types";
import type { StaffDoc, PermissionSetDoc } from "@/lib/firestore/types";

/**
 * Get a user's role in a specific gym
 */
export async function getUserGymRole(
  gymId: string,
  userId: string
): Promise<UserRole | null> {
  try {
    const db = requireAdminDb();
    const staffDoc = await db
      .doc(collections.staffMember(gymId, userId))
      .get();

    if (!staffDoc.exists) {
      return null;
    }

    const data = staffDoc.data() as StaffDoc;
    return data.role;
  } catch (error) {
    console.error("Error getting user gym role:", error);
    return null;
  }
}

/**
 * Check if a user is a member of a gym's staff
 */
export async function requireGymMembership(
  gymId: string,
  userId: string
): Promise<StaffDoc> {
  const db = requireAdminDb();
  const staffDoc = await db
    .doc(collections.staffMember(gymId, userId))
    .get();

  if (!staffDoc.exists) {
    throw new Error(`User ${userId} is not a member of gym ${gymId}`);
  }

  const data = staffDoc.data() as StaffDoc;
  
  if (data.status !== "active") {
    throw new Error(`User ${userId} is not an active member of gym ${gymId}`);
  }

  return data;
}

/**
 * Check if a user has a specific permission in a gym
 * Owners always have all permissions
 */
export async function requirePermission(
  context: PermissionContext
): Promise<void> {
  const { gymId, userId, permissionKey } = context;

  // Get user's role
  const role = await getUserGymRole(gymId, userId);
  
  if (!role) {
    throw new Error(`User ${userId} is not a member of gym ${gymId}`);
  }

  // Owners always have all permissions
  if (role === "OWNER") {
    return;
  }

  // Get permission sets
  const db = requireAdminDb();
  const permissionSetDoc = await db
    .doc(collections.permissionSet(gymId))
    .get();

  if (!permissionSetDoc.exists) {
    throw new Error(`Permission set not found for gym ${gymId}`);
  }

  const permissionSet = permissionSetDoc.data() as PermissionSetDoc;

  // Check manager permissions
  if (role === "MANAGER") {
    const hasPermission = permissionSet.managerPermissions[permissionKey] === true;
    if (!hasPermission) {
      throw new Error(
        `User ${userId} (MANAGER) does not have permission: ${permissionKey}`
      );
    }
    return;
  }

  // Check employee permissions
  if (role === "EMPLOYEE") {
    const hasPermission = permissionSet.employeePermissions[permissionKey] === true;
    if (!hasPermission) {
      throw new Error(
        `User ${userId} (EMPLOYEE) does not have permission: ${permissionKey}`
      );
    }
    return;
  }

  // MEMBER role doesn't have staff permissions
  throw new Error(`User ${userId} (MEMBER) does not have staff permissions`);
}

/**
 * Check permission (non-throwing version)
 * Returns a result object instead of throwing
 */
export async function checkPermission(
  context: PermissionContext
): Promise<PermissionCheck> {
  try {
    await requirePermission(context);
    return { allowed: true };
  } catch (error) {
    return {
      allowed: false,
      reason: error instanceof Error ? error.message : "Permission denied",
    };
  }
}

/**
 * Get all gyms a user belongs to
 * 
 * Uses a direct query approach (checking each gym) instead of collectionGroup
 * to avoid requiring Firestore indexes. This is efficient for small-scale use.
 */
export async function getUserGyms(userId: string): Promise<string[]> {
  try {
    const db = requireAdminDb();
    
    // Query all gyms and check if user is staff member
    // This approach avoids collectionGroup queries which require indexes
    const allGyms = await db.collection(collections.gyms()).get();
    const gymIds: string[] = [];
    
    console.log(`[getUserGyms] Checking ${allGyms.docs.length} gyms for user ${userId}`);
    
    for (const gymDoc of allGyms.docs) {
      const gymId = gymDoc.id;
      const staffDoc = await db
        .doc(collections.staffMember(gymId, userId))
        .get();
      
      if (staffDoc.exists) {
        const staffData = staffDoc.data() as StaffDoc;
        // Handle both old documents (without status field) and new documents
        // If status is missing, assume "active" (for backward compatibility)
        const status = staffData?.status || "active";
        
        if (status === "active") {
          gymIds.push(gymId);
          console.log(`[getUserGyms] Found active staff membership for gym ${gymId}`);
        } else {
          console.log(`[getUserGyms] Staff membership for gym ${gymId} is ${status}, skipping`);
        }
      }
    }
    
    console.log(`[getUserGyms] Returning ${gymIds.length} gyms for user ${userId}`);
    return gymIds;
  } catch (error: any) {
    console.error("Error getting user gyms:", error);
    
    // If Admin SDK is not available, return empty array (will redirect to signin)
    if (error instanceof Error && error.message.includes("Firebase Admin SDK is not configured")) {
      console.warn("Admin SDK not configured - cannot retrieve gyms. User will be redirected to signin.");
    }
    
    return [];
  }
}

