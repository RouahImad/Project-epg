import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "./config/config";
import authRouter from "./routes/auth.routes";
import usersRouter from "./routes/users.routes";
import dashboardRouter from "./routes/dashboard.routes";
import studentsRouter from "./routes/students.routes";
import paymentsRouter from "./routes/payments.routes";
import receiptsRouter from "./routes/receipts.routes";
import activityLogsRouter from "./routes/activityLogs.routes";
import majorsRouter from "./routes/majors.routes";
import programTypesRouter from "./routes/programTypes.routes";
import taxesRouter from "./routes/taxes.routes";
import companyInfoRouter from "./routes/companyInfo.routes";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || [
            "http://127.0.0.1:5173",
            "http://localhost:5173",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// const apiVersion = "/api/v1";
// API routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/students", studentsRouter);
app.use("/payments", paymentsRouter);
app.use("/receipts", receiptsRouter);
app.use("/activity-logs", activityLogsRouter);
app.use("/majors", majorsRouter);
app.use("/program-types", programTypesRouter);
app.use("/taxes", taxesRouter);
app.use("/company-info", companyInfoRouter);

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal server error" });
});

// Handle 404 routes
// app.use((req: Request, res: Response) => {
//     res.status(404).json({ message: "Endpoint not found" });
// });

app.listen(config.port, (err) => {
    if (err) {
        console.error("Error starting server:", err);
        return;
    }
    console.log(`Server is running on port ${config.port}`);
});
