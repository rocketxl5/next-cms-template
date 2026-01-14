import { Role, Theme } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  role: Role;
  theme: Theme;
  name?: string | null;
};
