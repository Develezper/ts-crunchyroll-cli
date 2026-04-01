import { ServicioCategorias } from "../../application/services/CategoryService";
import { ControladorBase } from "./BaseController";
import { VistaCategorias } from "../views/CategoryView";
import { VistaComun } from "../views/CommonView";

export class ControladorCategorias extends ControladorBase {
  constructor(private readonly servicioCategorias: ServicioCategorias) {
    super();
  }

  crear(nombre: string, descripcion: string): void {
    const creada = this.ejecutar(() => this.servicioCategorias.crear(nombre, descripcion));
    if (!creada) {
      return;
    }

    VistaComun.mostrarExito("Categoria creada correctamente.");
    VistaCategorias.mostrarItem(creada);
  }

  listar(): void {
    const categorias = this.ejecutar(() => this.servicioCategorias.listar());
    if (!categorias) {
      return;
    }

    VistaCategorias.mostrarLista(categorias);
  }

  buscarPorId(id: number): void {
    const categoria = this.ejecutar(() => this.servicioCategorias.buscarPorId(id));
    if (!categoria) {
      return;
    }

    VistaCategorias.mostrarItem(categoria);
  }

  actualizar(id: number, data: { nombre?: string; descripcion?: string }): void {
    const actualizada = this.ejecutar(() => this.servicioCategorias.actualizar(id, data));
    if (!actualizada) {
      return;
    }

    VistaComun.mostrarExito("Categoria actualizada correctamente.");
    VistaCategorias.mostrarItem(actualizada);
  }

  eliminar(id: number): void {
    const completado = this.ejecutarVacio(() => this.servicioCategorias.eliminar(id));
    if (!completado) {
      return;
    }

    VistaComun.mostrarExito(`Categoria ${id} eliminada correctamente.`);
  }
}
