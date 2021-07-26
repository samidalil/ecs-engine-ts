import assert from "../utils/assert";
import Stack from "../utils/Stack";

import { Component, Components } from "./components/types";
import Entity from "./Entity";
import { EntityComponents, IEngine, IEntityManager } from "./types";

class EntityManager implements IEntityManager {
  constructor(
    public readonly engine: IEngine,
    private readonly maxEntitiesCount: number
  ) {
    this.availableEntities = new Stack(maxEntitiesCount);
    this.entityComponentsArray = Array.from({ length: maxEntitiesCount });
    this.entitySignatures = Array.from({ length: maxEntitiesCount });

    for (let i = 0; i < maxEntitiesCount; i++) {
      this.availableEntities.push(new Entity(i, this.engine));
      this.entityComponentsArray[i] = {};
      this.entitySignatures[i] = Components.None;
    }
  }

  private readonly availableEntities: Stack<Entity>;
  private readonly entityComponentsArray: EntityComponents[];
  private readonly entitySignatures: Components[];
  private livingEntitiesCount = 0;

  /** Entity Lifecycle Management */

  public create = () => {
    assert(
      this.livingEntitiesCount < this.maxEntitiesCount,
      "Too many entities created"
    );

    this.livingEntitiesCount++;
    return this.availableEntities.pop() as Entity;
  };

  public destroy = (entity: Entity) => {
    this.entitySignatures[entity.id] = Components.None;
    this.availableEntities.push(entity);
    this.livingEntitiesCount--;
  };

  /** Entity Component Management */

  public addComponent = (entity: Entity, component: Component) => {
    assert(
      !this.hasComponents(entity, component.componentType),
      "Cannot add component : already registered"
    );

    this.entityComponentsArray[entity.id][component.componentType] = component;
    this.entitySignatures[entity.id] |= component.componentType;
  };

  public getAllComponents = (entity: Entity) =>
    this.entityComponentsArray[entity.id];

  public getComponent = (entity: Entity, componentType: Components) => {
    assert(
      this.hasComponents(entity, componentType),
      "Cannot get component : not registered"
    );

    return this.entityComponentsArray[entity.id][componentType];
  };

  public getComponentTypes = (entity: Entity) =>
    this.entitySignatures[entity.id];

  public hasComponents = (entity: Entity, componentTypes: Components) =>
    (this.entitySignatures[entity.id] & componentTypes) === componentTypes;

  public removeComponent = (entity: Entity, componentType: Components) => {
    assert(
      this.hasComponents(entity, componentType),
      "Cannot remove component : not registered"
    );

    delete this.entityComponentsArray[entity.id][componentType];
    this.entitySignatures[entity.id] &= ~componentType;
  };
}

export default EntityManager;
