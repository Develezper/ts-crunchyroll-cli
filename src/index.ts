import { CategoryService, EpisodeService, SeasonService } from "./application/services";
import {
  InMemoryCategoryRepository,
  InMemoryEpisodeRepository,
  InMemorySeasonRepository
} from "./infrastructure/repositories";
import { CategoryController, SeasonEpisodeController } from "./presentation/controllers";

const categoryRepository = new InMemoryCategoryRepository();
const seasonRepository = new InMemorySeasonRepository();
const episodeRepository = new InMemoryEpisodeRepository();

const categoryService = new CategoryService(categoryRepository);
const seasonService = new SeasonService(seasonRepository);
const episodeService = new EpisodeService(episodeRepository);

const categoryController = new CategoryController(categoryService);
const seasonEpisodeController = new SeasonEpisodeController(seasonService, episodeService);

function bootstrapDemo(): void {
  categoryController.list();
  seasonEpisodeController.listSeasons();
  seasonEpisodeController.listEpisodesBySeason(1);
}

bootstrapDemo();
