import { EpisodeService } from "../../application/services/EpisodeService";
import { SeasonService } from "../../application/services/SeasonService";
import { CommonView } from "../views/CommonView";
import { SeasonEpisodeView } from "../views/SeasonEpisodeView";

export class SeasonEpisodeController {
  constructor(
    private readonly seasonService: SeasonService,
    private readonly episodeService: EpisodeService
  ) {}

  createSeason(seriesId: number, number: number, title: string): void {
    try {
      const season = this.seasonService.create(seriesId, number, title);
      CommonView.showSuccess("Temporada creada correctamente.");
      SeasonEpisodeView.showSeason(season);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  listSeasons(): void {
    try {
      SeasonEpisodeView.showSeasons(this.seasonService.findAll());
    } catch (error) {
      CommonView.showError(error);
    }
  }

  updateSeason(
    id: number,
    data: { number?: number; title?: string; episodeIds?: number[] }
  ): void {
    try {
      const updated = this.seasonService.update(id, data);
      CommonView.showSuccess("Temporada actualizada correctamente.");
      SeasonEpisodeView.showSeason(updated);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  removeSeason(id: number): void {
    try {
      this.seasonService.remove(id);
      CommonView.showSuccess(`Temporada ${id} eliminada correctamente.`);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  createEpisode(seasonId: number, number: number, title: string, durationMin: number): void {
    try {
      const episode = this.episodeService.create(seasonId, number, title, durationMin);
      CommonView.showSuccess("Episodio creado correctamente.");
      SeasonEpisodeView.showEpisode(episode);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  listEpisodesBySeason(seasonId: number): void {
    try {
      SeasonEpisodeView.showEpisodes(this.episodeService.findBySeason(seasonId));
    } catch (error) {
      CommonView.showError(error);
    }
  }

  updateEpisode(
    id: number,
    data: { number?: number; title?: string; durationMin?: number }
  ): void {
    try {
      const updated = this.episodeService.update(id, data);
      CommonView.showSuccess("Episodio actualizado correctamente.");
      SeasonEpisodeView.showEpisode(updated);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  removeEpisode(id: number): void {
    try {
      this.episodeService.remove(id);
      CommonView.showSuccess(`Episodio ${id} eliminado correctamente.`);
    } catch (error) {
      CommonView.showError(error);
    }
  }
}
