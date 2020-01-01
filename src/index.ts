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
        max_health: 3,
        type: 'player'
    },
    {
        x: 500 - 48,
        y: 200 - 48,
        width: 48,
        height: 48,
        mass: 3,
        max_health: 5,
        type: 'enemy'
    }],
    dimensions: { width: 1000, height: 1000 }
};

for (let i = 0; i < (game_config.dimensions.width - 150) / 50; i++) {
    game_config.objects.push({
        x: 50 * i,
        y: 50 * i,
        width: 48,
        height: 48,
        mass: 3,
        max_health: 1,
        type: 'enemy'
    });
}

const gc = new GameController(game_canvas, game_config, new KeyboardManager());
window.GameController = gc;
gc.initGameObjects();
gc.run();