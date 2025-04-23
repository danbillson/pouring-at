import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { sendEmail } from "@/lib/email";
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
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click here to verify your email: ${url}`,
      });
    },
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
