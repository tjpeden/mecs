import {
  Class,
  ID,
} from './utilities'

export type Entity = string

export type ComponentStore = Map<string, Component<any>>

export interface WithType {
  type: string
}

export abstract class Component<T> implements WithType {
  public static type = ID()

  public constructor(defaults?: Omit<T, 'type'>, properties: Partial<T> = {}) {
    if (defaults) {
      Object.assign(this, defaults, properties)
    }
  }

  public get type() {
    return Component.type
  }
}

export class World implements WithType {
  public readonly type = ID()

  public entities = new Set<Entity>()
  public components = new Map<Entity, ComponentStore>()

  public constructor() {
    this.components.set(this.type, new Map())
  }

  public spawn(): Entity {
    let entity

    do {
      entity = ID()
    } while (this.entities.has(entity))

    this.entities.add(entity)
    this.components.set(entity, new Map())

    return entity
  }

  public despawn(entity: Entity): void {
    if (this.entities.has(entity)) {
      this.entities.delete(entity)
      this.components.delete(entity)
    }
  }

  public insertComponent(entity: Entity, component: Component<any>): void {
    this.components.get(entity)!.set(component.type, component)
  }

  public removeComponent(entity: Entity, component: WithType): void {
    this.components.get(entity)!.delete(component.type)
  }

  public getComponent<T extends Component<T>>(entity: Entity, component: WithType & Class<T>): T | undefined {
    return this.components.get(entity)!.get(component.type) as T
  }

  public insertResource(component: Component<any>): void {
    this.components.get(this.type)!.set(component.type, component)
  }

  public removeResource(component: WithType): void {
    this.components.get(this.type)!.delete(component.type)
  }

  public getResource<T extends Component<T>>(component: WithType & Class<T>): T | undefined {
    return this.components.get(this.type)!.get(component.type) as T
  }
}
