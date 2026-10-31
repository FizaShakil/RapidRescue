import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.router.js";
import bookingRouter from "./routes/bookings.router.js";
import ambulanceRouter from "./routes/ambulance.router.js";
import { adminDriverRouter, driverRouter } from "./routes/driver.router.js";
import medicalProfileRouter from "./routes/medicalprofile.router.js";
import feedbackRouter from "./routes/feedback.router.js";

const app = express();

// Core middleware 
app.use(cors({ 
    origin: process.env.CORS_ORIGIN, 
    credentials: true 
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
// Mount order matters — more specific prefixes before wildcards

// Public + user-authenticated routes
app.use("/api/v1/users", userRouter);

// Driver self-service routes
app.use("/api/v1/driver", driverRouter);

// Admin-only routes
app.use("/api/v1/admin/bookings", bookingRouter);
app.use("/api/v1/admin/ambulances", ambulanceRouter);
app.use("/api/v1/admin/drivers", adminDriverRouter);
app.use("/api/v1/admin/medical-profiles", medicalProfileRouter);
app.use("/api/v1/admin/feedback", feedbackRouter);

// ── 404 handler — catches any unmatched route ─────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ── Global error handler ──────────────────────────────────────────────────────
// Receives errors thrown via ApiError or passed to next(err) by asyncHandler.
// Stack traces are suppressed in production to avoid leaking implementation details.
// 4-parameter signature is required by Express to recognise this as an error handler.

// _req and _next are unused but must be present.
app.use((err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    const response = {
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
    };

    // Only include stack trace in development
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    return res.status(statusCode).json(response);
});

export default app;
