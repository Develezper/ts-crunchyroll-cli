/**
 * Concrete repository implementations (in-memory, JSON, etc.).
 *
 * Rule: implement domain contracts here.
 */

// Import types for the interfaces and classes
import type { Series } from '../../domain/entities/Series';
import type { Category } from '../../domain/entities/Category';
import type { SeriesRepository } from '../../domain/interfaces/SeriesRepository';
import type { CategoryRepository } from '../../domain/interfaces/CategoryRepository';

// Import the actual data arrays
import { series as seriesData, categories as categoriesData } from '../../data';

// Implementation of Series storage in memory
export class InMemorySeriesRepository implements SeriesRepository {
  // We use the data from data.ts
  private data: Series[] = seriesData;

  // Save a new series to the list
  save(series: Series): void {
    this.data.push(series);
  }

  // Find one series by its unique ID
  findById(id: string): Series | null {
    const result = this.data.find((item) => item.id === id);
    return result || null;
  }

  // Get all series in the list
  findAll(): Series[] {
    return this.data;
  }

  // Update an existing series with new data
  update(id: string, updates: Partial<Series>): void {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const existingSeries = this.data[index]!;
      // We merge the old data with the new updates
      this.data[index] = { ...existingSeries, ...updates } as Series;
    }
  }

  // Remove a series from the list
  delete(id: string): void {
    this.data = this.data.filter((item) => item.id !== id);
  }

  // Search all series that belong to a specific category
  findByCategory(categoryId: string): Series[] {
    return this.data.filter((item) => item.categoryId === categoryId);
  }
}

// Implementation of Category storage in memory
export class InMemoryCategoryRepository implements CategoryRepository {
  private data: Category[] = categoriesData;

  create(category: Category): Category {
    this.data.push(category);
    return category;
  }

  existsByName(name: string): boolean {
    return this.data.some((item) => item.name.toLowerCase() === name.toLowerCase());
  }

  findById(id: number): Category | undefined {
    return this.data.find((item) => item.id === id);
  }

  findAll(): Category[] {
    return this.data;
  }

  update(id: number, updates: Partial<Omit<Category, "id">>): Category | undefined {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index]!, ...updates } as Category;
      return this.data[index];
    }

    return undefined;
  }

  delete(id: number): boolean {
    const previous = this.data.length;
    this.data = this.data.filter((item) => item.id !== id);
    return this.data.length < previous;
  }
}

export { InMemorySeasonRepository } from "./InMemorySeasonRepository";
export { InMemoryEpisodeRepository } from "./InMemoryEpisodeRepository";
