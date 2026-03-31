export class Series {
  constructor(
    public readonly id: number,
    public title: string,
    public categoryId: number,
    public seasonIds: number[] = []
  ) {}
}
