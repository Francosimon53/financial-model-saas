import "dotenv/config";
import express from "express";
import { registerOAuthRoutes } from "../server/_core/oauth";

const app = express();

// CRITICAL: Register Stripe webhook BEFORE body parser middleware
async function setupStripeWebhook() {
    try {
        const { registerStripeWebhook } = await import("../server/stripe-webhook");
        registerStripeWebhook(app);
    } catch (error) {
        console.warn("[Stripe] Webhook setup skipped:", error);
    }
}

setupStripeWebhook();

// Configure body parser with larger size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS configuration
app.use((req, res, next) => {
    const allowedOrigins = [
        "http://localhost:5174",
        "http://localhost:5173",
        "http://localhost:3000"
    ];

    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.includes(".vercel.app"))) {
        res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// OAuth routes
registerOAuthRoutes(app);

// Health check endpoint
app.get("/api", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "Financial Model SaaS API"
    });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export the Express app for Vercel serverless
export default app;
