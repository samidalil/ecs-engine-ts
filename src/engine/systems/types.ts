import ActionSystem from "./ActionSystem";
import ClockSystem from "./ClockSystem";
import NetworkSystem from "./NetworkSystem";
import PhysicsSystem from "./PhysicsSystem";

export type System = ClockSystem | PhysicsSystem | ActionSystem | NetworkSystem;
