import { GameObject } from "./GameObject";
import { GameController } from "../GameController";
const degToRad = Math.PI / 180;
export class Bullet extends GameObject implements Renderable {
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
        this.velocity += 5;
        const delta_x = this.velocity * Math.cos(this.bearing * degToRad) * time_step;
        const delta_y = this.velocity * Math.sin(this.bearing * degToRad) * time_step;
        this.x += delta_x;
        this.y += delta_y;
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
        shape: "square"
    }, gc, ctx, source);
}