import { Episode } from "../../domain/entities/Episode";
import type { EpisodeRepository } from "../../domain/interfaces/EpisodeRepository";
import { episodesTable } from "../database/inMemoryDb";

export class InMemoryEpisodeRepository implements EpisodeRepository {
  create(episode: Episode): Episode {
    episodesTable.push(episode);
    return episode;
  }

  findAll(): Episode[] {
    return episodesTable;
  }

  findById(id: number): Episode | undefined {
    return episodesTable.find((episode) => episode.id === id);
  }

  findBySeasonId(seasonId: number): Episode[] {
    return episodesTable.filter((episode) => episode.seasonId === seasonId);
  }

  update(id: number, data: Partial<Omit<Episode, "id" | "seasonId">>): Episode | undefined {
    const episode = this.findById(id);
    if (!episode) {
      return undefined;
    }

    Object.assign(episode, data);
    return episode;
  }

  delete(id: number): boolean {
    const index = episodesTable.findIndex((episode) => episode.id === id);
    if (index < 0) {
      return false;
    }

    episodesTable.splice(index, 1);
    return true;
  }
}
