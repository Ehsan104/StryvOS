import Link from "next/link";

const footerLinks = {
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "#contact", label: "Contact" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">Stryvos</h3>
            <p className="text-sm text-muted-foreground">
              Every small gym can run like a big gym—without enterprise pricing or bloat.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              <a
                href="mailto:info@stryvos.org"
                className="hover:text-primary transition-colors"
              >
                info@stryvos.org
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Stryvos. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

