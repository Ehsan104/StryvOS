"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGymOwnerSchema, type CreateGymOwnerData } from "@/lib/validators/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateGymOwnerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CreateGymOwnerData>({
    resolver: zodResolver(createGymOwnerSchema),
  });

  const onSubmit = async (data: CreateGymOwnerData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/create-gym-owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create gym owner");
      }

      toast.success("Gym owner created successfully!");
      
      // Redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Create gym owner error:", error);
      
      let errorMessage = "Failed to create gym owner. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Gym Owner</CardTitle>
            <CardDescription>
              Create a new gym owner account and their gym in one step
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Owner Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...form.register("name")}
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="owner@gym.com"
                    {...form.register("email")}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Minimum 8 characters. You'll share this with the gym owner.
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Gym Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="gymName">Gym Name *</Label>
                  <Input
                    id="gymName"
                    placeholder="FitZone Gym"
                    {...form.register("gymName")}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.gymName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.gymName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gymAddress">Address *</Label>
                  <Input
                    id="gymAddress"
                    placeholder="123 Main St, City, State 12345"
                    {...form.register("gymAddress")}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.gymAddress && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.gymAddress.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gymPhone">Phone Number *</Label>
                  <Input
                    id="gymPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...form.register("gymPhone")}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.gymPhone && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.gymPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Gym Owner"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
