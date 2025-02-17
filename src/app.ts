import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./interfaces/routes/user.routes";

const app = express();

// Middlewares de seguridad y CORS
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);

export default app;