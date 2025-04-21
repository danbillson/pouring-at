import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  geometry,
  index,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const bar = pgTable(
  "bar",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    slug: text("slug"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    postcode: text("postcode"),
    formattedAddress: text("formatted_address"),
    logo: text("logo"),
    coverImage: text("cover_image"),
    location: geometry("location", { type: "point", mode: "xy", srid: 4326 }),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    organizationId: text("organization_id").references(() => organization.id),
  },
  (table) => [
    index("bar_location_idx").using("gist", table.location),
    unique("bar_slug_unique").on(table.slug),
  ]
);

export type Bar = typeof bar.$inferSelect;

export const brewery = pgTable(
  "brewery",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    slug: text("slug"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    postcode: text("postcode"),
    formattedAddress: text("formatted_address"),
    logo: text("logo"),
    coverImage: text("cover_image"),
    location: geometry("location", { type: "point", mode: "xy", srid: 4326 }),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    organizationId: text("organization_id").references(() => organization.id),
  },
  (table) => [
    index("brewery_location_idx").using("gist", table.location),
    unique("brewery_slug_unique").on(table.slug),
  ]
);

export type Brewery = typeof brewery.$inferSelect;

export const beer = pgTable("beer", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  breweryId: text("brewery_id")
    .notNull()
    .references(() => brewery.id, { onDelete: "cascade" }),
  abv: decimal("abv", { precision: 3, scale: 1 }),
  style: text("style"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Beer = typeof beer.$inferSelect;

export const tap = pgTable(
  "tap",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    barId: text("bar_id")
      .notNull()
      .references(() => bar.id, { onDelete: "cascade" }),
    beerId: text("beer_id")
      .notNull()
      .references(() => beer.id, { onDelete: "cascade" }),
    tappedOn: timestamp("tapped_on").notNull().defaultNow(),
    tappedOff: timestamp("tapped_off"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("tap_bar_beer_unique").on(table.barId, table.beerId)]
);

export type Tap = typeof tap.$inferSelect;

// Relations
export const barRelations = relations(bar, ({ many }) => ({
  taps: many(tap),
}));

export const breweryRelations = relations(brewery, ({ many }) => ({
  beers: many(beer),
}));

export const beerRelations = relations(beer, ({ one, many }) => ({
  brewery: one(brewery, {
    fields: [beer.breweryId],
    references: [brewery.id],
  }),
  taps: many(tap),
}));

export const tapRelations = relations(tap, ({ one }) => ({
  bar: one(bar, {
    fields: [tap.barId],
    references: [bar.id],
  }),
  beer: one(beer, {
    fields: [tap.beerId],
    references: [beer.id],
  }),
}));
