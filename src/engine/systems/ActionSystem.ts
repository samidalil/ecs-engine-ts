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
        //physics.velocity.x -= 2;
        transform.rotation.y -= 1;
        break;
      case Action.MOVE_RIGHT:
        //physics.velocity.x += 2;np
        transform.rotation.y += 1;
        break;
      case Action.MOVE_BACKWARD:
        //physics.velocity.z -= 0.2;
        transform.position.z -= 0.2;
        break;
      case Action.MOVE_FORWARD:
        //physics.velocity.z += 0.2;
        transform.position.z += 0.2;
        break;
      case Action.JUMP:
        if (physics.velocity.y === 0)
          physics.velocity.y += 10;
        break;
    }
  };
}

export default ActionSystem;
