import express from "express";
import { createServer, Server } from "http";
import SIO from "socket.io";

import * as ECS from "../engine";
import { isAction } from "../engine/components/ActionComponent";
import { Component } from "../engine/components/types";
import { EntityComponents } from "../engine/types";
import Game from "../game";
import { INetworkManager } from "./types";

type StateMap = Record<ECS.Entity["id"], EntityComponents>;

class NetworkManager implements INetworkManager {
  public constructor(
    public game: Game,
    public reliableFrames = game.engine.requiredFrameRate * 2
  ) {
    this.expressApp = express();
    this.httpServer = createServer(this.expressApp);
    this.socketServer = new SIO.Server(this.httpServer, { cors: {} });
  }

  /** Services */

  private expressApp;
  private httpServer: Server;
  private socketServer: SIO.Server;

  /** Data */

  private previousFrame = 0;

  private diff: StateMap = {};
  private state: StateMap = {};

  /** Public Methods */

  public listen = (port = 3000) => {
    this.setup();
    this.expressApp.get("/", (req, res) => {
      console.log("Aiming root");
      res.send("Test");
    });
    this.httpServer.listen(port, () =>
      console.log(`Listening to port ${port}`)
    );
  };

  private assign = (
    object: StateMap,
    key: ECS.Entity["id"],
    component: Component
  ) => {
    const { componentType, ...data } = component;

    if (!(key in object)) object[key] = {};
    if (!(componentType in object[key]))
      object[key][componentType] = {} as Component;
    object[key][componentType] = {
      ...object[key][componentType],
      ...data,
    };
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
      this.diff = {};
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

  };

  private setup = () => {
    this.game.engine.on("entityCreated", this.onEntityCreated);

    this.socketServer.on("connection", (socket) => {
      console.log("Client connected");
      const entity = this.game.addPlayer(this);

      socket.emit("state", {
        data: this.state,
        frame: this.previousFrame,
      });
      socket.on("action", (action: any) => {
        if (isAction(+action)) {
          this.game.applyAction(entity, +action);
        }
      });
      socket.emit("say_hi", { msg: "test" });
      socket.on("disconnect", () => this.game.removePlayer(entity));
    });
  };
}

export default NetworkManager;
