import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { ac, admin, member, user as userPermissions } from "@/lib/permissions";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, organization } from "better-auth/plugins";

const schema = {
  user,
  account,
  session,
  verification,
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization(),
    adminPlugin({
      ac,
      roles: {
        admin,
        member,
        user: userPermissions,
      },
    }),
  ],
});
