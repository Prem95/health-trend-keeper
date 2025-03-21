import { pgTable, uuid, text, timestamp, date, real } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  birthdate: date('birthdate'),
  height: real('height'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reports table
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  uploadTimestamp: timestamp('upload_timestamp').defaultNow().notNull(),
  fileUrl: text('file_url').notNull(),
  summary: text('summary'),
});

// Measurements table
export const measurements = pgTable('measurements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  metricType: text('metric_type').notNull(), // e.g. "blood_pressure", "cholesterol", "weight"
  value: real('value').notNull(),
  source: text('source').notNull(), // e.g. "manual", "report"
  reportId: uuid('report_id').references(() => reports.id),
});

// Types for type safety
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

export type Measurement = typeof measurements.$inferSelect;
export type NewMeasurement = typeof measurements.$inferInsert; 