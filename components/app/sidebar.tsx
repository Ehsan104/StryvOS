"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  UserCog,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  gymId: string;
  gymName: string;
}

const navigation = [
  {
    name: "Dashboard",
    href: (gymId: string) => `/app/${gymId}/dashboard`,
    icon: LayoutDashboard,
    active: true,
  },
  {
    name: "Members",
    href: (gymId: string) => `/app/${gymId}/members`,
    icon: Users,
    active: false, // Disabled for Milestone 1
  },
  {
    name: "Classes",
    href: (gymId: string) => `/app/${gymId}/classes`,
    icon: Calendar,
    active: false, // Disabled for Milestone 1
  },
  {
    name: "Billing",
    href: (gymId: string) => `/app/${gymId}/billing`,
    icon: CreditCard,
    active: false, // Disabled for Milestone 1
  },
  {
    name: "Analytics",
    href: (gymId: string) => `/app/${gymId}/analytics`,
    icon: BarChart3,
    active: false, // Disabled for Milestone 1
  },
  {
    name: "Staff",
    href: (gymId: string) => `/app/${gymId}/staff`,
    icon: UserCog,
    active: false, // Disabled for Milestone 1
  },
];

export function Sidebar({ gymId, gymName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Stryvos
            </span>
          </Link>
        </div>

        <div className="px-4 mb-4">
          <h2 className="text-sm font-semibold text-sidebar-foreground truncate">
            {gymName}
          </h2>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const href = item.href(gymId);
            const isActive = pathname === href || pathname?.startsWith(href + "/");
            const Icon = item.icon;

            if (!item.active) {
              return (
                <div
                  key={item.name}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground cursor-not-allowed opacity-50"
                  )}
                  title="Coming soon"
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
            asChild
          >
            <Link href="/signout">
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}


