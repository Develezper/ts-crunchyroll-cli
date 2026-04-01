import { Categoria } from "../../domain/entities/Category";
import { tablaCategorias, tablaSeries } from "../../infrastructure/database";
import { ErrorNoEncontrado, ErrorValidacion } from "../../shared/errors";
import { RegistrarEjecucion } from "../../shared/decorators";
import { generarIdPorLista } from "../../shared/utils";

export class ServicioCategorias {
  private existePorNombre(nombre: string): boolean {
    return tablaCategorias.some((categoria) => categoria.nombre.toLowerCase() === nombre.toLowerCase());
  }

  @RegistrarEjecucion("Crear categoria")
  crear(nombre: string, descripcion: string): Categoria {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      throw new ErrorValidacion("El nombre de la categoria es obligatorio.");
    }

    if (this.existePorNombre(nombreLimpio)) {
      throw new ErrorValidacion("Ya existe una categoria con ese nombre.");
    }

    const id = generarIdPorLista(tablaCategorias);
    const creada = new Categoria(id, nombreLimpio, descripcion.trim());
    tablaCategorias.push(creada);
    return creada;
  }

  listar(): Categoria[] {
    return tablaCategorias;
  }

  buscarPorId(id: number): Categoria {
    const categoria = tablaCategorias.find((item) => item.id === id);
    if (!categoria) {
      throw new ErrorNoEncontrado("Categoria no encontrada.");
    }

    return categoria;
  }

  actualizar(id: number, data: Partial<Omit<Categoria, "id">>): Categoria {
    if (data.nombre !== undefined) {
      const nombreLimpio = data.nombre.trim();
      if (!nombreLimpio) {
        throw new ErrorValidacion("El nombre de la categoria no puede estar vacio.");
      }

      const categoriaExistente = tablaCategorias.find((item) => item.id === id);
      if (!categoriaExistente) {
        throw new ErrorNoEncontrado("Categoria no encontrada para actualizar.");
      }

      if (
        categoriaExistente.nombre.toLowerCase() !== nombreLimpio.toLowerCase() &&
        this.existePorNombre(nombreLimpio)
      ) {
        throw new ErrorValidacion("Ya existe una categoria con ese nombre.");
      }
    }

    const datosSeguros: Partial<Omit<Categoria, "id">> = {
      ...data,
      nombre: data.nombre?.trim(),
      descripcion: data.descripcion?.trim()
    };

    const categoria = tablaCategorias.find((item) => item.id === id);
    if (!categoria) {
      throw new ErrorNoEncontrado("Categoria no encontrada para actualizar.");
    }

    Object.assign(categoria, datosSeguros);
    return categoria;
  }

  eliminar(id: number): void {
    const seriesRelacionadas = tablaSeries.filter((serie) => serie.categoriaId === id);
    if (seriesRelacionadas.length > 0) {
      throw new ErrorValidacion("No se puede eliminar la categoria porque tiene series asociadas.");
    }

    const indice = tablaCategorias.findIndex((item) => item.id === id);
    if (indice < 0) {
      throw new ErrorNoEncontrado("Categoria no encontrada para eliminar.");
    }

    tablaCategorias.splice(indice, 1);
  }
}
