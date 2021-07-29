import * as ECS from "../engine";
import { isAction } from "../engine/components/ActionComponent";
import { Component } from "../engine/components/types";
import Game from "../game";
import SocketServer from "./SocketServer";
import { DiffMap, INetworkManager, StateMap } from "./types";

class NetworkManager implements INetworkManager {
  public constructor(
    public game: Game,
    public reliableFrames = game.engine.requiredFrameRate * 2
  ) {
    this.socketServer = new SocketServer();
    this.setup();
  }

  /** Services */

  private socketServer: SocketServer;

  /** Data */

  private previousFrame = 0;

  private diff: DiffMap = [];
  private state: StateMap = [];

  /** Public Methods */

  private assign = (
    object: StateMap,
    key: ECS.Entity["id"],
    component: Component
  ) => {
    const { componentType, ...data } = component;
    let entityIndex = object.findIndex(data => key === data.id);

    if (entityIndex === -1) {
      entityIndex = object.length;
      object.push({
        id: key,
        components: [],
      });
    }

    let componentIndex = object[entityIndex].components.findIndex(data => componentType === data.id);

    if (componentIndex === -1) {
      componentIndex = object[entityIndex].components.length;
      object[entityIndex].components.push({
        id: componentType,
        data: {} as Component,
      });
    }

    object[entityIndex].components[componentIndex].data = {
      ...data,
      ...object[entityIndex].components[componentIndex].data,
    }
  };

  public prepare = (entity: ECS.Entity, components: Component[]) => {
    components.forEach((component) => {
      this.assign(this.diff, entity.id, component);
      this.assign(this.state, entity.id, component);
    });
  };

  public send = (frame: number) => {
    if (this.previousFrame < frame) {
      if (this.previousFrame % this.reliableFrames === 0) this.emitState();
      else this.emitDiff();

      this.previousFrame = frame;
      this.diff = [];
    }
  };

  /** Private Methods */

  private emitDiff = () => {
    if (Object.keys(this.diff).length > 0)
      this.socketServer.emit("diff", {
        data: this.diff,
        frame: this.previousFrame,
      });
  };

  private emitState = () => {
    if (Object.keys(this.diff).length > 0)
      this.socketServer.emit("state", {
        data: this.state,
        frame: this.previousFrame,
      });
  };

  private onEntityCreated = (entity: ECS.Entity) => {
    this.socketServer.emit("entityCreated", {
      id: entity.id,
    });
  };

  private setup = () => {
    this.game.engine.on("entityCreated", this.onEntityCreated);

    this.socketServer.on("connection", (socket) => {
      console.log("Client connected");
      const entity = this.game.addPlayer(this);

      socket.emit("init", {
        assignedId: entity.id,
        data: this.state,
        frame: this.previousFrame,
      });
      socket.on("action", (action: any) => {
        if (isAction(action)) {
          this.game.applyAction(entity, action);
        }
      });
      socket.on("disconnect", () => this.game.removePlayer(entity));
    });
  };
}

export default NetworkManager;
