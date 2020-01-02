import { GameObject } from "./GameObject";


export class Player extends GameObject implements Renderable, Interactive, Collidable {
    protected capabilities: GameObjectCapabilities = {
        render: true,
        interact: true,
        act: true,
        collide: true
    };

    protected v_max = 250;

    private has_been_moved = false;

    renderDamage() {
        this.rendering_context.fillStyle = 'rgb(0, 0, 0)';
        const damage_width = this.width / this.max_health;
        for (let i = 0; i < this.max_health - this.health; i++) {
            this.rendering_context.fillRect(this.x + i * damage_width, this.y, damage_width, this.height - 2);
        }
    }

    render() {
        this.rendering_context.fillStyle = 'rgb(255, 0, 0)';
        this.rendering_context.fillRect(this.x, this.y, this.width, this.height);

        this.renderDamage();
    }

    handleInteraction(km: KeyMap, ncks: Set<string>, time_step: number) {
        if (km.ArrowLeft && !km.ArrowRight) {
            this.has_been_moved = true;
            this.move(-550, time_step);
        } else if (km.ArrowRight && !km.ArrowLeft) {
            this.has_been_moved = true;
            this.move(550, time_step);
        } else {
            this.has_been_moved = false;
        }

        if (ncks.has('Space') || ncks.has('ArrowUp')) {
            this.game_controller.dispatchEvent({
                source: this,
                event: 'shoot',
                payload: {
                    x: this.x + this.width / 2 - 12 * this.game_controller.scale.x,
                    y: this.y,
                    bearing: 90
                }
            });
        }


    }

    move(force: number, time_step: number) {
        if (force) {
            const delta_v = force / this.mass * time_step;
            const in_opposite_directions = (delta_v < 0 && this.velocity > 0) || (this.velocity < 0 && delta_v > 0);
            if (in_opposite_directions) {
                this.velocity += delta_v * 3;
            } else {
                this.velocity += delta_v;
            }
        }
    }

    act(time_step: number) {
        if (!this.has_been_moved) {
            this.velocity -= 0.05 * this.velocity;
        }
        const bounding_dims = this.game_controller.getBoundingDimensions();
        if (this.velocity > this.v_max) {
            this.velocity = this.v_max;
        } else if (this.velocity < -this.v_max) {
            this.velocity = -this.v_max;
        }
        const x_res = this.x + this.velocity * time_step;
        if (x_res < bounding_dims.x.min || x_res > bounding_dims.x.max - this.width) {
            this.velocity = -this.velocity;
        } else {
            this.x = x_res;
        }
    }

    handleCollision() {
        console.log('ouch');
        this.health -= 1;
    }
}


