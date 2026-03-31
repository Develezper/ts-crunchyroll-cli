import * as fs from "fs";
import * as path from "path";
import type { UserProps } from "../../domain/entities/User";
import { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/interfaces/UserRepository";
import { usersData } from "../../data";
import { generarId } from "../../shared/utils/generateId";

const DATA_FILE = path.resolve(process.cwd(), "data", "users.json");

export class JsonUserRepository implements IUserRepository {
    private users: User[] = [];

    constructor() {
        this.loadData();
    }

    private loadData(): void {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (!fs.existsSync(DATA_FILE)) {
            this.users = [...usersData];
            this.saveData();
        } else {
            const raw = fs.readFileSync(DATA_FILE, "utf-8");
            const parsed = JSON.parse(raw) as UserProps[];
            this.users = parsed.map((props) => new User({
                ...props,
                fechaCreacion: new Date(props.fechaCreacion)
            }));
        }
    }

    private saveData(): void {
        const propsArray = this.users.map((u) => u.toJSON());
        fs.writeFileSync(DATA_FILE, JSON.stringify(propsArray, null, 2), "utf-8");
    }

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
        this.saveData();
        return newUser;
    }

    async update(id: number, data: Partial<UserProps>): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) return null;

        Object.assign(user, data);
        this.saveData();
        return user;
    }

    async addFavorite(userId: number, seriesId: number): Promise<void> {
        const user = await this.findById(userId);
        if (!user) throw new Error("Usuario no encontrado");

        if (!user.favoritos.includes(seriesId)) {
            user.favoritos.push(seriesId);
            this.saveData();
        }
    }

    async addToHistory(userId: number, seriesId: number): Promise<void> {
        const user = await this.findById(userId);
        if (!user) throw new Error("Usuario no encontrado");

        user.historial.push(seriesId);
        this.saveData();
    }

    async softDelete(id: number): Promise<boolean> {
        const user = await this.findById(id);
        if (!user) return false;

        user.activo = false;
        this.saveData();
        return true;
    }

    async delete(id: number): Promise<boolean> {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) return false;

        this.users.splice(index, 1);
        this.saveData();
        return true;
    }
}
