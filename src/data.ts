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
  new Category('1', 'Acción'),
  new Category('2', 'Romance'),
  new Category('3', 'Isekai')
];

// Initial data for Series
export const series: Series[] = [
  new Series('1', 'Chainsaw Man', '1'),
  new Series('2', 'Frieren', '3')
];
