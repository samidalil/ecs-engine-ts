import { ActionComponent, PhysicsComponent } from "../components";
import { Action } from "../components/ActionComponent";
import { Components } from "../components/types";
import Entity from "../Entity";
import BaseSystem from "./BaseSystem";

class ActionSystem extends BaseSystem<[ActionComponent, PhysicsComponent]> {
  public readonly componentTypeArray = [Components.Action, Components.Physics];

  public behaviour = (
    entity: Entity,
    [action, physics]: [ActionComponent, PhysicsComponent]
  ) => {
    switch (action.consume()) {
      case Action.MOVE_LEFT:
        physics.velocity.x -= 2;
        break;
      case Action.MOVE_RIGHT:
        physics.velocity.x += 2;
        break;
      case Action.MOVE_BACKWARD:
        physics.velocity.z -= 2;
        break;
      case Action.MOVE_FORWARD:
        physics.velocity.z += 2;
        break;
      case Action.JUMP:
        if (physics.velocity.y === 0)
          physics.velocity.y += 10;
        break;
    }
  };
}

export default ActionSystem;
