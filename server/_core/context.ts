import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // In development, use a mock user to bypass authentication
    if (process.env.NODE_ENV === "development") {
      console.log("[DEV MODE] Using mock user for development");
      user = {
        id: 1,
        openId: "dev-user-1",
        name: "Developer User",
        email: "developer@example.com",
        loginMethod: "development",
        role: "admin" as const,
        subscriptionPlan: "professional",
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStatus: "active",
        subscriptionEndsAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };
    } else {
      // Authentication is optional for public procedures in production
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
