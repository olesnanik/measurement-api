import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserRefreshSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
});

export class UserRefreshDto extends createZodDto(UserRefreshSchema) {}
