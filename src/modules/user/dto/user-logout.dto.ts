import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserLogoutSchema = z.object({
  accessToken: z.string().min(1, 'accessToken is required'),
});

export class UserLogoutDto extends createZodDto(UserLogoutSchema) {}
