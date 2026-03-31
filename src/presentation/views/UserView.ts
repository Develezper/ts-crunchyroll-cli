import * as readline from "readline";
import { User } from "../../domain/entities/User";

export class UserView {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    ask(query: string): Promise<string> {
        return new Promise((resolve) => this.rl.question(`\x1b[33m${query}\x1b[0m`, resolve));
    }

    close(): void {
        this.rl.close();
    }

    printMenu(): void {
        console.log("\n--- Menú de Usuarios ---");
        console.log("1. Crear Usuario (Requiere ADMIN)");
        console.log("2. Listar Usuarios Activos (Requiere ADMIN)");
        console.log("3. Ver Mi Perfil");
        console.log("4. Eliminar Usuario (Borrado Lógico, Requiere ADMIN)");
        console.log("5. Agregar a Favoritos (Simulación)");
        console.log("6. Agregar a Historial de Vistos (Simulación)");
        console.log("0. Salir");
    }

    printSuccess(message: string): void {
        console.log(`\x1b[32m✅ Éxito:\x1b[0m ${message}`);
    }

    printError(message: string): void {
        console.log(`\x1b[31m❌ Error:\x1b[0m ${message}`);
    }

    printUsers(users: User[]): void {
        console.log("\n--- Lista de Usuarios ---");
        console.table(
            users.map((u) => ({
                ID: u.id,
                Nombre: u.nombre,
                Email: u.email,
                Rol: u.rol,
                Estado: u.activo ? "Activo" : "Inactivo",
                Favs: u.favoritos.length,
                Hist: u.historial.length,
            }))
        );
    }

    printProfile(user: User): void {
        console.log("\n--- Mi Perfil ---");
        console.log(`ID: ${user.id}`);
        console.log(`Nombre: ${user.nombre}`);
        console.log(`Email: ${user.email}`);
        console.log(`Rol: ${user.rol}`);
        console.log(`Favoritos (IDs): ${user.favoritos.join(", ")}`);
        console.log(`Historial (IDs): ${user.historial.join(", ")}`);
        console.log("-----------------\n");
    }
}
