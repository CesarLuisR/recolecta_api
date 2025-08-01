import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import config from "./config";

import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./User/routes/authRoutes";
import userRoutes from "./User/routes/userRoutes";

const app = express();

// config
app.set("port", config.port);

// middlewares
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: config.origin, 
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use(errorHandler);

export default app;