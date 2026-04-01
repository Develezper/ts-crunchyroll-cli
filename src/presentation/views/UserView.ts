import { Usuario } from "../../domain/entities/User";

export class VistaUsuarios {
  static mostrarItem(usuario: Usuario): void {
    console.log(
      `👤 Usuario [${usuario.id}] ${usuario.nombre} | ${usuario.email} | Rol: ${usuario.rol} | Estado: ${
        usuario.activo ? "Activo" : "Inactivo"
      }`
    );
  }

  static mostrarLista(usuarios: Usuario[]): void {
    console.log("\n👤 Usuarios:\n");

    if (usuarios.length === 0) {
      console.log("- Sin registros.");
      return;
    }

    console.table(
      usuarios.map((usuario) => ({
        ID: usuario.id,
        Nombre: usuario.nombre,
        Email: usuario.email,
        Rol: usuario.rol,
        Estado: usuario.activo ? "Activo" : "Inactivo",
        Favoritos: usuario.favoritos.length,
        Historial: usuario.historial.length
      }))
    );
  }
}
