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

const INVALID_ID = "❌ ID inválido.";
const INVALID_ROLE = "❌ Rol inválido. Debe ser ADMIN o USER.";
const INVALID_NUMERIC_DATA = "❌ Datos numéricos inválidos.";

const MENU_TEXT = `===== MENÚ PRINCIPAL =====

--- CATEGORÍAS ---
1. Listar categorías
2. Crear categoría
3. Buscar categoría por ID
4. Actualizar categoría
5. Eliminar categoría

--- SERIES ---
6. Listar series
7. Crear serie
8. Buscar serie por ID
9. Actualizar serie
10. Eliminar serie
11. Filtrar series por categoría

--- TEMPORADAS ---
12. Listar temporadas
13. Crear temporada
14. Actualizar temporada
15. Eliminar temporada

--- EPISODIOS ---
16. Listar episodios por temporada
17. Crear episodio
18. Actualizar episodio
19. Eliminar episodio
20. Listar todos los episodios

--- USUARIOS ---
21. Listar usuarios activos
22. Crear usuario
23. Actualizar usuario
24. Eliminar usuario (borrado lógico)

0. Salir`;

// Composition root.
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

async function askRequiredNumber(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string
): Promise<number | null> {
  const value = parseNumber(await rl.question(prompt));
  if (value === null) {
    console.log(invalidMessage);
  }
  return value;
}

async function askOptionalNumber(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string
): Promise<number | undefined | null> {
  const rawValue = (await rl.question(prompt)).trim();
  if (!rawValue) {
    return undefined;
  }

  const value = parseNumber(rawValue);
  if (value === null) {
    console.log(invalidMessage);
  }

  return value;
}

async function askRequiredRole(
  rl: CliInterface,
  prompt: string,
  invalidMessage: string
): Promise<Rol | null> {
  const role = parseRequiredRole(await rl.question(prompt));
  if (!role) {
    console.log(invalidMessage);
  }
  return role;
}

