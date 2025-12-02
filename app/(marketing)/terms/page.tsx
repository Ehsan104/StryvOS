import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service | Stryvos",
  description: "Terms of service for Stryvos gym management software",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-16">
      <h1 className="text-4xl font-heading font-bold mb-8">Terms of Service</h1>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Last Updated: {new Date().getFullYear()}</h2>
            <p className="text-muted-foreground">
              Please read these Terms of Service carefully before using Stryvos.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Acceptance of Terms</h3>
            <p className="text-muted-foreground">
              By accessing or using Stryvos, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Use License</h3>
            <p className="text-muted-foreground">
              Permission is granted to use Stryvos for your gym management needs. This license does not include the right to resell, redistribute, or reverse engineer the software.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Payment Terms</h3>
            <p className="text-muted-foreground">
              Subscription fees are billed monthly or annually in advance. All fees are non-refundable except as required by law. Stripe processing fees apply to all transactions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Account Responsibility</h3>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Service Availability</h3>
            <p className="text-muted-foreground">
              We strive to maintain high availability but do not guarantee uninterrupted access. We reserve the right to modify or discontinue the service at any time.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Limitation of Liability</h3>
            <p className="text-muted-foreground">
              Stryvos is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="text-muted-foreground">
              If you have questions about these Terms, please contact us at{" "}
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

