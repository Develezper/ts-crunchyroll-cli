import { EpisodeService } from "../../application/services/EpisodeService";
import { SeasonService } from "../../application/services/SeasonService";
import { CommonView } from "../views/CommonView";
import { SeasonEpisodeView } from "../views/SeasonEpisodeView";

export class SeasonEpisodeController {
  constructor(
    private readonly seasonService: SeasonService,
    private readonly episodeService: EpisodeService
  ) {}

  listSeasons(): void {
    try {
      SeasonEpisodeView.showSeasons(this.seasonService.findAll());
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
}
