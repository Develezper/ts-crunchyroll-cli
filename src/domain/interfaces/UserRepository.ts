import type { UserProps } from "../entities/User";
import { User } from "../entities/User";

export interface IUserRepository {
    /**
     * Obtiene todos los usuarios, opcionalmente filtrando por estado activo
     */
    findAll(onlyActive?: boolean): Promise<User[]>;

    /**
     * Busca un usuario por ID
     */
    findById(id: number): Promise<User | null>;

    /**
     * Busca un usuario por email (util para login y validaciones)
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Crea un nuevo usuario
     */
    create(userProps: Omit<UserProps, "id" | "fechaCreacion" | "favoritos" | "historial" | "activo">): Promise<User>;

    /**
     * Actualiza propiedades de un usuario existente
     */
    update(id: number, data: Partial<UserProps>): Promise<User | null>;

    /**
     * Agrega un id de serie a los favoritos del usuario
     */
    addFavorite(userId: number, seriesId: number): Promise<void>;

    /**
     * Agrega un id de serie al historial de visualización del usuario
     */
    addToHistory(userId: number, seriesId: number): Promise<void>;

    /**
     * Eliminación lógica de un usuario (activo = false)
     */
    softDelete(id: number): Promise<boolean>;

    /**
     * Eliminación física (opcional, por si el Admin lo requiere)
     */
    delete(id: number): Promise<boolean>;
}
