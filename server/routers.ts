import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import type * as calc from "./calculations";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Projects router
  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await import("./db");
      return db.getUserProjects(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        return db.getProjectById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        industry: z.string().optional(),
        startDate: z.date(),
        endDate: z.date(),
        currency: z.string().default("USD")
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        return db.createProject(ctx.user.id, input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        industry: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        currency: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const { id, ...updates } = input;
        return db.updateProject(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.deleteProject(input.id);
      }),
  }),
  
  // Revenue products router
  revenue: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        return db.getRevenueProducts(input.projectId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string(),
        averagePrice: z.number(),
        volume: z.number(),
        unit: z.string(),
        seasonalityFactor: z.number().default(100)
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.createRevenueProduct(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        averagePrice: z.number().optional(),
        volume: z.number().optional(),
        unit: z.string().optional(),
        seasonalityFactor: z.number().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const { id, ...updates } = input;
        return db.updateRevenueProduct(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.deleteRevenueProduct(input.id);
      }),
  }),
  
  // COGS router
  cogs: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        return db.getCogsItems(input.projectId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string(),
        costType: z.enum(["fixed", "variable", "percentage"]),
        amount: z.number(),
        growthRate: z.number().default(0)
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.createCogsItem(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        costType: z.enum(["fixed", "variable", "percentage"]).optional(),
        amount: z.number().optional(),
        growthRate: z.number().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const { id, ...updates } = input;
        return db.updateCogsItem(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.deleteCogsItem(input.id);
      }),
  }),
  
  // Salaries router
  salaries: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        return db.getSalaries(input.projectId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        position: z.string(),
        monthlyCost: z.number(),
        startDate: z.date(),
        endDate: z.date().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.createSalary(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        position: z.string().optional(),
        monthlyCost: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const { id, ...updates } = input;
        return db.updateSalary(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.deleteSalary(input.id);
      }),
  }),
  
  // OPEX router
  opex: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        return db.getOpexItems(input.projectId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string(),
        expenseType: z.enum(["fixed", "percentage"]),
        amount: z.number()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.createOpexItem(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        expenseType: z.enum(["fixed", "percentage"]).optional(),
        amount: z.number().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const { id, ...updates } = input;
        return db.updateOpexItem(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.deleteOpexItem(input.id);
      }),
  }),
  
  // Fixed expenses router
  fixedExpenses: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        return db.getFixedExpenses(input.projectId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string(),
        amount: z.number(),
        date: z.date(),
        frequency: z.enum(["once", "monthly", "quarterly", "annually"])
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.createFixedExpense(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        amount: z.number().optional(),
        date: z.date().optional(),
        frequency: z.enum(["once", "monthly", "quarterly", "annually"]).optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const { id, ...updates } = input;
        return db.updateFixedExpense(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.deleteFixedExpense(input.id);
      }),
  }),
  
  // CAPEX router
  capex: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        return db.getCapexItems(input.projectId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string(),
        amount: z.number(),
        purchaseDate: z.date(),
        paymentDelay: z.number().default(0)
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.createCapexItem(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        amount: z.number().optional(),
        purchaseDate: z.date().optional(),
        paymentDelay: z.number().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const { id, ...updates } = input;
        return db.updateCapexItem(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.deleteCapexItem(input.id);
      }),
  }),
  
  // Funding sources router
  funding: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        return db.getFundingSources(input.projectId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        sourceType: z.enum(["equity", "debt"]),
        amount: z.number(),
        interestRate: z.number().default(0),
        date: z.date()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.createFundingSource(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        sourceType: z.enum(["equity", "debt"]).optional(),
        amount: z.number().optional(),
        interestRate: z.number().optional(),
        date: z.date().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const { id, ...updates } = input;
        return db.updateFundingSource(id, updates);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return db.deleteFundingSource(input.id);
      }),
  }),
  
  // Financial statements router
  statements: router({
    incomeStatement: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        const calc = await import("./calculations");
        
        const project = await db.getProjectById(input.projectId);
        if (!project) throw new Error("Project not found");
        
        const products = await db.getRevenueProducts(input.projectId);
        const cogsItems = await db.getCogsItems(input.projectId);
        const salaries = await db.getSalaries(input.projectId);
        const opexItems = await db.getOpexItems(input.projectId);
        const fixedExpenses = await db.getFixedExpenses(input.projectId);
        const fundingSources = await db.getFundingSources(input.projectId);
        
        // Generate statements for each month in project timeline
        const statements: calc.IncomeStatement[] = [];
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const statement = calc.generateIncomeStatement(
            new Date(currentDate),
            products,
            cogsItems,
            salaries,
            opexItems,
            fixedExpenses,
            fundingSources,
            startDate
          );
          statements.push(statement);
          
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        return statements;
      }),
    
    cashFlow: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        const calc = await import("./calculations");
        
        const project = await db.getProjectById(input.projectId);
        if (!project) throw new Error("Project not found");
        
        const products = await db.getRevenueProducts(input.projectId);
        const cogsItems = await db.getCogsItems(input.projectId);
        const salaries = await db.getSalaries(input.projectId);
        const opexItems = await db.getOpexItems(input.projectId);
        const fixedExpenses = await db.getFixedExpenses(input.projectId);
        const capexItems = await db.getCapexItems(input.projectId);
        const fundingSources = await db.getFundingSources(input.projectId);
        
        // Generate cash flow statements
        const statements: calc.CashFlowStatement[] = [];
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        
        let currentDate = new Date(startDate);
        let cumulativeCashFlow = 0;
        
        while (currentDate <= endDate) {
          const incomeStatement = calc.generateIncomeStatement(
            new Date(currentDate),
            products,
            cogsItems,
            salaries,
            opexItems,
            fixedExpenses,
            fundingSources,
            startDate
          );
          
          const cashFlowStatement = calc.generateCashFlowStatement(
            new Date(currentDate),
            incomeStatement,
            capexItems,
            fundingSources,
            cumulativeCashFlow
          );
          
          statements.push(cashFlowStatement);
          cumulativeCashFlow = cashFlowStatement.cumulativeCashFlow;
          
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        return statements;
      }),
    
    kpis: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        const calc = await import("./calculations");
        
        const project = await db.getProjectById(input.projectId);
        if (!project) throw new Error("Project not found");
        
        const products = await db.getRevenueProducts(input.projectId);
        const cogsItems = await db.getCogsItems(input.projectId);
        const salaries = await db.getSalaries(input.projectId);
        const opexItems = await db.getOpexItems(input.projectId);
        const fixedExpenses = await db.getFixedExpenses(input.projectId);
        const capexItems = await db.getCapexItems(input.projectId);
        const fundingSources = await db.getFundingSources(input.projectId);
        
        // Generate all statements first
        const incomeStatements: calc.IncomeStatement[] = [];
        const cashFlowStatements: calc.CashFlowStatement[] = [];
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        
        let currentDate = new Date(startDate);
        let cumulativeCashFlow = 0;
        
        while (currentDate <= endDate) {
          const incomeStatement = calc.generateIncomeStatement(
            new Date(currentDate),
            products,
            cogsItems,
            salaries,
            opexItems,
            fixedExpenses,
            fundingSources,
            startDate
          );
          incomeStatements.push(incomeStatement);
          
          const cashFlowStatement = calc.generateCashFlowStatement(
            new Date(currentDate),
            incomeStatement,
            capexItems,
            fundingSources,
            cumulativeCashFlow
          );
          cashFlowStatements.push(cashFlowStatement);
          cumulativeCashFlow = cashFlowStatement.cumulativeCashFlow;
          
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        return calc.calculateProjectKPIs(incomeStatements, cashFlowStatements, fundingSources);
      }),
  }),
  
  // Stripe subscription routers
  subscription: router({
    createCheckout: protectedProcedure
      .input(z.object({ 
        plan: z.enum(["professional", "enterprise"]),
        billingPeriod: z.enum(["monthly", "yearly"])
      }))
      .mutation(async ({ input, ctx }) => {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: "2025-10-29.clover",
        });
        const { SUBSCRIPTION_PLANS } = await import("./products");
        
        const plan = SUBSCRIPTION_PLANS[input.plan];
        if (!plan) throw new Error("Invalid plan");
        
        const priceId = input.billingPeriod === "monthly" 
          ? plan.stripePriceIdMonthly 
          : plan.stripePriceIdYearly;
        
        if (!priceId) {
          throw new Error("Price ID not configured for this plan");
        }
        
        const origin = ctx.req.headers.origin || `http://localhost:${process.env.PORT || 3000}`;
        
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/pricing`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            plan: input.plan,
          },
          allow_promotion_codes: true,
        });
        
        return { url: session.url };
      }),
    
    getCurrentPlan: protectedProcedure.query(async ({ ctx }) => {
      return {
        plan: ctx.user.subscriptionPlan || "free",
        status: ctx.user.subscriptionStatus || "active",
        endsAt: ctx.user.subscriptionEndsAt,
      };
    }),
    
    cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user.stripeSubscriptionId) {
        throw new Error("No active subscription");
      }
      
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-10-29.clover",
      });
      
      await stripe.subscriptions.update(ctx.user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
