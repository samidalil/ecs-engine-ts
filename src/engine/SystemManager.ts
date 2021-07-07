import { Components } from "./components/types";
import Entity from "./Entity";
import { IEngine, ISystemManager, System } from "./types";

type ComponentTypesSystemMap = Record<Components, System[]>;

class SystemManager implements ISystemManager {
  constructor(public engine: IEngine) {}

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
        (componentTypes & value) !== Components.None &&
        (previousComponentTypes & value) === Components.None
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
        (previousComponentTypes & value) !== Components.None &&
        (componentTypes & value) === Components.None
      )
        this.componentTypesToSystemMap[key].forEach((system) =>
          system.removeEntity(entity)
        );
    }
  };

  /** Register system before creating entities */
  public register = (system: System) => {
    this.systems.push(system);

    if (!(system.componentTypes in this.componentTypesToSystemMap))
      this.componentTypesToSystemMap[system.componentTypes] = [];

    this.componentTypesToSystemMap[system.componentTypes].push(system);
  };

  public run = async () => {
    for (const system of this.systems) {
      await system.run();
    }
  };
}

export default SystemManager;
