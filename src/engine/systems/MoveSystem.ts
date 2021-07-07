import { Transform } from "../components/Transform";
import { Components } from "../components/types";
import Entity from "../Entity";
import BaseSystem from "./BaseSystem";

class MoveSystem extends BaseSystem<[Transform]> {
  public readonly componentTypes = Components.Transform;
  public readonly componentTypeArray = [Components.Transform];

  public behaviour = (entity: Entity, components: [Transform]) => {
    components[0].position = {};
    console.log(components[0].name);
  };
}

export default MoveSystem;
