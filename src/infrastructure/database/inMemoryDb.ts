import { Category } from "../../domain/entities/Category";
import { Episode } from "../../domain/entities/Episode";
import { Season } from "../../domain/entities/Season";
import { Series } from "../../domain/entities/Series";

export const categoriesTable: Category[] = [
  new Category(1, "Shonen", "Series de accion y aventura"),
  new Category(2, "Drama", "Series centradas en desarrollo emocional"),
  new Category(3, "Isekai", "Protagonistas transportados a otro mundo"),
  new Category(4, "Seinen", "Historias maduras y de tono serio"),
  new Category(5, "Slice of Life", "Historias cotidianas y de crecimiento personal"),
  new Category(6, "Fantasia", "Mundos magicos, heroes y criaturas fantasticas"),
  new Category(7, "Sci-Fi", "Ciencia, tecnologia y viajes en el tiempo"),
  new Category(8, "Deportes", "Competencia, trabajo en equipo y superacion"),
  new Category(9, "Romance", "Relaciones, sentimientos y desarrollo emocional"),
  new Category(10, "Misterio", "Investigacion, suspenso y estrategias")
];

export const seriesTable: Series[] = [
  new Series(1, "Chainsaw Man", 1, [1]),
  new Series(2, "Frieren", 6, [2]),
  new Series(3, "Attack on Titan", 4, [3, 4]),
  new Series(4, "Demon Slayer", 1, [5, 6]),
  new Series(5, "Jujutsu Kaisen", 1, [7, 8]),
  new Series(6, "Haikyuu!!", 8, [9, 10]),
  new Series(7, "Re:Zero", 3, [11, 12]),
  new Series(8, "Steins;Gate", 7, [13]),
  new Series(9, "Your Lie in April", 9, [14]),
  new Series(10, "Death Note", 10, [15])
];

export const seasonsTable: Season[] = [
  new Season(1, 1, 1, "Public Safety Arc", [1, 2, 3]),
  new Season(2, 2, 1, "Journey to the North", [4, 5, 6]),
  new Season(3, 3, 1, "The Fall of Shiganshina", [7, 8, 9]),
  new Season(4, 3, 2, "Clash of the Titans", [10, 11, 12]),
  new Season(5, 4, 1, "Unwavering Resolve Arc", [13, 14, 15]),
  new Season(6, 4, 2, "Entertainment District Arc", [16, 17, 18]),
  new Season(7, 5, 1, "Curse Womb Arc", [19, 20, 21]),
  new Season(8, 5, 2, "Shibuya Incident Arc", [22, 23, 24]),
  new Season(9, 6, 1, "Karasuno Team Formation", [25, 26, 27]),
  new Season(10, 6, 2, "Road to Nationals", [28, 29, 30]),
  new Season(11, 7, 1, "Starting Life in Another World", [31, 32, 33]),
  new Season(12, 7, 2, "Sanctuary Arc", [34, 35, 36]),
  new Season(13, 8, 1, "Time Travel and Consequences", [37, 38, 39]),
  new Season(14, 9, 1, "Spring of Youth", [40, 41, 42]),
  new Season(15, 10, 1, "Kira and L", [43, 44, 45])
];

export const episodesTable: Episode[] = [
  new Episode(1, 1, 1, "Dog and Chainsaw", 24),
  new Episode(2, 1, 2, "Arrival in Tokyo", 24),
  new Episode(3, 1, 3, "Meowy Rescue Mission", 24),

  new Episode(4, 2, 1, "The Hero Party", 26),
  new Episode(5, 2, 2, "After the Funeral", 24),
  new Episode(6, 2, 3, "First Northern Town", 24),

  new Episode(7, 3, 1, "To You, in 2000 Years", 25),
  new Episode(8, 3, 2, "That Day", 24),
  new Episode(9, 3, 3, "A Dim Light in the Darkness", 24),

  new Episode(10, 4, 1, "Beast Titan Appears", 24),
  new Episode(11, 4, 2, "Warrior", 24),
  new Episode(12, 4, 3, "Scream", 24),

  new Episode(13, 5, 1, "Cruelty", 24),
  new Episode(14, 5, 2, "Trainer Sakonji", 24),
  new Episode(15, 5, 3, "Final Selection", 24),

  new Episode(16, 6, 1, "Sound Hashira Joins", 23),
  new Episode(17, 6, 2, "Infiltration", 23),
  new Episode(18, 6, 3, "Upper Rank Battle", 24),

  new Episode(19, 7, 1, "Ryomen Sukuna", 24),
  new Episode(20, 7, 2, "Curse Womb Must Die", 24),
  new Episode(21, 7, 3, "Girl of Steel", 24),

  new Episode(22, 8, 1, "Halloween Incident", 23),
  new Episode(23, 8, 2, "Domain Collision", 23),
  new Episode(24, 8, 3, "The Strongest Falls", 24),

  new Episode(25, 9, 1, "The End and the Beginning", 24),
  new Episode(26, 9, 2, "Karasuno Revival", 24),
  new Episode(27, 9, 3, "Practice Match", 24),

  new Episode(28, 10, 1, "Land vs Air", 24),
  new Episode(29, 10, 2, "Serve Strategy", 24),
  new Episode(30, 10, 3, "Battle at Nationals", 24),

  new Episode(31, 11, 1, "The Day Subaru Died", 25),
  new Episode(32, 11, 2, "Reunion with Emilia", 24),
  new Episode(33, 11, 3, "A Promise in the Mansion", 24),

  new Episode(34, 12, 1, "The Witch of Greed", 24),
  new Episode(35, 12, 2, "Trials Begin", 24),
  new Episode(36, 12, 3, "Return by Death", 24),

  new Episode(37, 13, 1, "Prologue of Time Travel", 24),
  new Episode(38, 13, 2, "Microwave Mystery", 24),
  new Episode(39, 13, 3, "Changing World Lines", 24),

  new Episode(40, 14, 1, "A New Transfer Student", 22),
  new Episode(41, 14, 2, "Piano and Violin", 22),
  new Episode(42, 14, 3, "First Concert", 23),

  new Episode(43, 15, 1, "The Notebook", 24),
  new Episode(44, 15, 2, "Confrontation", 24),
  new Episode(45, 15, 3, "Mind Games", 24)
];
