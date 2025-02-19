import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";

export const isUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ error: "Acceso denegado, solo usuarios normales pueden crear envíos." });
  }
  next();
};