import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export class UserTokenResponseDto extends createZodDto(
  UserTokenResponseSchema,
) {}
