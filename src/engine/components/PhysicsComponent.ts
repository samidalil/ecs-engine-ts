import { Vector3 } from "../../lib/math";
import { Components, IComponent } from "./types";

class PhysicsComponent implements IComponent {
  public readonly componentType = Components.Physics;

  public velocity = new Vector3();
  public useGravity = true;
  public gravityForce = 9.81;
  public friction = 5;
}

export default PhysicsComponent;
