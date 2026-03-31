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
    findById(id: number): Promise<User | null>;

    /**
     * Finds a user by email (useful for login and validation).
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Creates a new user.
     */
    create(userProps: Omit<UserProps, "id" | "fechaCreacion" | "favoritos" | "historial" | "activo">): Promise<User>;

    /**
     * Updates properties of an existing user.
     */
    update(id: number, data: Partial<UserProps>): Promise<User | null>;

    /**
     * Soft deletes a user (active = false).
     */
    softDelete(id: number): Promise<boolean>;

    /**
     * Hard deletes a user (optional, if an admin requires it).
     */
    delete(id: number): Promise<boolean>;
}
