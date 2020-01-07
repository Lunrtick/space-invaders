import { GameObject } from "./game-objects/GameObject";
import { Player } from "./game-objects/Player";
import { KeyboardManager } from "./KeyboardManager";
import { Bullet, createBullet } from "./game-objects/Bullet";
import { Enemy } from "./game-objects/Enemy";
import { GameObjectGroup } from "./game-objects/GameObjectGroup";
import { EnemyGroup } from "./game-objects/EnemyGroup";
import { LaserEnemy } from "./game-objects/LaserEnemy";
import { createLaser, Laser } from "./game-objects/Laser";
import { SniperEnemy } from './game-objects/SniperEnemy';

export class GameController {
    private drawing_canvas: HTMLCanvasElement;
    private objects: Map<string, GameObject | GameObjectGroup> = new Map;
    private events: GameEventRequest[] = [];

    public scale: { x: number; y: number; };

    private rules: RuleMap;

    private config: GameConfig;

    private keyboard_manager: KeyboardManager;

    private time_step: number = 0;
    private last_time: number;

    private stop_game = false;

    constructor(canvas: HTMLCanvasElement, game_config: GameConfig, keyman: KeyboardManager) {
        this.keyboard_manager = keyman;
        this.drawing_canvas = canvas;
        this.scale = this.getScale(game_config.dimensions.width, game_config.dimensions.height);
        this.config = this.adjustConfig(game_config, canvas);
        this.last_time = Date.now();
        this.rules = game_config.rules;
    }

    getScale(width: number, height: number) {
        return { x: this.drawing_canvas.width / width, y: this.drawing_canvas.height / height };
    }

    getGameObjects() {
        return this.objects;
    }

    updateRule(rule: string, f: RuleFunction) {
        this.rules.set(rule, f);
    }


    getLineToTarget(o1: GameObject, o2: GameObject): { distance: number; bearing: number; } {

        const c1 = o1.getCenter();
        const c2 = o2.getCenter();

        return {
            distance: Math.sqrt((c1.x - c2.x) ^ 2 + (c1.y - c2.y) ^ 2),
            bearing: Math.atan2(c1.y - c2.y, c1.x - c2.x) * 180 / Math.PI
        };
    }

    private adjustConfig(game_config: GameConfig, canvas: HTMLCanvasElement) {
        const scale = this.scale;
        return {
            ...game_config,
            objects: game_config.objects.map(o => ({
                ...o,
                x: scale.x * o.x,
                y: scale.y * o.y,
                width: scale.x * o.width,
                height: scale.y * o.height
            }))
        };
    }

    allows(o1: GameObject, action: string, o2: GameObject) {
        const a = this.rules.get(action);
        if (a) {
            return a(o1, o2);
        } else {
            return false;
        }
    }

    dispatchEvent(er: GameEventRequest) {
        this.events.push(er);
    }

    createObject(er: GameEventRequest) {
        const ctx = this.drawing_canvas.getContext('2d');
        if (ctx) {
            if (er.payload.type === 'bullet') {
                const nb = createBullet(er.payload, er.source, this, this.scale, ctx, er.payload?.colour, er.payload?.v_max);
                this.objects.set(nb.id, nb);
            } else if (er.payload.type === 'laser') {
                const nb = createLaser(er.payload, er.source, er.payload.target, this, this.scale, ctx);
                this.objects.set(nb.id, nb);
            }
        }
    }

    initGameObjects(): void {
        const ctx = this.drawing_canvas.getContext('2d');
        if (ctx) {
            this.config.objects.forEach(o => {
                switch (o.type) {
                    case 'player':
                        const np = new Player(o, this, ctx);
                        this.objects.set(np.id, np);
                        break;
                    case 'enemy':
                        const ne = new Enemy(o, this, ctx);
                        this.objects.set(ne.id, ne);
                        break;
                    case 'laser-enemy':
                        const nle = new LaserEnemy(o, this, ctx);
                        this.objects.set(nle.id, nle);
                        break;
                    case 'sniper-enemy':
                        const nse = new SniperEnemy(o, this, ctx);
                        this.objects.set(nse.id, nse);
                        break;
                }
            });
            this.config.groups?.forEach(name => {

                const g = new EnemyGroup(name, this, ctx);
                this.objects.set(g.id, g);

                g.updateObjects(this.getObjectsInGroup(name));

            });
        }
    };

    getObjectsInGroup(name: string) {
        const obs_in_group: GameObject[] = [];
        this.objects.forEach(o => {
            if (o instanceof GameObject && o.group === name) {
                obs_in_group.push(o);
            }
        });
        return obs_in_group;
    }

    renderGameObjects(): void {
        this.objects.forEach(o => {
            if (o.can('render')) {
                (o as GameObject & Renderable).render();
            }
        });
    };

    run(): void {
        const now = Date.now();
        this.time_step = (this.last_time - now) / 1000; // ms to s
        this.drawBackground();

        this.objects.forEach(o => {
            if (o.can('interact')) {
                (o as Interactive & GameObject).handleInteraction(this.keyboard_manager.keymap, this.keyboard_manager.non_continuous_keys, this.time_step);
            }
        });

        this.objects.forEach(o => {
            if (o instanceof GameObject && !o.group) {
                o.act(this.time_step);
            } else if (o instanceof GameObjectGroup) {
                o.act(this.time_step);
            }
        });

        this.objects.forEach(o => {
            o.handleEvents(this.events);
        });
        this.events = [];

        this.removeDeadGameObjects();

        this.renderGameObjects();

        this.updateGroups();

        this.last_time = now;

        if (!this.stop_game) {
            requestAnimationFrame(() => this.run());
        }

        this.clearObjects();
        this.keyboard_manager.clearNonContinuousKeys();

    }

    updateGroups() {
        this.objects.forEach(o => {
            if (o instanceof GameObjectGroup) {
                o.updateObjects(this.getObjectsInGroup(o.name));
            }
        });
    }

    getBoundingDimensions() {
        return {
            x: {
                min: 0,
                max: this.drawing_canvas.width
            },
            y: {
                min: 0,
                max: this.drawing_canvas.height
            }
        };
    }

    removeDeadGameObjects() {
        this.objects.forEach((o) => {
            if (o.isDead()) {
                this.objects.delete(o.id);
                o.destroy();
            }
        });
    }

    clearObjects() {
        this.objects.forEach((o, idx) => {
            if (o instanceof Bullet && o.isOutOfBox(0, this.drawing_canvas.width, 0, this.drawing_canvas.height)) {
                this.objects.delete(o.id);
                o.destroy();
            }
        });
    }

    drawBackground() {
        const ctx = this.drawing_canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = 'rgb(10, 10, 10)';
            const { width, height } = this.getCanvasDimensions();
            ctx.clearRect(0, 0, width, height);
            ctx.fillRect(0, 0, width, height);
        }
    }

    getCanvasDimensions(): { width: number, height: number; } {
        return {
            width: this.drawing_canvas.width,
            height: this.drawing_canvas.height
        };
    }

    stopGame() {
        this.stop_game = true;
    }
}