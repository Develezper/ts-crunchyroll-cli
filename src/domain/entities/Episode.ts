export class Episode {
  constructor(
    public readonly id: number,
    public readonly seasonId: number,
    public number: number,
    public title: string,
    public durationMin: number
  ) {}
}
