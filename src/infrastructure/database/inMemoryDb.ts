import { Category } from "../../domain/entities/Category";
import { Episode } from "../../domain/entities/Episode";
import { Season } from "../../domain/entities/Season";

export const categoriesTable: Category[] = [
  new Category(1, "Shonen", "Series de accion y aventura"),
  new Category(2, "Drama", "Series centradas en desarrollo emocional")
];

export const seasonsTable: Season[] = [new Season(1, 101, 1, "Temporada 1", [1, 2])];

export const episodesTable: Episode[] = [
  new Episode(1, 1, 1, "El comienzo", 24),
  new Episode(2, 1, 2, "El reto", 26)
];
