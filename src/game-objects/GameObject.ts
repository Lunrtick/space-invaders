import { GameController } from "../GameController";
import { degToRad } from '../utils/index';

let current = 1;
function getId() {
    const id = `GObj - ${current}`;
    current += 1;
    return id;
}

export class GameObject {
    protected capabilities: GameObjectCapabilities = {
        act: true
    };

    public group?: string;

    public id: string;

    protected health: number;
    protected max_health: number;

    protected mass: number;
    protected velocity: number = 0;
    protected v_max: number = 10e9;

    public x: number;
    public y: number;
    public bearing: number;
    public width: number;
    public height: number;
    public shape: Shape;

    protected game_controller: GameController;

    protected rendering_context: CanvasRenderingContext2D;

    constructor(options: GameObjectOptions, gc: GameController, ctx: CanvasRenderingContext2D) {
        this.id = getId();
        this.max_health = options.max_health;
        this.health = this.max_health;
        300 - 48;
        this.mass = options.mass;

        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.shape = options.shape ?? 'square';
        this.bearing = options.bearing ?? 90; // horizontal to the right

        this.game_controller = gc;

        this.rendering_context = ctx;

        this.group = options.group;
    }

    act(time_step: number) {

    }

    isDead() {
        return this.health <= 0;
    }

    can(action: string): boolean {
        return this.capabilities[action];
    }

    isOutOfBox(xMin: number, xMax: number, yMin: number, yMax: number) {
        return this.x < xMin || this.x > xMax || this.y < yMin || this.y > yMax;
    }

    getDeltaX(velocity: number, bearing: number, time_step: number) {
        return velocity * Math.cos(bearing * degToRad) * time_step;
    }

    getDeltaY(velocity: number, bearing: number, time_step: number) {
        return velocity * Math.sin(bearing * degToRad) * time_step;
    }

    willCollide(r1: Rectangle, r2: Rectangle) {
        if (this.shape === 'square') {
            if (r1.x < r2.x + r2.width &&
                r1.x + r1.width > r2.x &&
                r1.y < r2.y + r2.height &&
                r1.y + r1.height > r2.y) {
                return this;
            } else {
                return null;
            }
        } else {
            throw new Error('circle?');
        }
    }

    destroy() {
        console.log(`${this.id} says baaaaaii`);
    }
}