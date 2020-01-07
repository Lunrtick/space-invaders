import { GameObject } from "./GameObject";
import { GameController } from "../GameController";
import { degToRad } from "../utils/index";
import { Player } from "./Player";

export class Bullet extends GameObject implements Renderable, CanActivelyCollide, Collidable {

    handleCollision(source: GameObject): void {
        if (this.allowedTo('reflect', source)) {
            this.bearing += 180;
            if (!(source instanceof Bullet)) {
                this.source = source;
            }
        } else if (this.allowedTo('collide', source)) {
            this.health -= 1;
        }
    }

    protected v_max: number;

    private colour: string;

    getColour() {
        return this.colour;
    }
    protected capabilities: GameObjectCapabilities = new Set([
        'render',
        'act',
        'collide',
    ]);
    public source: GameObject;

    constructor(options: GameObjectOptions, gc: GameController, ctx: CanvasRenderingContext2D, source: GameObject, colour?: string, v_max?: number) {
        super(options, gc, ctx);
        this.source = source;
        this.colour = colour ?? 'rgb(0, 255, 0)';
        this.v_max = v_max ?? 60;
    }

    act(time_step: number) {
        const collisions = this.listCollisions();
        collisions.forEach(c => {
            this.game_controller.dispatchEvent({
                event: 'collide',
                payload: c,
                source: this
            });
        });

        this.move(time_step);
    }

    private move(time_step: number) {
        this.setVelocity(this.velocity + 2);
        this.x += this.getDeltaX(time_step);
        this.y += this.getDeltaY(time_step);
    }

    listCollisions() {
        return Array.from(this.game_controller.getGameObjects()).reduce((acc, [id, o]) => {
            if (o instanceof GameObject
                && o !== this &&
                o.can('collide') && o.willCollide(this, o)) {
                acc.push(o);
            }
            return acc;
        }, [] as GameObject[]);
    }

    destroy() {
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
            }
        });
    }

}


export function createBullet(b: ShootSpec, source: GameObject, gc: GameController, scale: { x: number, y: number; }, ctx: CanvasRenderingContext2D, colour?: string, v_max?: number) {
    const { x: scaleX, y: scaleY } = scale;
    return new Bullet({
        height: 2,
        width: 4,
        mass: 1,
        max_health: 1,
        x: b.x,
        y: b.y,
        bearing: b.bearing,
        shape: "square",
        type: 'bullet'
    }, gc, ctx, source, colour, v_max);
}