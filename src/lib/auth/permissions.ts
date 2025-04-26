import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  bar: ["create", "read", "update", "delete", "manage"],
  tap: ["create", "read", "update", "delete"],
  beer: ["create", "read", "update", "delete"],
  brewery: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  bar: ["create", "read", "update", "delete", "manage"],
  tap: ["create", "read", "update", "delete"],
  beer: ["create", "read", "update", "delete"],
  brewery: ["create", "read", "update", "delete"],
  ...adminAc.statements,
});

export const member = ac.newRole({
  bar: ["create", "read", "update"],
  tap: ["create", "read", "update"],
  beer: ["create", "read", "update"],
  brewery: ["create", "read", "update"],
});

export const user = ac.newRole({
  bar: ["read"],
  tap: ["read"],
  beer: ["read"],
  brewery: ["read"],
});
