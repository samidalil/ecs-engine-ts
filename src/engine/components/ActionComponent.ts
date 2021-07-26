import Stack from "../../utils/Stack";
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

  public actions = new Stack<Action>();

  public consume = () => {
    if (this.actions.size === 0) return Action.NONE;
    return this.actions.pop();
  };

  public store = (action: Action) => {
    if (action !== Action.NONE) this.actions.push(action);
  };
}

export default ActionComponent;
