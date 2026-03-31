// We use "import type" because CategoryRepository is an interface
import type { Category } from '../entities/Category';

// This interface defines the actions we can do with Categories in the database
export interface CategoryRepository {
  save(category: Category): void;
  findById(id: string): Category | null;
  findAll(): Category[];
  update(id: string, category: Partial<Category>): void;
  delete(id: string): void;
}