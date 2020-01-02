import { GameObject } from "./GameObject";
import { GameController } from "../GameController";
export class Bullet extends GameObject implements Renderable, CanActivelyCollide, Collidable {
    handleCollision(source: GameObject): void {
        this.health -= 1;
    }
    protected capabilities: GameObjectCapabilities = {
        render: true,
        act: true
    };

    public source: GameObject;

    constructor(options: GameObjectOptions, gc: GameController, ctx: CanvasRenderingContext2D, source: GameObject) {
        super(options, gc, ctx);
        this.source = source;
    }

    render() {
        this.rendering_context.fillStyle = 'rgb(0, 255, 0)';
        this.rendering_context.fillRect(this.x, this.y, this.width, this.height);
    }

    act(time_step: number) {
        const collisions = this.listCollisions();
        collisions.forEach(c => {
            console.log(c);
            this.game_controller.dispatchEvent({
                event: 'collide',
                payload: c,
                source: this
            });
        });

        this.velocity += 2;
        this.x += this.getDeltaX(this.velocity, this.bearing, time_step);
        this.y += this.getDeltaY(this.velocity, this.bearing, time_step);
    }

    listCollisions() {
        return Array.from(this.game_controller.getGameObjects()).reduce((acc, [id, o]) => {
            if (
                o.constructor.name !== this.source.constructor.name
                && o instanceof GameObject &&
                o.can('collide') && o.willCollide(this, o)) {
                acc.push(o);
            }
            return acc;
        }, [] as GameObject[]);
    }

    destroy() {
        console.log("Ded Bullet");
    }

}


export function createBullet(b: BulletSpec, source: GameObject, gc: GameController, scale: { x: number, y: number; }, ctx: CanvasRenderingContext2D) {
    const { x: scaleX, y: scaleY } = scale;
    return new Bullet({
        height: 12 * scaleX,
        width: 12 * scaleY,
        mass: 1,
        max_health: 1,
        x: b.x,
        y: b.y,
        bearing: b.bearing,
        shape: "square",
        type: 'bullet'
    }, gc, ctx, source);
}