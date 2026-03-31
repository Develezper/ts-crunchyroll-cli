import { User } from "../../domain/entities/User";

export class UserView {
  static showItem(user: User): void {
    console.log(
      `👤 Usuario [${user.id}] ${user.nombre} | ${user.email} | Rol: ${user.rol} | Estado: ${
        user.activo ? "Activo" : "Inactivo"
      }`
    );
  }

  static showList(users: User[]): void {
    console.log("\n👤 Usuarios:\n");

    if (users.length === 0) {
      console.log("- Sin registros.");
      return;
    }

    console.table(
      users.map((user) => ({
        ID: user.id,
        Nombre: user.nombre,
        Email: user.email,
        Rol: user.rol,
        Estado: user.activo ? "Activo" : "Inactivo",
        Favoritos: user.favoritos.length,
        Historial: user.historial.length
      }))
    );
  }
}
