/**
 * Script to create your first admin account
 * 
 * Usage:
 * 1. Update the email, password, and name below
 * 2. Run: npx tsx scripts/setup-admin.ts
 * 
 * This will:
 * - Create a Firebase Auth user
 * - Create a user document in Firestore with isAdmin: true
 */

// Load environment variables from .env.local FIRST (before any other imports)
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file - MUST be before importing admin module
config({ path: resolve(process.cwd(), ".env.local") });

// Now import Firebase Admin and initialize directly (not using shared module)
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { collections } from "../lib/firestore/collections";
import { Timestamp } from "firebase-admin/firestore";

async function setupAdmin() {
  // ⚠️ UPDATE THESE VALUES BEFORE RUNNING
  const email = process.env.ADMIN_EMAIL || "your-email@example.com";
  const password = process.env.ADMIN_PASSWORD || "your-secure-password";
  const name = process.env.ADMIN_NAME || "Admin";
  
  if (email === "your-email@example.com" || password === "your-secure-password") {
    console.error("❌ Please set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME environment variables");
    console.error("   Or update the script with your credentials before running");
    process.exit(1);
  }

  // Credentials are set, ready to proceed

  try {
    console.log("🔐 Creating admin account...");

    // Initialize Firebase Admin SDK directly in this script
    const hasAdminCredentials = 
      process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!hasAdminCredentials) {
      console.error("❌ Firebase Admin SDK credentials are missing!");
      console.error("   Please add FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY to .env.local");
      process.exit(1);
    }

    // Initialize Firebase Admin App
    let adminApp;
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      adminApp = getApps()[0];
    }

    const adminAuth = getAuth(adminApp);
    const adminDb = getFirestore(adminApp);

    // 1. Create or get Firebase Auth user
    console.log("   Checking for existing Firebase Auth user...");
    let userRecord;
    try {
      // Try to get existing user by email
      userRecord = await adminAuth.getUserByEmail(email);
      console.log(`   ✅ Found existing Auth user: ${userRecord.uid}`);
    } catch (error: any) {
      if (error?.code === "auth/user-not-found") {
        // User doesn't exist, create it
        console.log("   Creating new Firebase Auth user...");
        userRecord = await adminAuth.createUser({
          email,
          password,
          displayName: name,
        });
        console.log(`   ✅ Auth user created: ${userRecord.uid}`);
      } else {
        throw error;
      }
    }

    const userId = userRecord.uid;

    // 2. Create user document with isAdmin flag
    console.log("   Creating Firestore user document...");
    await adminDb.collection("users").doc(userId).set({
      email,
      name,
      createdAt: Timestamp.now(),
      isAdmin: true, // This is what makes you an admin!
    });

    console.log(`   ✅ User document created with isAdmin: true`);

    console.log("\n✅ Admin account created successfully!");
    console.log("\n📋 Account Details:");
    console.log(`   Email: ${email}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Name: ${name}`);
    console.log("\n🚀 Next Steps:");
    console.log("   1. Go to http://localhost:3000/admin/login");
    console.log("   2. Sign in with the email and password you set above");
    console.log("   3. You'll be redirected to the admin dashboard");
    console.log("   4. Click 'Create Gym Owner' to create your first gym owner account");
    console.log("\n⚠️  Remember to delete or secure this script after use!");
  } catch (error) {
    console.error("\n❌ Error creating admin account:", error);
    
    if (error instanceof Error) {
      if (error instanceof Error && error.message.includes("email-already-exists")) {
        console.error("\n   This email is already registered.");
        console.error("   You can manually set isAdmin: true in Firestore:");
        console.error("   1. Go to Firebase Console → Firestore Database");
        console.error("   2. Find your user ID from Authentication → Users");
        console.error("   3. Navigate to users/{yourUserId}");
        console.error("   4. Add or update the 'isAdmin' field to 'true' (boolean)");
      } else if (error.message.includes("Firebase Admin SDK is not configured")) {
        console.error("\n   Please configure Firebase Admin SDK first.");
        console.error("   See ADMIN_SETUP.md or FIREBASE_PERSONAL_SETUP.md");
      } else {
        console.error(`\n   ${error.message}`);
      }
    }
    
    process.exit(1);
  }
}

// Run the script
setupAdmin();
