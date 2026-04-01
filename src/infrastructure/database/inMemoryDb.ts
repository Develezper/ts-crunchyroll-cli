import { Categoria } from "../../domain/entities/Category";
import { Serie } from "../../domain/entities/Series";

export const tablaCategorias: Categoria[] = [
  new Categoria(1, "Shonen", "Series de accion y aventura"),
  new Categoria(2, "Drama", "Series centradas en desarrollo emocional"),
  new Categoria(3, "Isekai", "Protagonistas transportados a otro mundo"),
  new Categoria(4, "Seinen", "Historias maduras y de tono serio"),
  new Categoria(5, "Slice of Life", "Historias cotidianas y de crecimiento personal"),
  new Categoria(6, "Fantasia", "Mundos magicos, heroes y criaturas fantasticas"),
  new Categoria(7, "Sci-Fi", "Ciencia, tecnologia y viajes en el tiempo"),
  new Categoria(8, "Deportes", "Competencia, trabajo en equipo y superacion"),
  new Categoria(9, "Romance", "Relaciones, sentimientos y desarrollo emocional"),
  new Categoria(10, "Misterio", "Investigacion, suspenso y estrategias")
];

export const tablaSeries: Serie[] = [
  new Serie(1, "Chainsaw Man", 1),
  new Serie(2, "Frieren", 6),
  new Serie(3, "Attack on Titan", 4),
  new Serie(4, "Demon Slayer", 1),
  new Serie(5, "Jujutsu Kaisen", 1),
  new Serie(6, "Haikyuu!!", 8),
  new Serie(7, "Re:Zero", 3),
  new Serie(8, "Steins;Gate", 7),
  new Serie(9, "Your Lie in April", 9),
  new Serie(10, "Death Note", 10)
];
