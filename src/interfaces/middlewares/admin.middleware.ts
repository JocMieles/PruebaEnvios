import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Acceso denegado, requiere rol de administrador" });
  }
  next();
};