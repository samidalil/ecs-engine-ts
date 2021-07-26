import assert from "../../utils/assert";
import { Component, Components } from "../components/types";
import Engine from "../Engine";
import Entity from "../Entity";
import { ISystem } from "../types";

abstract class BaseSystem<T extends Component[]> implements ISystem<T> {
  public readonly componentTypeArray: Components[] = [];
  private readonly entities: Entity[] = [];

  /** System Methods */

  public abstract behaviour(
    entity: Entity,
    components: T,
    engine: Engine
  ): any | Promise<any>;

  /**
   * Run behaviour for every entity
   * @param entities Entities with same component signature as the system
   */
  public run = (engine: Engine) => {
    const promises: any[] = this.entities.map((entity) =>
      this.behaviour(
        entity,
        this.componentTypeArray.map(entity.getComponent) as T,
        engine
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
