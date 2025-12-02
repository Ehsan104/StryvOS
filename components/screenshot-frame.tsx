import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ScreenshotFrameProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function ScreenshotFrame({ children, title, className }: ScreenshotFrameProps) {
  return (
    <div className={cn("relative", className)}>
      <Card className="border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="relative">
          {title && (
            <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium">
              {title}
            </div>
          )}
          <div className="relative aspect-video bg-gradient-to-br from-card to-card/50 flex items-center justify-center">
            {children}
          </div>
        </div>
      </Card>
      <div className="absolute inset-0 border border-primary/20 rounded-lg pointer-events-none" />
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-lg blur-xl opacity-50 pointer-events-none" />
    </div>
  );
}

