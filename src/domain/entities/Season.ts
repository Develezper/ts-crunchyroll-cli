export class Season {
  constructor(
    public readonly id: number,
    public readonly seriesId: number,
    public number: number,
    public title: string,
    public episodeIds: number[] = []
  ) {}
}
