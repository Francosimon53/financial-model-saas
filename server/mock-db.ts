// In-memory mock database for demo purposes (when DATABASE_URL is not configured)
// This allows the app to work on Vercel without needing a real database

import type {
    InsertUser, User,
    InsertProject, Project,
    InsertRevenueProduct, RevenueProduct,
    InsertCogsItem, CogsItem,
    InsertSalary, Salary,
    InsertOpexItem, OpexItem,
    InsertFixedExpense, FixedExpense,
    InsertCapexItem, CapexItem,
    InsertFundingSource, FundingSource,
    InsertSubscription, Subscription
} from "../drizzle/schema";

// In-memory storage
let mockUsers: User[] = [];
let mockProjects: Project[] = [];
let mockRevenueProducts: RevenueProduct[] = [];
let mockCogsItems: CogsItem[] = [];
let mockSalaries: Salary[] = [];
let mockOpexItems: OpexItem[] = [];
let mockFixedExpenses: FixedExpense[] = [];
let mockCapexItems: CapexItem[] = [];
let mockFundingSources: FundingSource[] = [];
let mockSubscriptions: Subscription[] = [];

// Auto-increment IDs
let nextUserId = 1;
let nextProjectId = 1;
let nextRevenueProductId = 1;
let nextCogsItemId = 1;
let nextSalaryId = 1;
let nextOpexItemId = 1;
let nextFixedExpenseId = 1;
let nextCapexItemId = 1;
let nextFundingSourceId = 1;
let nextSubscriptionId = 1;

// Helper to create timestamps
const now = () => new Date();

