import { Episode } from "../../domain/entities/Episode";
import { Season } from "../../domain/entities/Season";

export class SeasonEpisodeView {
  static showSeasons(seasons: Season[]): void {
    console.log("\n🎞️ Temporadas:\n");
    for (const season of seasons) {
      console.log(`- [${season.id}] Serie ${season.seriesId} | T${season.number}: ${season.title}`);
    }
  }

  static showEpisodes(episodes: Episode[]): void {
    console.log("\n📺 Episodios:\n");
    for (const episode of episodes) {
      console.log(`- [${episode.id}] S${episode.seasonId}E${episode.number}: ${episode.title} (${episode.durationMin} min)`);
    }
  }
}
