import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Firebase Admin SDK configuration
// These values come from your .env.local file
// Get them from: Firebase Console → Project Settings → Service accounts → Generate new private key
// Note: If your organization restricts service account key creation, you can use Application Default Credentials
// or skip Admin SDK for now (some features will be limited)

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

if (getApps().length === 0) {
  // Check for required environment variables
  const hasAdminCredentials = 
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (hasAdminCredentials) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
      });

      // Initialize Admin services
      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
    } catch (error) {
      console.warn("Failed to initialize Firebase Admin SDK:", error);
      console.warn("Admin SDK features will be disabled. Some server-side operations may not work.");
    }
  } else {
    // Try Application Default Credentials (ADC) as fallback
    // This works if you've run: gcloud auth application-default login
    try {
      console.log("Attempting to use Application Default Credentials...");
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stryvos-001",
        // No credential specified - will use ADC if available
      });

      // Initialize Admin services
      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
      console.log("✅ Firebase Admin SDK initialized using Application Default Credentials");
    } catch (error) {
      console.warn(
        "Firebase Admin SDK credentials are missing and ADC is not available.\n" +
        "Admin SDK features will be disabled. Some server-side operations may not work.\n" +
        "Options:\n" +
        "1. Add FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY to .env.local\n" +
        "2. Run: gcloud auth application-default login (if you have Google Cloud SDK installed)\n" +
        "3. Request service account key creation permission from your organization admin"
      );
    }
  }
} else {
  adminApp = getApps()[0];
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
}

// Export with null checks - code using these should check for null
export { adminAuth, adminDb };
export default adminApp;

