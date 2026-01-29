# Admin Setup Guide

## Overview

The StrYvOS application now uses an admin-controlled model where only admins can create gym owner accounts. Gym owners can only sign in (no sign-up or gym creation).

## Setting Up Your First Admin Account

Since admins are identified by the `isAdmin: true` flag in their user document, you need to manually set this up for your first admin accounts.

### Option 1: Using Firebase Console (Recommended)

1. **Create your admin account via Firebase Console:**
   - Go to Firebase Console → Authentication → Users
   - Click "Add user"
   - Enter your email and a temporary password
   - Click "Add user"

2. **Set the `isAdmin` flag in Firestore:**
   - Go to Firebase Console → Firestore Database
   - Navigate to `users/{userId}` (find your user ID from Authentication)
   - If the document doesn't exist, create it with:
     ```json
     {
       "email": "your-email@example.com",
       "name": "Your Name",
       "createdAt": [current timestamp],
       "isAdmin": true
     }
     ```
   - If the document exists, add/update the `isAdmin` field to `true`

3. **Sign in at `/admin/login`** with your credentials

### Option 2: Using Firebase Admin SDK Script

Create a temporary script to set up your admin account:

```typescript
// scripts/setup-admin.ts
import { adminAuth, adminDb } from "../lib/firebase/admin";
import { collections } from "../lib/firestore/collections";
import { Timestamp } from "firebase-admin/firestore";

async function setupAdmin() {
  const email = "your-email@example.com";
  const password = "your-secure-password";
  const name = "Your Name";

  // Create Firebase Auth user
  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: name,
  });

  // Create user document with isAdmin flag
  await adminDb.doc(collections.user(userRecord.uid)).set({
    email,
    name,
    createdAt: Timestamp.now(),
    isAdmin: true,
  });

  console.log(`Admin account created: ${email} (${userRecord.uid})`);
}

setupAdmin();
```

## Admin Features

Once you're set up as an admin, you can:

1. **Access Admin Dashboard** at `/admin`
   - View all gyms in the system
   - See gym owner information

2. **Create Gym Owners** at `/admin/create-gym-owner`
   - Create both the gym owner account (email/password) and their gym in one step
   - Fill in:
     - Owner name
     - Owner email
     - Owner password (you'll share this with them)
     - Gym name
     - Gym address
     - Gym phone number

3. **Hand Off Credentials**
   - After creating a gym owner, share the email and password with them
   - They can sign in at `/signin` and will be automatically redirected to their gym dashboard

## Security Notes

- Only users with `isAdmin: true` in their user document can access `/admin` routes
- Admin routes are protected by middleware and server-side checks
- Gym owners cannot create accounts or gyms themselves
- Gym owners are automatically redirected to their gym dashboard after sign-in

## Troubleshooting

**"Unauthorized: Admin access required"**
- Make sure your user document in Firestore has `isAdmin: true`
- Check that you're signed in with the correct account

**"User is not an admin"**
- Verify the `isAdmin` field exists and is set to `true` (not `"true"` as a string)
- Make sure you're checking the correct user ID
