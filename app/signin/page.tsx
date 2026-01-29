"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get redirect parameter if user was trying to access a protected route
  // Default to /app which will auto-redirect admins to /admin
  const redirectTo = searchParams?.get("redirect") || "/app";
  
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
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Need help?{" "}
                <a
                  href="mailto:info@stryvos.org"
                  className="text-primary hover:underline"
                >
                  Contact us
                </a>
              </p>
            </div>
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
      
      // Redirect to the intended destination or /app (which will auto-redirect admins)
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);
      
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
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
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
          
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Don't have an account? Contact us to get set up.
            </p>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}

