/**
 * Mock data / in-memory seeds.
 *
 * Team TODO:
 * - Define typed initial arrays (users, series, categories)
 * - Keep strict typing and avoid `any`
 */

import { Series, Category } from './domain/entities';

// Initial data for Categories
export const categories: Category[] = [
  new Category(1, 'Acción', 'Series con alto ritmo y combates'),
  new Category(2, 'Romance', 'Historias centradas en relaciones'),
  new Category(3, 'Isekai', 'Protagonistas transportados a otro mundo')
];

// Initial data for Series
export const series: Series[] = [
  new Series('1', 'Chainsaw Man', '1'),
  new Series('2', 'Frieren', '3')
];
