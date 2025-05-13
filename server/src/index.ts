import express, { Application } from "express";
import { config } from "./config/config";
import authRouter from "./routes/auth";

const app: Application = express();

app.use(express.json());

app.use("/auth", authRouter);

app.listen(config.port, (err) => {
    if (err) {
        console.error("Error starting server:", err);
        return;
    }
    console.log(`Server is running on port ${config.port}`);
});
