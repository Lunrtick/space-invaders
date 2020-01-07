import { GameController } from "../GameController";
import { degToRad } from '../utils/index';

let current = 1;
function getId() {
    const id = `GObj - ${current}`;
    current += 1;
    return id;
}

export class GameObject {
    protected capabilities: GameObjectCapabilities = new Set([
        'act',
        'render'
    ]);

    public group?: string;

    public id: string;

    protected health: number;
    protected max_health: number;

    protected mass: number;
    protected velocity: number = 0;
    protected v_max: number = 10e9;
    setVelocity(new_v: number) {
        if (new_v < this.v_max) {
            this.velocity = new_v;
        }
    }

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
        this.bearing = options.bearing ?? 0; // horizontal to the right

        this.game_controller = gc;

        this.rendering_context = ctx;

        this.group = options.group;
    }

    act(time_step: number) {

    }

    render() {
        this.rendering_context.fillStyle = this.getColour();
        this.rendering_context.fillRect(this.x, this.y, this.width, this.height);
    }

    allowedTo(action: string, o: GameObject) {
        return this.game_controller.allows(this, action, o);
    }

    isDead() {
        return this.health <= 0;
    }

    can(action: string): boolean {
        return this.capabilities.has(action);
    }

    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    getColour(): string {
        return '#fff';
    }

    isOutOfBox(xMin: number, xMax: number, yMin: number, yMax: number) {
        return this.x < xMin || this.x > xMax || this.y < yMin || this.y > yMax;
    }

    static getDeltaX(velocity: number, bearing: number, time_step: number) {
        return velocity * Math.cos(bearing * degToRad) * time_step;
    }

    static getDeltaY(velocity: number, bearing: number, time_step: number) {
        return velocity * Math.sin(bearing * degToRad) * time_step;
    }

    getDeltaX(time_step: number) {
        return this.velocity * Math.cos(this.bearing * degToRad) * time_step;
    }

    getDeltaY(time_step: number) {
        return this.velocity * Math.sin(this.bearing * degToRad) * time_step;
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

    handleEvents(er: GameEventRequest[]) {

    }

    playDamageSound() {

    }

    destroy() {
        const sound = new Audio('http://localhost:8002/blast.mp3');
        sound.volume = 0.2;
        sound.play();
    }
}