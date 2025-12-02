import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  gymName: z.string().min(2, "Gym name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  memberCount: z.enum(["1-50", "51-100", "101-150", "151-200", "200+"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  company_website: z.string().max(0).optional(), // Honeypot field
});

export type ContactFormData = z.infer<typeof contactSchema>;

