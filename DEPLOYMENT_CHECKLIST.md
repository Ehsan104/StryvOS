# Deployment Checklist for stryvos.org

## Pre-Deployment Checklist

### 1. Environment Variables (Vercel)

Make sure all these are set in your Vercel project settings:

#### Required for Production:
```env
# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_TO=info@stryvos.org
NEXT_PUBLIC_BASE_URL=https://stryvos.org

# Firebase Client SDK (Public - safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Firebase Admin SDK (Private - keep secret!)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Firebase Configuration

#### Authorized Domains
1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", make sure these are added:
   - `stryvos.org`
   - `www.stryvos.org`
   - `*.vercel.app` (for preview deployments)

#### Firestore Security Rules
1. Go to Firebase Console → Firestore Database → Rules
2. Deploy the rules from `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```
   Or copy/paste the rules manually in the Firebase Console

### 3. Domain Configuration (Vercel)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add `stryvos.org` and `www.stryvos.org`
3. Configure DNS records as instructed by Vercel
4. Enable SSL (automatic with Vercel)

## User Flow Verification

### Landing Page → Sign In Flow

✅ **Landing Page (stryvos.org)**
- Header has "Sign In" button → Links to `/signin`
- Hero section has "Sign in here" link → Links to `/signin`
- Footer has "Sign In" link → Links to `/signin`
- Contact form has "Sign in here" link → Links to `/signin`

✅ **Sign In Page (`/signin`)**
- Works for both admins and gym owners
- After sign-in, redirects to `/app`
- `/app` automatically detects user type:
  - **Admin** → Redirects to `/admin`
  - **Gym Owner** → Redirects to `/app/[gymId]/dashboard`

✅ **Admin Flow**
- Admin signs in → `/admin` dashboard
- Can create gym owners at `/admin/create-gym-owner`
- Can view all gyms

✅ **Gym Owner Flow**
- Gym owner signs in → `/app/[gymId]/dashboard`
- Can access their gym dashboard
- Sidebar navigation works

## Post-Deployment Testing

### Test Checklist

1. **Landing Page**
   - [ ] Visit `https://stryvos.org`
   - [ ] Click "Sign In" in header → Should go to `/signin`
   - [ ] Click "Sign in here" in hero → Should go to `/signin`
   - [ ] Click "Sign In" in footer → Should go to `/signin`

2. **Sign In**
   - [ ] Visit `https://stryvos.org/signin`
   - [ ] Sign in as admin → Should redirect to `/admin`
   - [ ] Sign in as gym owner → Should redirect to `/app/[gymId]/dashboard`

3. **Admin Dashboard**
   - [ ] Can see all gyms
   - [ ] Can create new gym owner
   - [ ] New gym owner can sign in immediately

4. **Gym Owner Dashboard**
   - [ ] Can access dashboard
   - [ ] Sidebar navigation works
   - [ ] Can see gym information

5. **Protected Routes**
   - [ ] Visiting `/admin` without auth → Redirects to `/signin`
   - [ ] Visiting `/app` without auth → Redirects to `/signin`
   - [ ] Visiting `/app/[gymId]/dashboard` without auth → Redirects to `/signin`

6. **Contact Form**
   - [ ] Submit contact form → Should send email
   - [ ] Check email inbox for submission

## Common Issues & Fixes

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Fix:** Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is set correctly in Vercel

### Issue: "Firebase Admin SDK is not configured"
**Fix:** Check that all three Admin SDK variables are set in Vercel:
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

### Issue: Redirects not working
**Fix:** 
- Check that `NEXT_PUBLIC_BASE_URL` is set to `https://stryvos.org`
- Clear browser cache
- Check Vercel deployment logs

### Issue: Session cookies not persisting
**Fix:**
- Check that cookies are set with `secure: true` in production
- Verify domain is correct
- Check browser console for cookie errors

## Deployment Steps

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel will automatically deploy when you push to main
   - Or manually trigger deployment in Vercel dashboard

3. **Verify Deployment**
   - Check Vercel deployment logs
   - Visit `https://stryvos.org`
   - Run through the test checklist above

4. **Monitor**
   - Check Vercel Analytics
   - Monitor Firebase Console for errors
   - Check email service (Resend) for contact form submissions

## Production URLs

- **Landing Page:** `https://stryvos.org`
- **Sign In:** `https://stryvos.org/signin`
- **Admin Dashboard:** `https://stryvos.org/admin` (requires admin login)
- **Gym Dashboard:** `https://stryvos.org/app/[gymId]/dashboard` (requires gym owner login)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Check Firebase Console → Authentication → Users (verify accounts exist)
4. Check Firebase Console → Firestore Database (verify data exists)
