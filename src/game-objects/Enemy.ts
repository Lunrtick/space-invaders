import { GameObject } from "./GameObject";
import { Player } from './Player';

export class Enemy extends GameObject implements Collidable, CanActivelyCollide {

    handleCollision(source: GameObject): void {
        if (this.allowedTo('collide', source)) {
            this.health -= 1;
        }
    }
    protected v_max = 40;

    protected capabilities: GameObjectCapabilities = new Set([
        'render',
        'act',
        'collide',
    ]);

    getColour(): string {
        return this.group ? 'rgb(123, 80, 200)' : '#dd2200';
    }

    dispatchCollisions() {
        const collisions = this.listCollisions();
        collisions.forEach(c => {
            this.game_controller.dispatchEvent({
                event: 'collide',
                payload: c,
                source: this
            });
        });
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

    getBearingToPlayer() {
        let bearing_to_player = null;
        this.game_controller.getGameObjects().forEach(o => {
            if (o instanceof Player) {
                bearing_to_player = this.game_controller.getLineToTarget(this, o).bearing;
            }
        });
        return bearing_to_player;
    }

    act(time_step: number, should_move = true) {
        if (should_move) {
            const bounding_dims = this.game_controller.getBoundingDimensions();

            this.velocity = this.v_max;

            this.bearing = this.getBearingToPlayer() ?? this.bearing;
            const x_res = this.x + this.getDeltaX(time_step);

            if (x_res > bounding_dims.x.max - this.width || x_res < bounding_dims.x.min) {
                this.bearing += 180;
                this.x = this.x + this.getDeltaX(time_step);
            } else {
                this.x = x_res;
            }

            const y_res = this.y + this.getDeltaY(time_step);

            if (y_res > bounding_dims.y.max - this.height || y_res < bounding_dims.y.min) {
                this.bearing += 180;
                this.y = this.y + this.getDeltaY(time_step);
            } else {
                this.y = y_res;
            }
            this.bearing += 1;
        }
        this.shoot();
        this.leaveGroup();
        this.dispatchCollisions();
    }

    shoot(chance = 0.0005) {
        if (Math.random() < chance) {
            const center = this.getCenter();
            this.game_controller.createObject({
                source: this,
                event: 'shoot',
                payload: {
                    type: 'bullet',
                    x: center.x,
                    y: center.y,
                    bearing: 270 + Math.random() * 50 * this.getPosOrNeg(),
                    colour: '#ff0000'
                } as ShootSpec
            });
        }
    }

    leaveGroup(chance = 0.0001) {
        if (Math.random() < chance && this.group !== undefined) {
            this.group = undefined;
            this.v_max += Math.random() * 40;
        }
    }

    protected getPosOrNeg() {
        return Math.random() > 0.5 ? 1 : -1;
    }

    handleEvents(er: GameEventRequest[]) {
        er.forEach(er => {
            switch (er.event) {
                case 'collide':
                    const c = er as CollideEventRequest;
                    if (c.payload === this) {
                        this.handleCollision(c.source);
                    } else if (c.source === this && c.payload instanceof Player) {
                        this.handleCollision(c.payload);
                    }
                    break;
            }
        });
    }
}


