import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(20, 'Имя пользователя должно содержать максимум 20 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Имя пользователя может содержать только буквы, цифры и подчеркивания'),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(50, 'Пароль должен содержать максимум 50 символов')
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(20, 'Имя пользователя должно содержать максимум 20 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Имя пользователя может содержать только буквы, цифры и подчеркивания'),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(50, 'Пароль должен содержать максимум 50 символов')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру'),
  confirmPassword: z.string()
    .min(1, 'Подтверждение пароля обязательно')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;