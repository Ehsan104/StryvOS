# StrYvOS Implementation Plan

## Current State Analysis

✅ **Existing Setup:**
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui components
- Zod validation
- Resend email service (contact form)
- Landing page deployed at stryvos.org

⚠️ **Issues to Fix:**
- Contact form email errors (likely missing `RESEND_API_KEY` env var)

---

## Milestone 1: Foundation

### Phase 1: Fix Contact Form Issue
**Problem:** Email form giving errors
**Solution:**
- Check if `RESEND_API_KEY` is set in environment
- Add better error handling and user feedback
- Document required env vars clearly

### Phase 2: Firebase Setup
**Dependencies to Install:**
```bash
npm install firebase firebase-admin
npm install -D @types/node
```

**Files to Create:**
1. `lib/firebase/client.ts` - Firebase client SDK initialization
2. `lib/firebase/admin.ts` - Firebase Admin SDK initialization
3. `.env.local.example` - Template for environment variables

**Environment Variables Needed:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### Phase 3: Authentication
**Files to Create:**
1. `app/signin/page.tsx` - Sign in page (email/password)
2. `app/signout/page.tsx` - Sign out handler (optional)
3. `lib/auth/session.ts` - Session management helpers
4. `app/api/auth/session/route.ts` - Session cookie API
5. `app/api/auth/logout/route.ts` - Logout API
6. `middleware.ts` - Route protection middleware

**Auth Flow:**
- Client-side: Firebase Auth for sign in
- Server-side: Session cookies (HttpOnly) for protection
- Middleware validates session and loads user context

### Phase 4: RBAC Framework
**Files to Create:**
1. `lib/rbac/permissions.ts` - Permission checking utilities
2. `lib/rbac/types.ts` - Type definitions for roles/permissions
3. `lib/validators/auth.ts` - Auth-related Zod schemas

**RBAC Structure:**
- Roles: `OWNER`, `MANAGER`, `EMPLOYEE`, `MEMBER`
- Permission helpers:
  - `getUserGymRole(gymId, userId)`
  - `requireGymMembership(gymId, userId)`
  - `requirePermission({gymId, userId, permissionKey})`

### Phase 5: Firestore Data Models
**Collections Structure:**
```
users/{userId}
  - email, name?, createdAt

gyms/{gymId}
  - name, address?, phone?, createdAt, ownerUserId

gyms/{gymId}/permissionSets/main
  - managerPermissions (map), employeePermissions (map)

gyms/{gymId}/staff/{userId}
  - role: "OWNER" | "MANAGER" | "EMPLOYEE"
  - createdAt, status

gyms/{gymId}/invites/{inviteId}
  - (stub for now)
```

**Files to Create:**
1. `lib/firestore/types.ts` - TypeScript types for Firestore documents
2. `lib/firestore/collections.ts` - Collection path helpers

### Phase 6: Firestore Security Rules
**File to Create:**
1. `firestore.rules` - Security rules file

**Rules Baseline:**
- Deny all by default
- Authenticated users can read/write their own `users/{userId}`
- Staff can read gym and staff docs for gyms they belong to
- Only OWNER can write `permissionSets`
- No client writes to sensitive collections

### Phase 7: Onboarding Flow
**Files to Create:**
1. `app/app/onboarding/page.tsx` - Create gym form
2. `app/api/gyms/create/route.ts` - Create gym API endpoint

**Flow:**
- First-time owner login → redirect to `/app/onboarding`
- Form: name, address, phone
- On submit: create gym doc, staff doc (OWNER), permissionSets doc
- Redirect to `/app/[gymId]/dashboard`

### Phase 8: App Shell & Routing
**Files to Create:**
1. `app/app/[gymId]/(shell)/layout.tsx` - Sidebar shell layout
2. `app/app/[gymId]/dashboard/page.tsx` - Dashboard placeholder
3. `app/app/select-gym/page.tsx` - Gym selection (if multiple gyms)

**Sidebar Navigation:**
- Dashboard (active)
- Members (disabled)
- Classes (disabled)
- Billing (disabled)
- Analytics (disabled)
- Staff (disabled for now, will enable in Milestone 2)

### Phase 9: Multi-tenant Routing Protection
**Middleware Logic:**
- Check authentication
- Load user's gym memberships
- Validate access to requested gym
- Redirect to `/signin` if not authenticated
- Redirect to `/app/select-gym` if multiple gyms and no gymId specified
- Redirect to `/app/onboarding` if no gyms and user is owner

