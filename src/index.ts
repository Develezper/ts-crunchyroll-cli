import { CategoryService, EpisodeService, SeasonService } from "./application/services";
import {
  InMemoryCategoryRepository,
  InMemoryEpisodeRepository,
  InMemorySeasonRepository
} from "./infrastructure/repositories";
import { CategoryController, SeasonEpisodeController } from "./presentation/controllers";

// Composition root: wire concrete infrastructure to application services.
const categoryRepository = new InMemoryCategoryRepository();
const seasonRepository = new InMemorySeasonRepository();
const episodeRepository = new InMemoryEpisodeRepository();

const categoryService = new CategoryService(categoryRepository);
const seasonService = new SeasonService(seasonRepository);
const episodeService = new EpisodeService(episodeRepository);

const categoryController = new CategoryController(categoryService);
const seasonEpisodeController = new SeasonEpisodeController(seasonService, episodeService);

function bootstrapDemo(): void {
  // Temporary scripted flow to validate use cases before interactive CLI menu.
  console.log("\n=== DEMO CRUD CATEGORIAS ===");
  categoryController.create("Comedia", "Series con humor y situaciones divertidas");
  categoryController.list();
  categoryController.getById(1);
  categoryController.update(1, { description: "Series de accion intensa y combates" });
  categoryController.remove(2);
  categoryController.list();

  console.log("\n=== DEMO TEMPORADAS / EPISODIOS ===");
  seasonEpisodeController.listSeasons();
  seasonEpisodeController.listEpisodesBySeason(1);
}

bootstrapDemo();
