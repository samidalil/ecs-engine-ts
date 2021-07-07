import ComponentManager from "./ComponentManager";
import { Components } from "./components/types";
import Entity from "./Entity";
import EntityManager from "./EntityManager";
import SystemManager from "./SystemManager";
import { Component, IEngine, System } from "./types";

class Engine implements IEngine {
  public readonly componentManager: ComponentManager = new ComponentManager(
    this
  );
  public readonly entityManager: EntityManager = new EntityManager(this, 200);
  public readonly systemManager: SystemManager = new SystemManager(this);

  private frameRate = 1000;
  private promise: Promise<any> = Promise.resolve();
  private running = false;

  /** Entity Management */

  public createEntity = () => this.entityManager.create();

  public destroyEntity = (entity: Entity) => this.entityManager.destroy(entity);

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

  /** Loop */

  private waitForFrame = () =>
    Promise.all([
      new Promise(res => setTimeout(res, this.frameRate, null)),
      this.systemManager.run(),
    ])


  public run = async () => {
    if (this.running) return;

    this.running = true;

    while (this.running) {
      await (this.promise = this.waitForFrame());
    }
  };

  public stop = async () => {
    this.running = false;
    await this.promise;
  };
}

export default Engine;
