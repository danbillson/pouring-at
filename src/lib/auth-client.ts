import { ac, admin, member, user as userPermissions } from "@/lib/permissions";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, updateUser } =
  createAuthClient({
    plugins: [
      organizationClient(),
      adminClient({
        ac,
        roles: {
          admin,
          member,
          user: userPermissions,
        },
      }),
    ],
  });
