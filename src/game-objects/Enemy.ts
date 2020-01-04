import { GameObject } from "./GameObject";
import { Player } from './Player';
import { degToRad } from '../utils/index';

export class Enemy extends GameObject implements Collidable {

    handleCollision(source: GameObject & CanActivelyCollide): void {
        if (this.allowedTo('collide', source)) {
            this.health -= 1;
        }
    }
    protected v_max = 30;

    private step = 0;

    protected capabilities: GameObjectCapabilities = new Set([
        'render',
        'act',
        'collide',
    ]);

    getColour(): string {
        return 'rgb(123, 80, 200)';
    }

    renderDamage() {
        this.rendering_context.fillStyle = 'rgb(0, 0, 0)';
        const damage_width = this.width / this.max_health;
        for (let i = 0; i < this.max_health - this.health; i++) {
            this.rendering_context.fillRect(this.x + i * damage_width, this.y, damage_width, this.height - 2);
        }
    }

    render() {
        this.rendering_context.fillStyle = this.getColour();
        this.rendering_context.fillRect(this.x, this.y, this.width, this.height);

        this.renderDamage();
    }

    act(time_step: number) {
        const bounding_dims = this.game_controller.getBoundingDimensions();

        this.step += 1;

        this.velocity = this.v_max;

        if (this.step > 60) {
            const jump_distance = bounding_dims.x.max / 10;
            const x_res = this.x + Math.cos(this.bearing) * jump_distance;
            if (x_res > bounding_dims.x.max - this.width || x_res < bounding_dims.x.min) {
                this.bearing += 180 * degToRad;
                this.x = this.x + Math.cos(this.bearing) * jump_distance;
            } else {
                this.x = x_res;
            }
            this.step = 0;
            if (this.health < this.max_health) {
                this.y += bounding_dims.y.max / 20;
            }

            this.shoot(0.4);

        }
    }

    public shoot(chance = 0.0005) {
        if (Math.random() < chance) {
            this.game_controller.dispatchEvent({
                source: this,
                event: 'shoot',
                payload: {
                    x: this.x + this.width / 2 - 12 * this.game_controller.scale.x,
                    y: this.y,
                    bearing: 270 + Math.random() * 50 * this.getPosOrNeg(),
                    collides_with: new Set([Player.name]),
                    doesnt_collide_with: new Set([this.constructor.name])
                } as BulletSpec
            });
        }
    }

    private getPosOrNeg() {
        return Math.random() > 0.5 ? 1 : -1;
    }
}


