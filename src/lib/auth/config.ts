import { requireEnv, getExpires } from '../env';
import type { StringValue } from 'ms';

export const authConfig = {
  accessSecret: requireEnv('JWT_ACCESS_SECRET'),
  refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
  accessExpires: getExpires('JWT_ACCESS_EXPIRES', '15m' as StringValue),
  refreshExpires: getExpires('JWT_REFRESH_EXPIRES', '7d' as StringValue),
};
