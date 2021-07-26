import * as ECS from "../engine";
import { Component } from "../engine/components/types";

export interface INetworkManager {
  prepare(entity: ECS.Entity, components: Component[]): void;
  send(frame: number): void;
}
