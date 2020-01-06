import { GameObject } from "./GameObject";
import { Enemy } from './Enemy';
import { Bullet } from "./Bullet";

export class Player extends GameObject implements Renderable, Interactive, Collidable {
    protected capabilities: GameObjectCapabilities = new Set([
        'render',
        'interact',
        'act',
        'collide',
    ]);
    protected v_max = 250;

    private max_ammo = 3;
    private ammo = 3;

    private has_been_moved = false;

    private is_invulnerable = false;
    private last_invulnerable: Nullable<number> = null;

    private INVULNERABLE_FREQ = 1000 * 5;
    private INVULNERABLE_DUR = 1000 * 2;

    private act_count = 0;

    private shouldBeInvulnerable() {
        const now = Date.now();
        const li = this.last_invulnerable ?? 0;
        return now - li < this.INVULNERABLE_DUR;
    }

    private canGoInvulnerable() {
        const now = Date.now();
        const li = this.last_invulnerable ?? 0;
        return now - li > this.INVULNERABLE_FREQ;
    }

    renderDamage() {
        this.rendering_context.fillStyle = 'rgb(0, 0, 0)';
        const damage_width = this.width / this.max_health;
        for (let i = 0; i < this.max_health - this.health; i++) {
            this.rendering_context.fillRect(this.x + i * damage_width, this.y, damage_width, this.height / 3);
        }
    }

    renderAmmo() {
        this.rendering_context.fillStyle = 'rgb(60, 60, 60)';
        const r_width = this.width / this.max_ammo;
        for (let i = 0; i < this.ammo; i++) {
            this.rendering_context.fillRect(this.x + i * r_width, this.height / 3 * 2 + this.y, r_width, this.height / 3);
        }
    }

    render() {
        if (this.is_invulnerable) {
            this.rendering_context.fillStyle = 'rgb(255,0,255)';
        } else if (this.canGoInvulnerable()) {
            this.rendering_context.fillStyle = 'rgb(255,255,255)';
        } else {
            this.rendering_context.fillStyle = 'rgb(255,0,0)';
        }
        this.rendering_context.fillRect(this.x, this.y, this.width, this.height);

        this.renderDamage();
        this.renderAmmo();
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

        if (ncks.has('Space') && this.canShoot()) {
            this.game_controller.createObject({
                source: this,
                event: 'shoot',
                payload: {
                    x: this.getCenter().x - 2,
                    y: this.y - 4,
                    bearing: 90,
                    type: 'bullet'
                } as ShootSpec
            });
            this.ammo -= 1;
        }

        if (ncks.has('ArrowUp') && this.canGoInvulnerable()) {
            this.last_invulnerable = Date.now();
            this.is_invulnerable = true;
            this.game_controller.updateRule('reflect', (o1, o2) => {
                if (o1 instanceof Player) {
                    return o2 instanceof Bullet && !(o2.source instanceof Player);
                } else if (o1 instanceof Bullet && !(o1.source instanceof Player)) {
                    return o2 instanceof Player;
                }
                return false;
            });
        }


    }

    canShoot() {
        return this.ammo > 0;
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
        const now = Date.now();
        const li = this.last_invulnerable ?? 0;
        if (this.is_invulnerable && !this.shouldBeInvulnerable()) {
            this.is_invulnerable = false;
            this.game_controller.updateRule('reflect', (o1, o2) => {
                return false;
            });
        }

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

        this.act_count += 1;

        if (this.act_count > 60 && this.ammo < this.max_ammo) {
            this.ammo += 1;
            this.act_count = 0;
        }
    }

    handleCollision(source: GameObject) {
        if (this.allowedTo('reflect', source)) {

        }
        else if (this.allowedTo('collide', source)) {
            console.log('ouch');
            this.health -= 1;
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
            }
        });
    }
}


