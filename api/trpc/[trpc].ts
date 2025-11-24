import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

const app = express();

// Configure body parser
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

// tRPC middleware
const trpcHandler = createExpressMiddleware({
    router: appRouter,
    createContext,
});

// Handle all tRPC requests
app.use(trpcHandler);

// Export for Vercel
export default app;
