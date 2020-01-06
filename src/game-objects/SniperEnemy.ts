import { GameObject } from "./GameObject";
import { Player } from './Player';
import { Enemy } from "./Enemy";
import { Laser } from "./Laser";

export class SniperEnemy extends Enemy implements Collidable {

    protected v_max = 10;

    protected capabilities: GameObjectCapabilities = new Set([
        'render',
        'act',
        'collide',
    ]);

    getColour(): string {
        return 'rgb(80, 123, 200)';
    }

    private shoot_chance = 0;

    act(time_step: number, should_move = true) {
        if (should_move) {
            const bounding_dims = this.game_controller.getBoundingDimensions();
            this.velocity = this.v_max;


            const x_res = this.x + this.getDeltaX(time_step);

            if (x_res > bounding_dims.x.max - this.width || x_res < bounding_dims.x.min) {
                this.bearing += 180;
                this.x = this.x + this.getDeltaX(time_step);
            } else {
                this.x = x_res;
            }

            const y_res = this.y + this.getDeltaY(time_step);

            if (y_res > bounding_dims.y.max / 2 || y_res < bounding_dims.y.min) {
                this.bearing += 180;
                this.y = this.y + this.getDeltaY(time_step);
            } else {
                this.y = y_res;
            }
            this.bearing += 1;
        }

        this.shoot(this.shoot_chance);
        this.shoot_chance += 0.00001 + 0.0001 * (1 - this.health / this.max_health);
    }

    handleDeath(o: GameObject) {

    }

    handleEvents(er: GameEventRequest[]) {
        er.forEach(er => {
            switch (er.event) {
                case 'collide':
                    const c = er as CollideEventRequest;
                    if (c.payload === this) {
                        this.handleCollision(c.source);
                    }
                    break;
            }
        });
    }

    public shoot(chance = 0.0005) {
        if (Math.random() < chance) {
            this.shoot_chance = 0;
            const go = this.game_controller.getGameObjects();
            const center = this.getCenter();
            go.forEach((o) => {
                if (o instanceof Player) {
                    const t = this.game_controller.getLineToTarget(this, o);
                    const player = o;
                    this.game_controller.createObject({
                        source: this,
                        event: 'shoot',
                        payload: {
                            type: 'bullet',
                            x: center.x,
                            y: center.y,
                            bearing: t.bearing,
                            colour: '#ffff00'
                        } as ShootSpec
                    });
                }
            });
        }
    }

    destroy() {
        this.game_controller.dispatchEvent({
            source: this,
            event: 'death',
            payload: null
        });
        super.destroy();
    }
}


