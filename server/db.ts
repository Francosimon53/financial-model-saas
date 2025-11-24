import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  projects, InsertProject,
  revenueProducts, InsertRevenueProduct,
  cogsItems, InsertCogsItem,
  salaries, InsertSalary,
  opexItems, InsertOpexItem,
  fixedExpenses, InsertFixedExpense,
  capexItems, InsertCapexItem,
  fundingSources, InsertFundingSource,
  subscriptions, InsertSubscription
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Project queries
export async function createProject(userId: number, project: Omit<InsertProject, "userId">) {
  const db = await getDb();

  // In development mode, return mock data if database is not available
  if (!db) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Database] Creating project with mock data - DATABASE_URL not configured");
      // Return a mock result that simulates successful insertion
      return {
        insertId: Math.floor(Math.random() * 1000) + 1,
        affectedRows: 1,
      };
    }
    throw new Error("Database not available. Please configure DATABASE_URL in .env file");
  }

  const result = await db.insert(projects).values({ ...project, userId });
  return result;
}

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(projects).where(eq(projects.userId, userId));
}

export async function getProjectById(projectId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return result[0] || null;
}

export async function updateProject(projectId: number, updates: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(projects).set(updates).where(eq(projects.id, projectId));
}

export async function deleteProject(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete all related data
  await db.delete(revenueProducts).where(eq(revenueProducts.projectId, projectId));
  await db.delete(cogsItems).where(eq(cogsItems.projectId, projectId));
  await db.delete(salaries).where(eq(salaries.projectId, projectId));
  await db.delete(opexItems).where(eq(opexItems.projectId, projectId));
  await db.delete(fixedExpenses).where(eq(fixedExpenses.projectId, projectId));
  await db.delete(capexItems).where(eq(capexItems.projectId, projectId));
  await db.delete(fundingSources).where(eq(fundingSources.projectId, projectId));
  await db.delete(projects).where(eq(projects.id, projectId));
}

// Revenue Products queries
export async function getRevenueProducts(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(revenueProducts).where(eq(revenueProducts.projectId, projectId));
}

export async function createRevenueProduct(product: InsertRevenueProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(revenueProducts).values(product);
}

export async function updateRevenueProduct(id: number, updates: Partial<InsertRevenueProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(revenueProducts).set(updates).where(eq(revenueProducts.id, id));
}

export async function deleteRevenueProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(revenueProducts).where(eq(revenueProducts.id, id));
}

// COGS queries
export async function getCogsItems(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cogsItems).where(eq(cogsItems.projectId, projectId));
}

export async function createCogsItem(item: InsertCogsItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(cogsItems).values(item);
}

export async function updateCogsItem(id: number, updates: Partial<InsertCogsItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cogsItems).set(updates).where(eq(cogsItems.id, id));
}

export async function deleteCogsItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cogsItems).where(eq(cogsItems.id, id));
}

// Salaries queries
export async function getSalaries(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(salaries).where(eq(salaries.projectId, projectId));
}

export async function createSalary(salary: InsertSalary) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(salaries).values(salary);
}

export async function updateSalary(id: number, updates: Partial<InsertSalary>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(salaries).set(updates).where(eq(salaries.id, id));
}

export async function deleteSalary(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(salaries).where(eq(salaries.id, id));
}

// OPEX queries
export async function getOpexItems(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(opexItems).where(eq(opexItems.projectId, projectId));
}

export async function createOpexItem(item: InsertOpexItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(opexItems).values(item);
}

export async function updateOpexItem(id: number, updates: Partial<InsertOpexItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(opexItems).set(updates).where(eq(opexItems.id, id));
}

export async function deleteOpexItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(opexItems).where(eq(opexItems.id, id));
}

// Fixed Expenses queries
export async function getFixedExpenses(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(fixedExpenses).where(eq(fixedExpenses.projectId, projectId));
}

export async function createFixedExpense(expense: InsertFixedExpense) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(fixedExpenses).values(expense);
}

export async function updateFixedExpense(id: number, updates: Partial<InsertFixedExpense>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(fixedExpenses).set(updates).where(eq(fixedExpenses.id, id));
}

export async function deleteFixedExpense(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(fixedExpenses).where(eq(fixedExpenses.id, id));
}

// CAPEX queries
export async function getCapexItems(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(capexItems).where(eq(capexItems.projectId, projectId));
}

export async function createCapexItem(item: InsertCapexItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(capexItems).values(item);
}

export async function updateCapexItem(id: number, updates: Partial<InsertCapexItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(capexItems).set(updates).where(eq(capexItems.id, id));
}

export async function deleteCapexItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(capexItems).where(eq(capexItems.id, id));
}

// Funding Sources queries
export async function getFundingSources(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(fundingSources).where(eq(fundingSources.projectId, projectId));
}

export async function createFundingSource(source: InsertFundingSource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(fundingSources).values(source);
}

export async function updateFundingSource(id: number, updates: Partial<InsertFundingSource>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(fundingSources).set(updates).where(eq(fundingSources.id, id));
}

export async function deleteFundingSource(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(fundingSources).where(eq(fundingSources.id, id));
}

// Subscription queries
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result[0] || null;
}

export async function createSubscription(subscription: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(subscriptions).values(subscription);
}

export async function updateSubscription(userId: number, updates: Partial<InsertSubscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set(updates).where(eq(subscriptions.userId, userId));
}
