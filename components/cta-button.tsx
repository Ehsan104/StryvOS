import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: () => void;
  asChild?: boolean;
}

export function CTAButton({
  children,
  variant = "primary",
  size = "lg",
  className,
  onClick,
  asChild,
}: CTAButtonProps) {
  const variantMap = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  };

  return (
    <Button
      size={size}
      className={cn(
        "font-semibold transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variantMap[variant],
        className
      )}
      onClick={onClick}
      asChild={asChild}
    >
      {children}
    </Button>
  );
}

