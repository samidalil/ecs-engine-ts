export enum Components {
  None = 0,
  Transform = 1 << 0,
}

export interface IComponent {
  readonly componentType: Components;
}
