import { Categoria } from "../../domain/entities/Category";

export class VistaCategorias {
  static mostrarItem(categoria: Categoria): void {
    console.log(`📂 Categoria [${categoria.id}] ${categoria.nombre}: ${categoria.descripcion}`);
  }

  static mostrarLista(categorias: Categoria[]): void {
    console.log("\n📂 Categorias:\n");
    for (const categoria of categorias) {
      console.log(`- [${categoria.id}] ${categoria.nombre}: ${categoria.descripcion}`);
    }
  }
}
