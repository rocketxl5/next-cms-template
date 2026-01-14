
import { Role } from "@prisma/client";
import { getSession } from "./getSession";

type AllowedRoles = Role | Role[]

export async function enforceRole(roles: AllowedRoles) {
   const session = await getSession();

   if(!session) {
    return {ok: false, status: 401} as const;
   }

   const allowed = Array.isArray(roles) ? roles : [roles];
   
   if(!allowed.includes(session.user.role)) {
    return {ok: false, status: 403} as const;
   }

   return {ok: true, user: session.user} as const;
}