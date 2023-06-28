import { Class } from './utilities'
import {
  Component,
  Entity,
  WithType,
  World,
} from './world'

export interface InsertResource {
  type: 'insert resource'
  resource: Component<any>
}

export interface RemoveResource {
  type: 'remove resource'
  resource: WithType & Class<Component<any>>
}

export interface DespawnEntity {
  type: 'despawn entity'
  entity: Entity
}

export interface InsertComponent {
  type: 'insert component'
  entity: Entity
  component: Component<any>
}

export interface RemoveComponent {
  type: 'remove component'
  entity: Entity
  component: WithType & Class<Component<any>>
}

export type Command =
  | InsertResource
  | RemoveResource
  | DespawnEntity
  | InsertComponent
  | RemoveComponent

export class Commands {
  private queue: Command[] = []

  public constructor(
    private readonly world: World,
  ) {}

  public add(command: Command): void {
    this.queue.push(command)
  }

  public insertResource(resource: Component<any>): void {
    this.add({
      type: 'insert resource',
      resource,
    })
  }

  public removeResource(resource: WithType & Class<Component<any>>): void {
    this.add({
      type: 'remove resource',
      resource,
    })
  }

  public entity(entity: Entity): EntityCommands {
    if (!this.world.entities.has(entity)) {
      throw new Error(`Entity ${entity} does not exist in the world.`)
    }

    return new EntityCommands(this, entity)
  }

  public getOrSpawn(entity: Entity): EntityCommands {
    if (this.world.entities.has(entity)) {
      return this.entity(entity)
    }

    return this.spawn()
  }

  public spawn(): EntityCommands {
    return this.entity(this.world.spawn())
  }

  public apply(): void {
    for (const command of this.queue) {
      switch (command.type) {
        case 'insert resource':
          this.world.insertResource(command.resource)
          break
        case 'remove resource':
          this.world.removeResource(command.resource)
          break
        case 'despawn entity':
          this.world.despawn(command.entity)
          break
        case 'insert component':
          this.world.insertComponent(command.entity, command.component)
          break
        case 'remove component':
          this.world.removeComponent(command.entity, command.component)
          break
      }
    }

    this.queue = []
  }
}

export class EntityCommands {
  public constructor(
    private readonly commands: Commands,
    private readonly entity: Entity,
  ) {}

  public id(): Entity {
    return this.entity
  }

  public insert(component: Component<any>): this {
    this.commands.add({
      type: 'insert component',
      entity: this.entity,
      component,
    })

    return this
  }

  public remove(component: WithType & Class<Component<any>>): this {
    this.commands.add({
      type: 'remove component',
      entity: this.entity,
      component,
    })

    return this
  }

  public despawn(): this {
    this.commands.add({
      type: 'despawn entity',
      entity: this.entity,
    })

    return this
  }
}
