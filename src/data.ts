import { Category, Series } from "./domain/entities";
import { User } from "./domain/entities/User";
import { setGenerarId } from "./shared/utils/generateId";

export const usersData: User[] = [
  new User({
    id: 1,
    nombre: "Administrador Supremo",
    email: "admin@crunchy.com",
    password: "123",
    rol: "ADMIN",
    favoritos: [],
    historial: [],
    activo: true,
    fechaCreacion: new Date("2026-01-01T10:00:00.000Z")
  }),
  new User({
    id: 2,
    nombre: "Usuario Regular",
    email: "user@crunchy.com",
    password: "123",
    rol: "USER",
    favoritos: [100, 101],
    historial: [100],
    activo: true,
    fechaCreacion: new Date("2026-02-01T10:00:00.000Z")
  })
];

export const categories: Category[] = [
  new Category(1, "Acción", "Series con alto ritmo y combates"),
  new Category(2, "Romance", "Historias centradas en relaciones"),
  new Category(3, "Isekai", "Protagonistas transportados a otro mundo")
];

export const series: Series[] = [new Series("1", "Chainsaw Man", "1"), new Series("2", "Frieren", "3")];

setGenerarId(3);
