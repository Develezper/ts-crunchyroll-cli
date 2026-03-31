import type { User } from "../../domain/entities/User";
import { AuthorizationError } from "../errors";

let currentId = 1;

export function generateId(items: Array<{ id: number }>): number {
  if (items.length === 0) {
    return 1;
  }

  return Math.max(...items.map((item) => item.id)) + 1;
}

export function generarId(): number {
  return currentId++;
}

export function setGenerarId(baseId: number): void {
  currentId = baseId;
}

export function validarAdmin(user: User | null | undefined): void {
  if (!user || user.rol !== "ADMIN") {
    throw new AuthorizationError("No tienes permisos para esta accion. Se requiere rol ADMIN.");
  }
}
