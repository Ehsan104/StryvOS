import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy | Stryvos",
  description: "Privacy policy for Stryvos gym management software",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-16">
      <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Last Updated: {new Date().getFullYear()}</h2>
            <p className="text-muted-foreground">
              At Stryvos, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Information We Collect</h3>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, such as when you create an account, contact us, or use our services. This may include your name, email address, gym information, and payment details.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">How We Use Your Information</h3>
            <p className="text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our services, process transactions, send you communications, and comply with legal obligations.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Data Security</h3>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Third-Party Services</h3>
            <p className="text-muted-foreground">
              We use third-party services like Stripe for payment processing. These services have their own privacy policies governing the use of your information.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:info@stryvos.org" className="text-primary hover:underline">
                info@stryvos.org
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

