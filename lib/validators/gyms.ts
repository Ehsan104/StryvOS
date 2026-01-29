import { z } from "zod";

// Create gym schema
export const createGymSchema = z.object({
  name: z.string().min(2, "Gym name must be at least 2 characters").max(100),
  address: z.string().min(5, "Address must be at least 5 characters").max(200),
  phone: z.string().min(10, "Phone number must be at least 10 characters").max(20),
});

export type CreateGymData = z.infer<typeof createGymSchema>;

