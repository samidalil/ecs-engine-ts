class Vector3 {
  public constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  /** Getters */

  public get magnitude() {
    return Math.sqrt(this.sqrMagnitude);
  }

  public get normalized() {
    return this.copy().normalize();
  }

  public get sqrMagnitude() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /** Public methods */

  public add = (v: Vector3) => {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  };
  public assign = (v: Vector3) => {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  };

  public copy = () => new Vector3(this.x, this.y, this.z);

  public divide = (f: number) => {
    this.x /= f;
    this.y /= f;
    this.z /= f;
    return this;
  };

  public multiply = (f: number) => {
    this.x *= f;
    this.y *= f;
    this.z *= f;
    return this;
  };

  public normalize = () => this.divide(this.magnitude);

  public subtract = (v: Vector3) => {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  };

  public toString = () => `x: ${this.x}, y: ${this.y}, z: ${this.z}`;

  /** Static methods */

  public static add = (a: Vector3, b: Vector3) => a.copy().add(b);

  public static dot = (a: Vector3, b: Vector3) =>
    a.x * b.x + a.y * b.y + a.z * b.z;

  public static subtract = (a: Vector3, b: Vector3) => a.copy().subtract(b);

  public static equals = (a: Vector3, b: Vector3) =>
    a.x === b.x && a.y === b.y && a.z === b.z;

  public static zero = () => new Vector3(0, 0, 0);
}

export default Vector3;
