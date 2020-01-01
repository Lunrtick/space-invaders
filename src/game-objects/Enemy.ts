import { GameObject } from "./GameObject";

import { degToRad } from '../utils/index';

export class Enemy extends GameObject implements Collidable {
    handleCollision(source: GameObject & CanActivelyCollide): void {
        this.health -= 1;
    }
    protected v_max = 30;

    private step = 0;

    protected capabilities = {
        render: true,
        act: true,
        collide: true
    };

    render() {
        this.rendering_context.fillStyle = this.max_health > 2 ? 'rgb(0, 0, 255)' : 'rgb(123, 80, 200)';
        this.rendering_context.fillRect(this.x, this.y, this.width, this.height);

        this.rendering_context.fillStyle = 'rgb(0, 0, 0)';
        const damage_width = this.width / this.max_health;
        for (let i = 0; i < this.max_health - this.health; i++) {
            this.rendering_context.fillRect(this.x + i * damage_width, this.y, damage_width, this.height - 2);
        }
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

        }
    }

    private getPosOrNeg() {
        return Math.random() > 0.5 ? 1 : -1;
    }
}


