import express, { Application } from "express";
import { config } from "./config/config";
import authRouter from "./routes/auth.routes";
import usersRouter from "./routes/users.routes";
import dashboardRouter from "./routes/dashboard.routes";
import studentsRouter from "./routes/students.routes";
import paymentsRouter from "./routes/payments.routes";
import activityLogsRouter from "./routes/activityLogs.routes";
import majorsRouter from "./routes/majors.routes";
import programTypesRouter from "./routes/programTypes.routes";
import taxesRouter from "./routes/taxes.routes";
import companyInfoRouter from "./routes/companyInfo.routes";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
    console.log(req.cookies);
    // req.cookies = "ts=yes;";
    res.send("hello");
});

// const apiVersion = "/api/v1";
// API routes with proper prefix
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/students", studentsRouter);
app.use("/payments", paymentsRouter);
app.use("/activity-logs", activityLogsRouter);
app.use("/majors", majorsRouter);
app.use("/program-types", programTypesRouter);
app.use("/taxes", taxesRouter);
app.use("/company-info", companyInfoRouter);

app.listen(config.port, (err) => {
    if (err) {
        console.error("Error starting server:", err);
        return;
    }
    console.log(`Server is running on port ${config.port}`);
});
