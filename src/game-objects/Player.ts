import { GameObject } from "./GameObject";


export class Player extends GameObject {
    private has_been_moved = false;

    render() {
        this.rendering_context.fillStyle = 'rgb(255, 0, 0)';
        this.rendering_context.fillRect(this.x, this.y, this.width, this.height);
    }

    handleInteraction(km: KeyMap, ncks: Set<string>, time_step: number) {
        if (km.ArrowLeft && !km.ArrowRight) {
            this.has_been_moved = true;
            this.move(-350, time_step);
        } else if (km.ArrowRight && !km.ArrowLeft) {
            this.has_been_moved = true;
            this.move(350, time_step);
        } else {
            this.has_been_moved = false;
        }

        if (ncks.has('Space')) {
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
            this.velocity += delta_v;
        }
    }

    act(time_step: number) {
        if (!this.has_been_moved) {
            this.velocity -= 0.1 * this.velocity;
        }
        const bounding_dims = this.game_controller.getBoundingDimensions();
        const x_res = this.x + this.velocity * time_step;
        if (x_res < bounding_dims.x.min || x_res > bounding_dims.x.max - this.width) {
            this.velocity = 0;
        } else {
            this.x = x_res;
        }
    }
}


