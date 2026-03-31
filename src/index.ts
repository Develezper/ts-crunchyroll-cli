import {
  CategoryService,
  EpisodeService,
  SeasonService,
  SeriesService,
  UserService
} from "./application/services";
import type { Rol, User } from "./domain/entities/User";
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
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type CliInterface = ReturnType<typeof createInterface>;
type MenuAction = (rl: CliInterface) => Promise<void>;

const MENU_OPTIONS: readonly string[] = [
  "1. Listar categorías",
  "2. Crear categoría",
  "3. Buscar categoría por ID",
  "4. Actualizar categoría",
  "5. Eliminar categoría",
  "6. Listar series",
  "7. Crear serie",
  "8. Buscar serie por ID",
  "9. Actualizar serie",
  "10. Eliminar serie",
  "11. Filtrar series por categoría",
  "12. Listar temporadas",
  "13. Crear temporada",
  "14. Actualizar temporada",
  "15. Eliminar temporada",
  "16. Listar episodios por temporada",
  "17. Crear episodio",
  "18. Actualizar episodio",
  "19. Eliminar episodio",
  "20. Listar todos los episodios",
  "21. Listar usuarios activos",
  "22. Crear usuario",
  "23. Actualizar usuario",
  "24. Eliminar usuario (borrado lógico)",
  "0. Salir"
];

// Composition root: one place to wire concrete dependencies.
const categoryRepository = new InMemoryCategoryRepository();
const seriesRepository = new InMemorySeriesRepository();
const seasonRepository = new InMemorySeasonRepository();
const episodeRepository = new InMemoryEpisodeRepository();
const userRepository = new InMemoryUserRepository();

const categoryController = new CategoryController(
  new CategoryService(categoryRepository, seriesRepository)
);
const seriesController = new SeriesController(
  new SeriesService(seriesRepository, categoryRepository, seasonRepository, episodeRepository)
);
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

function parseRequiredRole(rawRole: string): Rol | null {
  const normalized = rawRole.trim().toUpperCase();
  return normalized === "ADMIN" || normalized === "USER" ? normalized : null;
}

function parseOptionalRole(rawRole: string): Rol | undefined | null {
  const normalized = rawRole.trim().toUpperCase();
  if (!normalized) {
    return undefined;
  }

  return normalized === "ADMIN" || normalized === "USER" ? normalized : null;
}

function printMenu(): void {
  console.log("\n===== MENÚ PRINCIPAL =====");
  for (const option of MENU_OPTIONS) {
    console.log(option);
  }
}

async function askNumber(rl: CliInterface, prompt: string): Promise<number | null> {
  return parseNumber(await rl.question(prompt));
}

async function askOptionalNumber(
  rl: CliInterface,
  prompt: string
): Promise<number | undefined | null> {
  const raw = (await rl.question(prompt)).trim();
  return raw ? parseNumber(raw) : undefined;
}

async function readRequiredNumber(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string
): Promise<number | undefined> {
  const value = await askNumber(rl, prompt);
  if (value === null) {
    console.log(invalidMessage);
    return undefined;
  }

  return value;
}

async function withRequiredNumber(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string,
  onSuccess: (value: number) => void | Promise<void>
): Promise<void> {
  const value = await readRequiredNumber(rl, prompt, invalidMessage);
  if (value === undefined) {
    return;
  }

  await onSuccess(value);
}

async function withOptionalNumber(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string,
  onSuccess: (value: number | undefined) => void | Promise<void>
): Promise<void> {
  const value = await askOptionalNumber(rl, prompt);
  if (value === null) {
    console.log(invalidMessage);
    return;
  }

  await onSuccess(value);
}

async function readRequiredRole(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string
): Promise<Rol | undefined> {
  const role = parseRequiredRole(await rl.question(prompt));
  if (!role) {
    console.log(invalidMessage);
    return undefined;
  }

  return role;
}

