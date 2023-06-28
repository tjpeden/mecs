import { RunCriteria } from './run-criteria'
import {
  Stage,
  System,
  SystemStage,
} from './stage'
import { World } from './world'

export class Schedule extends Stage {
  private order: string[] = []
  private stages = new Map<string, Stage>()

  public constructor(
    private readonly runCriteria: RunCriteria = RunCriteria.Infinitely,
  ) {
    super()
  }

  public addStage(label: string, stage: Stage): this {
    this.order.push(label)
    this.stages.set(label, stage)

    return this
  }

  public addSystemToStage(label: string, system: System): void {
    const stage = this.getStage<SystemStage>(label)

    if (stage) {
      stage.addSystem(system)
    }
  }

  public getStage<S extends Stage>(label: string): S | undefined {
    return this.stages.get(label) as S
  }

  public stage<S extends Stage>(label: string, action: (stage: S) => void): this {
    const stage = this.getStage<S>(label)

    if (stage) {
      action(stage)
    }

    return this
  }

  public run(world: World): void {
    if (this.runCriteria.shouldRun()) {
      for (const label of this.order) {
        this.stages.get(label)!.run(world)
      }
    }
  }
}
