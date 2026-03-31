import { Season } from "../../domain/entities/Season";
import type { EpisodeRepository } from "../../domain/interfaces/EpisodeRepository";
import type { SeasonRepository } from "../../domain/interfaces/SeasonRepository";
import type { SeriesRepository } from "../../domain/interfaces/SeriesRepository";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { generateId } from "../../shared/utils";
import { LogExecution } from "../../shared/decorators";

export class SeasonService {
  constructor(
    private readonly seasonRepository: SeasonRepository,
    private readonly episodeRepository: EpisodeRepository,
    private readonly seriesRepository: SeriesRepository
  ) {}

  @LogExecution("Crear temporada")
  create(seriesId: number, number: number, title: string): Season {
    const series = this.seriesRepository.findById(seriesId);
    if (!series) {
      throw new NotFoundError("La serie indicada no existe.");
    }

    if (number <= 0) {
      throw new ValidationError("El numero de temporada debe ser mayor a 0.");
    }

    const duplicatedNumber = this.seasonRepository
      .findBySeriesId(seriesId)
      .some((season) => season.number === number);
    if (duplicatedNumber) {
      throw new ValidationError("Ya existe una temporada con ese numero en la serie.");
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new ValidationError("El titulo de la temporada es obligatorio.");
    }

    const id = generateId(this.seasonRepository.findAll());
    const created = this.seasonRepository.create(new Season(id, seriesId, number, trimmedTitle));

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

  update(id: number, data: Partial<Pick<Season, "number" | "title">>): Season {
    const currentSeason = this.seasonRepository.findById(id);
    if (!currentSeason) {
      throw new NotFoundError("Temporada no encontrada para actualizar.");
    }

    if (data.number !== undefined) {
      if (data.number <= 0) {
        throw new ValidationError("El numero de temporada debe ser mayor a 0.");
      }

      const duplicatedNumber = this.seasonRepository
        .findBySeriesId(currentSeason.seriesId)
        .some((season) => season.id !== id && season.number === data.number);

      if (duplicatedNumber) {
        throw new ValidationError("Ya existe una temporada con ese numero en la serie.");
      }
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new ValidationError("El titulo de la temporada no puede estar vacio.");
    }

    const safeData: Partial<Pick<Season, "number" | "title">> = {
      ...data,
      title: data.title?.trim()
    };

    const updated = this.seasonRepository.update(id, safeData);
    if (!updated) {
      throw new NotFoundError("Temporada no encontrada para actualizar.");
    }

    return updated;
  }

  remove(id: number): void {
    // Cascade delete to prevent orphan episodes when a season is removed.
    const episodes = this.episodeRepository.findBySeasonId(id);
    for (const episode of episodes) {
      this.episodeRepository.delete(episode.id);
    }

    const season = this.seasonRepository.findById(id);
    const removed = this.seasonRepository.delete(id);
    if (!removed) {
      throw new NotFoundError("Temporada no encontrada para eliminar.");
    }

    if (season) {
      const series = this.seriesRepository.findById(season.seriesId);
      if (series) {
        this.seriesRepository.update(series.id, {
          seasonIds: series.seasonIds.filter((seasonId) => seasonId !== id)
        });
      }
    }
  }
}
