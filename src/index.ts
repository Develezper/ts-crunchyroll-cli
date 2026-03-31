import {
  CategoryService,
  EpisodeService,
  SeasonService,
  SeriesService,
  UserService
} from "./application/services";
import { usersData } from "./data";
import {
  InMemoryCategoryRepository,
  InMemoryEpisodeRepository,
  InMemorySeasonRepository,
  InMemorySeriesRepository,
  InMemoryUserRepository
} from "./infrastructure/repositories";
import {
  CategoryController,
  SeasonEpisodeController,
  SeriesController,
  UserController
} from "./presentation/controllers";
import type { User } from "./domain/entities/User";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// Composition root: one place to wire concrete dependencies.
const categoryRepository = new InMemoryCategoryRepository();
const seriesRepository = new InMemorySeriesRepository();
const seasonRepository = new InMemorySeasonRepository();
const episodeRepository = new InMemoryEpisodeRepository();
const userRepository = new InMemoryUserRepository();

const categoryController = new CategoryController(new CategoryService(categoryRepository));
const seriesController = new SeriesController(new SeriesService(seriesRepository, categoryRepository));
const seasonEpisodeController = new SeasonEpisodeController(
  new SeasonService(seasonRepository, episodeRepository, seriesRepository),
  new EpisodeService(episodeRepository, seasonRepository)
);
const userController = new UserController(new UserService(userRepository));

function resolveAdminUser(): User {
  const admin = usersData.find((user) => user.rol === "ADMIN") ?? usersData[0];
  if (!admin) {
    throw new Error("No hay usuario admin inicial para operar el sistema.");
  }

  return admin;
}
const adminUser = resolveAdminUser();

function parseNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function askNumber(
  rl: ReturnType<typeof createInterface>,
  prompt: string
): Promise<number | null> {
  return parseNumber(await rl.question(prompt));
}

