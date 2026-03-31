import type { UserProps } from "../../domain/entities/User";
import { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/interfaces/UserRepository";
import { usersData } from "../../data";
import { generarId } from "../../shared/utils";

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = usersData;

  async findAll(onlyActive: boolean = true): Promise<User[]> {
    if (onlyActive) {
      return this.users.filter((user) => user.activo);
    }
    return this.users;
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.users.find((user) => user.email.trim().toLowerCase() === normalizedEmail);
  }

  async create(
    userProps: Omit<UserProps, "id" | "fechaCreacion" | "favoritos" | "historial" | "activo">
  ): Promise<User> {
    const newUser = new User({
      id: generarId(),
      nombre: userProps.nombre,
      email: userProps.email.trim(),
      password: userProps.password,
      rol: userProps.rol,
      favoritos: [],
      historial: [],
      activo: true,
      fechaCreacion: new Date()
    });

    this.users.push(newUser);
    return newUser;
  }

  async update(id: number, data: Partial<UserProps>): Promise<User | undefined> {
    const user = await this.findById(id);
    if (!user) {
      return undefined;
    }

    Object.assign(user, data);
    return user;
  }

  async softDelete(id: number): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      return false;
    }

    user.activo = false;
    return true;
  }
}
