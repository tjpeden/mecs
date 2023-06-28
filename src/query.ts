import { Class } from './utilities'
import {
  Component,
  Entity,
  WithType,
  World,
} from "./world"

export class Query {
  public constructor(
    private readonly world: World,
  ) {}

  public entities(...components: (WithType & Class<Component<any>>)[]): Set<Entity> {
    const entities = new Set<Entity>()

    for (const entity of this.world.entities) {
      const match = components.every(
        component => this.world.getComponent(entity, component)
      )

      if (match) {
        entities.add(entity)
      }
    }

    return entities
  }

  public component<T extends Component<T>>(entity: Entity, component: WithType & Class<T>): T | undefined {
    return this.world.getComponent(entity, component)
  }

  public resource<T extends Component<T>>(component: WithType & Class<T>): T | undefined {
    return this.world.getResource(component)
  }
}
