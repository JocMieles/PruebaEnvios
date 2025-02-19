import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import pool from "./mysql.config";

export class UserMySQLRepository implements IUserRepository {

  async create(user: User): Promise<User> {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
        [user.id, user.name, user.email, user.password, user.role]
      );
      return user;
    } finally {
      connection.release();
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (rows.length > 0) {
        const user = rows[0];
        return new User(user.id, user.name, user.email, user.password, user.role);
      }
      return null;
    } finally {
      connection.release();
    }
  }

  async findByRole(role: "admin" | "user"): Promise<User[]> {
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.execute(
        "SELECT * FROM users WHERE role = ?",
        [role]
      );
      return rows.map((user: any) => new User(user.id, user.name, user.email, user.password, user.role));
    } finally {
      connection.release();
    }
  }
}