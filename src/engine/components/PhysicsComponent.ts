import { Vector3 } from "../../lib/math";
import { Components, IComponent } from "./types";

class PhysicsComponent implements IComponent {
  public readonly componentType = Components.Physics;

  public velocity = new Vector3();
  public useGravity = true;
  public speed = new Vector3(0.3, 10, 0.3);
  public gravityForce = 9.81;
  public friction = 3;
}

export default PhysicsComponent;