---

## Milestone 2: Members + Plans + Stripe

### Phase 1: Stripe Setup
**Dependencies to Install:**
```bash
npm install stripe
npm install qrcode.react  # For QR code display
npm install nanoid        # For stable QR token generation
```

**Environment Variables:**
```
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=  # For webhooks
```

**Files to Create:**
1. `lib/stripe/client.ts` - Stripe client initialization
2. `app/api/stripe/webhook/route.ts` - Stripe webhook handler
3. `app/api/stripe/create-subscription/route.ts` - Create subscription
4. `app/api/stripe/create-plan/route.ts` - Create Stripe product/price

### Phase 2: Plans CRUD
**Files to Create:**
1. `app/app/[gymId]/plans/page.tsx` - Plans list page
2. `app/app/[gymId]/plans/create/page.tsx` - Create plan page (or modal)
3. `app/app/[gymId]/plans/[planId]/edit/page.tsx` - Edit plan page
4. `app/api/plans/create/route.ts` - Create plan API
5. `app/api/plans/update/route.ts` - Update plan API
6. `app/api/plans/delete/route.ts` - Delete plan API
7. `lib/validators/plans.ts` - Plan validation schemas

**Plan Data Model:**
```
plans/{planId}
  - name, description, priceCents, billingPeriod ("monthly"|"annual")
  - active (boolean)
  - stripeProductId, stripePriceId
  - createdAt
```

**Features:**
- Table view with activate/deactivate toggle
- Create/edit modal or page
- Link to Stripe product/price

### Phase 3: Members CRUD
**Files to Create:**
1. `app/app/[gymId]/members/page.tsx` - Members list (searchable table)
2. `app/app/[gymId]/members/[memberId]/page.tsx` - Member detail page
3. `app/api/members/create/route.ts` - Create member API
4. `app/api/members/update/route.ts` - Update member API
5. `app/api/members/delete/route.ts` - Delete member API
6. `lib/validators/members.ts` - Member validation schemas

**Member Data Model:**
```
members/{memberId}
  - name, email, phone
  - status: "active" | "paused" | "cancelled"
  - qrToken (stable, generated with nanoid)
  - createdAt
  - linkedMemberIds (array)
  - lastCheckinAt (optional)
```

**Features:**
- Searchable table (name/email/phone)
- Create member form
- Member detail page with QR code display
- Stable QR token (never changes)

### Phase 4: Subscriptions
**Files to Create:**
1. `app/api/subscriptions/create/route.ts` - Create subscription (server-only)
2. `lib/firestore/subscriptions.ts` - Subscription helpers

**Subscription Data Model:**
```
subscriptions/{subscriptionId}
  - memberId, planId, status
  - stripeCustomerId, stripeSubscriptionId
  - pauseReason (optional)
  - createdAt, updatedAt
```

**Flow:**
- Create Stripe customer if needed
- Create Stripe subscription
- Store subscription doc in Firestore
- Handle webhook events (subscription.created, subscription.updated, etc.)

### Phase 5: Member Portal
**Files to Create:**
1. `app/member/page.tsx` - Member gym selection
2. `app/member/[gymId]/page.tsx` - Member dashboard (QR + status)

**Features:**
- Email lookup to find member's gyms
- Display QR code
- Show membership status
- Show active subscriptions

### Phase 6: RBAC Enforcement for Milestone 2
**Permission Keys:**
- `members.manage` - Full member CRUD (OWNER, MANAGER with toggle)
- `members.create` - Create members (OWNER, MANAGER, EMPLOYEE with toggle)
- `members.edit` - Edit members (OWNER, MANAGER, EMPLOYEE with toggle)
- `members.delete` - Delete members (OWNER, MANAGER with toggle)
- `plans.manage` - Full plan CRUD (OWNER, MANAGER with toggle)

**Update:**
- `lib/rbac/permissions.ts` - Add permission checking for member/plan operations
- All API routes check permissions before allowing mutations

### Phase 7: Firestore Security Rules Update
**Update `firestore.rules`:**
- Allow staff to read/write plans (with permission checks)
- Allow staff to read/write members (with permission checks)
- Deny client writes to subscriptions (server-only)
- Allow members to read their own member doc (for portal)

---

## What You Need to Do

### Before I Start Implementation:

