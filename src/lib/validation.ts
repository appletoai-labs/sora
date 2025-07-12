import { z } from "zod";

// Password strength validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// User registration schema
export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  confirmPassword: z.string(),
  accountType: z.enum(["individual", "therapy_client", "therapist"]).refine((val) => val !== undefined, {
    message: "Please select an account type"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Profile update schema
export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name too long"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  role: z.enum(["individual", "therapy_client", "therapist"]).optional()
});

// Password strength checker
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push("At least 8 characters");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("One uppercase letter");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("One lowercase letter");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("One number");

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push("One special character");

  return { score, feedback };
}

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;