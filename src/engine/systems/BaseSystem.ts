import assert from "../../utils/assert";
import { Components } from "../components/types";
import Entity from "../Entity";
import { Component, ISystem } from "../types";

abstract class BaseSystem<T extends Component[]> implements ISystem<T> {
  public abstract readonly componentTypes: Components;
  public abstract readonly componentTypeArray: Components[];
  private readonly entities: Entity[] = [];

  /** System Methods */

  public abstract behaviour(entity: Entity, components: T): any | Promise<any>;

  /**
   * Run behaviour for every entity
   * @param entities Entities with same component signature as the system
   */
  public run = () => {
    const promises: any[] = this.entities.map((entity) =>
      this.behaviour(
        entity,
        this.componentTypeArray.map(entity.getComponent) as T
      )
    );

    return Promise.all(promises);
  };

  /** Entity Management */

  public addEntity = (entity: Entity) => {
    assert(
      this.entities.indexOf(entity) === -1,
      "Cannot add entity : already registered"
    );

    this.entities.push(entity);
  };

  public removeEntity = (entity: Entity) => {
    const index = this.entities.indexOf(entity);

    assert(index !== -1, "Cannot remove entity : not registered");

    this.entities.splice(index, 1);
  };
}

export default BaseSystem;
