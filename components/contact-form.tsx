"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  
  const memberCount = watch("memberCount");

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check
    if (data.company_website && data.company_website.length > 0) {
      // Bot detected, silently fail
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully! We'll be in touch soon.");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again or email us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Your name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gymName">Gym Name *</Label>
          <Input
            id="gymName"
            {...register("gymName")}
            placeholder="Your gym name"
            disabled={isSubmitting}
          />
          {errors.gymName && (
            <p className="text-sm text-destructive">{errors.gymName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="your@email.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="memberCount">Member Count *</Label>
        <Select
          value={memberCount}
          onValueChange={(value) =>
            setValue("memberCount", value as ContactFormData["memberCount"], { shouldValidate: true })
          }
          disabled={isSubmitting}
        >
          <SelectTrigger id="memberCount">
            <SelectValue placeholder="Select member count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-50">1-50 members</SelectItem>
            <SelectItem value="51-100">51-100 members</SelectItem>
            <SelectItem value="101-150">101-150 members</SelectItem>
            <SelectItem value="151-200">151-200 members</SelectItem>
            <SelectItem value="200+">200+ members</SelectItem>
          </SelectContent>
        </Select>
        {errors.memberCount && (
          <p className="text-sm text-destructive">{errors.memberCount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Tell us about your gym..."
          rows={5}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Honeypot field */}
      <input
        type="text"
        {...register("company_website")}
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Or email us directly at{" "}
        <a
          href="mailto:info@stryvos.org"
          className="text-primary hover:underline"
        >
          info@stryvos.org
        </a>
      </p>
    </form>
  );
}

