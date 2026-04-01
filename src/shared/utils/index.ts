import type { Usuario } from "../../domain/entities/User";
import { ErrorAutorizacion } from "../errors";

let idActual = 1;

export function generarIdPorLista(elementos: Array<{ id: number }>): number {
  if (elementos.length === 0) {
    return 1;
  }

  return Math.max(...elementos.map((elemento) => elemento.id)) + 1;
}

export function generarIdSecuencial(): number {
  return idActual++;
}

export function fijarIdSecuencial(idBase: number): void {
  idActual = idBase;
}

export function validarAdmin(usuario: Usuario | null | undefined): void {
  if (!usuario || usuario.rol !== "ADMIN") {
    throw new ErrorAutorizacion("No tienes permisos para esta accion. Se requiere rol ADMIN.");
  }
}
