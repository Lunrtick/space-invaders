import { GameController } from "../GameController";

export class GameObject implements Renderable, Reactive {
    private health: number;
    private max_health: number;

    private mass: number;
    private velocity: number = 0;

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private shape: Shape;

    private game_controller: GameController;

    constructor(options: GameObjectOptions, gc: GameController) {
        this.max_health = options.max_health;
        this.health = this.max_health;

        this.mass = options.mass;

        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.shape = options.shape;

        this.game_controller = gc;
    }

    render() {
        console.log("NIY: render");
    }

    react(e: GameEvent) {
        console.log("NIY: react");
    }
}