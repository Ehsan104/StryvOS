import { z } from "zod";

/**
 * Schema for creating a gym owner (account + gym in one step)
 */
export const createGymOwnerSchema = z.object({
  // Account details
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100),
  
  // Gym details
  gymName: z.string().min(2, "Gym name must be at least 2 characters").max(100),
  gymAddress: z.string().min(1, "Address is required").max(200),
  gymPhone: z.string().min(1, "Phone number is required").max(20),
});

export type CreateGymOwnerData = z.infer<typeof createGymOwnerSchema>;
