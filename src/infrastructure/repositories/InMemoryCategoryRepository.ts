import { Category } from "../../domain/entities/Category";
import type { CategoryRepository } from "../../domain/interfaces/CategoryRepository";
import { categoriesTable } from "../database/inMemoryDb";

export class InMemoryCategoryRepository implements CategoryRepository {
  create(category: Category): Category {
    categoriesTable.push(category);
    return category;
  }

  findAll(): Category[] {
    return categoriesTable;
  }

  findById(id: number): Category | undefined {
    return categoriesTable.find((category) => category.id === id);
  }

  update(id: number, data: Partial<Omit<Category, "id">>): Category | undefined {
    const category = this.findById(id);
    if (!category) {
      return undefined;
    }

    // In-memory update mutates the same reference used by callers.
    Object.assign(category, data);
    return category;
  }

  delete(id: number): boolean {
    const index = categoriesTable.findIndex((category) => category.id === id);
    if (index < 0) {
      return false;
    }

    categoriesTable.splice(index, 1);
    return true;
  }

  existsByName(name: string): boolean {
    return categoriesTable.some((category) => category.name.toLowerCase() === name.toLowerCase());
  }
}
