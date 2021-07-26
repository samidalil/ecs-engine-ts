import { Vector3 } from "../../lib/math";
import { NetworkComponent, TransformComponent } from "../components";
import { Components } from "../components/types";
import Engine from "../Engine";
import Entity from "../Entity";
import BaseSystem from "./BaseSystem";

class NetworkSystem extends BaseSystem<[TransformComponent, NetworkComponent]> {
  public readonly componentTypeArray = [
    Components.Transform,
    Components.Network,
  ];

  public behaviour = (
    entity: Entity,
    [transform, network]: [TransformComponent, NetworkComponent],
    engine: Engine
  ) => {
    if (!Vector3.equals(transform.position, network.position)) {
      network.registerModification(entity, transform);
    }
    network.updateClients(engine.time.frames);
  };
}

export default NetworkSystem;
