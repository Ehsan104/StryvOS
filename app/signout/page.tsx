"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleSignOut() {
      try {
        // Sign out from Firebase
        await firebaseSignOut(auth);

        // Clear session cookie
        await fetch("/api/auth/logout", {
          method: "POST",
        });

        // Redirect to home
        router.push("/");
      } catch (error) {
        console.error("Sign out error:", error);
        // Still redirect even if there's an error
        router.push("/");
      }
    }

    handleSignOut();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Signing out...</p>
      </div>
    </div>
  );
}


