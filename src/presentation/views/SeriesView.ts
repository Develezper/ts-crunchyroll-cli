import { Serie } from "../../domain/entities/Series";

export class VistaSeries {
  static mostrarItem(serie: Serie): void {
    console.log(`🎬 Serie [${serie.id}] ${serie.titulo} | Categoria ${serie.categoriaId}`);
  }

  static mostrarLista(series: Serie[]): void {
    console.log("\n🎬 Series:\n");

    if (series.length === 0) {
      console.log("- Sin registros.");
      return;
    }

    for (const serie of series) {
      console.log(`- [${serie.id}] ${serie.titulo} | Categoria ${serie.categoriaId}`);
    }
  }
}
