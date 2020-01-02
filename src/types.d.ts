type Shape = 'square' | 'round';

type GameEvent = 'shoot' | 'collide';

type GameObjectType = 'player' | 'enemy' | 'bullet';

type Nullable<T> = T | null;

type NullableGameObject = Nullable<import('./game-objects/GameObject').GameObject>;

interface GameObjectCapabilities {
    [key: string]: boolean;
}

interface GameObjectGroupEdgeMap {
    left: NullableGameObject;
    right: NullableGameObject;
    top: NullableGameObject;
    bottom: NullableGameObject;
}

interface GameObjectOptions {
    x: number,
    y: number,
    width: number,
    height: number,
    shape?: Shape;
    group?: string;
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

interface GameObjectGroupConfig {

}

interface GameConfig {
    objects: GameObjectOptions[];
    groups?: string[];
    dimensions: { width: number, height: number; };
}

interface KeyMap {
    [key: string]: boolean;
}