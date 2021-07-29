import { Vector3 } from "../../lib/math";
import { INetworkManager, NetworkEventType } from "../../networking/types";
import Entity from "../Entity";
import TransformComponent from "./TransformComponent";
import { Components, IComponent } from "./types";

class NetworkComponent implements IComponent {
  public constructor(public server: INetworkManager) {}
  public readonly componentType = Components.Network;

  public position = new Vector3();

  public registerModification = (
    entity: Entity,
    transform: TransformComponent
  ) => {
    this.server.prepare(entity, [transform], NetworkEventType.MODIFIED);
    this.position = transform.position.copy();
  };

  public updateClients = (frame: number) => this.server.send(frame);
}

export default NetworkComponent;
