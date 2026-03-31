import type { Series } from "../entities/Series";

export interface SeriesRepository {
  create(series: Series): Series;
  findAll(): Series[];
  findById(id: number): Series | undefined;
  findByCategoryId(categoryId: number): Series[];
  update(id: number, data: Partial<Omit<Series, "id">>): Series | undefined;
  delete(id: number): boolean;
}
