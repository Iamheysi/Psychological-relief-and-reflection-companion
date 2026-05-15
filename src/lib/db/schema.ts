import { pgTable, uuid, text, timestamp, integer, boolean, date, jsonb, primaryKey, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  name: text("name"),
  locale: text("locale").notNull().default("en"),
  plan: text("plan", { enum: ["free", "pro", "pro_plus"] }).notNull().default("free"),
  status: text("status", { enum: ["active", "deleted", "suspended"] }).notNull().default("active"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  ageConfirmed: boolean("age_confirmed").notNull().default(false),
  acceptedTermsAt: timestamp("accepted_terms_at", { withTimezone: true }),
  acceptedMedicalDisclaimerAt: timestamp("accepted_medical_disclaimer_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  preferredCompanion: text("preferred_companion").notNull().default("mira"),
  theme: text("theme", { enum: ["warm-clinic", "sage-forest", "dark"] }).notNull().default("warm-clinic"),
  motionPref: text("motion_pref", { enum: ["full", "reduced"] }).notNull().default("full"),
  encryptedKey: text("encrypted_key"),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  sentimentTag: text("sentiment_tag"),
}, (t) => ({
  userIdx: index("sessions_user_idx").on(t.userId),
}));

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  contentEncrypted: text("content_encrypted").notNull(),
  tokensIn: integer("tokens_in").notNull().default(0),
  tokensOut: integer("tokens_out").notNull().default(0),
  safetyFlag: jsonb("safety_flag"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  sessionIdx: index("messages_session_idx").on(t.sessionId),
}));

export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mood: integer("mood").notNull(),
  noteEncrypted: text("note_encrypted"),
  date: date("date").notNull(),
}, (t) => ({
  userDateIdx: index("journal_user_date_idx").on(t.userId, t.date),
}));

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider", { enum: ["stripe", "yookassa"] }).notNull(),
  plan: text("plan", { enum: ["pro", "pro_plus"] }).notNull(),
  status: text("status", { enum: ["active", "past_due", "canceled", "trialing"] }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  externalId: text("external_id"),
}, (t) => ({
  userIdx: index("subs_user_idx").on(t.userId),
}));

export const usageCounters = pgTable("usage_counters", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  messagesSent: integer("messages_sent").notNull().default(0),
  tokensUsed: integer("tokens_used").notNull().default(0),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.date] }),
}));

export const exports = pgTable("exports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  downloadUrl: text("download_url"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const deletionRequests = pgTable("deletion_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});
