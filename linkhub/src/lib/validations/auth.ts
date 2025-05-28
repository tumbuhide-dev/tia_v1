import { z } from 'zod';

// Password policy (see PROMPT_ALL.txt)
const passwordPolicy = z.string()
  .min(8, 'Minimal 8 karakter')
  .max(128, 'Maksimal 128 karakter')
  .regex(/[A-Z]/, 'Harus ada huruf besar')
  .regex(/[a-z]/, 'Harus ada huruf kecil')
  .regex(/[0-9]/, 'Harus ada angka')
  .regex(/[^A-Za-z0-9]/, 'Harus ada karakter spesial')
  .refine(val => !/123456|password|qwerty|admin|linkhub|12345678|password123/.test(val), {
    message: 'Password terlalu umum',
  });

export const RegisterSchema = z.object({
  role: z.enum(['brand', 'creator']),
  email: z.string().email(),
  password: passwordPolicy,
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Anda harus menyetujui syarat & ketentuan' })
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak sama',
  path: ['confirmPassword'],
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const reserved = ['admin', 'api', 'www', 'app'];
export const CompleteProfileSchema = z.object({
  username: z.string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Hanya huruf, angka, dan underscore')
    .refine(val => !reserved.includes(val.toLowerCase()), {
      message: 'Username tidak tersedia',
    }),
  fullName: z.string().min(2).max(50),
  birthDate: z.string().regex(/^(\d{2}-\d{2}-\d{4}|\d{4}-\d{2}-\d{2})$/, 'Format DD-MM-YYYY atau YYYY-MM-DD'),
}); 