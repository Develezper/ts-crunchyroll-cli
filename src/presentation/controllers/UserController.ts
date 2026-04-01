import type { Rol, Usuario } from "../../domain/entities/User";
import { ServicioUsuarios } from "../../application/services/UserService";
import { ControladorBase } from "./BaseController";
import { VistaComun } from "../views/CommonView";
import { VistaUsuarios } from "../views/UserView";

export class ControladorUsuarios extends ControladorBase {
  constructor(private readonly servicioUsuarios: ServicioUsuarios) {
    super();
  }

  async crear(
    usuarioActual: Usuario,
    data: { nombre: string; email: string; password: string; rol: Rol }
  ): Promise<void> {
    const creado = await this.ejecutarAsync(() => this.servicioUsuarios.crearUsuario(usuarioActual, data));
    if (!creado) {
      return;
    }

    VistaComun.mostrarExito("Usuario creado correctamente.");
    VistaUsuarios.mostrarItem(creado);
  }

  async listarActivos(usuarioActual: Usuario): Promise<void> {
    const usuarios = await this.ejecutarAsync(() =>
      this.servicioUsuarios.listarUsuariosActivos(usuarioActual)
    );
    if (!usuarios) {
      return;
    }

    VistaUsuarios.mostrarLista(usuarios);
  }

  async actualizar(
    usuarioActual: Usuario,
    id: number,
    data: { nombre?: string; email?: string; rol?: Rol }
  ): Promise<void> {
    const actualizado = await this.ejecutarAsync(() =>
      this.servicioUsuarios.actualizarUsuario(usuarioActual, id, data)
    );
    if (!actualizado) {
      return;
    }

    VistaComun.mostrarExito("Usuario actualizado correctamente.");
    VistaUsuarios.mostrarItem(actualizado);
  }

  async eliminar(usuarioActual: Usuario, id: number): Promise<void> {
    const completado = await this.ejecutarVacioAsync(() =>
      this.servicioUsuarios.desactivarUsuario(usuarioActual, id)
    );
    if (!completado) {
      return;
    }

    VistaComun.mostrarExito(`Usuario ${id} eliminado correctamente (borrado lógico).`);
  }
}
