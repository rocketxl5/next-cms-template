import {z} from "zod";
import { emailSchema } from "../common";

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});