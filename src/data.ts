import { User } from "./domain/entities/User";
import { setGenerarId } from "./shared/utils";

export const usersData: User[] = [
  new User({
    id: 1,
    nombre: "Administrador",
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
    nombre: "Usuario",
    email: "user@crunchy.com",
    password: "123",
    rol: "USER",
    favoritos: [1, 2],
    historial: [1],
    activo: true,
    fechaCreacion: new Date("2026-02-01T10:00:00.000Z")
  }),
  new User({
    id: 3,
    nombre: "Juan Pablo",
    email: "juan.pablo@crunchy.com",
    password: "123",
    rol: "USER",
    favoritos: [],
    historial: [],
    activo: true,
    fechaCreacion: new Date("2026-02-15T10:00:00.000Z")
  }),
  new User({
    id: 4,
    nombre: "Argenis",
    email: "argenis@crunchy.com",
    password: "123",
    rol: "USER",
    favoritos: [],
    historial: [],
    activo: true,
    fechaCreacion: new Date("2026-02-20T10:00:00.000Z")
  }),
  new User({
    id: 5,
    nombre: "Tomas",
    email: "tomas@crunchy.com",
    password: "123",
    rol: "USER",
    favoritos: [],
    historial: [],
    activo: true,
    fechaCreacion: new Date("2026-02-25T10:00:00.000Z")
  })
];

setGenerarId(Math.max(...usersData.map((user) => user.id)) + 1);
