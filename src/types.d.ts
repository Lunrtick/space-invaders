type Shape = 'square' | 'round';

type GameEvent = 'shoot' | 'collide' | 'death';

type GameObjectType = 'player' | 'enemy' | 'bullet' | 'laser-enemy' | 'laser' | 'sniper-enemy';

type Nullable<T> = T | null;

type NullableGameObject = Nullable<import('./game-objects/GameObject').GameObject>;


type GameObjectCapabilities = Set<string>;

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

type ShotType = 'bullet' | 'laser';

interface ShootSpec {
    type: ShotType;
    x: number;
    y: number;
    bearing: number;
}

interface ShootEventRequest extends GameEventRequest {
    event: 'shoot';
    payload: ShootSpec;
}

interface CollideEventRequest extends GameEventRequest {
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
type RuleFunction = (o1: import('./game-objects/GameObject').GameObject, o2: import('./game-objects/GameObject').GameObject) => void;
type RuleMap = Map<string, RuleFunction>;

interface GameConfig {
    objects: GameObjectOptions[];
    groups?: string[];
    dimensions: { width: number, height: number; };
    rules: RuleMap;
}

interface KeyMap {
    [key: string]: boolean;
}