async function askOptionalRole(
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

async function confirmAndRun(
  rl: CliInterface,
  label: string,
  action: () => void | Promise<void>
): Promise<void> {
  if (await confirmDeletion(rl, label)) {
    await action();
    return;
  }

  console.log("ℹ️ Eliminación cancelada.");
}

function createDeleteAction(
  prompt: string,
  labelBuilder: (id: number) => string,
  onDelete: (id: number) => void | Promise<void>
): MenuAction {
  return async (rl) => {
    const id = await askRequiredNumber(rl, prompt, INVALID_ID);
    if (id === null) {
      return;
    }

    await confirmAndRun(rl, labelBuilder(id), () => onDelete(id));
  };
}

function printMenu(): void {
  console.log(`\n${MENU_TEXT}`);
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
    const id = await askRequiredNumber(rl, "ID de la categoría: ", INVALID_ID);
    if (id === null) {
      return;
    }
    categoryController.getById(id);
  },
  "4": async (rl) => {
    const id = await askRequiredNumber(rl, "ID de la categoría a actualizar: ", INVALID_ID);
    if (id === null) {
      return;
    }

    const name = (await rl.question("Nuevo nombre (enter para omitir): ")).trim();
    const description = (await rl.question("Nueva descripción (enter para omitir): ")).trim();
    categoryController.update(id, {
      name: name || undefined,
      description: description || undefined
    });
  },
  "5": createDeleteAction(
    "ID de la categoría a eliminar: ",
    (id) => `la categoría ${id}`,
    (id) => categoryController.remove(id)
  ),

  "6": async () => {
    seriesController.list();
  },
  "7": async (rl) => {
    const title = await rl.question("Título de la serie: ");
    const categoryId = await askRequiredNumber(rl, "ID de la categoría: ", "❌ ID de categoría inválido.");
    if (categoryId === null) {
      return;
    }
    seriesController.create(title, categoryId);
  },
  "8": async (rl) => {
    const id = await askRequiredNumber(rl, "ID de la serie: ", INVALID_ID);
    if (id === null) {
      return;
    }
    seriesController.getById(id);
  },
  "9": async (rl) => {
    const id = await askRequiredNumber(rl, "ID de la serie a actualizar: ", INVALID_ID);
    if (id === null) {
      return;
    }

    const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
    const categoryId = await askOptionalNumber(
      rl,
      "Nuevo ID de categoría (enter para omitir): ",
      "❌ ID de categoría inválido."
    );
    if (categoryId === null) {
      return;
    }

    seriesController.update(id, {
      title: title || undefined,
      categoryId
    });
  },
  "10": createDeleteAction(
    "ID de la serie a eliminar: ",
    (id) => `la serie ${id}`,
    (id) => seriesController.remove(id)
  ),
  "11": async (rl) => {
    const categoryId = await askRequiredNumber(rl, "ID de la categoría a filtrar: ", INVALID_ID);
    if (categoryId === null) {
      return;
    }
    seriesController.listByCategory(categoryId);
  },

  "12": async () => {
    seasonEpisodeController.listSeasons();
  },
  "13": async (rl) => {
    const seriesId = await askRequiredNumber(rl, "ID de la serie: ", INVALID_NUMERIC_DATA);
    const number = await askRequiredNumber(rl, "Número de temporada: ", INVALID_NUMERIC_DATA);
    if (seriesId === null || number === null) {
      return;
    }

    const title = await rl.question("Título de la temporada: ");
    seasonEpisodeController.createSeason(seriesId, number, title);
  },
  "14": async (rl) => {
    const id = await askRequiredNumber(rl, "ID de la temporada a actualizar: ", INVALID_ID);
    if (id === null) {
      return;
    }

    const number = await askOptionalNumber(rl, "Nuevo número (enter para omitir): ", "❌ Número inválido.");
    if (number === null) {
      return;
    }

    const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
    seasonEpisodeController.updateSeason(id, {
      number,
      title: title || undefined
    });
  },
  "15": createDeleteAction(
    "ID de la temporada a eliminar: ",
    (id) => `la temporada ${id}`,
    (id) => seasonEpisodeController.removeSeason(id)
  ),
  "16": async (rl) => {
    const seasonId = await askRequiredNumber(rl, "ID de la temporada: ", INVALID_ID);
    if (seasonId === null) {
      return;
    }
    seasonEpisodeController.listEpisodesBySeason(seasonId);
  },
  "17": async (rl) => {
    const seasonId = await askRequiredNumber(rl, "ID de la temporada: ", INVALID_NUMERIC_DATA);
    const number = await askRequiredNumber(rl, "Número de episodio: ", INVALID_NUMERIC_DATA);
    const durationMin = await askRequiredNumber(rl, "Duración (minutos): ", INVALID_NUMERIC_DATA);
    if (seasonId === null || number === null || durationMin === null) {
      return;
    }

    const title = await rl.question("Título del episodio: ");
    seasonEpisodeController.createEpisode(seasonId, number, title, durationMin);
  },
  "18": async (rl) => {
    const id = await askRequiredNumber(rl, "ID del episodio a actualizar: ", INVALID_ID);
    if (id === null) {
      return;
    }

    const number = await askOptionalNumber(
      rl,
      "Nuevo número (enter para omitir): ",
      "❌ Número o duración inválidos."
    );
    const durationMin = await askOptionalNumber(
      rl,
      "Nueva duración en minutos (enter para omitir): ",
      "❌ Número o duración inválidos."
    );
    if (number === null || durationMin === null) {
      return;
    }

    const title = (await rl.question("Nuevo título (enter para omitir): ")).trim();
    seasonEpisodeController.updateEpisode(id, {
      number,
      title: title || undefined,
      durationMin
    });
  },
  "19": createDeleteAction(
    "ID del episodio a eliminar: ",
    (id) => `el episodio ${id}`,
    (id) => seasonEpisodeController.removeEpisode(id)
  ),
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
    const rol = await askRequiredRole(rl, "Rol (ADMIN/USER): ", INVALID_ROLE);
    if (!rol) {
      return;
    }

    await userController.create(adminUser, { nombre, email, password, rol });
  },
  "23": async (rl) => {
    const id = await askRequiredNumber(rl, "ID de usuario a actualizar: ", INVALID_ID);
    if (id === null) {
      return;
    }

    const nombre = (await rl.question("Nuevo nombre (enter para omitir): ")).trim();
    const email = (await rl.question("Nuevo email (enter para omitir): ")).trim();
    const rol = await askOptionalRole(
      rl,
      "Nuevo rol ADMIN/USER (enter para omitir): ",
      INVALID_ROLE
    );
    if (rol === null) {
      return;
    }

    await userController.update(adminUser, id, {
      nombre: nombre || undefined,
      email: email || undefined,
      rol
    });
  },
  "24": createDeleteAction(
    "ID de usuario a eliminar: ",
    (id) => `el usuario ${id}`,
    (id) => userController.remove(adminUser, id)
  )
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
