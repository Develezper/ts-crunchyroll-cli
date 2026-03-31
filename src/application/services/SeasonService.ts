import { Season } from "../../domain/entities/Season";
import type { SeasonRepository } from "../../domain/interfaces/SeasonRepository";
import type { SeriesRepository } from "../../domain/interfaces/SeriesRepository";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { generateId } from "../../shared/utils";
import { LogExecution } from "../../shared/decorators";

export class SeasonService {
  constructor(
    private readonly seasonRepository: SeasonRepository,
    private readonly seriesRepository: SeriesRepository
  ) {}

  @LogExecution("Crear temporada")
  create(seriesId: number, number: number, title: string): Season {
    if (number <= 0) {
      throw new ValidationError("El numero de temporada debe ser mayor a 0.");
    }

    const series = this.seriesRepository.findById(seriesId);
    if (!series) {
      throw new NotFoundError("La serie indicada no existe.");
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new ValidationError("El titulo de la temporada es obligatorio.");
    }

    const id = generateId(this.seasonRepository.findAll());
    const created = this.seasonRepository.create(new Season(id, seriesId, number, trimmedTitle));

    // Keep bidirectional in-memory relation synchronized (Series -> Season IDs).
    if (!series.seasonIds.includes(created.id)) {
      this.seriesRepository.update(series.id, {
        seasonIds: [...series.seasonIds, created.id]
      });
    }

    return created;
  }

  findAll(): Season[] {
    return this.seasonRepository.findAll();
  }

  findBySeries(seriesId: number): Season[] {
    return this.seasonRepository.findBySeriesId(seriesId);
  }

  update(id: number, data: Partial<Omit<Season, "id" | "seriesId">>): Season {
    const updated = this.seasonRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError("Temporada no encontrada para actualizar.");
    }

    return updated;
  }

  remove(id: number): void {
    const season = this.seasonRepository.findById(id);
    if (!season) {
      throw new NotFoundError("Temporada no encontrada para eliminar.");
    }

    const removed = this.seasonRepository.delete(id);
    if (!removed) {
      throw new NotFoundError("Temporada no encontrada para eliminar.");
    }

    const series = this.seriesRepository.findById(season.seriesId);
    if (series) {
      this.seriesRepository.update(series.id, {
        seasonIds: series.seasonIds.filter((seasonId) => seasonId !== id)
      });
    }
  }
}
