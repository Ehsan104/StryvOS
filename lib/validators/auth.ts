import { z } from "zod";

// Sign in schema
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInData = z.infer<typeof signInSchema>;

// Sign up schema (for future use)
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export type SignUpData = z.infer<typeof signUpSchema>;


