import type { Rol, User } from "../../domain/entities/User";
import { UserService } from "../../application/services/UserService";
import { BaseController } from "./BaseController";
import { CommonView } from "../views/CommonView";
import { UserView } from "../views/UserView";

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  async create(
    currentUser: User,
    data: { nombre: string; email: string; password: string; rol: Rol }
  ): Promise<void> {
    const created = await this.executeAsync(() => this.userService.createUser(currentUser, data));
    if (!created) {
      return;
    }

    CommonView.showSuccess("Usuario creado correctamente.");
    UserView.showItem(created);
  }

  async listActive(currentUser: User): Promise<void> {
    const users = await this.executeAsync(() => this.userService.getAllActiveUsers(currentUser));
    if (!users) {
      return;
    }

    UserView.showList(users);
  }

  async update(
    currentUser: User,
    id: number,
    data: { nombre?: string; email?: string; rol?: Rol }
  ): Promise<void> {
    const updated = await this.executeAsync(() => this.userService.updateUser(currentUser, id, data));
    if (!updated) {
      return;
    }

    CommonView.showSuccess("Usuario actualizado correctamente.");
    UserView.showItem(updated);
  }

  async remove(currentUser: User, id: number): Promise<void> {
    const completed = await this.runAsync(() => this.userService.softDeleteUser(currentUser, id));
    if (!completed) {
      return;
    }

    CommonView.showSuccess(`Usuario ${id} eliminado correctamente (borrado lógico).`);
  }
}
