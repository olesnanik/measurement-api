import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginUserSchema = z.object({
  login: z.string().min(1, 'Login is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
});

export class LoginUserDto extends createZodDto(LoginUserSchema) {}
