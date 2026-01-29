# Stryvos

Gym management software for sub-200 member gyms. Built with Next.js, Firebase, and Stripe.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Animations**: framer-motion (respects `prefers-reduced-motion`)
- **Fonts**: Inter (body), Sora (headings) via next/font
- **Email**: Resend API
- **Validation**: Zod
- **Forms**: react-hook-form
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Payments**: Stripe (Milestone 2)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, yarn, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stryvos
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:
```bash
# Create .env.local file (see FIREBASE_SETUP_GUIDE.md for detailed instructions)
```

Edit `.env.local` and add your values:
```env
# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_TO=info@stryvos.org
NEXT_PUBLIC_BASE_URL=https://stryvos.org

# Firebase Client SDK (get from Firebase Console → Project Settings → Your apps → Web app)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Firebase Admin SDK (get from Firebase Console → Project Settings → Service accounts → Generate new private key)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Stripe (for Milestone 2 - optional for now)
# STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**📖 See [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) for detailed Firebase setup instructions.**

### Development

Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

### Required

- `RESEND_API_KEY`: Your Resend API key (get from [resend.com/api-keys](https://resend.com/api-keys))
- `CONTACT_TO`: Email address where contact form submissions are sent (default: `info@stryvos.org`)
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase Auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID
- `FIREBASE_ADMIN_PROJECT_ID`: Firebase Admin project ID
- `FIREBASE_ADMIN_CLIENT_EMAIL`: Firebase Admin client email
- `FIREBASE_ADMIN_PRIVATE_KEY`: Firebase Admin private key

### Optional

- `NEXT_PUBLIC_BASE_URL`: Base URL for the site (used in sitemap and metadata, default: `https://stryvos.org`)
- `STRIPE_SECRET_KEY`: Stripe secret key (for Milestone 2)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (for Milestone 2)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret (for Milestone 2)

## Email Configuration

### Using Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add it to your `.env.local` as `RESEND_API_KEY`
4. Verify your domain in Resend dashboard
5. Update the `from` email in `app/api/contact/route.ts` to match your verified domain

### Switching to Nodemailer (Fallback)

If you prefer to use Nodemailer instead of Resend:

1. Install Nodemailer:
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

2. Update `app/api/contact/route.ts`:

```typescript
import nodemailer from "nodemailer";

// Replace Resend code with:
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

await transporter.sendMail({
  from: process.env.SMTP_FROM || "no-reply@stryvos.com",
  to: contactTo,
  subject: `New Stryvos Lead — ${data.gymName}`,
  html: `...`, // same HTML as before
});
```

3. Add to `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=no-reply@stryvos.com
```

## Project Structure

```
stryvos/
├── app/
│   ├── (marketing)/          # Marketing pages with header/footer
│   │   ├── layout.tsx        # Marketing layout
│   │   └── page.tsx          # Home page
│   ├── api/
│   │   └── contact/
│   │       └── route.ts      # Contact form API endpoint
│   ├── privacy/
│   │   └── page.tsx          # Privacy policy
│   ├── terms/
│   │   └── page.tsx          # Terms of service
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles & theme
│   ├── opengraph-image.tsx   # Dynamic OG image
│   └── sitemap.ts            # Sitemap generation
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── header.tsx            # Site header/navbar
│   ├── footer.tsx            # Site footer
│   ├── section.tsx           # Section wrapper component
│   ├── cta-button.tsx        # CTA button component
│   ├── feature-card.tsx      # Feature card component
│   ├── price-card.tsx        # Pricing card component
│   ├── testimonial.tsx       # Testimonial component
│   ├── screenshot-frame.tsx  # Screenshot placeholder frame
│   └── contact-form.tsx      # Contact form component
├── lib/
│   ├── utils.ts              # Utility functions
│   └── validations.ts        # Zod schemas
└── public/
    └── robots.txt            # Robots.txt
```

## Features

### Marketing Site
- ✅ Responsive design (mobile-first)
- ✅ Dark theme with brand colors
- ✅ Smooth animations (respects `prefers-reduced-motion`)
- ✅ Contact form with honeypot & rate limiting
- ✅ SEO optimized (meta tags, OG images, JSON-LD schema)
- ✅ Accessibility (WCAG AA compliant)
- ✅ Performance optimized (targets Lighthouse ≥95)

### Web App (Milestone 1)
- ✅ Firebase Authentication (email/password)
- ✅ Multi-tenant gym management
- ✅ Role-Based Access Control (RBAC)
- ✅ Owner onboarding flow
- ✅ Protected routes with middleware
- ✅ App shell with sidebar navigation
- ✅ Firestore security rules
- ✅ Session management with cookies

### Coming in Milestone 2
- 🔜 Member management (CRUD)
- 🔜 Membership plans (CRUD)
- 🔜 Stripe subscription integration
- 🔜 QR code generation for members
- 🔜 Member portal

## Brand Colors

- Background: `#0B0B0C` (near-black)
- Foreground: `#F7F7F7` (off-white)
- Muted: `#A1A1AA` (zinc-ish)
- Accent: `#7CF67C` (Electric Lime)
- Card: `#111213` (dark gray)

## Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `RESEND_API_KEY`
   - `CONTACT_TO`
   - `NEXT_PUBLIC_BASE_URL`
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Generate static pages where possible
- Set up SSL
- Configure CDN

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted (Node.js server)

## Performance Targets

- Lighthouse Performance: ≥95
- Lighthouse Accessibility: ≥95
- Lighthouse SEO: ≥95
- Lighthouse Best Practices: ≥95

## Accessibility

- Semantic HTML (header, main, footer, nav)
- Proper heading hierarchy (H1 → H3)
- Labeled form inputs
- Visible focus states
- Color contrast meets WCAG AA
- Reduced motion support
- Keyboard navigation

## License

Copyright © 2024 Stryvos. All rights reserved.

## Support

For questions or issues, contact: info@stryvos.org
