import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(name: string, email: string, password: string, role: "admin" | "user"): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    if (!["admin", "user"].includes(role)) {
      throw new Error("Rol inválido");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(randomUUID(), name, email, hashedPassword, role);
    return await this.userRepository.create(newUser);
  }
}