import { z } from 'zod';

const emailSchema = z.string().trim().min(1, 'Введите email').email('Введите корректный email');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Введите пароль'),
});

export const registerSchema = z
  .object({
    username: z.string().trim().min(2, 'Минимум 2 символа'),
    email: emailSchema,
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, 'Название проекта обязательно'),
  description: z
    .string()
    .trim()
    .transform((value) => value || undefined),
});

export const createRoomSchema = z.object({
  title: z.string().trim().min(1, 'Название комнаты обязательно'),
  selectedProjectId: z
    .number({ error: 'Выберите проект' })
    .int('Выберите проект')
    .positive('Выберите проект'),
  maxParticipants: z
    .number({ error: 'Введите количество участников' })
    .int('Количество участников должно быть целым числом')
    .min(1, 'Минимум 1 участник')
    .max(100, 'Максимум 100 участников'),
});
