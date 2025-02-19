import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/environment";
import { IUserRepository } from "../../domain/repositories/user.repository";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<{ token: string, user: { id: string, name: string, role: string } }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Credenciales incorrectas");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Credenciales incorrectas");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user: { id: user.id, name: user.name, role: user.role } };
  }
}