import { GameObject } from "./GameObject";


export class Player extends GameObject implements Renderable, Interactive {
    protected capabilities: GameObjectCapabilities = {
        render: true,
        interact: true,
        act: true
    };

    protected v_max = 250;

    private has_been_moved = false;

    render() {
        this.rendering_context.fillStyle = 'rgb(255, 0, 0)';
        this.rendering_context.fillRect(this.x, this.y, this.width, this.height);
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
}


