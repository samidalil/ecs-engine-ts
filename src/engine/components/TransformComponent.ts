import { Vector3 } from "../../lib/math";
import { Components, IComponent } from "./types";

class TransformComponent implements IComponent {
  public constructor(
    public position = new Vector3(),
    public scale = new Vector3(1, 1, 1),
    public rotation = new Vector3()
  ) {}

  public readonly componentType = Components.Transform;
}

export default TransformComponent;