export const mockDb = {
    // Users
    upsertUser: async (user: InsertUser): Promise<void> => {
        const existingIndex = mockUsers.findIndex(u => u.openId === user.openId);

        if (existingIndex >= 0) {
            // Update existing user
            mockUsers[existingIndex] = {
                ...mockUsers[existingIndex],
                ...user,
                updatedAt: now(),
            };
        } else {
            // Create new user
            const newUser: User = {
                id: nextUserId++,
                openId: user.openId,
                name: user.name || null,
                email: user.email || null,
                loginMethod: user.loginMethod || null,
                role: user.role || "user",
                subscriptionPlan: "free",
                stripeCustomerId: null,
                stripeSubscriptionId: null,
                subscriptionStatus: "active",
                subscriptionEndsAt: null,
                createdAt: now(),
                updatedAt: now(),
                lastSignedIn: user.lastSignedIn || now(),
            };
            mockUsers.push(newUser);
        }
    },

    getUserByOpenId: async (openId: string): Promise<User | undefined> => {
        return mockUsers.find(u => u.openId === openId);
    },

    // Projects
    createProject: async (userId: number, project: Omit<InsertProject, "userId">): Promise<{ insertId: number; affectedRows: number }> => {
        const newProject: Project = {
            id: nextProjectId,
            userId,
            name: project.name,
            description: project.description || null,
            industry: project.industry || null,
            startDate: project.startDate,
            endDate: project.endDate,
            currency: project.currency || "USD",
            createdAt: now(),
            updatedAt: now(),
        };
        mockProjects.push(newProject);
        const insertId = nextProjectId;
        nextProjectId++;
        return { insertId, affectedRows: 1 };
    },

    getUserProjects: async (userId: number): Promise<Project[]> => {
        return mockProjects.filter(p => p.userId === userId);
    },

    getProjectById: async (projectId: number): Promise<Project | null> => {
        return mockProjects.find(p => p.id === projectId) || null;
    },

    updateProject: async (projectId: number, updates: Partial<InsertProject>): Promise<void> => {
        const index = mockProjects.findIndex(p => p.id === projectId);
        if (index >= 0) {
            mockProjects[index] = {
                ...mockProjects[index],
                ...updates,
                updatedAt: now(),
            };
        }
    },

    deleteProject: async (projectId: number): Promise<void> => {
        mockProjects = mockProjects.filter(p => p.id !== projectId);
        mockRevenueProducts = mockRevenueProducts.filter(r => r.projectId !== projectId);
        mockCogsItems = mockCogsItems.filter(c => c.projectId !== projectId);
        mockSalaries = mockSalaries.filter(s => s.projectId !== projectId);
        mockOpexItems = mockOpexItems.filter(o => o.projectId !== projectId);
        mockFixedExpenses = mockFixedExpenses.filter(f => f.projectId !== projectId);
        mockCapexItems = mockCapexItems.filter(c => c.projectId !== projectId);
        mockFundingSources = mockFundingSources.filter(f => f.projectId !== projectId);
    },

    // Revenue Products
    getRevenueProducts: async (projectId: number): Promise<RevenueProduct[]> => {
        return mockRevenueProducts.filter(r => r.projectId === projectId);
    },

    createRevenueProduct: async (product: InsertRevenueProduct): Promise<{ insertId: number }> => {
        const newProduct: RevenueProduct = {
            id: nextRevenueProductId,
            ...product,
            seasonalityFactor: product.seasonalityFactor ?? 100, // Default to 100%
            createdAt: now(),
            updatedAt: now(),
        };
        mockRevenueProducts.push(newProduct);
        const insertId = nextRevenueProductId;
        nextRevenueProductId++;
        return { insertId };
    },

    updateRevenueProduct: async (id: number, updates: Partial<InsertRevenueProduct>): Promise<void> => {
        const index = mockRevenueProducts.findIndex(r => r.id === id);
        if (index >= 0) {
            mockRevenueProducts[index] = { ...mockRevenueProducts[index], ...updates, updatedAt: now() };
        }
    },

    deleteRevenueProduct: async (id: number): Promise<void> => {
        mockRevenueProducts = mockRevenueProducts.filter(r => r.id !== id);
    },

    // COGS Items
    getCogsItems: async (projectId: number): Promise<CogsItem[]> => {
        return mockCogsItems.filter(c => c.projectId === projectId);
    },

    createCogsItem: async (item: InsertCogsItem): Promise<{ insertId: number }> => {
        const newItem: CogsItem = {
            id: nextCogsItemId,
            ...item,
            growthRate: item.growthRate ?? 0, // Default to 0% growth
            createdAt: now(),
            updatedAt: now(),
        };
        mockCogsItems.push(newItem);
        const insertId = nextCogsItemId;
        nextCogsItemId++;
        return { insertId };
    },

    updateCogsItem: async (id: number, updates: Partial<InsertCogsItem>): Promise<void> => {
        const index = mockCogsItems.findIndex(c => c.id === id);
        if (index >= 0) {
            mockCogsItems[index] = { ...mockCogsItems[index], ...updates, updatedAt: now() };
        }
    },

    deleteCogsItem: async (id: number): Promise<void> => {
        mockCogsItems = mockCogsItems.filter(c => c.id !== id);
    },

    // Similar implementations for other entities...
    // (Salaries, OPEX, Fixed Expenses, CAPEX, Funding Sources, Subscriptions)

    getSalaries: async (projectId: number): Promise<Salary[]> => {
        return mockSalaries.filter(s => s.projectId === projectId);
    },

    getOpexItems: async (projectId: number): Promise<OpexItem[]> => {
        return mockOpexItems.filter(o => o.projectId === projectId);
    },

    getFixedExpenses: async (projectId: number): Promise<FixedExpense[]> => {
        return mockFixedExpenses.filter(f => f.projectId === projectId);
    },

    getCapexItems: async (projectId: number): Promise<CapexItem[]> => {
        return mockCapexItems.filter(c => c.projectId === projectId);
    },

    getFundingSources: async (projectId: number): Promise<FundingSource[]> => {
        return mockFundingSources.filter(f => f.projectId === projectId);
    },
};
