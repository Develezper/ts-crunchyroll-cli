import { CategoryService, EpisodeService, SeasonService } from "./application/services";
import {
  InMemoryCategoryRepository,
  InMemoryEpisodeRepository,
  InMemorySeasonRepository
} from "./infrastructure/repositories";
import { CategoryController, SeasonEpisodeController } from "./presentation/controllers";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// Composition root: wire concrete infrastructure to application services.
const categoryRepository = new InMemoryCategoryRepository();
const seasonRepository = new InMemorySeasonRepository();
const episodeRepository = new InMemoryEpisodeRepository();

const categoryService = new CategoryService(categoryRepository);
const seasonService = new SeasonService(seasonRepository, episodeRepository);
const episodeService = new EpisodeService(episodeRepository, seasonRepository);

const categoryController = new CategoryController(categoryService);
const seasonEpisodeController = new SeasonEpisodeController(seasonService, episodeService);

function parseNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function confirmDeletion(
  rl: ReturnType<typeof createInterface>,
  label: string
): Promise<boolean> {
  const confirm = (await rl.question(`¿Seguro que deseas eliminar ${label}? (s/n): `))
    .trim()
    .toLowerCase();
  return confirm === "s" || confirm === "si" || confirm === "sí";
}

async function bootstrapCli(): Promise<void> {
  // Composition root already built above; this loop only orchestrates CLI interaction.
  const rl = createInterface({ input, output });

  console.log("\n🎬 Bienvenido a Crunchyroll CLI\n");

  while (true) {
    console.log("\n===== MENÚ PRINCIPAL =====");
    console.log("1. Listar categorías");
    console.log("2. Crear categoría");
    console.log("3. Buscar categoría por ID");
    console.log("4. Actualizar categoría");
    console.log("5. Eliminar categoría");
    console.log("6. Listar temporadas");
    console.log("7. Crear temporada");
    console.log("8. Actualizar temporada");
    console.log("9. Eliminar temporada");
    console.log("10. Listar episodios por temporada");
    console.log("11. Crear episodio");
    console.log("12. Actualizar episodio");
    console.log("13. Eliminar episodio");
    console.log("14. Listar todos los episodios");
    console.log("0. Salir");

    const option = (await rl.question("\nSelecciona una opción: ")).trim();

    if (option === "0") {
      console.log("👋 Saliendo de la aplicación...");
      rl.close();
      return;
    }

    if (option === "1") {
      categoryController.list();
      continue;
    }

    if (option === "2") {
      const name = await rl.question("Nombre de la categoría: ");
      const description = await rl.question("Descripción: ");
      categoryController.create(name, description);
      continue;
    }

    if (option === "3") {
      const id = parseNumber(await rl.question("ID de la categoría: "));
      if (id === null) {
        console.log("❌ ID inválido.");
        continue;
      }
      categoryController.getById(id);
      continue;
    }

    if (option === "4") {
      const id = parseNumber(await rl.question("ID de la categoría a actualizar: "));
      if (id === null) {
        console.log("❌ ID inválido.");
        continue;
      }
      const name = await rl.question("Nuevo nombre (enter para omitir): ");
      const description = await rl.question("Nueva descripción (enter para omitir): ");
      categoryController.update(id, {
        name: name.trim() ? name.trim() : undefined,
        description: description.trim() ? description.trim() : undefined
      });
      continue;
    }

    if (option === "5") {
      const id = parseNumber(await rl.question("ID de la categoría a eliminar: "));
      if (id === null) {
        console.log("❌ ID inválido.");
        continue;
      }
      if (!(await confirmDeletion(rl, `la categoría ${id}`))) {
        console.log("ℹ️ Eliminación cancelada.");
        continue;
      }
      categoryController.remove(id);
      continue;
    }

    if (option === "6") {
      seasonEpisodeController.listSeasons();
      continue;
    }

    if (option === "7") {
      const seriesId = parseNumber(await rl.question("ID de la serie: "));
      const number = parseNumber(await rl.question("Número de temporada: "));
      const title = await rl.question("Título de la temporada: ");
      if (seriesId === null || number === null) {
        console.log("❌ IDs o número inválidos.");
        continue;
      }
      seasonEpisodeController.createSeason(seriesId, number, title);
      continue;
    }

    if (option === "8") {
      const id = parseNumber(await rl.question("ID de la temporada a actualizar: "));
      if (id === null) {
        console.log("❌ ID inválido.");
        continue;
      }
      const numberRaw = await rl.question("Nuevo número (enter para omitir): ");
      const title = await rl.question("Nuevo título (enter para omitir): ");
      const number = numberRaw.trim() ? parseNumber(numberRaw) : undefined;
      if (numberRaw.trim() && number === null) {
        console.log("❌ Número inválido.");
        continue;
      }
      const safeNumber = number === null ? undefined : number;
      seasonEpisodeController.updateSeason(id, {
        number: safeNumber,
        title: title.trim() ? title.trim() : undefined
      });
      continue;
    }

    if (option === "9") {
      const id = parseNumber(await rl.question("ID de la temporada a eliminar: "));
      if (id === null) {
        console.log("❌ ID inválido.");
        continue;
      }
      if (!(await confirmDeletion(rl, `la temporada ${id}`))) {
        console.log("ℹ️ Eliminación cancelada.");
        continue;
      }
      seasonEpisodeController.removeSeason(id);
      continue;
    }

    if (option === "10") {
      const seasonId = parseNumber(await rl.question("ID de la temporada: "));
      if (seasonId === null) {
        console.log("❌ ID inválido.");
        continue;
      }
      seasonEpisodeController.listEpisodesBySeason(seasonId);
      continue;
    }

    if (option === "11") {
      const seasonId = parseNumber(await rl.question("ID de la temporada: "));
      const number = parseNumber(await rl.question("Número de episodio: "));
      const title = await rl.question("Título del episodio: ");
      const durationMin = parseNumber(await rl.question("Duración (minutos): "));
      if (seasonId === null || number === null || durationMin === null) {
        console.log("❌ Datos numéricos inválidos.");
        continue;
      }
      seasonEpisodeController.createEpisode(seasonId, number, title, durationMin);
      continue;
    }

    if (option === "12") {
      const id = parseNumber(await rl.question("ID del episodio a actualizar: "));
      if (id === null) {
        console.log("❌ ID inválido.");
        continue;
      }
      const numberRaw = await rl.question("Nuevo número (enter para omitir): ");
      const title = await rl.question("Nuevo título (enter para omitir): ");
      const durationRaw = await rl.question("Nueva duración en minutos (enter para omitir): ");
      const number = numberRaw.trim() ? parseNumber(numberRaw) : undefined;
      const durationMin = durationRaw.trim() ? parseNumber(durationRaw) : undefined;
      if ((numberRaw.trim() && number === null) || (durationRaw.trim() && durationMin === null)) {
        console.log("❌ Número o duración inválidos.");
        continue;
      }
      const safeNumber = number === null ? undefined : number;
      const safeDuration = durationMin === null ? undefined : durationMin;
      seasonEpisodeController.updateEpisode(id, {
        number: safeNumber,
        title: title.trim() ? title.trim() : undefined,
        durationMin: safeDuration
      });
      continue;
    }

    if (option === "13") {
      const id = parseNumber(await rl.question("ID del episodio a eliminar: "));
      if (id === null) {
        console.log("❌ ID inválido.");
        continue;
      }
      if (!(await confirmDeletion(rl, `el episodio ${id}`))) {
        console.log("ℹ️ Eliminación cancelada.");
        continue;
      }
      seasonEpisodeController.removeEpisode(id);
      continue;
    }

    if (option === "14") {
      seasonEpisodeController.listAllEpisodes();
      continue;
    }

    console.log("❌ Opción no válida.");
  }
}

void bootstrapCli();
