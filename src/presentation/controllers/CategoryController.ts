import { CategoryService } from "../../application/services/CategoryService";
import { CategoryView } from "../views/CategoryView";
import { CommonView } from "../views/CommonView";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  list(): void {
    try {
      CategoryView.showList(this.categoryService.findAll());
    } catch (error) {
      CommonView.showError(error);
    }
  }
}
