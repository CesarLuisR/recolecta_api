import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import config from "./config";

import errorHandler from "./middlewares/errorHandler";

import authClienteRoutes from "./lib/Auth/routes/clienteRoutes";
import usuarioRoutes from "./lib/Usuarios/routes/usuarioRoutes";
import contenedorRoutes from "./lib/Contenedores/routes/contenedorRoutes";
import rutasRoutes from "./lib/Rutas/routes";

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
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/containers", containersRoutes);

// new routes
app.use("/api/v1/auth", authClienteRoutes);
app.use("/api/v1/usuarios", usuarioRoutes);
app.use("/api/v1/contenedores", contenedorRoutes);
app.use("/api/v1/rutas", rutasRoutes);

app.use(errorHandler);

export default app;