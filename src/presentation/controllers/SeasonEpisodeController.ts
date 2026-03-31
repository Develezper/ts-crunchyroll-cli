import { EpisodeService } from "../../application/services/EpisodeService";
import { SeasonService } from "../../application/services/SeasonService";
import { BaseController } from "./BaseController";
import { CommonView } from "../views/CommonView";
import { SeasonEpisodeView } from "../views/SeasonEpisodeView";

export class SeasonEpisodeController extends BaseController {
  constructor(
    private readonly seasonService: SeasonService,
    private readonly episodeService: EpisodeService
  ) {
    super();
  }

  createSeason(seriesId: number, number: number, title: string): void {
    const season = this.execute(() => this.seasonService.create(seriesId, number, title));
    if (!season) {
      return;
    }

    CommonView.showSuccess("Temporada creada correctamente.");
    SeasonEpisodeView.showSeason(season);
  }

  listSeasons(): void {
    const seasons = this.execute(() => this.seasonService.findAll());
    if (!seasons) {
      return;
    }

    SeasonEpisodeView.showSeasons(seasons);
  }

  updateSeason(id: number, data: { number?: number; title?: string }): void {
    const updated = this.execute(() => this.seasonService.update(id, data));
    if (!updated) {
      return;
    }

    CommonView.showSuccess("Temporada actualizada correctamente.");
    SeasonEpisodeView.showSeason(updated);
  }

  removeSeason(id: number): void {
    const completed = this.run(() => this.seasonService.remove(id));
    if (!completed) {
      return;
    }

    CommonView.showSuccess(`Temporada ${id} eliminada correctamente.`);
  }

  createEpisode(seasonId: number, number: number, title: string, durationMin: number): void {
    const episode = this.execute(() =>
      this.episodeService.create(seasonId, number, title, durationMin)
    );
    if (!episode) {
      return;
    }

    CommonView.showSuccess("Episodio creado correctamente.");
    SeasonEpisodeView.showEpisode(episode);
  }

  listEpisodesBySeason(seasonId: number): void {
    const episodes = this.execute(() => this.episodeService.findBySeason(seasonId));
    if (!episodes) {
      return;
    }

    SeasonEpisodeView.showEpisodes(episodes);
  }

  listAllEpisodes(): void {
    const episodes = this.execute(() => this.episodeService.findAll());
    if (!episodes) {
      return;
    }

    SeasonEpisodeView.showEpisodes(episodes);
  }

  updateEpisode(
    id: number,
    data: { number?: number; title?: string; durationMin?: number }
  ): void {
    const updated = this.execute(() => this.episodeService.update(id, data));
    if (!updated) {
      return;
    }

    CommonView.showSuccess("Episodio actualizado correctamente.");
    SeasonEpisodeView.showEpisode(updated);
  }

  removeEpisode(id: number): void {
    const completed = this.run(() => this.episodeService.remove(id));
    if (!completed) {
      return;
    }

    CommonView.showSuccess(`Episodio ${id} eliminado correctamente.`);
  }
}
