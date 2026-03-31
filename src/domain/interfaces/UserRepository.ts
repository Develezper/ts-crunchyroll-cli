import type { UserProps } from "../entities/User";
import { User } from "../entities/User";

export interface IUserRepository {
  /**
   * Returns all users, optionally filtered by active status.
   */
  findAll(onlyActive?: boolean): Promise<User[]>;

  /**
   * Finds a user by ID.
   */
  findById(id: number): Promise<User | undefined>;

  /**
   * Finds a user by email (useful for uniqueness validation).
   */
  findByEmail(email: string): Promise<User | undefined>;

  /**
   * Creates a new user.
   */
  create(
    userProps: Omit<UserProps, "id" | "fechaCreacion" | "favoritos" | "historial" | "activo">
  ): Promise<User>;

  /**
   * Updates properties of an existing user.
   */
  update(id: number, data: Partial<UserProps>): Promise<User | undefined>;

  /**
   * Soft deletes a user (active = false).
   */
  softDelete(id: number): Promise<boolean>;
}
