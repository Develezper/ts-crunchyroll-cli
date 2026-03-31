import { Episode } from "../../domain/entities/Episode";
import type { EpisodeRepository } from "../../domain/interfaces/EpisodeRepository";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { generateId } from "../../shared/utils";
import { LogExecution } from "../../shared/decorators";

export class EpisodeService {
  constructor(private readonly episodeRepository: EpisodeRepository) {}

  @LogExecution("Crear episodio")
  create(seasonId: number, number: number, title: string, durationMin: number): Episode {
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

    const id = generateId(this.episodeRepository.findAll());
    return this.episodeRepository.create(new Episode(id, seasonId, number, trimmedTitle, durationMin));
  }

  findAll(): Episode[] {
    return this.episodeRepository.findAll();
  }

  findBySeason(seasonId: number): Episode[] {
    return this.episodeRepository.findBySeasonId(seasonId);
  }

  update(id: number, data: Partial<Omit<Episode, "id" | "seasonId">>): Episode {
    const updated = this.episodeRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError("Episodio no encontrado para actualizar.");
    }

    return updated;
  }

  remove(id: number): void {
    const removed = this.episodeRepository.delete(id);
    if (!removed) {
      throw new NotFoundError("Episodio no encontrado para eliminar.");
    }
  }
}
