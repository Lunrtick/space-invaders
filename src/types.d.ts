type Shape = 'square' | 'round';

type GameEvent = 'shoot' | 'impact';

interface GameObjectOptions {
    x: number,
    y: number,
    width: number,
    height: number,
    shape?: Shape;
    mass: number;
    max_health: number;
    bearing?: number;
}

interface GameEventRequest {
    source: import('./game-objects/GameObject').GameObject;
    event: GameEvent;
    payload: any;
}

interface BulletSpec {
    x: number;
    y: number;
    bearing: number;
}

interface ShootEventRequest {
    event: 'shoot';
    payload: BulletSpec;
}

interface Renderable {
    render(): void;
}

interface Reactive {
    react(event: GameEvent): void;
}


interface GameConfig {
    objects: GameObjectOptions[];
    dimensions: { width: number, height: number; };
}

interface KeyMap {
    [key: string]: boolean;
}