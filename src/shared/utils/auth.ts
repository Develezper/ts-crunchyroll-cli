import { User } from "../../domain/entities/User";

export function esAdmin(user: User): boolean {
    return user.rol === "ADMIN";
}

/**
 * Simula un middleware de Node validando que el usuario tenga rol ADMIN.
 * Lanza un error en caso de no tener permisos.
 */
export function validarAdmin(user: User | null | undefined): void {
    if (!user || user.rol !== "ADMIN") {
        throw new Error("❌ No tienes permisos para esta acción. Se requiere rol ADMIN.");
    }
}

/**
 * Ejecuta una accion solo si el usuario es ADMIN
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function requireAdmin(user: User, action: Function): any {
    if (user.rol === "ADMIN") {
        return action();
    } else {
        throw new Error("❌ Acción denegada.");
    }
}
