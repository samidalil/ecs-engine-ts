import { Components, IComponent } from "./types";

export class Transform implements IComponent {
  public constructor(public name: string) {}

  public readonly componentType = Components.Transform;

  position = {};
}
