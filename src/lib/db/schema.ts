// src/lib/db/schema.ts
import { pgTable, text, timestamp, doublePrecision, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["citizen", "officer", "admin"] }).default("citizen").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const wasteReports = pgTable("waste_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  address: text("address"),
  imageUrl: text("image_url").notNull(),
  aiWasteType: text("ai_waste_type"),
  aiConfidence: doublePrecision("ai_confidence"),
  aiRawResponse: jsonb("ai_raw_response"),
  severity: text("severity", { enum: ["low", "medium", "high", "critical"] }).default("low").notNull(),
  status: text("status", { enum: ["reported", "verified", "in_progress", "resolved"] }).default("reported").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id").references(() => wasteReports.id, { onDelete: "cascade" }).notNull().unique(),
  priority: text("priority").notNull(),
  handlingMethod: text("handling_method").notNull(),
  resourcesNeeded: text("resources_needed"),
  assignedAgency: text("assigned_agency"),
  aiRawResponse: jsonb("ai_raw_response"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reportActivities = pgTable("report_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id").references(() => wasteReports.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  notes: text("notes"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(wasteReports),
  activities: many(reportActivities),
}));

export const wasteReportsRelations = relations(wasteReports, ({ one, many }) => ({
  user: one(users, {
    fields: [wasteReports.userId],
    references: [users.id],
  }),
  recommendation: one(aiRecommendations, {
    fields: [wasteReports.id],
    references: [aiRecommendations.reportId],
  }),
  activities: many(reportActivities),
}));

export const aiRecommendationsRelations = relations(aiRecommendations, ({ one }) => ({
  report: one(wasteReports, {
    fields: [aiRecommendations.reportId],
    references: [wasteReports.id],
  }),
}));

export const reportActivitiesRelations = relations(reportActivities, ({ one }) => ({
  report: one(wasteReports, {
    fields: [reportActivities.reportId],
    references: [wasteReports.id],
  }),
  user: one(users, {
    fields: [reportActivities.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type WasteReport = typeof wasteReports.$inferSelect;
export type NewWasteReport = typeof wasteReports.$inferInsert;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type NewAiRecommendation = typeof aiRecommendations.$inferInsert;
export type ReportActivity = typeof reportActivities.$inferSelect;
export type NewReportActivity = typeof reportActivities.$inferInsert;
