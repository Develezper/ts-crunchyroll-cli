import { Season } from "../../domain/entities/Season";
import type { SeasonRepository } from "../../domain/interfaces/SeasonRepository";
import { seasonsTable } from "../database/inMemoryDb";

export class InMemorySeasonRepository implements SeasonRepository {
  create(season: Season): Season {
    seasonsTable.push(season);
    return season;
  }

  findAll(): Season[] {
    return seasonsTable;
  }

  findById(id: number): Season | undefined {
    return seasonsTable.find((season) => season.id === id);
  }

  findBySeriesId(seriesId: number): Season[] {
    return seasonsTable.filter((season) => season.seriesId === seriesId);
  }

  update(id: number, data: Partial<Omit<Season, "id" | "seriesId">>): Season | undefined {
    const season = this.findById(id);
    if (!season) {
      return undefined;
    }

    Object.assign(season, data);
    return season;
  }

  delete(id: number): boolean {
    const index = seasonsTable.findIndex((season) => season.id === id);
    if (index < 0) {
      return false;
    }

    seasonsTable.splice(index, 1);
    return true;
  }
}
