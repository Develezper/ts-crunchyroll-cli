import type { Rol, User } from "../../domain/entities/User";
import { UserService } from "../../application/services/UserService";
import { CommonView } from "../views/CommonView";
import { UserView } from "../views/UserView";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(
    currentUser: User,
    data: { nombre: string; email: string; password: string; rol: Rol }
  ): Promise<void> {
    try {
      const created = await this.userService.createUser(currentUser, data);
      CommonView.showSuccess("Usuario creado correctamente.");
      UserView.showItem(created);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  async listActive(currentUser: User): Promise<void> {
    try {
      const users = await this.userService.getAllActiveUsers(currentUser);
      UserView.showList(users);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  async update(
    currentUser: User,
    id: number,
    data: { nombre?: string; email?: string; rol?: Rol }
  ): Promise<void> {
    try {
      const updated = await this.userService.updateUser(currentUser, id, data);
      if (!updated) {
        CommonView.showError(new Error("Usuario no encontrado para actualizar."));
        return;
      }

      CommonView.showSuccess("Usuario actualizado correctamente.");
      UserView.showItem(updated);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  async remove(currentUser: User, id: number): Promise<void> {
    try {
      const removed = await this.userService.softDeleteUser(currentUser, id);
      if (!removed) {
        CommonView.showError(new Error("Usuario no encontrado para eliminar."));
        return;
      }

      CommonView.showSuccess(`Usuario ${id} eliminado correctamente (borrado lógico).`);
    } catch (error) {
      CommonView.showError(error);
    }
  }
}
