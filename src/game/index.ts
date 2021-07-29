import * as ECS from "../engine";
import { Action } from "../engine/components/ActionComponent";
import { Components } from "../engine/components/types";
import { INetworkManager } from "../networking/types";
import { IGame } from "./types";

class Game implements IGame {
  public engine = new ECS.Engine(60);
  public players: ECS.Entity[] = [];

  public addPlayer = (server: INetworkManager) => {
    const entity = this.engine.createEntity([
      new ECS.components.ActionComponent(),
      new ECS.components.PhysicsComponent(),
      new ECS.components.TransformComponent(),
      new ECS.components.NetworkComponent(server),
    ]);

    this.players.push(entity);
    return entity;
  };

  public applyAction = (entity: ECS.Entity, action: Action) => {
    const component = entity.getComponent(
      Components.Action
    ) as ECS.components.ActionComponent;

    component.store(action);
  };

  public removePlayer = (entity: ECS.Entity) => {
    const index = this.players.indexOf(entity);

    this.players.splice(index, 1);
    this.engine.destroyEntity(entity);
  };

  public run = async () => {
    this.engine.registerSystem(new ECS.systems.ActionSystem());
    this.engine.registerSystem(new ECS.systems.NetworkSystem());
    this.engine.registerSystem(new ECS.systems.PhysicsSystem());

    while (true) await this.engine.tick();
  };
}

export default Game;
