import * as ECS from "../engine";
import { isAction } from "../engine/components/ActionComponent";
import { Component, Components } from "../engine/components/types";
import Game from "../game";
import SocketServer from "./SocketServer";
import { DiffMap, INetworkManager, NetworkEventType, StateMap } from "./types";

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

  private assignState = (
    object: StateMap,
    key: ECS.Entity["id"],
    component: Component
  ) => {
    const { componentType, ...data } = component;
    let entityIndex = object.findIndex(data => key === data.id);

    if (!(~entityIndex)) {
      entityIndex = object.length;
      object.push({
        id: key,
        components: [],
      });
    }

    let componentIndex = object[entityIndex].components.findIndex(data => componentType === data.id);

    if (!(~componentIndex)) {
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

  private assignDiff = (
    object: DiffMap,
    key: ECS.Entity["id"],
    component: Component,
    eventType: NetworkEventType,
  ) => {
    const { componentType, ...data } = component;
    let entityIndex = object.findIndex(data => key === data.id);

    if (!(~entityIndex)) {
      entityIndex = object.length;
      object.push({
        eventType: NetworkEventType.NONE,
        id: key,
        components: [],
      });
    }
    object[entityIndex].eventType = eventType;

    let componentIndex = object[entityIndex].components.findIndex(data => componentType === data.id);

    if (!(~componentIndex)) {
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

  public prepare = (entity: ECS.Entity, components: Component[], eventType: NetworkEventType) => {
    components.forEach((component) => {
      this.assignDiff(this.diff, entity.id, component, eventType);
      this.assignState(this.state, entity.id, component);
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
    if (entity.hasComponents(Components.Network))
      Object.values(entity.getAllComponents()).forEach((component) => {
        this.assignDiff(this.diff, entity.id, component, NetworkEventType.CREATED);
        this.assignState(this.state, entity.id, component);
      });
  };

  private onEntityDestroyed = (entity: ECS.Entity) => {
    if (entity.hasComponents(Components.Network))
      Object.values(entity.getAllComponents()).forEach((component) => {
        this.assignDiff(this.diff, entity.id, component, NetworkEventType.REMOVED);
        this.assignState(this.state, entity.id, component);
      });
  };

  private setup = () => {
    this.game.engine.on("entityCreated", this.onEntityCreated);
    this.game.engine.on("entityDestroyed", this.onEntityDestroyed);

    this.socketServer.onConnect((socket) => {
      console.log("Client connected");
      const entity = this.game.addPlayer(this);

      setTimeout(() => socket.emit("init", {
        assignedId: entity.id,
        data: this.state,
        frame: this.previousFrame,
      }), 1000);
      socket.on("action", (action: any) => {
        if (isAction(action)) {
          this.game.applyAction(entity, action);
        }
      });
      socket.on("close", () => this.game.removePlayer(entity));
    });
  };
}

export default NetworkManager;
