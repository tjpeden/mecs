import { RunCriteria } from './run-criteria'
import { Schedule } from './schedule'
import {
  System,
  SystemStage,
} from './stage'
import {
  Component,
  World,
} from './world'

export const enum CoreStage {
  First = 'First',
  Startup = 'Startup',
  PreUpdate = 'PreUpdate',
  Update = 'Update',
  PostUpdate = 'PostUpdate',
  Last = 'Last',
}

export const enum StartupStage {
  PreStartup = 'PreStartup',
  Startup = 'Startup',
  PostStartup = 'PostStartup',
}

interface AppRunner {
  (app: App): void
}

export class App {
  private world = new World()
  private schedule = new Schedule()
  private runner = runOnce

  public static default(): App {
    return new App()
    .addDefaultStages()
  }

  public addDefaultStages(): this {
    this.schedule
    .addStage(CoreStage.First, new SystemStage())
    .addStage(
      CoreStage.Startup,
      new Schedule(RunCriteria.Once)
      .addStage(StartupStage.PreStartup, new SystemStage())
      .addStage(StartupStage.Startup, new SystemStage())
      .addStage(StartupStage.PostStartup, new SystemStage()),
    )
    .addStage(CoreStage.PreUpdate, new SystemStage())
    .addStage(CoreStage.Update, new SystemStage())
    .addStage(CoreStage.PostUpdate, new SystemStage())
    .addStage(CoreStage.Last, new SystemStage())

    return this
  }

  public addPlugin(plugin: Plugin): this {
    plugin.build(this)

    return this
  }

  public addSystemToStage(label: string, system: System): this {
    this.schedule.addSystemToStage(label, system)

    return this
  }

  public addStartupSystemToStage(label: string, system: System): this {
    this.schedule.stage(
      CoreStage.Startup,
      (stage: Schedule) => {
        stage.addSystemToStage(label, system)
      },
    )

    return this
  }

  public addStartupSystem(system: System): this {
    this.addStartupSystemToStage(StartupStage.Startup, system)

    return this
  }

  public addSystem(system: System): this {
    this.addSystemToStage(CoreStage.Update, system)

    return this
  }

  public insertResource(resource: Component<any>): this {
    this.world.insertResource(resource)

    return this
  }

  public setRunner(runner: AppRunner): this {
    this.runner = runner

    return this
  }

  public update(): void {
    this.schedule.run(this.world)
  }

  public run(): void {
    this.runner(this)
  }
}

export abstract class Plugin {
  abstract build(app: App): void
}

function runOnce(app: App): void {
  app.update()
}
