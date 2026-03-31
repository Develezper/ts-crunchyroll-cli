// This interface tells us what a Season should look like
export interface Season {
  id: string;
  number: number;
  episodes: unknown[]; 
}

// This class represents a TV Series
export class Series {
  // Properties of a series
  public id: string;
  public title: string;
  public categoryId: string;
  public seasons: Season[];

  constructor(id: string, title: string, categoryId: string) {
    this.id = id;
    this.title = title;
    this.categoryId = categoryId;
    // We start with an empty list of seasons by default
    this.seasons = [];
  }
}