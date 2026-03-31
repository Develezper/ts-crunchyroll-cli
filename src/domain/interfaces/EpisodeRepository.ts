import { Episode } from "../entities/Episode";

export interface EpisodeRepository {
  create(episode: Episode): Episode;
  findAll(): Episode[];
  findById(id: number): Episode | undefined;
  findBySeasonId(seasonId: number): Episode[];
  update(id: number, data: Partial<Omit<Episode, "id" | "seasonId">>): Episode | undefined;
  delete(id: number): boolean;
}
