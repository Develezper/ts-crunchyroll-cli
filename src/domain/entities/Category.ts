// This class represents a category (like Action, Drama, etc.)
export class Category {
  // We define the properties of the category
  public id: string | number;
  public name: string;
  public description?: string;

  constructor(
    id: string | number,
    name: string,
    description?: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
