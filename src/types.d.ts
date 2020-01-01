
type Shape = 'square' | 'round';

type GameEvent = 'shoot' | 'collide';

type GameObjectType = 'player' | 'enemy' | 'bullet';

interface GameObjectCapabilities {
    [key: string]: boolean;
}

interface GameObjectOptions {
    x: number,
    y: number,
    width: number,
    height: number,
    shape?: Shape;
    mass: number;
    max_health: number;
    bearing?: number;
    type: GameObjectType;
}

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
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

interface CollideEventRequest {
    event: 'collide';
    payload: import('./game-objects/GameObject').GameObject;
}

interface Renderable {
    render(): void;
}

interface CanActivelyCollide {
    listCollisions(): import('./game-objects/GameObject').GameObject[];
}

interface Collidable {
    handleCollision(source: import('./game-objects/GameObject').GameObject): void;
}

interface Reactive {
    react(event: GameEvent): void;
}

interface Interactive {
    handleInteraction(km: KeyMap, ncks: Set<string>, time_step: number): void;
}


interface GameConfig {
    objects: GameObjectOptions[];
    dimensions: { width: number, height: number; };
}

interface KeyMap {
    [key: string]: boolean;
}