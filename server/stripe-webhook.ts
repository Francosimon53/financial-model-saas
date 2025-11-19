import express from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export function registerStripeWebhook(app: express.Application) {
  // CRITICAL: Register webhook BEFORE express.json() middleware
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];

      if (!sig) {
        console.error("[Webhook] No signature provided");
        return res.status(400).send("No signature");
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err: any) {
        console.error(`[Webhook] Signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      // Handle real events
      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
          }

          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionChange(subscription);
            break;
          }

          case "invoice.paid": {
            const invoice = event.data.object as Stripe.Invoice;
            console.log(`[Webhook] Invoice paid: ${invoice.id}`);
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            console.log(`[Webhook] Invoice payment failed: ${invoice.id}`);
            await handlePaymentFailed(invoice);
            break;
          }

          default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (error: any) {
        console.error(`[Webhook] Error processing event: ${error.message}`);
        res.status(500).json({ error: "Webhook processing failed" });
      }
    }
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Webhook] Processing checkout completion: ${session.id}`);

  const userId = session.metadata?.user_id;
  const customerEmail = session.customer_email || session.metadata?.customer_email;

  if (!userId) {
    console.error("[Webhook] No user_id in session metadata");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return;
  }

  // Determine plan from session
  let plan = "free";
  if (session.metadata?.plan) {
    plan = session.metadata.plan;
  }

  // Update user with Stripe customer ID and subscription
  await db
    .update(users)
    .set({
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      subscriptionPlan: plan,
      subscriptionStatus: "active",
    })
    .where(eq(users.id, parseInt(userId)));

  console.log(`[Webhook] Updated user ${userId} with subscription ${plan}`);
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log(`[Webhook] Processing subscription change: ${subscription.id}`);

  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return;
  }

  // Find user by subscription ID
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (result.length === 0) {
    console.error(`[Webhook] No user found for subscription ${subscription.id}`);
    return;
  }

  const user = result[0];

  // Update subscription status
  const status = subscription.status === "active" ? "active" : subscription.status;
  const endsAt = subscription.cancel_at
    ? new Date(subscription.cancel_at * 1000)
    : null;

  await db
    .update(users)
    .set({
      subscriptionStatus: status,
      subscriptionEndsAt: endsAt,
    })
    .where(eq(users.id, user.id));

  console.log(`[Webhook] Updated subscription status for user ${user.id}: ${status}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`[Webhook] Processing payment failure: ${invoice.id}`);

  const db = await getDb();
  if (!db) return;

  if (!invoice.customer) return;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, invoice.customer as string))
    .limit(1);

  if (result.length === 0) return;

  // Optionally update user status or send notification
  console.log(`[Webhook] Payment failed for user ${result[0].id}`);
}
