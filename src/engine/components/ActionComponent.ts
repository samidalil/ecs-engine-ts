import Queue from "../../utils/Queue";
import { Components, IComponent } from "./types";

export enum Action {
  NONE,
  MOVE_LEFT,
  MOVE_FORWARD,
  MOVE_RIGHT,
  MOVE_BACKWARD,
  JUMP,
}

export const isAction = (maybeAction: any): maybeAction is Action =>
  typeof maybeAction === "number" &&
  (maybeAction == Action.NONE ||
    maybeAction == Action.MOVE_LEFT ||
    maybeAction == Action.MOVE_RIGHT ||
    maybeAction == Action.MOVE_FORWARD ||
    maybeAction == Action.MOVE_BACKWARD ||
    maybeAction == Action.JUMP);

class ActionComponent implements IComponent {
  public readonly componentType = Components.Action;

  public actions = new Queue<Action>();

  public consume = () => {
    if (this.actions.size === 0) return Action.NONE;
    return this.actions.dequeue();
  };

  public store = (action: Action) => {
    if (action !== Action.NONE) this.actions.enqueue(action);
  };
}

export default ActionComponent;
