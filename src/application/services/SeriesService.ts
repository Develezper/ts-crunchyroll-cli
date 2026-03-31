import { Series } from "../../domain/entities/Series";
import type { CategoryRepository } from "../../domain/interfaces/CategoryRepository";
import type { SeriesRepository } from "../../domain/interfaces/SeriesRepository";
import { LogExecution } from "../../shared/decorators";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { generateId } from "../../shared/utils";

export class SeriesService {
  constructor(
    private readonly seriesRepository: SeriesRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  @LogExecution("Crear serie")
  create(title: string, categoryId: number): Series {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new ValidationError("El titulo de la serie es obligatorio.");
    }

    // Cross-entity validation to avoid orphan series records.
    const category = this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundError("La categoria indicada no existe.");
    }

    const id = generateId(this.seriesRepository.findAll());
    return this.seriesRepository.create(new Series(id, trimmedTitle, categoryId));
  }

  findAll(): Series[] {
    return this.seriesRepository.findAll();
  }

  findById(id: number): Series {
    const series = this.seriesRepository.findById(id);
    if (!series) {
      throw new NotFoundError("Serie no encontrada.");
    }

    return series;
  }

  findByCategory(categoryId: number): Series[] {
    return this.seriesRepository.findByCategoryId(categoryId);
  }

  update(id: number, data: Partial<Omit<Series, "id">>): Series {
    if (data.title !== undefined && !data.title.trim()) {
      throw new ValidationError("El titulo de la serie no puede quedar vacio.");
    }

    if (data.categoryId !== undefined) {
      const category = this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new NotFoundError("La categoria indicada no existe.");
      }
    }

    // Normalize values once so repository stays focused on persistence only.
    const safeData: Partial<Omit<Series, "id">> = {
      ...data,
      title: data.title?.trim()
    };

    const updated = this.seriesRepository.update(id, safeData);
    if (!updated) {
      throw new NotFoundError("Serie no encontrada para actualizar.");
    }

    return updated;
  }

  remove(id: number): void {
    const removed = this.seriesRepository.delete(id);
    if (!removed) {
      throw new NotFoundError("Serie no encontrada para eliminar.");
    }
  }
}
