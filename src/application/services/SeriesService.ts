import { Serie } from "../../domain/entities/Series";
import { tablaCategorias, tablaSeries } from "../../infrastructure/database";
import { RegistrarEjecucion } from "../../shared/decorators";
import { ErrorNoEncontrado, ErrorValidacion } from "../../shared/errors";
import { generarIdPorLista } from "../../shared/utils";

export class ServicioSeries {
  @RegistrarEjecucion("Crear serie")
  crear(titulo: string, categoriaId: number): Serie {
    const tituloLimpio = titulo.trim();
    if (!tituloLimpio) {
      throw new ErrorValidacion("El titulo de la serie es obligatorio.");
    }

    if (!tablaCategorias.some((categoria) => categoria.id === categoriaId)) {
      throw new ErrorNoEncontrado("La categoria indicada no existe.");
    }

    const id = generarIdPorLista(tablaSeries);
    const creada = new Serie(id, tituloLimpio, categoriaId);
    tablaSeries.push(creada);
    return creada;
  }

  listar(): Serie[] {
    return tablaSeries;
  }

  buscarPorId(id: number): Serie {
    const encontrada = tablaSeries.find((serie) => serie.id === id);
    if (!encontrada) {
      throw new ErrorNoEncontrado("Serie no encontrada.");
    }

    return encontrada;
  }

  listarPorCategoria(categoriaId: number): Serie[] {
    return tablaSeries.filter((serie) => serie.categoriaId === categoriaId);
  }

  actualizar(id: number, data: Partial<Omit<Serie, "id">>): Serie {
    if (data.titulo !== undefined && !data.titulo.trim()) {
      throw new ErrorValidacion("El titulo de la serie no puede estar vacio.");
    }

    if (
      data.categoriaId !== undefined &&
      !tablaCategorias.some((categoria) => categoria.id === data.categoriaId)
    ) {
      throw new ErrorNoEncontrado("La categoria indicada no existe.");
    }

    const datosSeguros: Partial<Omit<Serie, "id">> = {
      ...data,
      titulo: data.titulo?.trim()
    };

    const serie = tablaSeries.find((item) => item.id === id);
    if (!serie) {
      throw new ErrorNoEncontrado("Serie no encontrada para actualizar.");
    }

    Object.assign(serie, datosSeguros);
    return serie;
  }

  eliminar(id: number): void {
    const serie = tablaSeries.find((item) => item.id === id);
    if (!serie) {
      throw new ErrorNoEncontrado("Serie no encontrada para eliminar.");
    }

    const indiceSerie = tablaSeries.findIndex((item) => item.id === id);
    if (indiceSerie < 0) {
      throw new ErrorNoEncontrado("Serie no encontrada para eliminar.");
    }

    tablaSeries.splice(indiceSerie, 1);
  }
}
