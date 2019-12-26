import { GameObject } from "./game-objects/GameObject";

export class GameController {
    private drawing_canvas: HTMLCanvasElement;
    private objects: GameObject[] = [];

    constructor(canvas: HTMLCanvasElement, game_config: GameConfig) {
        this.drawing_canvas = canvas;
        this.initGameObjects(game_config);
    }

    initGameObjects(game_config: GameConfig): void {
        this.objects.push()
    }


}