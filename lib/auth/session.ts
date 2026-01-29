import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import type { DecodedIdToken } from "firebase-admin/auth";

// Helper to check if Admin SDK is available
function requireAdminAuth() {
  if (!adminAuth) {
    throw new Error(
      "Firebase Admin SDK is not configured. Please add Admin SDK credentials to .env.local"
    );
  }
  return adminAuth;
}

const SESSION_COOKIE_NAME = "firebase-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Create a session cookie from Firebase ID token
 */
export async function createSession(idToken: string): Promise<void> {
  // Verify the ID token and get the decoded token
  const auth = requireAdminAuth();
  const decodedToken = await auth.verifyIdToken(idToken);
  
  // Create a custom token session (or use Firebase session cookie)
  // For now, we'll store the ID token in a cookie (in production, use Firebase session cookies)
  const expiresIn = SESSION_MAX_AGE * 1000; // Convert to milliseconds
  
  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * Get the current session (user ID from cookie)
 */
export async function getSession(): Promise<{ userId: string; email: string } | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionToken) {
      return null;
    }

    // Verify the token
    const auth = requireAdminAuth();
    const decodedToken = await auth.verifyIdToken(sessionToken);
    
    return {
      userId: decodedToken.uid,
      email: decodedToken.email || "",
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Delete the session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verify ID token and return user info
 */
export async function verifyIdToken(idToken: string): Promise<DecodedIdToken> {
  const auth = requireAdminAuth();
  return await auth.verifyIdToken(idToken);
}

