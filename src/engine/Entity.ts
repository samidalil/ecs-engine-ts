import { Component, Components } from "./components/types";
import { EntityId, IEngine, IEntity } from "./types";

class Entity implements IEntity {
  public constructor(
    public readonly id: EntityId,
    public readonly engine: IEngine
  ) {}

  public addComponent = (component: Component) =>
    this.engine.addComponentToEntity(this, component);

  public getAllComponents = () => this.engine.getAllComponentsOfEntity(this);

  public getComponent = (componentType: Components) =>
    this.engine.getComponentOfEntity(this, componentType);

  public getComponentTypes = () => this.engine.getComponentTypesOfEntity(this);

  public hasComponents = (componentTypes: Components) =>
    this.engine.hasEntityComponents(this, componentTypes);

  public removeComponent = (componentType: Components) =>
    this.engine.removeComponentOfEntity(this, componentType);
}

export default Entity;
