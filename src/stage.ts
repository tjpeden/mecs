import { Commands } from './commands'
import { Query } from './query'
import { World } from './world'

export interface System {
  (commands: Commands, query: Query): void
}

export abstract class Stage {
  abstract run(world: World): void
}

export class SystemStage extends Stage {
  private systems: Set<System> = new Set()

  public addSystem(system: System): void {
    this.systems.add(system)
  }

  public run(world: World): void {
    const commands = new Commands(world)
    const query = new Query(world)

    for (const system of this.systems) {
      system(commands, query)
    }

    commands.apply()
  }
}
