import EventEmitter from "../utils/EventEmitter";
import { TimeComponent } from "./components";
import { Component, Components } from "./components/types";
import { System } from "./systems/types";

export type EntityId = number;

export type EntityComponents = Record<Components, Component>;

export interface IEntity {
  readonly id: EntityId;

  addComponent(component: Component): void;
  getAllComponents(): EntityComponents;
  getComponent(componentType: Components): Component;
  getComponentTypes(): Components;
  hasComponents(componentTypes: Components): boolean;
  removeComponent(componentType: Components): void;
}

export interface IEntityManager {
  addComponent(entity: IEntity, component: Component): void;
  getAllComponents(entity: IEntity): EntityComponents;
  getComponent(entity: IEntity, componentType: Components): Component;
  getComponentTypes(entity: IEntity): Components;
  hasComponents(entity: IEntity, componentTypes: Components): boolean;
  removeComponent(entity: IEntity, componentType: Components): void;
}

export interface IComponentManager {
  add(entity: IEntity, componentType: Components): void;
  remove(entity: IEntity, componentType: Components): void;
}

export interface ISystem<T extends Component[]> {
  readonly componentTypeArray: Components[];

  addEntity(entity: IEntity): void;
  behaviour(
    entity: IEntity,
    components: T,
    engine: IEngine
  ): any | Promise<any>;
  removeEntity(entity: IEntity): void;
  run(engine: IEngine): any | Promise<any>;
}

export interface ISystemManager {
  onEntityComponentAdded(
    entity: IEntity,
    previousComponentTypes: Components
  ): void;
  onEntityComponentRemoved(
    entity: IEntity,
    previousComponentTypes: Components
  ): void;
  register(system: System): void;
  run(): Promise<void>;
}

export interface IEngine extends EventEmitter {
  readonly componentManager: IComponentManager;
  readonly entityManager: IEntityManager;
  readonly systemManager: ISystemManager;
  readonly time: TimeComponent;

  addComponentToEntity(entity: IEntity, component: Component): void;
  getAllComponentsOfEntity(entity: IEntity): EntityComponents;
  getComponentOfEntity(entity: IEntity, componentType: Components): Component;
  getComponentTypesOfEntity(entity: IEntity): Components;
  hasEntityComponents(entity: IEntity, componentTypes: Components): boolean;
  registerSystem(system: System): void;
  removeComponentOfEntity(entity: IEntity, componentType: Components): void;
  tick(): Promise<any>;
}
