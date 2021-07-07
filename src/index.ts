import { Transform } from "./engine/components/Transform";
import Engine from "./engine/Engine";
import MoveSystem from "./engine/systems/MoveSystem";

const engine = new Engine();

engine.registerSystem(new MoveSystem());

const entity = engine.createEntity();

entity.addComponent(new Transform("Testtest"));

engine.run();
