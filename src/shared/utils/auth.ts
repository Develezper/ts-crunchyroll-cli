import { User } from "../../domain/entities/User";
import { AuthorizationError } from "../errors";

/**
 * Validates ADMIN role before privileged actions.
 * Throws an error when the user does not have permission.
 */
export function validarAdmin(user: User | null | undefined): void {
  if (!user || user.rol !== "ADMIN") {
    throw new AuthorizationError("No tienes permisos para esta accion. Se requiere rol ADMIN.");
  }
}
