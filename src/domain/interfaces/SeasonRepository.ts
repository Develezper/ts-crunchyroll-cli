import { Season } from "../entities/Season";

export interface SeasonRepository {
  create(season: Season): Season;
  findAll(): Season[];
  findById(id: number): Season | undefined;
  findBySeriesId(seriesId: number): Season[];
  update(id: number, data: Partial<Omit<Season, "id" | "seriesId">>): Season | undefined;
  delete(id: number): boolean;
}
