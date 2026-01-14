/**
 * Signup Form Schema (UI-only)
 *
 * Purpose:
 * - Extends the backend signup schema with UI-only fields
 * - Handles confirmPassword matching for better UX
 *
 * Important:
 * - confirmPassword is NOT part of the API contract
 * - This schema should NEVER be used in API routes
 * - Backend validation is still required and enforced separately
 *
 * Design Rule:
 * - Backend schemas validate data integrity
 * - UI schemas validate user experience
 */

import {z} from "zod";
import { signupSchema } from "@/lib/validators";

export const signupFormSchema = signupSchema
.extend({
    confirmPassword: z.string()
})
.refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ['confirmPassword']
    }
)

export type signupFormData = z.infer<typeof signupFormSchema>;