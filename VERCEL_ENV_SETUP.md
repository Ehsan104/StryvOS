# Vercel Environment Variables Setup

## Required Environment Variables

Copy these from your `.env.local` file to Vercel Dashboard → Settings → Environment Variables

### Firebase Client SDK (Required for sign-in to work)

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Firebase Admin SDK (Required for sign-in and admin features)

**⚠️ CRITICAL:** These are required for sign-in to work! Without these, you'll get "Failed to create session" error.

```
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Important:** 
- For `FIREBASE_ADMIN_PRIVATE_KEY`, include the entire key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines, with `\n` for newlines.
- Copy the private key EXACTLY as it appears in your service account JSON file
- Make sure there are no extra spaces or quotes around the value

### Other Variables (Optional but recommended)

```
RESEND_API_KEY=your-resend-api-key
CONTACT_TO=info@stryvos.org
NEXT_PUBLIC_BASE_URL=https://stryvos.org
```

## Steps to Add in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (StryvOS)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. For each variable:
   - Enter the **Name** (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Enter the **Value** (copy from your `.env.local`)
   - Select **Environment**: Production, Preview, and Development (or just Production)
   - Click **Save**
6. After adding all variables, trigger a new deployment:
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Click **Redeploy**

## Verify Setup

### Step 1: Check Environment Variables
Visit `https://stryvos.org/debug/env` to see which variables are set/missing.

### Step 2: Test Sign In
After redeploying, visit:
- `https://stryvos.org/signin` - Should no longer show "Firebase Not Configured"
- You should be able to sign in with your admin credentials

## Troubleshooting

**Still seeing "Firebase Not Configured"?**
- Make sure all `NEXT_PUBLIC_*` variables are added
- Check that variable names match exactly (case-sensitive)
- Verify the values are correct (no extra spaces)
- Make sure you selected the correct environment (Production)
- Trigger a new deployment after adding variables
