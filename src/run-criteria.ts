
export class RunCriteria {
  public static Once = new RunCriteria(1)
  public static Infinitely = new RunCriteria(Infinity)

  private count = 0

  public constructor(
    public readonly runs: number,
  ) {}

  public shouldRun(): boolean {
    if (this.count < this.runs) {
      this.count++

      return true
    }

    return false
  }
}
