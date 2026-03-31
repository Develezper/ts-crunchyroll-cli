import { Category } from "../../domain/entities/Category";
import type { CategoryRepository } from "../../domain/interfaces/CategoryRepository";
import type { SeriesRepository } from "../../domain/interfaces/SeriesRepository";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { generateId } from "../../shared/utils";
import { LogExecution } from "../../shared/decorators";

export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly seriesRepository: SeriesRepository
  ) {}

  @LogExecution("Crear categoria")
  create(name: string, description: string): Category {
    // Normalize and validate user input before touching persistence.
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new ValidationError("El nombre de la categoria es obligatorio.");
    }

    // Enforce a business invariant: category name must be unique.
    if (this.categoryRepository.existsByName(trimmedName)) {
      throw new ValidationError("Ya existe una categoria con ese nombre.");
    }

    // ID is generated from current persisted data to keep it deterministic in-memory.
    const id = generateId(this.categoryRepository.findAll());
    return this.categoryRepository.create(new Category(id, trimmedName, description.trim()));
  }

  findAll(): Category[] {
    return this.categoryRepository.findAll();
  }

  findById(id: number): Category {
    const category = this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError("Categoria no encontrada.");
    }

    return category;
  }

  update(id: number, data: Partial<Omit<Category, "id">>): Category {
    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        throw new ValidationError("El nombre de la categoria no puede estar vacio.");
      }

      const existingCategory = this.categoryRepository.findById(id);
      if (!existingCategory) {
        throw new NotFoundError("Categoria no encontrada para actualizar.");
      }

      if (
        existingCategory.name.toLowerCase() !== trimmedName.toLowerCase() &&
        this.categoryRepository.existsByName(trimmedName)
      ) {
        throw new ValidationError("Ya existe una categoria con ese nombre.");
      }
    }

    const safeData: Partial<Omit<Category, "id">> = {
      ...data,
      name: data.name?.trim(),
      description: data.description?.trim()
    };

    const updated = this.categoryRepository.update(id, safeData);
    if (!updated) {
      throw new NotFoundError("Categoria no encontrada para actualizar.");
    }

    return updated;
  }

  remove(id: number): void {
    const relatedSeries = this.seriesRepository.findByCategoryId(id);
    if (relatedSeries.length > 0) {
      throw new ValidationError(
        "No se puede eliminar la categoria porque tiene series asociadas."
      );
    }

    const removed = this.categoryRepository.delete(id);
    if (!removed) {
      throw new NotFoundError("Categoria no encontrada para eliminar.");
    }
  }
}
