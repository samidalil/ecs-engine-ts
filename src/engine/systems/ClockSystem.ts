import { TimeComponent } from "../components";
import { Components } from "../components/types";
import Entity from "../Entity";
import BaseSystem from "./BaseSystem";

class ClockSystem extends BaseSystem<[TimeComponent]> {
  public readonly componentTypeArray = [Components.Time];

  public behaviour = (entity: Entity, [time]: [TimeComponent]) => {
    const now = Date.now();

    time.delta = now - time.now;
    time.elasped = now - time.startedAt;
    time.frames++;
    time.now = now;
  };
}

export default ClockSystem;
