# Firebase Setup Guide for StrYvOS

This guide will walk you through setting up Firebase and getting all the API keys and credentials you need.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `stryvos` (or your preferred name)
4. Click **"Continue"**
5. **Google Analytics** (optional):
   - You can enable it or skip it for now
   - If you enable it, select or create an Analytics account
6. Click **"Create project"**
7. Wait for project creation (30-60 seconds)
8. Click **"Continue"**

## Step 2: Get Client SDK Configuration (for Frontend)

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Register app:
   - App nickname: `Stryvos Web` (or any name)
   - **Do NOT** check "Also set up Firebase Hosting" (we're using Vercel)
   - Click **"Register app"**
6. You'll see your Firebase configuration object. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

7. **Copy these values** - you'll need them for your `.env.local` file

## Step 3: Enable Authentication (Email/Password)

1. In Firebase Console, go to **"Authentication"** in the left sidebar
2. Click **"Get started"** (if first time)
3. Click on **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Leave **"Email link (passwordless sign-in)"** OFF for now
7. Click **"Save"**

## Step 4: Create Firestore Database

1. In Firebase Console, go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules later)
   - ⚠️ **Note:** We'll replace these with proper rules, but this gets you started
4. Select a **location** for your database (choose closest to your users)
   - Example: `us-central` or `us-east1`
5. Click **"Enable"**
6. Wait for database creation (30-60 seconds)

## Step 5: Get Admin SDK Credentials (for Backend/Server)

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Go to **"Service accounts"** tab
4. Click **"Generate new private key"** button
5. A dialog will appear - click **"Generate key"**
6. A JSON file will download automatically - **SAVE THIS FILE SECURELY**
   - ⚠️ **IMPORTANT:** This file contains sensitive credentials. Never commit it to Git!
   - The file looks like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

7. You'll need these values from the JSON file:
   - `project_id`
   - `client_email`
   - `private_key` (the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

## Step 6: Configure Authorized Domains

1. In Firebase Console, go to **"Authentication"** → **"Settings"** tab
2. Scroll to **"Authorized domains"**
3. Add your domains:
   - `localhost` (should already be there)
   - `stryvos.org` (your production domain)
   - `your-vercel-app.vercel.app` (if you have a Vercel preview domain)
4. Click **"Add domain"** for each new domain

## Step 7: Create Your `.env.local` File

Create a file named `.env.local` in your project root (same folder as `package.json`).

Add these variables with your actual values:

```env
# Existing (keep these)
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_TO=info@stryvos.org
NEXT_PUBLIC_BASE_URL=https://stryvos.org

# Firebase Client SDK (from Step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Firebase Admin SDK (from Step 5 - JSON file)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Stripe (for Milestone 2 - add these later)
# STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Important Notes for `.env.local`:

1. **FIREBASE_ADMIN_PRIVATE_KEY**: 
   - Copy the entire private key from the JSON file
   - Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
   - Replace actual newlines with `\n` (or keep it as a multi-line string in quotes)
   - The key should be in quotes because it contains special characters

2. **Never commit `.env.local` to Git!**
   - It should already be in `.gitignore`
   - We'll create a `.env.local.example` template file instead

## Step 8: Verify Your Setup

After I implement the Firebase code, you can test:

1. Run `npm run dev`
2. Try to sign in at `/signin`
3. Check browser console for any Firebase errors
4. Check server logs for any Admin SDK errors

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Make sure `localhost` and your domain are listed

### "Firebase Admin: Error initializing"
- Check that `FIREBASE_ADMIN_PRIVATE_KEY` includes the full key with BEGIN/END lines
- Make sure the key is properly escaped (use quotes)
- Verify `FIREBASE_ADMIN_CLIENT_EMAIL` matches the JSON file

### "Permission denied" in Firestore
- Check that Firestore is created
- We'll add security rules later, but for now test mode should allow reads/writes

## Quick Reference: Where to Find Each Value

| Variable | Where to Find It |
|----------|------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Your apps → Web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Same as above |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Same as above |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Same as above |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Same as above |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Same as above |
| `FIREBASE_ADMIN_PROJECT_ID` | Service account JSON file → `project_id` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account JSON file → `client_email` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account JSON file → `private_key` |

## Next Steps

Once you have:
- ✅ Firebase project created
- ✅ Authentication enabled (Email/Password)
- ✅ Firestore database created
- ✅ Client SDK config copied
- ✅ Admin SDK credentials downloaded
- ✅ `.env.local` file created with all variables

Let me know and I'll:
1. Fix the contact form issue
2. Start implementing Milestone 1
3. Set up all the Firebase integration code

---

**Need Help?** If you get stuck on any step, let me know which step and what error you're seeing!


