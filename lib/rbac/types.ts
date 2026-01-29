// RBAC (Role-Based Access Control) type definitions

export type UserRole = "OWNER" | "MANAGER" | "EMPLOYEE" | "MEMBER";

// Permission keys (expand as needed)
export type PermissionKey =
  | "members.manage"
  | "members.create"
  | "members.edit"
  | "members.delete"
  | "plans.manage"
  | "plans.create"
  | "plans.edit"
  | "plans.delete"
  | "staff.manage"
  | "staff.invite"
  | "billing.view"
  | "billing.manage"
  | "analytics.view"
  | "classes.manage";

// Permission check result
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

// Permission context
export interface PermissionContext {
  gymId: string;
  userId: string;
  permissionKey: PermissionKey;
}


