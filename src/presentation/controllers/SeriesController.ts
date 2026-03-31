import { SeriesService } from "../../application/services/SeriesService";
import { CommonView } from "../views/CommonView";
import { SeriesView } from "../views/SeriesView";

export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  create(title: string, categoryId: number): void {
    try {
      const created = this.seriesService.create(title, categoryId);
      CommonView.showSuccess("Serie creada correctamente.");
      SeriesView.showItem(created);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  list(): void {
    try {
      SeriesView.showList(this.seriesService.findAll());
    } catch (error) {
      CommonView.showError(error);
    }
  }

  getById(id: number): void {
    try {
      SeriesView.showItem(this.seriesService.findById(id));
    } catch (error) {
      CommonView.showError(error);
    }
  }

  listByCategory(categoryId: number): void {
    try {
      SeriesView.showList(this.seriesService.findByCategory(categoryId));
    } catch (error) {
      CommonView.showError(error);
    }
  }

  update(id: number, data: { title?: string; categoryId?: number }): void {
    try {
      const updated = this.seriesService.update(id, data);
      CommonView.showSuccess("Serie actualizada correctamente.");
      SeriesView.showItem(updated);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  remove(id: number): void {
    try {
      this.seriesService.remove(id);
      CommonView.showSuccess(`Serie ${id} eliminada correctamente.`);
    } catch (error) {
      CommonView.showError(error);
    }
  }
}
