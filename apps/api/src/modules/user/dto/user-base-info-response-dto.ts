import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserBaseInfoSchema = z.object({
  login: z.string().min(1),
  name: z.string().min(1),
});

export class UserBaseInfoResponseDto extends createZodDto(UserBaseInfoSchema) {}
