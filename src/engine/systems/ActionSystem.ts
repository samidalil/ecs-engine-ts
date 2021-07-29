import { Vector3 } from "../../lib/math";
import { ActionComponent, PhysicsComponent, TransformComponent } from "../components";
import { Action } from "../components/ActionComponent";
import { Components } from "../components/types";
import Entity from "../Entity";
import BaseSystem from "./BaseSystem";

class ActionSystem extends BaseSystem<[ActionComponent, PhysicsComponent, TransformComponent]> {
  public readonly componentTypeArray = [Components.Action, Components.Physics, Components.Transform];

  public behaviour = (
    entity: Entity,
    [action, physics, transform]: [ActionComponent, PhysicsComponent, TransformComponent]
  ) => {
    switch (action.consume()) {
      case Action.MOVE_LEFT:
        physics.velocity.x -= physics.speed.x;
        break;
      case Action.MOVE_RIGHT:
        physics.velocity.x += physics.speed.x;
        break;
      case Action.MOVE_BACKWARD:
        physics.velocity.z -= physics.speed.z;
        break;
      case Action.MOVE_FORWARD:
        physics.velocity.z += physics.speed.z;
        break;
      case Action.JUMP:
        if (physics.velocity.y === 0)
          physics.velocity.y += physics.speed.y;
        break;
    }
  };
}

export default ActionSystem;
