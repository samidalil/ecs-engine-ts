import ActionComponent from "./ActionComponent";
import NetworkComponent from "./NetworkComponent";
import PhysicsComponent from "./PhysicsComponent";
import TimeComponent from "./TimeComponent";
import TransformComponent from "./TransformComponent";

export enum Components {
  None = 0,
  Time = 1 << 0,
  Transform = 1 << 1,
  Physics = 1 << 2,
  Action = 1 << 3,
  Network = 1 << 4,
}

export interface IComponent {
  readonly componentType: Components;
}

export type Component =
  | TimeComponent
  | TransformComponent
  | PhysicsComponent
  | ActionComponent
  | NetworkComponent;
