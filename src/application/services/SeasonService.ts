import { Season } from "../../domain/entities/Season";
import type { SeasonRepository } from "../../domain/interfaces/SeasonRepository";
import { NotFoundError, ValidationError } from "../../shared/errors";
import { generateId } from "../../shared/utils";
import { LogExecution } from "../../shared/decorators";

export class SeasonService {
  constructor(private readonly seasonRepository: SeasonRepository) {}

  @LogExecution("Crear temporada")
  create(seriesId: number, number: number, title: string): Season {
    if (number <= 0) {
      throw new ValidationError("El numero de temporada debe ser mayor a 0.");
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new ValidationError("El titulo de la temporada es obligatorio.");
    }

    const id = generateId(this.seasonRepository.findAll());
    return this.seasonRepository.create(new Season(id, seriesId, number, trimmedTitle));
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
    const removed = this.seasonRepository.delete(id);
    if (!removed) {
      throw new NotFoundError("Temporada no encontrada para eliminar.");
    }
  }
}
