import type { Category } from "../entities/Category";

export interface CategoryRepository {
  create(category: Category): Category;
  existsByName(name: string): boolean;
  findById(id: number): Category | undefined;
  findAll(): Category[];
  update(id: number, data: Partial<Omit<Category, "id">>): Category | undefined;
  delete(id: number): boolean;
}
