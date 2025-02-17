import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/environment";
import { AuthenticatedRequest } from "../types/express";

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso denegado, token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string; role: "admin" | "user" };
    req.user = decoded; // Ahora TypeScript reconoce `user`
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};