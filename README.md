# Stryvos Marketing Site

Production-grade marketing site for Stryvos, a gym management software for sub-200 member gyms.

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Animations**: framer-motion (respects `prefers-reduced-motion`)
- **Fonts**: Inter (body), Sora (headings) via next/font
- **Email**: Resend API
- **Validation**: Zod
- **Forms**: react-hook-form

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
cp .env.example .env.local
```

Edit `.env.local` and add your values:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_TO=info@stryvos.org
NEXT_PUBLIC_BASE_URL=https://stryvos.com
```

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

### Optional

- `NEXT_PUBLIC_BASE_URL`: Base URL for the site (used in sitemap and metadata, default: `https://stryvos.com`)

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

- ✅ Responsive design (mobile-first)
- ✅ Dark theme with brand colors
- ✅ Smooth animations (respects `prefers-reduced-motion`)
- ✅ Contact form with honeypot & rate limiting
- ✅ SEO optimized (meta tags, OG images, JSON-LD schema)
- ✅ Accessibility (WCAG AA compliant)
- ✅ Performance optimized (targets Lighthouse ≥95)
- ✅ Type-safe with TypeScript
- ✅ Form validation with Zod
- ✅ Email notifications via Resend

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
