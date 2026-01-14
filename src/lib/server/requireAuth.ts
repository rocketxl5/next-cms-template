import { requireRole } from "./requireRole";
import { Role } from "@prisma/client";

export async function requireAuth() {
    return requireRole({
        roles: Object.values(Role) // any authenticated role
    })
}