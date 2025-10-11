import { z } from 'zod';
import type { User, DemoUser, ButtonVariant, ButtonSize } from './types';

// User schemas
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  email_verified_at: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const DemoUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

// Authentication schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

// Profile schemas
export const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export const UpdatePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const DeleteUserSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

// Component validation schemas
export const ButtonVariantSchema = z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']);
export const ButtonSizeSchema = z.enum(['default', 'sm', 'lg', 'icon']);

// API response schemas
export const PaginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) => z.object({
  data: z.array(dataSchema),
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

export const ApiErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.array(z.string())).optional(),
});

// Demo API schemas
export const DemoUsersResponseSchema = z.array(DemoUserSchema);

// TypeScript type exports derived from Zod schemas
export type UserType = z.infer<typeof UserSchema>;
export type DemoUserType = z.infer<typeof DemoUserSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
export type RegisterType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;
export type UpdatePasswordType = z.infer<typeof UpdatePasswordSchema>;
export type DeleteUserType = z.infer<typeof DeleteUserSchema>;
export type ButtonVariantType = z.infer<typeof ButtonVariantSchema>;
export type ButtonSizeType = z.infer<typeof ButtonSizeSchema>;
export type ApiErrorType = z.infer<typeof ApiErrorSchema>;