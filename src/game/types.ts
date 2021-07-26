import * as ECS from "../engine";
import { Action } from "../engine/components/ActionComponent";
import { INetworkManager } from "../networking/types";

export interface IGame {
  engine: ECS.Engine;
  players: ECS.Entity[];

  addPlayer(server: INetworkManager): ECS.Entity;
  applyAction(entity: ECS.Entity, action: Action): void;
  removePlayer(entity: ECS.Entity): void;
  run(): Promise<any>;
}
