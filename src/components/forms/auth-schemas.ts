import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').max(72),
});

export const registrationSchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters').max(80),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters').max(72),
  photoURL: z
    .union([z.string().trim().url('Enter a valid image URL').max(2_048), z.literal('')])
    .optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegistrationFormValues = z.infer<typeof registrationSchema>;
