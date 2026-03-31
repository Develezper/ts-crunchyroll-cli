import type { UserProps } from "../../domain/entities/User";
import { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/interfaces/UserRepository";
import { usersData } from "../../data";
import { generarId } from "../../shared/utils/generateId";
import { NotFoundError } from "../../shared/errors/NotFoundError"; // Assumption that this exists or we will create it

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = usersData;

    async findAll(onlyActive: boolean = true): Promise<User[]> {
        if (onlyActive) {
            return this.users.filter((user) => user.activo);
        }
        return this.users;
    }

    async findById(id: number): Promise<User | null> {
        const user = this.users.find((u) => u.id === id);
        return user || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find((u) => u.email === email);
        return user || null;
    }

    async create(userProps: Omit<UserProps, "id" | "fechaCreacion" | "favoritos" | "historial" | "activo">): Promise<User> {
        const newUser = new User({
            id: generarId(),
            nombre: userProps.nombre,
            email: userProps.email,
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

    async update(id: number, data: Partial<UserProps>): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) return null;

        Object.assign(user, data);
        return user;
    }

    async addFavorite(userId: number, seriesId: number): Promise<void> {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundError("Usuario no encontrado");

        if (!user.favoritos.includes(seriesId)) {
            user.favoritos.push(seriesId);
        }
    }

    async addToHistory(userId: number, seriesId: number): Promise<void> {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundError("Usuario no encontrado");

        user.historial.push(seriesId);
    }

    async softDelete(id: number): Promise<boolean> {
        const user = await this.findById(id);
        if (!user) return false;

        user.activo = false;
        return true;
    }

    async delete(id: number): Promise<boolean> {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) return false;

        this.users.splice(index, 1);
        return true;
    }
}
