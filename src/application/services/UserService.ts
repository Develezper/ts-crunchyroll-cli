import type { UserProps } from "../../domain/entities/User";
import { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/interfaces/UserRepository";
import { validarAdmin } from "../../shared/utils/auth";
import { LogExecution } from "../../shared/decorators/LogExecution";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) { }

    @LogExecution()
    async login(email: string, password?: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        // Validation
        if (!user || !user.activo) {
            throw new Error("Credenciales inválidas o usuario inactivo");
        }
        if (!password) {
            throw new Error("La contraseña es requerida para poder iniciar sesión");
        }
        if (user.password !== password) {
            throw new Error("Contraseña incorrecta");
        }
        return user;
    }

    @LogExecution()
    async createUser(adminUser: User, data: Omit<UserProps, "id" | "fechaCreacion" | "favoritos" | "historial" | "activo">): Promise<User> {
        // Only admins can create users explicitly when this rule applies
        validarAdmin(adminUser);

        const exist = await this.userRepository.findByEmail(data.email);
        if (exist) {
            throw new Error("El email ya está en uso");
        }

        return this.userRepository.create(data);
    }

    @LogExecution()
    async getAllActiveUsers(adminUser: User): Promise<User[]> {
        validarAdmin(adminUser);
        return this.userRepository.findAll(true);
    }

    @LogExecution()
    async getUserById(id: number): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    @LogExecution()
    async updateUser(adminUser: User, id: number, data: Partial<UserProps>): Promise<User | null> {
        validarAdmin(adminUser);
        return this.userRepository.update(id, data);
    }

    @LogExecution()
    async softDeleteUser(adminUser: User, id: number): Promise<boolean> {
        validarAdmin(adminUser);
        if (adminUser.id === id) {
            throw new Error("No puedes eliminarte a ti mismo");
        }
        return this.userRepository.softDelete(id);
    }
}
