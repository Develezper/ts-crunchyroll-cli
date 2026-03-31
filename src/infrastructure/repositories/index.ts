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

  save(category: Category): void {
    this.data.push(category);
  }
  findById(id: string): Category | null {
    const result = this.data.find((item) => item.id === id);
    return result || null;
  }
  findAll(): Category[] {
    return this.data;
  }
  update(id: string, updates: Partial<Category>): void {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index]!, ...updates } as Category;
    }
  }
  delete(id: string): void {
    this.data = this.data.filter((item) => item.id !== id);
  }
}
