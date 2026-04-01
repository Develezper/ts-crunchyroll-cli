import { ServicioSeries } from "../../application/services/SeriesService";
import { ControladorBase } from "./BaseController";
import { VistaComun } from "../views/CommonView";
import { VistaSeries } from "../views/SeriesView";

export class ControladorSeries extends ControladorBase {
  constructor(private readonly servicioSeries: ServicioSeries) {
    super();
  }

  crear(titulo: string, categoriaId: number): void {
    const creada = this.ejecutar(() => this.servicioSeries.crear(titulo, categoriaId));
    if (!creada) {
      return;
    }

    VistaComun.mostrarExito("Serie creada correctamente.");
    VistaSeries.mostrarItem(creada);
  }

  listar(): void {
    const listaSeries = this.ejecutar(() => this.servicioSeries.listar());
    if (!listaSeries) {
      return;
    }

    VistaSeries.mostrarLista(listaSeries);
  }

  buscarPorId(id: number): void {
    const serie = this.ejecutar(() => this.servicioSeries.buscarPorId(id));
    if (!serie) {
      return;
    }

    VistaSeries.mostrarItem(serie);
  }

  listarPorCategoria(categoriaId: number): void {
    const listaSeries = this.ejecutar(() => this.servicioSeries.listarPorCategoria(categoriaId));
    if (!listaSeries) {
      return;
    }

    VistaSeries.mostrarLista(listaSeries);
  }

  actualizar(id: number, data: { titulo?: string; categoriaId?: number }): void {
    const actualizada = this.ejecutar(() => this.servicioSeries.actualizar(id, data));
    if (!actualizada) {
      return;
    }

    VistaComun.mostrarExito("Serie actualizada correctamente.");
    VistaSeries.mostrarItem(actualizada);
  }

  eliminar(id: number): void {
    const completado = this.ejecutarVacio(() => this.servicioSeries.eliminar(id));
    if (!completado) {
      return;
    }

    VistaComun.mostrarExito(`Serie ${id} eliminada correctamente.`);
  }
}
