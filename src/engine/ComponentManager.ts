import assert from "../utils/assert";
import { Components } from "./components/types";
import Entity from "./Entity";
import { EntityId, IComponentManager, IEngine } from "./types";

type ComponentEntitiesMap = Record<Components, EntityId[]>;

class ComponentManager implements IComponentManager {
  public constructor(public readonly engine: IEngine) {
    for (const value in Components) {
      const n = +value;
      /** Typescript Enum Number hack */
      if (!isNaN(n)) this.componentEntitiesMap[n] = [];
    }
  }

  private readonly componentEntitiesMap: ComponentEntitiesMap = {};

  public add = (entity: Entity, componentType: Components) => {
    assert(
      !this.componentEntitiesMap[componentType].includes(entity.id),
      "Entity already registered"
    );

    this.componentEntitiesMap[componentType].push(entity.id);
  };

  public remove = (entity: Entity, componentType: Components) => {
    const index = this.componentEntitiesMap[componentType].indexOf(entity.id);

    assert(index !== -1, "Entity not registered");

    this.componentEntitiesMap[componentType].splice(index, 1);
  };
}

export default ComponentManager;
