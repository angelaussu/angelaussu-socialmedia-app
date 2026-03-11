import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username is too long")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
});
export type EditProfileFormData = z.infer<typeof editProfileSchema>;

export const createPostSchema = z.object({
  caption: z.string().min(1, "Caption is required").max(500, "Caption is too long"),
  image: z.any().refine((file) => file instanceof File, "Please select an image"),
});
export type CreatePostFormData = z.infer<typeof createPostSchema>;

export const commentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(300, "Comment is too long"),
});
export type CommentFormData = z.infer<typeof commentSchema>;
