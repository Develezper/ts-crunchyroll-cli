import type { UserProps } from "../../domain/entities/User";
import { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/interfaces/UserRepository";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { validarAdmin } from "../../shared/utils";
import { LogExecution } from "../../shared/decorators/LogExecution";

type CreateUserInput = Omit<
  UserProps,
  "id" | "fechaCreacion" | "favoritos" | "historial" | "activo" | "password"
> & { password: string };
type UpdateUserInput = Partial<Pick<UserProps, "nombre" | "email" | "rol">>;

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private validateCreateInput(data: CreateUserInput): void {
    if (!data.nombre.trim()) {
      throw new ValidationError("El nombre del usuario es obligatorio.");
    }

    if (!data.email.trim()) {
      throw new ValidationError("El email del usuario es obligatorio.");
    }

    if (!data.password?.trim()) {
      throw new ValidationError("La contraseña del usuario es obligatoria.");
    }
  }

  @LogExecution()
  async createUser(adminUser: User, data: CreateUserInput): Promise<User> {
    validarAdmin(adminUser);
    this.validateCreateInput(data);

    const normalizedEmail = this.normalizeEmail(data.email);
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ValidationError("El email ya esta en uso.");
    }

    return this.userRepository.create({
      ...data,
      nombre: data.nombre.trim(),
      email: normalizedEmail,
      password: data.password.trim()
    });
  }

  @LogExecution()
  async getAllActiveUsers(adminUser: User): Promise<User[]> {
    validarAdmin(adminUser);
    return this.userRepository.findAll(true);
  }

  @LogExecution()
  async updateUser(adminUser: User, id: number, data: UpdateUserInput): Promise<User> {
    validarAdmin(adminUser);

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuario no encontrado para actualizar.");
    }

    const safeData: UpdateUserInput = {};
    if (data.nombre !== undefined) {
      const trimmedName = data.nombre.trim();
      if (!trimmedName) {
        throw new ValidationError("El nombre no puede estar vacio.");
      }
      safeData.nombre = trimmedName;
    }

    if (data.email !== undefined) {
      const normalizedEmail = this.normalizeEmail(data.email);
      if (!normalizedEmail) {
        throw new ValidationError("El email no puede estar vacio.");
      }

      const existingUser = await this.userRepository.findByEmail(normalizedEmail);
      if (existingUser && existingUser.id !== id) {
        throw new ValidationError("El email ya esta en uso.");
      }

      safeData.email = normalizedEmail;
    }

    if (data.rol !== undefined) {
      safeData.rol = data.rol;
    }

    const updated = await this.userRepository.update(id, safeData);
    if (!updated) {
      throw new NotFoundError("Usuario no encontrado para actualizar.");
    }

    return updated;
  }

  @LogExecution()
  async softDeleteUser(adminUser: User, id: number): Promise<void> {
    validarAdmin(adminUser);
    if (adminUser.id === id) {
      throw new ValidationError("No puedes eliminarte a ti mismo.");
    }

    const removed = await this.userRepository.softDelete(id);
    if (!removed) {
      throw new NotFoundError("Usuario no encontrado para eliminar.");
    }
  }
}
