import * as ECS from "../engine";
import { Component, Components } from "../engine/components/types";

export enum NetworkEventType {
  NONE,
  CREATED,
  MODIFIED,
  REMOVED,
};

export interface INetworkManager {
  prepare(entity: ECS.Entity, components: Component[], eventType: NetworkEventType): void;
  send(frame: number): void;
}

export interface ComponentInfo {
  id: Components;
  data: Component;
}

export interface EntityInfo {
  id: ECS.Entity["id"];
  components: ComponentInfo[];
}

export type StateMap = EntityInfo[];

export interface EntityDiffInfo extends EntityInfo {
  eventType: NetworkEventType;
}

export type DiffMap = EntityDiffInfo[];
