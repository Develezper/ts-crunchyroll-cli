import { Category } from "../entities/Category";

export interface CategoryRepository {
  create(category: Category): Category;
  findAll(): Category[];
  findById(id: number): Category | undefined;
  update(id: number, data: Partial<Omit<Category, "id">>): Category | undefined;
  delete(id: number): boolean;
  existsByName(name: string): boolean;
}
