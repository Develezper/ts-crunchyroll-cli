// We use "import type" because SeriesRepository is an interface
import type { Series } from '../entities/Series';

// This interface is like a "contract" that says what a Series Repository must do
export interface SeriesRepository {
  save(series: Series): void;
  findById(id: string): Series | null;
  findAll(): Series[];
  update(id: string, series: Partial<Series>): void;
  delete(id: string): void;
  findByCategory(categoryId: string): Series[];
}