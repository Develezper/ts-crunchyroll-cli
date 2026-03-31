import { Category } from "../../domain/entities/Category";

export class CategoryView {
  static showList(categories: Category[]): void {
    console.log("\n📂 Categorias:\n");
    for (const category of categories) {
      console.log(`- [${category.id}] ${category.name}: ${category.description}`);
    }
  }
}
