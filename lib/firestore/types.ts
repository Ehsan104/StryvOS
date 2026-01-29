// Firestore document type definitions

export type UserRole = "OWNER" | "MANAGER" | "EMPLOYEE" | "MEMBER";
export type MemberStatus = "active" | "paused" | "cancelled";
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "past_due";
export type BillingPeriod = "monthly" | "annual";

// User document
export interface UserDoc {
  email: string;
  name?: string;
  createdAt: FirebaseFirestore.Timestamp;
  isAdmin?: boolean; // true for admin accounts (you and your friend)
}

// Gym document
export interface GymDoc {
  name: string;
  address?: string;
  phone?: string;
  createdAt: FirebaseFirestore.Timestamp;
  ownerUserId: string;
}

// Permission sets document
export interface PermissionSetDoc {
  managerPermissions: Record<string, boolean>;
  employeePermissions: Record<string, boolean>;
  updatedAt: FirebaseFirestore.Timestamp;
}

// Staff document (gyms/{gymId}/staff/{userId})
export interface StaffDoc {
  userId: string; // Store userId in document for easier querying
  role: UserRole;
  createdAt: FirebaseFirestore.Timestamp;
  status: "active" | "inactive";
}

// Plan document (gyms/{gymId}/plans/{planId})
export interface PlanDoc {
  name: string;
  description?: string;
  priceCents: number;
  billingPeriod: BillingPeriod;
  active: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: FirebaseFirestore.Timestamp;
}

// Member document (gyms/{gymId}/members/{memberId})
export interface MemberDoc {
  name: string;
  email: string;
  phone?: string;
  status: MemberStatus;
  qrToken: string; // Stable token, never changes
  createdAt: FirebaseFirestore.Timestamp;
  linkedMemberIds?: string[]; // Array of other member IDs (family members, etc.)
  lastCheckinAt?: FirebaseFirestore.Timestamp;
}

// Subscription document (gyms/{gymId}/subscriptions/{subscriptionId})
export interface SubscriptionDoc {
  memberId: string;
  planId: string;
  status: SubscriptionStatus;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  pauseReason?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

// Invite document (gyms/{gymId}/invites/{inviteId})
export interface InviteDoc {
  email: string;
  role: UserRole;
  invitedBy: string;
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
  usedAt?: FirebaseFirestore.Timestamp;
}

