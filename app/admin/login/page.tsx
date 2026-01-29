"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInData } from "@/lib/validators/auth";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  // Check if Firebase is configured
  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Firebase Not Configured</CardTitle>
            <CardDescription>
              Firebase credentials are missing. Please add your Firebase configuration to .env.local
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              See <code className="bg-muted px-2 py-1 rounded text-xs">FIREBASE_SETUP_GUIDE.md</code> for setup instructions.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: SignInData) => {
    setIsSubmitting(true);
    try {
      // Sign in with existing account
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Get the ID token
      const idToken = await userCredential.user.getIdToken();

      // Create session on server
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create session");
      }

      toast.success("Signed in successfully!");
      
      // Redirect to /app - it will automatically redirect admins to /admin
      router.push("/app");
      router.refresh();
    } catch (error) {
      console.error("Admin sign in error:", error);
      
      let errorMessage = "Failed to sign in. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("auth/user-not-found")) {
          errorMessage = "No account found with this email.";
        } else if (error.message.includes("auth/wrong-password")) {
          errorMessage = "Incorrect password.";
        } else if (error.message.includes("auth/invalid-email")) {
          errorMessage = "Invalid email address.";
        } else if (error.message.includes("auth/too-many-requests")) {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
          <CardDescription>
            Enter your admin credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...signInForm.register("email")}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {signInForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...signInForm.register("password")}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              {signInForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
