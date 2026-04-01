import type { PropiedadesUsuario } from "../../domain/entities/User";
import { Usuario } from "../../domain/entities/User";
import { datosUsuarios } from "../../data";
import { ErrorNoEncontrado, ErrorValidacion } from "../../shared/errors";
import { RegistrarEjecucion } from "../../shared/decorators";
import { generarIdSecuencial, validarAdmin } from "../../shared/utils";

type EntradaCrearUsuario = Omit<
  PropiedadesUsuario,
  "id" | "fechaCreacion" | "favoritos" | "historial" | "activo" | "password"
> & { password: string };

type EntradaActualizarUsuario = Partial<Pick<PropiedadesUsuario, "nombre" | "email" | "rol">>;

export class ServicioUsuarios {
  private normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private buscarPorId(id: number): Usuario | undefined {
    return datosUsuarios.find((usuario) => usuario.id === id);
  }

  private buscarPorEmail(email: string): Usuario | undefined {
    const emailNormalizado = this.normalizarEmail(email);
    return datosUsuarios.find((usuario) => this.normalizarEmail(usuario.email) === emailNormalizado);
  }

  private validarEntradaCrear(data: EntradaCrearUsuario): void {
    if (!data.nombre.trim()) {
      throw new ErrorValidacion("El nombre del usuario es obligatorio.");
    }

    if (!data.email.trim()) {
      throw new ErrorValidacion("El email del usuario es obligatorio.");
    }

    if (!data.password?.trim()) {
      throw new ErrorValidacion("La contraseña del usuario es obligatoria.");
    }
  }

  @RegistrarEjecucion()
  async crearUsuario(usuarioAdmin: Usuario, data: EntradaCrearUsuario): Promise<Usuario> {
    validarAdmin(usuarioAdmin);
    this.validarEntradaCrear(data);

    const emailNormalizado = this.normalizarEmail(data.email);
    const usuarioExistente = this.buscarPorEmail(emailNormalizado);
    if (usuarioExistente) {
      throw new ErrorValidacion("El email ya esta en uso.");
    }

    const creado = new Usuario({
      id: generarIdSecuencial(),
      nombre: data.nombre.trim(),
      email: emailNormalizado,
      password: data.password.trim(),
      rol: data.rol,
      favoritos: [],
      historial: [],
      activo: true,
      fechaCreacion: new Date()
    });

    datosUsuarios.push(creado);
    return creado;
  }

  @RegistrarEjecucion()
  async listarUsuariosActivos(usuarioAdmin: Usuario): Promise<Usuario[]> {
    validarAdmin(usuarioAdmin);
    return datosUsuarios.filter((usuario) => usuario.activo);
  }

  @RegistrarEjecucion()
  async actualizarUsuario(
    usuarioAdmin: Usuario,
    id: number,
    data: EntradaActualizarUsuario
  ): Promise<Usuario> {
    validarAdmin(usuarioAdmin);

    const usuario = this.buscarPorId(id);
    if (!usuario) {
      throw new ErrorNoEncontrado("Usuario no encontrado para actualizar.");
    }

    const datosSeguros: EntradaActualizarUsuario = {};
    if (data.nombre !== undefined) {
      const nombreLimpio = data.nombre.trim();
      if (!nombreLimpio) {
        throw new ErrorValidacion("El nombre no puede estar vacio.");
      }
      datosSeguros.nombre = nombreLimpio;
    }

    if (data.email !== undefined) {
      const emailNormalizado = this.normalizarEmail(data.email);
      if (!emailNormalizado) {
        throw new ErrorValidacion("El email no puede estar vacio.");
      }

      const usuarioExistente = this.buscarPorEmail(emailNormalizado);
      if (usuarioExistente && usuarioExistente.id !== id) {
        throw new ErrorValidacion("El email ya esta en uso.");
      }

      datosSeguros.email = emailNormalizado;
    }

    if (data.rol !== undefined) {
      datosSeguros.rol = data.rol;
    }

    Object.assign(usuario, datosSeguros);
    return usuario;
  }

  @RegistrarEjecucion()
  async desactivarUsuario(usuarioAdmin: Usuario, id: number): Promise<void> {
    validarAdmin(usuarioAdmin);
    if (usuarioAdmin.id === id) {
      throw new ErrorValidacion("No puedes eliminarte a ti mismo.");
    }

    const usuario = this.buscarPorId(id);
    if (!usuario) {
      throw new ErrorNoEncontrado("Usuario no encontrado para eliminar.");
    }

    usuario.activo = false;
  }
}
