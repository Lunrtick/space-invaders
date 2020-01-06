import { GameController } from "./GameController";
import { KeyboardManager } from "./KeyboardManager";
import { Player } from "./game-objects/Player";
import { Bullet } from "./game-objects/Bullet";
import { Enemy } from "./game-objects/Enemy";
import { Laser } from "./game-objects/Laser";

const game_canvas = document.getElementById('game') as HTMLCanvasElement;

const game_rules = new Map<string, RuleFunction>();

game_rules.set('collide', (o1, o2) => {
    if (o1 instanceof Bullet || o1 instanceof Laser) {
        return o1.source.allowedTo('hit', o2);
    } else if (o2 instanceof Bullet || o2 instanceof Laser) {
        return o2.source.allowedTo('hit', o1);
    }
    return false;
});

game_rules.set('hit', (o1, o2) => {
    if (o1 instanceof Player) {
        return o2 instanceof Enemy;
    } else if (o1 instanceof Enemy) {
        return o2 instanceof Player;
    }
    return false;
});

game_rules.set('reflect', (o1, o2) => {
    return false;
});

const game_config: GameConfig = {
    objects: [{
        x: 500 - 48,
        y: 1000 - 60,
        width: 48,
        height: 48,
        mass: 3,
        max_health: 12,
        type: 'player'
    },
    {
        x: 500 - 48,
        y: 200 - 48,
        width: 48,
        height: 48,
        mass: 3,
        max_health: 5,
        type: 'laser-enemy'
    }],
    dimensions: { width: 1000, height: 1000 },
    groups: [
        'main-enemy-group'
    ],
    rules: game_rules

};

for (let i = 0; i < Math.random() * 4; i++) {
    game_config.objects.push({
        x: 500 - 48 + i * 100,
        y: 100 - 48,
        width: 48,
        height: 48,
        mass: 3,
        max_health: 5,
        type: 'laser-enemy'
    });
}

for (let i = 0; i < (game_config.dimensions.width - 150) / 50; i++) {
    game_config.objects.push({
        x: 50 * i * 1.1,
        y: 200,
        width: 48,
        height: 48,
        mass: 3,
        max_health: 1,
        type: i % 4 === 0 ? 'sniper-enemy' : 'enemy' as GameObjectType,
        group: 'main-enemy-group'
    });
    game_config.objects.push({
        x: 50 * i * 1.1,
        y: 300,
        width: 48,
        height: 48,
        mass: 3,
        max_health: 1,
        type: 'enemy' as GameObjectType,
        group: 'main-enemy-group'
    });
}

const gc = new GameController(game_canvas, game_config, new KeyboardManager());
window.GameController = gc;
gc.initGameObjects();
gc.run();