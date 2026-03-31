import { Series } from "../../domain/entities/Series";

export class SeriesView {
  static showItem(series: Series): void {
    console.log(
      `🎬 Serie [${series.id}] ${series.title} | Categoria ${series.categoryId} | Temporadas: ${series.seasonIds.length}`
    );
  }

  static showList(seriesList: Series[]): void {
    console.log("\n🎬 Series:\n");

    if (seriesList.length === 0) {
      console.log("- Sin registros.");
      return;
    }

    for (const series of seriesList) {
      console.log(
        `- [${series.id}] ${series.title} | Categoria ${series.categoryId} | Temporadas: ${series.seasonIds.length}`
      );
    }
  }
}
