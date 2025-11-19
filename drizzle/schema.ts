import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionPlan: varchar("subscriptionPlan", { length: 50 }).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  subscriptionStatus: varchar("subscriptionStatus", { length: 50 }),
  subscriptionEndsAt: timestamp("subscriptionEndsAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Project Templates
export const projectTemplates = mysqlTable("project_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  description: text("description"),
  isPublic: int("isPublic").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectTemplate = typeof projectTemplates.$inferSelect;
export type InsertProjectTemplate = typeof projectTemplates.$inferInsert;

// Financial Model SaaS Tables

// Projects table - stores financial model projects
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Revenue Products - product types and pricing
export const revenueProducts = mysqlTable("revenue_products", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  averagePrice: int("averagePrice").notNull(), // in cents
  volume: int("volume").notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  seasonalityFactor: int("seasonalityFactor").default(100).notNull(), // percentage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RevenueProduct = typeof revenueProducts.$inferSelect;
export type InsertRevenueProduct = typeof revenueProducts.$inferInsert;

// COGS Items - cost of goods sold
export const cogsItems = mysqlTable("cogs_items", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  costType: mysqlEnum("costType", ["fixed", "variable", "percentage"]).notNull(),
  amount: int("amount").notNull(), // in cents or percentage * 100
  growthRate: int("growthRate").default(0).notNull(), // annual growth in basis points
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CogsItem = typeof cogsItems.$inferSelect;
export type InsertCogsItem = typeof cogsItems.$inferInsert;

// Salaries - personnel positions and costs
export const salaries = mysqlTable("salaries", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  monthlyCost: int("monthlyCost").notNull(), // in cents
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Salary = typeof salaries.$inferSelect;
export type InsertSalary = typeof salaries.$inferInsert;

// OPEX Items - operating expenses
export const opexItems = mysqlTable("opex_items", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  expenseType: mysqlEnum("expenseType", ["fixed", "percentage"]).notNull(),
  amount: int("amount").notNull(), // in cents or percentage * 100
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OpexItem = typeof opexItems.$inferSelect;
export type InsertOpexItem = typeof opexItems.$inferInsert;

// Fixed Expenses - maintenance and turnarounds
export const fixedExpenses = mysqlTable("fixed_expenses", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // in cents
  date: timestamp("date").notNull(),
  frequency: mysqlEnum("frequency", ["once", "monthly", "quarterly", "annually"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FixedExpense = typeof fixedExpenses.$inferSelect;
export type InsertFixedExpense = typeof fixedExpenses.$inferInsert;

// CAPEX Items - capital expenditures
export const capexItems = mysqlTable("capex_items", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // in cents
  purchaseDate: timestamp("purchaseDate").notNull(),
  paymentDelay: int("paymentDelay").default(0).notNull(), // days
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CapexItem = typeof capexItems.$inferSelect;
export type InsertCapexItem = typeof capexItems.$inferInsert;

// Funding Sources - capital and debt
export const fundingSources = mysqlTable("funding_sources", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  sourceType: mysqlEnum("sourceType", ["equity", "debt"]).notNull(),
  amount: int("amount").notNull(), // in cents
  interestRate: int("interestRate").default(0).notNull(), // basis points
  date: timestamp("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FundingSource = typeof fundingSources.$inferSelect;
export type InsertFundingSource = typeof fundingSources.$inferInsert;

// Subscriptions - user subscription plans
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  plan: mysqlEnum("plan", ["free", "professional", "enterprise"]).default("free").notNull(),
  maxProjects: int("maxProjects").default(1).notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;