import { CategoryService } from "../../application/services/CategoryService";
import { BaseController } from "./BaseController";
import { CategoryView } from "../views/CategoryView";
import { CommonView } from "../views/CommonView";

export class CategoryController extends BaseController {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  create(name: string, description: string): void {
    const created = this.execute(() => this.categoryService.create(name, description));
    if (!created) {
      return;
    }

    CommonView.showSuccess("Categoria creada correctamente.");
    CategoryView.showItem(created);
  }

  list(): void {
    const categories = this.execute(() => this.categoryService.findAll());
    if (!categories) {
      return;
    }

    CategoryView.showList(categories);
  }

  getById(id: number): void {
    const category = this.execute(() => this.categoryService.findById(id));
    if (!category) {
      return;
    }

    CategoryView.showItem(category);
  }

  update(id: number, data: { name?: string; description?: string }): void {
    const updated = this.execute(() => this.categoryService.update(id, data));
    if (!updated) {
      return;
    }

    CommonView.showSuccess("Categoria actualizada correctamente.");
    CategoryView.showItem(updated);
  }

  remove(id: number): void {
    const completed = this.run(() => this.categoryService.remove(id));
    if (!completed) {
      return;
    }

    CommonView.showSuccess(`Categoria ${id} eliminada correctamente.`);
  }
}