async function readOptionalRole(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string
): Promise<Rol | undefined | null> {
  const role = parseOptionalRole(await rl.question(prompt));
  if (role === null) {
    console.log(invalidMessage);
  }

  return role;
}

async function confirmDeletion(rl: CliInterface, label: string): Promise<boolean> {
  const confirm = (await rl.question(`¿Seguro que deseas eliminar ${label}? (s/n): `))
    .trim()
    .toLowerCase();
  return confirm === "s" || confirm === "si" || confirm === "sí";
}

async function withDeletionConfirmation(
  rl: CliInterface,
  label: string,
  onConfirm: () => void | Promise<void>
): Promise<void> {
  if (await confirmDeletion(rl, label)) {
    await onConfirm();
    return;
  }

  console.log("ℹ️ Eliminación cancelada.");
}

async function withDeleteAction(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string,
  labelBuilder: (id: number) => string,
  onConfirm: (id: number) => void | Promise<void>
): Promise<void> {
  await withRequiredNumber(rl, prompt, invalidMessage, async (id) => {
    await withDeletionConfirmation(rl, labelBuilder(id), () => onConfirm(id));
  });
}

const menuActions: Record<string, MenuAction> = {
  "1": async () => {
    categoryController.list();
  },
  "2": async (rl) => {
    const name = await rl.question("Nombre de la categoría: ");
    const description = await rl.question("Descripción: ");
    categoryController.create(name, description);
  },
  "3": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de la categoría: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    categoryController.getById(id);
  },
  "4": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de la categoría a actualizar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    const name = (await rl.question("Nuevo nombre (enter para omitir): ")).trim();
    const description = (await rl.question("Nueva descripción (enter para omitir): ")).trim();

    categoryController.update(id, {
      name: name || undefined,
      description: description || undefined
    });
  },
  "5": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de la categoría a eliminar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    await withDeletionConfirmation(rl, `la categoría ${id}`, () => categoryController.remove(id));
  },
  "6": async () => {
    seriesController.list();
  },
  "7": async (rl) => {
    const title = await rl.question("Título de la serie: ");
    const categoryId = await readRequiredNumber(rl, "ID de la categoría: ", "❌ ID de categoría inválido.");
    if (categoryId === undefined) {
      return;
    }

    seriesController.create(title, categoryId);
  },
  "8": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de la serie: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    seriesController.getById(id);
  },
  "9": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de la serie a actualizar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
    const categoryId = await askOptionalNumber(rl, "Nuevo ID de categoría (enter para omitir): ");
    if (categoryId === null) {
      console.log("❌ ID de categoría inválido.");
      return;
    }

    seriesController.update(id, {
      title: title || undefined,
      categoryId
    });
  },
  "10": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de la serie a eliminar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    await withDeletionConfirmation(rl, `la serie ${id}`, () => seriesController.remove(id));
  },
  "11": async (rl) => {
    const categoryId = await readRequiredNumber(rl, "ID de la categoría a filtrar: ", "❌ ID inválido.");
    if (categoryId === undefined) {
      return;
    }

    seriesController.listByCategory(categoryId);
  },
  "12": async () => {
    seasonEpisodeController.listSeasons();
  },
  "13": async (rl) => {
    const seriesId = await readRequiredNumber(rl, "ID de la serie: ", "❌ IDs o número inválidos.");
    const number = await readRequiredNumber(rl, "Número de temporada: ", "❌ IDs o número inválidos.");
    if (seriesId === undefined || number === undefined) {
      return;
    }

    const title = await rl.question("Título de la temporada: ");
    seasonEpisodeController.createSeason(seriesId, number, title);
  },
  "14": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de la temporada a actualizar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    const number = await askOptionalNumber(rl, "Nuevo número (enter para omitir): ");
    if (number === null) {
      console.log("❌ Número inválido.");
      return;
    }

    const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
    seasonEpisodeController.updateSeason(id, {
      number,
      title: title || undefined
    });
  },
  "15": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de la temporada a eliminar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    await withDeletionConfirmation(rl, `la temporada ${id}`, () =>
      seasonEpisodeController.removeSeason(id)
    );
  },
  "16": async (rl) => {
    const seasonId = await readRequiredNumber(rl, "ID de la temporada: ", "❌ ID inválido.");
    if (seasonId === undefined) {
      return;
    }

    seasonEpisodeController.listEpisodesBySeason(seasonId);
  },
  "17": async (rl) => {
    const seasonId = await readRequiredNumber(rl, "ID de la temporada: ", "❌ Datos numéricos inválidos.");
    const number = await readRequiredNumber(rl, "Número de episodio: ", "❌ Datos numéricos inválidos.");
    const durationMin = await readRequiredNumber(rl, "Duración (minutos): ", "❌ Datos numéricos inválidos.");
    if (seasonId === undefined || number === undefined || durationMin === undefined) {
      return;
    }

    const title = await rl.question("Título del episodio: ");
    seasonEpisodeController.createEpisode(seasonId, number, title, durationMin);
  },
  "18": async (rl) => {
    const id = await readRequiredNumber(rl, "ID del episodio a actualizar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    const number = await askOptionalNumber(rl, "Nuevo número (enter para omitir): ");
    const durationMin = await askOptionalNumber(rl, "Nueva duración en minutos (enter para omitir): ");
    if (number === null || durationMin === null) {
      console.log("❌ Número o duración inválidos.");
      return;
    }

    const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
    seasonEpisodeController.updateEpisode(id, {
      number,
      title: title || undefined,
      durationMin
    });
  },
  "19": async (rl) => {
    const id = await readRequiredNumber(rl, "ID del episodio a eliminar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    await withDeletionConfirmation(rl, `el episodio ${id}`, () =>
      seasonEpisodeController.removeEpisode(id)
    );
  },
  "20": async () => {
    seasonEpisodeController.listAllEpisodes();
  },
  "21": async () => {
    await userController.listActive(adminUser);
  },
  "22": async (rl) => {
    const nombre = await rl.question("Nombre: ");
    const email = await rl.question("Email: ");
    const password = await rl.question("Contraseña: ");
    const role = await readRequiredRole(rl, "Rol (ADMIN/USER): ", "❌ Rol inválido. Debe ser ADMIN o USER.");
    if (!role) {
      return;
    }

    await userController.create(adminUser, { nombre, email, password, rol: role });
  },
  "23": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de usuario a actualizar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    const nombre = (await rl.question("Nuevo nombre (enter para omitir): ")).trim();
    const email = (await rl.question("Nuevo email (enter para omitir): ")).trim();
    const role = await readOptionalRole(
      rl,
      "Nuevo rol ADMIN/USER (enter para omitir): ",
      "❌ Rol inválido. Debe ser ADMIN o USER."
    );
    if (role === null) {
      return;
    }

    await userController.update(adminUser, id, {
      nombre: nombre || undefined,
      email: email || undefined,
      rol: role
    });
  },
  "24": async (rl) => {
    const id = await readRequiredNumber(rl, "ID de usuario a eliminar: ", "❌ ID inválido.");
    if (id === undefined) {
      return;
    }

    await withDeletionConfirmation(rl, `el usuario ${id}`, () =>
      userController.remove(adminUser, id)
    );
  }
};

async function bootstrapCli(): Promise<void> {
  const rl = createInterface({ input, output });
  console.log("\n🎬 Bienvenido a Crunchyroll CLI");
  console.log(`🔐 Sesión actual: ${adminUser.nombre} (${adminUser.rol})\n`);

  while (true) {
    printMenu();
    const option = (await rl.question("\nSelecciona una opción: ")).trim();

    if (option === "0") {
      console.log("👋 Saliendo de la aplicación...");
      rl.close();
      return;
    }

    const action = menuActions[option];
    if (!action) {
      console.log("❌ Opción no válida.");
      continue;
    }

    await action(rl);
  }
}

void bootstrapCli();
