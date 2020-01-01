import { GameObject } from "./game-objects/GameObject";
import { Player } from "./game-objects/Player";
import { KeyboardManager } from "./KeyboardManager";
import { Bullet, createBullet } from "./game-objects/Bullet";
import { Enemy } from "./game-objects/Enemy";

export class GameController {
    private drawing_canvas: HTMLCanvasElement;
    private objects: Map<string, GameObject> = new Map;
    private event_queue: GameEvent[] = [];

    public scale: { x: number; y: number; };

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
    }

    getScale(width: number, height: number) {
        return { x: this.drawing_canvas.width / width, y: this.drawing_canvas.height / height };
    }

    getGameObjects() {
        return this.objects;
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

    dispatchEvent(er: GameEventRequest) {
        switch (er.event) {
            case 'shoot':
                const ctx = this.drawing_canvas.getContext('2d');
                if (ctx) {
                    const nb = createBullet(er.payload, er.source, this, this.scale, ctx);
                    this.objects.set(nb.id, nb);
                }
                break;
            case 'collide':
                const e = er as CollideEventRequest;
                const p = er.payload as Collidable & GameObject;
                const s = er.source as CanActivelyCollide & Collidable & GameObject;
                p.handleCollision(s);
                s.handleCollision(p);

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
                }
            });
        }
    };

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

        this.objects.forEach(o => o.act(this.time_step));

        this.removeDeadGameObjects();

        this.renderGameObjects();

        this.last_time = now;

        if (!this.stop_game) {
            requestAnimationFrame(() => this.run());
        }

        this.clearObjects();
        this.keyboard_manager.clearNonContinuousKeys();

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
            }
        });
    }

    clearObjects() {
        this.objects.forEach((o, idx) => {
            if (o instanceof Bullet && o.isOutOfBox(0, this.drawing_canvas.width, 0, this.drawing_canvas.height)) {
                this.objects.delete(o.id);
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