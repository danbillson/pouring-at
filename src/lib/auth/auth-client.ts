
import { organizationClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, updateUser, organization } =
  createAuthClient({
    plugins: [
      organizationClient(),
      inferAdditionalFields({
        user: {
          role: {
            type: "string",
            default: "user",
          },
        },
      }),
    ],
  });
