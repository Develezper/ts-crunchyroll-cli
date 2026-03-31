// This class represents a category (like Action, Drama, etc.)
export class Category {
  // We define the properties of the category
  public id: string;
  public name: string;

  constructor(
    id: string,
    name: string
  ) {
    this.id = id;
    this.name = name;
  }
}