1. **Firebase Project Setup:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Get Firebase config (API keys, project ID, etc.)
   - Generate Admin SDK private key (Service Account)

2. **Stripe Account Setup (for Milestone 2):**
   - Create Stripe account at https://stripe.com
   - Get API keys (test mode is fine for now)
   - Set up webhook endpoint (we'll configure this later)

3. **Environment Variables:**
   - Create `.env.local` file in project root
   - Add all Firebase variables (see Phase 2 above)
   - Add Stripe variables (for Milestone 2)
   - Keep existing `RESEND_API_KEY` and `CONTACT_TO`

4. **Domain Configuration:**
   - Configure Firebase Auth domain
   - Add authorized domains in Firebase console

### During Implementation:

- I'll create all the files and structure
- You'll need to test the auth flow
- You'll need to test the onboarding flow
- We'll iterate on any issues

### After Implementation:

- Test end-to-end flows
- Deploy to Vercel
- Configure Firebase hosting rules (if needed)
- Set up Stripe webhook URL in Stripe dashboard

---

## File Structure (After Implementation)

```
stryvos/
├── app/
│   ├── (marketing)/          # Existing landing pages
│   ├── api/
│   │   ├── auth/
│   │   │   ├── session/
│   │   │   └── logout/
│   │   ├── contact/          # Existing
│   │   ├── gyms/
│   │   │   └── create/
│   │   ├── members/
│   │   │   ├── create/
│   │   │   ├── update/
│   │   │   └── delete/
│   │   ├── plans/
│   │   │   ├── create/
│   │   │   ├── update/
│   │   │   └── delete/
│   │   └── stripe/
│   │       ├── webhook/
│   │       ├── create-subscription/
│   │       └── create-plan/
│   ├── app/
│   │   ├── [gymId]/
│   │   │   ├── (shell)/
│   │   │   │   └── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── members/
│   │   │   │   └── [memberId]/
│   │   │   └── plans/
│   │   ├── onboarding/
│   │   └── select-gym/
│   ├── member/
│   │   └── [gymId]/
│   ├── signin/
│   └── signout/
├── lib/
│   ├── firebase/
│   │   ├── client.ts
│   │   └── admin.ts
│   ├── firestore/
│   │   ├── types.ts
│   │   ├── collections.ts
│   │   └── subscriptions.ts
│   ├── auth/
│   │   └── session.ts
│   ├── rbac/
│   │   ├── permissions.ts
│   │   └── types.ts
│   ├── stripe/
│   │   └── client.ts
│   ├── validators/
│   │   ├── auth.ts
│   │   ├── plans.ts
│   │   └── members.ts
│   ├── utils.ts              # Existing
│   └── validations.ts        # Existing
├── middleware.ts
├── firestore.rules
└── .env.local.example
```

---

## Testing Checklist

### Milestone 1:
- [ ] Sign in with email/password works
- [ ] Session persists after page refresh
- [ ] Protected routes redirect to signin if not authenticated
- [ ] Owner onboarding creates gym + staff doc + permissionSets
- [ ] Dashboard loads after onboarding
- [ ] Sidebar navigation works
- [ ] Firestore rules prevent unauthorized access
- [ ] Contact form works (fixed)

### Milestone 2:
- [ ] Plans CRUD works
- [ ] Members CRUD works
- [ ] QR token is stable (doesn't change)
- [ ] Stripe subscription creation works
- [ ] Member portal shows QR code
- [ ] Permissions are enforced on all mutations
- [ ] Webhook handles Stripe events

---

## Questions for You:

1. **Email Form Issue:** What specific error are you seeing? Is it a missing env var, or an actual API error from Resend?

2. **Firebase Setup:** Do you already have a Firebase project, or should I guide you through creating one?

3. **Stripe:** Do you want to use Stripe Checkout (redirect) or Stripe Elements (embedded form) for subscription creation?

4. **Member Portal Auth:** For the member portal, should we use:
   - Simple email lookup (no auth required)
   - Firebase Auth for members (separate from staff)
   - Magic link email authentication

5. **Timeline:** Should I implement both milestones now, or do you want to test Milestone 1 first?

---

**Please review this plan and let me know:**
1. If you approve the approach
2. Answers to the questions above
3. Any changes or additions you'd like
4. When you're ready for me to start implementing

Once approved, I'll start with fixing the contact form issue, then proceed with Milestone 1, then Milestone 2.


