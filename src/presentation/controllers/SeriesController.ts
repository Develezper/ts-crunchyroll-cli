import { SeriesService } from "../../application/services/SeriesService";
import { BaseController } from "./BaseController";
import { CommonView } from "../views/CommonView";
import { SeriesView } from "../views/SeriesView";

export class SeriesController extends BaseController {
  constructor(private readonly seriesService: SeriesService) {
    super();
  }

  create(title: string, categoryId: number): void {
    const created = this.execute(() => this.seriesService.create(title, categoryId));
    if (!created) {
      return;
    }

    CommonView.showSuccess("Serie creada correctamente.");
    SeriesView.showItem(created);
  }

  list(): void {
    const seriesList = this.execute(() => this.seriesService.findAll());
    if (!seriesList) {
      return;
    }

    SeriesView.showList(seriesList);
  }

  getById(id: number): void {
    const series = this.execute(() => this.seriesService.findById(id));
    if (!series) {
      return;
    }

    SeriesView.showItem(series);
  }

  listByCategory(categoryId: number): void {
    const seriesList = this.execute(() => this.seriesService.findByCategory(categoryId));
    if (!seriesList) {
      return;
    }

    SeriesView.showList(seriesList);
  }

  update(id: number, data: { title?: string; categoryId?: number }): void {
    const updated = this.execute(() => this.seriesService.update(id, data));
    if (!updated) {
      return;
    }

    CommonView.showSuccess("Serie actualizada correctamente.");
    SeriesView.showItem(updated);
  }

  remove(id: number): void {
    const completed = this.run(() => this.seriesService.remove(id));
    if (!completed) {
      return;
    }

    CommonView.showSuccess(`Serie ${id} eliminada correctamente.`);
  }
}
