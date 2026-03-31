import { CategoryService } from "../../application/services/CategoryService";
import { CategoryView } from "../views/CategoryView";
import { CommonView } from "../views/CommonView";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  create(name: string, description: string): void {
    try {
      // Controller delegates business rules to the service and only coordinates I/O.
      const created = this.categoryService.create(name, description);
      CommonView.showSuccess("Categoria creada correctamente.");
      CategoryView.showItem(created);
    } catch (error) {
      // Single error boundary for this use case path in the presentation layer.
      CommonView.showError(error);
    }
  }

  list(): void {
    try {
      CategoryView.showList(this.categoryService.findAll());
    } catch (error) {
      CommonView.showError(error);
    }
  }

  getById(id: number): void {
    try {
      const category = this.categoryService.findById(id);
      CategoryView.showItem(category);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  update(id: number, data: { name?: string; description?: string }): void {
    try {
      const updated = this.categoryService.update(id, data);
      CommonView.showSuccess("Categoria actualizada correctamente.");
      CategoryView.showItem(updated);
    } catch (error) {
      CommonView.showError(error);
    }
  }

  remove(id: number): void {
    try {
      this.categoryService.remove(id);
      CommonView.showSuccess(`Categoria ${id} eliminada correctamente.`);
    } catch (error) {
      CommonView.showError(error);
    }
  }
}
