import { GameController } from "../GameController";
import { Shape } from '../enums';
export class GameObject implements Renderable, Reactive {
    protected health: number;
    protected max_health: number;

    protected mass: number;
    protected velocity: number = 0;

    protected x: number;
    protected y: number;
    protected bearing: number;
    protected width: number;
    protected height: number;
    protected shape: Shape;

    protected game_controller: GameController;

    protected rendering_context: CanvasRenderingContext2D;

    constructor(options: GameObjectOptions, gc: GameController, ctx: CanvasRenderingContext2D) {
        this.max_health = options.max_health;
        this.health = this.max_health;

        this.mass = options.mass;

        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.shape = options.shape ?? Shape.square;
        this.bearing = options.bearing ?? 90; // horizontal to the right

        this.game_controller = gc;

        this.rendering_context = ctx;
    }

    render() {
    }

    handleInteraction(km: KeyMap, ncks: Set<string>, time_step: number) {
    }

    react(e: GameEvent) {
    }

    act(time_step: number) {

    }

    isOutOfBox(xMin: number, xMax: number, yMin: number, yMax: number) {
        return this.x < xMin || this.x > xMax || this.y < yMin || this.y > yMax;
    }
}