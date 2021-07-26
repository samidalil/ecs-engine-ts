import { Components } from "./components/types";
import Engine from "./Engine";
import Entity from "./Entity";
import { System } from "./systems/types";
import { ISystemManager } from "./types";

type ComponentTypesSystemMap = Record<Components, System[]>;

class SystemManager implements ISystemManager {
  constructor(public engine: Engine) {}

  private readonly componentTypesToSystemMap: ComponentTypesSystemMap = {};
  private readonly systems: System[] = [];

  public onEntityComponentAdded = (
    entity: Entity,
    previousComponentTypes: Components
  ) => {
    const componentTypes = entity.getComponentTypes();

    for (const key in this.componentTypesToSystemMap) {
      const value = +key;

      if (
        (componentTypes & value) === value &&
        (previousComponentTypes & value) !== value
      )
        this.componentTypesToSystemMap[key].forEach((system) =>
          system.addEntity(entity)
        );
    }
  };

  public onEntityComponentRemoved = (
    entity: Entity,
    previousComponentTypes: Components
  ) => {
    const componentTypes = entity.getComponentTypes();

    for (const key in this.componentTypesToSystemMap) {
      const value = +key;

      if (
        (previousComponentTypes & value) === value &&
        (componentTypes & value) !== value
      )
        this.componentTypesToSystemMap[key].forEach((system) =>
          system.removeEntity(entity)
        );
    }
  };

  /** Register system before creating entities */
  public register = (system: System) => {
    this.systems.push(system);
    const componentTypes = system.componentTypeArray.reduce(
      (acc, value) => acc | value,
      Components.None
    );

    if (!(componentTypes in this.componentTypesToSystemMap))
      this.componentTypesToSystemMap[componentTypes] = [];

    this.componentTypesToSystemMap[componentTypes].push(system);
  };

  public run = async () => {
    for (const system of this.systems) {
      await system.run(this.engine);
    }
  };
}

export default SystemManager;
