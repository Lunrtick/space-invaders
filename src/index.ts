import { GameController } from "./GameController";
import { KeyboardManager } from "./KeyboardManager";

const game_canvas = document.getElementById('game') as HTMLCanvasElement;

const game_config: GameConfig = {
    objects: [{
        x: 500 - 48,
        y: 1000 - 60,
        width: 48,
        height: 48,
        mass: 3,
        max_health: 3
    }],
    dimensions: { width: 1000, height: 1000 }
};

const gc = new GameController(game_canvas, game_config, new KeyboardManager());
window.GameController = gc;
gc.initGameObjects();
gc.run();