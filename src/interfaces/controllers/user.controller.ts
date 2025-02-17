import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import { UserMySQLRepository } from "../../infrastructure/database/user.mysql.repository";
import { RegisterUserUseCase } from "../../application/user/register-user.usecase";
import { LoginUserUseCase } from "../../application/user/login-user.usecase";
import { User } from "../../domain/entities/user.entity";

const userRepository = new UserMySQLRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

export default class UserController {
  static async register(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado, solo administradores pueden registrar usuarios" });
      }

      const { name, email, password, role }: User = req.body;
      const user = await registerUserUseCase.execute(name, email, password, role);
      res.status(201).json({ message: "Usuario registrado", user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await loginUserUseCase.execute(email, password);
      res.status(200).json({ message: "Login exitoso", token, user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}