import { Episode } from "../../domain/entities/Episode";
import type { EpisodeRepository } from "../../domain/interfaces/EpisodeRepository";
import type { SeasonRepository } from "../../domain/interfaces/SeasonRepository";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { generateId } from "../../shared/utils";
import { LogExecution } from "../../shared/decorators";

export class EpisodeService {
  constructor(
    private readonly episodeRepository: EpisodeRepository,
    private readonly seasonRepository: SeasonRepository
  ) {}

  @LogExecution("Crear episodio")
  create(seasonId: number, number: number, title: string, durationMin: number): Episode {
    const season = this.seasonRepository.findById(seasonId);
    if (!season) {
      throw new NotFoundError("La temporada indicada no existe.");
    }

    if (number <= 0) {
      throw new ValidationError("El numero de episodio debe ser mayor a 0.");
    }

    if (durationMin <= 0) {
      throw new ValidationError("La duracion debe ser mayor a 0 minutos.");
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new ValidationError("El titulo del episodio es obligatorio.");
    }

    const duplicatedEpisodeNumber = this.episodeRepository
      .findBySeasonId(seasonId)
      .some((episode) => episode.number === number);
    if (duplicatedEpisodeNumber) {
      throw new ValidationError("Ya existe un episodio con ese numero en la temporada.");
    }

    const id = generateId(this.episodeRepository.findAll());
    const created = this.episodeRepository.create(
      new Episode(id, seasonId, number, trimmedTitle, durationMin)
    );

    if (!season.episodeIds.includes(created.id)) {
      this.seasonRepository.update(season.id, {
        episodeIds: [...season.episodeIds, created.id]
      });
    }

    return created;
  }

  findAll(): Episode[] {
    return this.episodeRepository.findAll();
  }

  findBySeason(seasonId: number): Episode[] {
    if (!this.seasonRepository.findById(seasonId)) {
      throw new NotFoundError("La temporada indicada no existe.");
    }

    return this.episodeRepository.findBySeasonId(seasonId);
  }

  update(id: number, data: Partial<Omit<Episode, "id" | "seasonId">>): Episode {
    const episode = this.episodeRepository.findById(id);
    if (!episode) {
      throw new NotFoundError("Episodio no encontrado para actualizar.");
    }

    if (data.number !== undefined) {
      if (data.number <= 0) {
        throw new ValidationError("El numero de episodio debe ser mayor a 0.");
      }

      const duplicatedEpisodeNumber = this.episodeRepository
        .findBySeasonId(episode.seasonId)
        .some((existingEpisode) => existingEpisode.id !== id && existingEpisode.number === data.number);

      if (duplicatedEpisodeNumber) {
        throw new ValidationError("Ya existe un episodio con ese numero en la temporada.");
      }
    }

    if (data.durationMin !== undefined && data.durationMin <= 0) {
      throw new ValidationError("La duracion debe ser mayor a 0 minutos.");
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new ValidationError("El titulo del episodio no puede estar vacio.");
    }

    const safeData: Partial<Omit<Episode, "id" | "seasonId">> = {
      ...data,
      title: data.title?.trim()
    };

    const updated = this.episodeRepository.update(id, safeData);
    if (!updated) {
      throw new NotFoundError("Episodio no encontrado para actualizar.");
    }

    return updated;
  }

  remove(id: number): void {
    const episode = this.episodeRepository.findById(id);
    if (!episode) {
      throw new NotFoundError("Episodio no encontrado para eliminar.");
    }

    const removed = this.episodeRepository.delete(id);
    if (!removed) {
      throw new NotFoundError("Episodio no encontrado para eliminar.");
    }

    const season = this.seasonRepository.findById(episode.seasonId);
    if (season) {
      this.seasonRepository.update(season.id, {
        episodeIds: season.episodeIds.filter((episodeId) => episodeId !== id)
      });
    }
  }
}
