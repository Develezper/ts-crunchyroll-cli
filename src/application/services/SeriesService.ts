import { Series } from "../../domain/entities/Series";
import type { CategoryRepository } from "../../domain/interfaces/CategoryRepository";
import type { EpisodeRepository } from "../../domain/interfaces/EpisodeRepository";
import type { SeasonRepository } from "../../domain/interfaces/SeasonRepository";
import type { SeriesRepository } from "../../domain/interfaces/SeriesRepository";
import { LogExecution } from "../../shared/decorators";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { generateId } from "../../shared/utils";

export class SeriesService {
  constructor(
    private readonly seriesRepository: SeriesRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly seasonRepository: SeasonRepository,
    private readonly episodeRepository: EpisodeRepository
  ) {}

  @LogExecution("Crear serie")
  create(title: string, categoryId: number): Series {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new ValidationError("El titulo de la serie es obligatorio.");
    }

    if (!this.categoryRepository.findById(categoryId)) {
      throw new NotFoundError("La categoria indicada no existe.");
    }

    const id = generateId(this.seriesRepository.findAll());
    return this.seriesRepository.create(new Series(id, trimmedTitle, categoryId));
  }

  findAll(): Series[] {
    return this.seriesRepository.findAll();
  }

  findById(id: number): Series {
    const found = this.seriesRepository.findById(id);
    if (!found) {
      throw new NotFoundError("Serie no encontrada.");
    }

    return found;
  }

  findByCategory(categoryId: number): Series[] {
    return this.seriesRepository.findByCategoryId(categoryId);
  }

  update(id: number, data: Partial<Omit<Series, "id">>): Series {
    if (data.title !== undefined && !data.title.trim()) {
      throw new ValidationError("El titulo de la serie no puede estar vacio.");
    }

    if (data.categoryId !== undefined && !this.categoryRepository.findById(data.categoryId)) {
      throw new NotFoundError("La categoria indicada no existe.");
    }

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
    const series = this.seriesRepository.findById(id);
    if (!series) {
      throw new NotFoundError("Serie no encontrada para eliminar.");
    }

    // Keep data integrity by removing children before deleting parent series.
    const seasons = this.seasonRepository.findBySeriesId(series.id);
    for (const season of seasons) {
      const episodes = this.episodeRepository.findBySeasonId(season.id);
      for (const episode of episodes) {
        this.episodeRepository.delete(episode.id);
      }
      this.seasonRepository.delete(season.id);
    }

    const removed = this.seriesRepository.delete(id);
    if (!removed) {
      throw new NotFoundError("Serie no encontrada para eliminar.");
    }
  }
}
