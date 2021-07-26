import { Components, IComponent } from "./types";

class TimeComponent implements IComponent {
  public constructor() {}

  public readonly componentType = Components.Time;

  public delta = 0;
  public elasped = 0;
  public frames = 0;
  public now = Date.now();
  public startedAt = Date.now();
}

export default TimeComponent;
