import Game from "./game";
import NetworkManager from "./networking";

const game = new Game();
const networkManager = new NetworkManager(game);

game.run();
networkManager.listen();
