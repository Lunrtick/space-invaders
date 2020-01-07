import { GameObject } from "./GameObject";
import { GameController } from "../GameController";
import { degToRad } from "../utils/index";
import { Player } from "./Player";

export class Laser extends GameObject implements Renderable, CanActivelyCollide, Collidable {

    handleCollision(source: GameObject): void {
        if (this.allowedTo('collide', source)) {
            this.hit = true;
        }
    }
    protected capabilities: GameObjectCapabilities = new Set([
        'render',
        'act',
        'collide',
    ]);
    public source: GameObject;

    public created_at: number;

    private target: GameObject;
    private target_coords: { x: number, y: number; };
    private active = false;
    private sighted = false;
    private hit = false;


    constructor(options: GameObjectOptions, gc: GameController, ctx: CanvasRenderingContext2D, source: GameObject, target: GameObject) {
        super(options, gc, ctx);
        this.source = source;
        this.created_at = Date.now();
        this.target = target;
        this.target_coords = target.getCenter();
    }

    render() {
        if (this.active) {
            this.rendering_context.lineWidth = 4;
            this.rendering_context.strokeStyle = '#ff0000';
        } else if (this.sighted) {
            this.rendering_context.lineWidth = 2;
            this.rendering_context.strokeStyle = '#ff000085';
        } else {
            this.rendering_context.lineWidth = 1;
            this.rendering_context.strokeStyle = '#ff000060';
        }
        this.rendering_context.beginPath();
        this.rendering_context.moveTo(this.x, this.y);
        this.rendering_context.lineTo(this.target_coords.x, this.target_coords.y);
        this.rendering_context.stroke();
    }

    act(time_step: number) {
        const now = Date.now();
        if (now - this.created_at > 1450) {
            this.health = 0;
        } else {
            if (now - this.created_at > 1400) {
                this.active = true;
            } else if (now - this.created_at < 1200) {
                this.target_coords = this.target.getCenter();
            } else {
                this.sighted = true;
            }
            if (!this.hit && this.active) {
                const collisions = this.listCollisions();
                collisions.forEach(c => {
                    this.game_controller.dispatchEvent({
                        event: 'collide',
                        payload: c,
                        source: this
                    });
                });
            }
        }

    }

    listCollisions() {
        return Array.from(this.game_controller.getGameObjects()).reduce((acc, [id, o]) => {
            if (o instanceof GameObject &&
                o.can('collide')) {
                if (this.target_coords.x > o.x && this.target_coords.x < o.x + o.width) {
                    acc.push(o);
                }
            }
            return acc;
        }, [] as GameObject[]);
    }

    handleDeath(o: GameObject) {
        this.health = 0;
    }

    handleEvents(er: GameEventRequest[]) {
        er.forEach(er => {
            switch (er.event) {
                case 'collide':
                    const c = er as CollideEventRequest;
                    if (c.source === this) {
                        this.handleCollision(c.payload);
                    }
                    break;
                case 'death':
                    if (er.source === this.source) {
                        this.handleDeath(er.source);
                    }
            }
        });
    }

    destroy() {
        this.game_controller.dispatchEvent({
            source: this,
            event: 'death',
            payload: null
        });
    }

}
export function createLaser(b: ShootSpec, source: GameObject, target: GameObject, gc: GameController, scale: { x: number, y: number; }, ctx: CanvasRenderingContext2D) {
    const { x: scaleX, y: scaleY } = scale;
    return new Laser({
        height: 0,
        width: 0,
        mass: 1,
        max_health: 1,
        x: b.x,
        y: b.y,
        bearing: b.bearing,
        shape: "square",
        type: 'laser'
    }, gc, ctx, source, target);
}