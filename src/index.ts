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
  seasonEpisodeController.createSeason(101, 2, "Temporada 2");
  seasonEpisodeController.listSeasons();
  seasonEpisodeController.updateSeason(1, { title: "Temporada 1 Remasterizada" });
  seasonEpisodeController.createEpisode(1, 3, "La revancha", 25);
  seasonEpisodeController.listEpisodesBySeason(1);
  seasonEpisodeController.updateEpisode(1, { title: "El comienzo (Edicion extendida)" });
  seasonEpisodeController.removeEpisode(2);
  seasonEpisodeController.removeSeason(2);
  seasonEpisodeController.listSeasons();
  seasonEpisodeController.listEpisodesBySeason(1);
}

bootstrapDemo();
