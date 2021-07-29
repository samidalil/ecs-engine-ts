import EventEmitter from "../utils/EventEmitter";
import ComponentManager from "./ComponentManager";
import { TimeComponent } from "./components";
import { Component, Components } from "./components/types";
import Entity from "./Entity";
import EntityManager from "./EntityManager";
import SystemManager from "./SystemManager";
import { ClockSystem } from "./systems";
import { System } from "./systems/types";
import { IEngine } from "./types";

class Engine extends EventEmitter implements IEngine {
  public constructor(public requiredFrameRate = 60) {
    super();
    this.frameDuration = 1000 / requiredFrameRate;
    this.registerSystem(new ClockSystem());
    this.createEntity().addComponent(this.time);
  }

  /** Managers */

  public readonly componentManager: ComponentManager = new ComponentManager(
    this
  );
  public readonly entityManager: EntityManager = new EntityManager(this, 200);
  public readonly systemManager: SystemManager = new SystemManager(this);

  /** Data */

  private readonly frameDuration: number;
  public readonly time: TimeComponent = new TimeComponent();

  /** Entity Management */

  public createEntity = () => {
    const entity = this.entityManager.create();

    this.emit("entityCreated", entity);
    return entity;
  };

  public destroyEntity = (entity: Entity) => {
    this.emit("entityDestroyed", entity);
    Object.values(entity.getAllComponents()).forEach((component) =>
      this.removeComponentOfEntity(entity, component.componentType)
    );
    this.entityManager.destroy(entity);
  };

  public getAllComponentsOfEntity = (entity: Entity) =>
    this.entityManager.getAllComponents(entity);

  public getComponentOfEntity = (entity: Entity, componentType: Components) =>
    this.entityManager.getComponent(entity, componentType);

  public getComponentTypesOfEntity = (entity: Entity) =>
    this.entityManager.getComponentTypes(entity);

  public hasEntityComponents = (entity: Entity, componentTypes: Components) =>
    this.entityManager.hasComponents(entity, componentTypes);

  /** Component Management */

  public addComponentToEntity = (entity: Entity, component: Component) => {
    const componentTypes = entity.getComponentTypes();

    this.entityManager.addComponent(entity, component);
    this.componentManager.add(entity, component.componentType);
    this.systemManager.onEntityComponentAdded(entity, componentTypes);
  };

  public removeComponentOfEntity = (
    entity: Entity,
    componentType: Components
  ) => {
    const componentTypes = entity.getComponentTypes();

    this.entityManager.removeComponent(entity, componentType);
    this.componentManager.remove(entity, componentType);
    this.systemManager.onEntityComponentRemoved(entity, componentTypes);
  };

  /** System Management */

  public registerSystem = (system: System) =>
    this.systemManager.register(system);

  /** Tick */

  public tick = () =>
    Promise.all([
      new Promise((res) => setTimeout(res, this.frameDuration, null)),
      this.systemManager.run(),
    ]);
}

export default Engine;
