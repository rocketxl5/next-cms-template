import { z } from 'zod';
import { nameSchema, emailSchema, passwordSchema } from '../common';

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});