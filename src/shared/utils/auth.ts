import { User } from "../../domain/entities/User";

export function esAdmin(user: User): boolean {
    return user.rol === "ADMIN";
}

/**
 * Simulates a Node-style middleware check for ADMIN role.
 * Throws an error when the user does not have permission.
 */
export function validarAdmin(user: User | null | undefined): void {
    if (!user || user.rol !== "ADMIN") {
        throw new Error("❌ No tienes permisos para esta acción. Se requiere rol ADMIN.");
    }
}

/**
 * Executes an action only when the user has ADMIN role.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function requireAdmin(user: User, action: Function): any {
    if (user.rol === "ADMIN") {
        return action();
    } else {
        throw new Error("❌ Acción denegada.");
    }
}
