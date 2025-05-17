import express, { Application } from "express";
import { config, db } from "./config/config";
import authRouter from "./routes/auth";
import academicRouter from "./routes/academic";
import enrollmentRouter from "./routes/enrollment";
import financialRouter from "./routes/financial";
import adminRouter from "./routes/admin";

const app: Application = express();

app.use(express.json());

// const apiVersion = "/api/v1";
app.use("/auth", authRouter);
app.use("/academic", academicRouter);
app.use("/enrollment", enrollmentRouter);
app.use("/financial", financialRouter);
app.use("/admin", adminRouter);

app.listen(config.port, (err) => {
    if (err) {
        console.error("Error starting server:", err);
        return;
    }
    console.log(`Server is running on port ${config.port}`);
});
