import { Series } from "../../domain/entities/Series";
import type { SeriesRepository } from "../../domain/interfaces/SeriesRepository";
import { seriesTable } from "../database/inMemoryDb";

export class InMemorySeriesRepository implements SeriesRepository {
  create(series: Series): Series {
    seriesTable.push(series);
    return series;
  }

  findAll(): Series[] {
    return seriesTable;
  }

  findById(id: number): Series | undefined {
    return seriesTable.find((series) => series.id === id);
  }

  findByCategoryId(categoryId: number): Series[] {
    return seriesTable.filter((series) => series.categoryId === categoryId);
  }

  update(id: number, data: Partial<Omit<Series, "id">>): Series | undefined {
    const series = this.findById(id);
    if (!series) {
      return undefined;
    }

    // Mutate in place so all references see the same updated object in memory.
    Object.assign(series, data);
    return series;
  }

  delete(id: number): boolean {
    const index = seriesTable.findIndex((series) => series.id === id);
    if (index < 0) {
      return false;
    }

    seriesTable.splice(index, 1);
    return true;
  }
}
