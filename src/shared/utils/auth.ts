import { User } from "../../domain/entities/User";

/**
 * Validates ADMIN role before privileged actions.
 * Throws an error when the user does not have permission.
 */
export function validarAdmin(user: User | null | undefined): void {
  if (!user || user.rol !== "ADMIN") {
    throw new Error("❌ No tienes permisos para esta acción. Se requiere rol ADMIN.");
  }
}
