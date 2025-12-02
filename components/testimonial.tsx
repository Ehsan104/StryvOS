import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  quote: string;
  author: string;
  gymType: string;
  location: string;
  className?: string;
}

export function Testimonial({
  quote,
  author,
  gymType,
  location,
  className,
}: TestimonialProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="pt-6">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
          ))}
        </div>
        <p className="text-muted-foreground mb-4 italic">&ldquo;{quote}&rdquo;</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">
            {gymType} • {location}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