async function askOptionalNumber(
  rl: ReturnType<typeof createInterface>,
  prompt: string
): Promise<number | undefined | null> {
  const raw = (await rl.question(prompt)).trim();
  if (!raw) {
    return undefined;
  }

  return parseNumber(raw);
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

function printMenu(): void {
  console.log("\n===== MENÚ PRINCIPAL =====");
  console.log("1. Listar categorías");
  console.log("2. Crear categoría");
  console.log("3. Buscar categoría por ID");
  console.log("4. Actualizar categoría");
  console.log("5. Eliminar categoría");
  console.log("6. Listar series");
  console.log("7. Crear serie");
  console.log("8. Buscar serie por ID");
  console.log("9. Actualizar serie");
  console.log("10. Eliminar serie");
  console.log("11. Filtrar series por categoría");
  console.log("12. Listar temporadas");
  console.log("13. Crear temporada");
  console.log("14. Actualizar temporada");
  console.log("15. Eliminar temporada");
  console.log("16. Listar episodios por temporada");
  console.log("17. Crear episodio");
  console.log("18. Actualizar episodio");
  console.log("19. Eliminar episodio");
  console.log("20. Listar todos los episodios");
  console.log("21. Listar usuarios activos");
  console.log("22. Crear usuario");
  console.log("23. Ver perfil admin actual");
  console.log("24. Actualizar usuario");
  console.log("25. Eliminar usuario (borrado lógico)");
  console.log("26. Agregar serie a favoritos de usuario");
  console.log("27. Agregar serie al historial de usuario");
  console.log("0. Salir");
}

async function bootstrapCli(): Promise<void> {
  const rl = createInterface({ input, output });
  console.log("\n🎬 Bienvenido a Crunchyroll CLI");
  console.log(`🔐 Sesión actual: ${adminUser.nombre} (${adminUser.rol})\n`);

  while (true) {
    printMenu();
    const option = (await rl.question("\nSelecciona una opción: ")).trim();

    switch (option) {
      case "0":
        console.log("👋 Saliendo de la aplicación...");
        rl.close();
        return;

      case "1":
        categoryController.list();
        break;
      case "2": {
        const name = await rl.question("Nombre de la categoría: ");
        const description = await rl.question("Descripción: ");
        categoryController.create(name, description);
        break;
      }
      case "3": {
        const id = await askNumber(rl, "ID de la categoría: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        categoryController.getById(id);
        break;
      }
      case "4": {
        const id = await askNumber(rl, "ID de la categoría a actualizar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        const name = (await rl.question("Nuevo nombre (enter para omitir): ")).trim();
        const description = (await rl.question("Nueva descripción (enter para omitir): ")).trim();
        categoryController.update(id, {
          name: name || undefined,
          description: description || undefined
        });
        break;
      }
      case "5": {
        const id = await askNumber(rl, "ID de la categoría a eliminar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        if (await confirmDeletion(rl, `la categoría ${id}`)) {
          categoryController.remove(id);
        } else {
          console.log("ℹ️ Eliminación cancelada.");
        }
        break;
      }

      case "6":
        seriesController.list();
        break;
      case "7": {
        const title = await rl.question("Título de la serie: ");
        const categoryId = await askNumber(rl, "ID de la categoría: ");
        if (categoryId === null) {
          console.log("❌ ID de categoría inválido.");
          break;
        }
        seriesController.create(title, categoryId);
        break;
      }
      case "8": {
        const id = await askNumber(rl, "ID de la serie: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        seriesController.getById(id);
        break;
      }
      case "9": {
        const id = await askNumber(rl, "ID de la serie a actualizar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
        const categoryId = await askOptionalNumber(rl, "Nuevo ID de categoría (enter para omitir): ");
        if (categoryId === null) {
          console.log("❌ ID de categoría inválido.");
          break;
        }
        seriesController.update(id, {
          title: title || undefined,
          categoryId
        });
        break;
      }
      case "10": {
        const id = await askNumber(rl, "ID de la serie a eliminar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        if (await confirmDeletion(rl, `la serie ${id}`)) {
          seriesController.remove(id);
        } else {
          console.log("ℹ️ Eliminación cancelada.");
        }
        break;
      }
      case "11": {
        const categoryId = await askNumber(rl, "ID de la categoría a filtrar: ");
        if (categoryId === null) {
          console.log("❌ ID inválido.");
          break;
        }
        seriesController.listByCategory(categoryId);
        break;
      }

      case "12":
        seasonEpisodeController.listSeasons();
        break;
      case "13": {
        const seriesId = await askNumber(rl, "ID de la serie: ");
        const number = await askNumber(rl, "Número de temporada: ");
        const title = await rl.question("Título de la temporada: ");
        if (seriesId === null || number === null) {
          console.log("❌ IDs o número inválidos.");
          break;
        }
        seasonEpisodeController.createSeason(seriesId, number, title);
        break;
      }
      case "14": {
        const id = await askNumber(rl, "ID de la temporada a actualizar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        const number = await askOptionalNumber(rl, "Nuevo número (enter para omitir): ");
        if (number === null) {
          console.log("❌ Número inválido.");
          break;
        }
        const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
        seasonEpisodeController.updateSeason(id, {
          number,
          title: title || undefined
        });
        break;
      }
      case "15": {
        const id = await askNumber(rl, "ID de la temporada a eliminar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        if (await confirmDeletion(rl, `la temporada ${id}`)) {
          seasonEpisodeController.removeSeason(id);
        } else {
          console.log("ℹ️ Eliminación cancelada.");
        }
        break;
      }
      case "16": {
        const seasonId = await askNumber(rl, "ID de la temporada: ");
        if (seasonId === null) {
          console.log("❌ ID inválido.");
          break;
        }
        seasonEpisodeController.listEpisodesBySeason(seasonId);
        break;
      }
      case "17": {
        const seasonId = await askNumber(rl, "ID de la temporada: ");
        const number = await askNumber(rl, "Número de episodio: ");
        const title = await rl.question("Título del episodio: ");
        const durationMin = await askNumber(rl, "Duración (minutos): ");
        if (seasonId === null || number === null || durationMin === null) {
          console.log("❌ Datos numéricos inválidos.");
          break;
        }
        seasonEpisodeController.createEpisode(seasonId, number, title, durationMin);
        break;
      }
      case "18": {
        const id = await askNumber(rl, "ID del episodio a actualizar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        const number = await askOptionalNumber(rl, "Nuevo número (enter para omitir): ");
        const durationMin = await askOptionalNumber(
          rl,
          "Nueva duración en minutos (enter para omitir): "
        );
        if (number === null || durationMin === null) {
          console.log("❌ Número o duración inválidos.");
          break;
        }
        const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
        seasonEpisodeController.updateEpisode(id, {
          number,
          title: title || undefined,
          durationMin
        });
        break;
      }
      case "19": {
        const id = await askNumber(rl, "ID del episodio a eliminar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        if (await confirmDeletion(rl, `el episodio ${id}`)) {
          seasonEpisodeController.removeEpisode(id);
        } else {
          console.log("ℹ️ Eliminación cancelada.");
        }
        break;
      }
      case "20":
        seasonEpisodeController.listAllEpisodes();
        break;

      case "21":
        await userController.listActive(adminUser);
        break;
      case "22": {
        const nombre = await rl.question("Nombre: ");
        const email = await rl.question("Email: ");
        const password = await rl.question("Contraseña: ");
        const rawRol = (await rl.question("Rol (ADMIN/USER): ")).trim().toUpperCase();
        const rol = rawRol === "ADMIN" ? "ADMIN" : "USER";
        await userController.create(adminUser, { nombre, email, password, rol });
        break;
      }
      case "23":
        userController.showProfile(adminUser);
        break;
      case "24": {
        const id = await askNumber(rl, "ID de usuario a actualizar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        const nombre = (await rl.question("Nuevo nombre (enter para omitir): ")).trim();
        const email = (await rl.question("Nuevo email (enter para omitir): ")).trim();
        const rawRol = (await rl.question("Nuevo rol ADMIN/USER (enter para omitir): "))
          .trim()
          .toUpperCase();
        const rol = rawRol ? (rawRol === "ADMIN" ? "ADMIN" : "USER") : undefined;
        await userController.update(adminUser, id, {
          nombre: nombre || undefined,
          email: email || undefined,
          rol
        });
        break;
      }
      case "25": {
        const id = await askNumber(rl, "ID de usuario a eliminar: ");
        if (id === null) {
          console.log("❌ ID inválido.");
          break;
        }
        if (await confirmDeletion(rl, `el usuario ${id}`)) {
          await userController.remove(adminUser, id);
        } else {
          console.log("ℹ️ Eliminación cancelada.");
        }
        break;
      }
      case "26": {
        const userId = await askNumber(rl, "ID de usuario: ");
        const seriesId = await askNumber(rl, "ID de serie: ");
        if (userId === null || seriesId === null) {
          console.log("❌ IDs inválidos.");
          break;
        }
        await userController.addFavorite(userId, seriesId);
        break;
      }
      case "27": {
        const userId = await askNumber(rl, "ID de usuario: ");
        const seriesId = await askNumber(rl, "ID de serie: ");
        if (userId === null || seriesId === null) {
          console.log("❌ IDs inválidos.");
          break;
        }
        await userController.addHistory(userId, seriesId);
        break;
      }

      default:
        console.log("❌ Opción no válida.");
        break;
    }
  }
}

void bootstrapCli();
