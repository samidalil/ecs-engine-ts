import { Vector3 } from "../../lib/math";
import { TransformComponent } from "../components";
import PhysicsComponent from "../components/PhysicsComponent";
import { Components } from "../components/types";
import Engine from "../Engine";
import Entity from "../Entity";
import BaseSystem from "./BaseSystem";

class PhysicsSystem extends BaseSystem<[TransformComponent, PhysicsComponent]> {
  public readonly componentTypeArray = [
    Components.Transform,
    Components.Physics,
  ];

  public behaviour = (
    entity: Entity,
    [transform, physics]: [TransformComponent, PhysicsComponent],
    engine: Engine
  ) => {
    const deltaVelocity = physics.velocity.copy().multiply(engine.time.delta);
    if (transform.position.y > 0)
      physics.velocity.y -= physics.gravityForce * engine.time.delta

    transform.position.add(deltaVelocity);
    physics.velocity.subtract(deltaVelocity);
    if (transform.position.y < 0) {
      transform.position.y = 0;
      physics.velocity.y = 0;
    }

    if (physics.velocity.sqrMagnitude < 0.000001)
      physics.velocity = Vector3.zero();
  };
}

export default PhysicsSystem;
