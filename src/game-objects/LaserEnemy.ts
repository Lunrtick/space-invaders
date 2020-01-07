import { GameObject } from "./GameObject";
import { Player } from './Player';
import { Enemy } from "./Enemy";
import { Laser } from "./Laser";

export class LaserEnemy extends Enemy implements Collidable {

    protected v_max = 40;

    private laser_object: Nullable<Laser> = null;

    protected capabilities: GameObjectCapabilities = new Set([
        'render',
        'act',
        'collide',
    ]);

    render() {
        this.rendering_context.drawImage(document.getElementById('enemy_laser') as HTMLImageElement, this.x, this.y, this.width, this.height);

        this.renderDamage();
    }

    getColour(): string {
        return 'rgb(123, 80, 200)';
    }

    private shoot_chance = 0;



    act(time_step: number) {
        if (this.laser_object instanceof Laser) {
            return;
        }
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

        this.shoot(this.shoot_chance);
        this.shoot_chance += 0.000001 + 0.0001 * (1 - this.health / this.max_health);
    }

    handleDeath(o: GameObject) {
        if (o instanceof Laser && this.laser_object === o) {
            this.laser_object = null;
        }
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
                case 'death':
                    if (er.source instanceof Laser) {
                        this.handleDeath(er.source);
                    }
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
                    const player = o;
                    this.game_controller.createObject({
                        source: this,
                        event: 'shoot',
                        payload: {
                            type: 'laser',
                            x: center.x,
                            y: center.y,
                            bearing: 0,
                            target: player
                        } as ShootSpec
                    });
                }
            });
            go.forEach(o => {
                if (o instanceof Laser && o.source === this) {
                    this.laser_object = o;
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


