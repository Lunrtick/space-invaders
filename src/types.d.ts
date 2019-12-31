declare const enum Shape {
    square,
    round
}

declare const enum GameEvent {
    SHOOT,
    MOVE_LEFT,
    MOVE_RIGHT,
    IMPACT
}

interface GameObjectOptions {
    x: number,
    y: number,
    width: number,
    height: number,
    shape: Shape;
    mass: number;
    max_health: number;
}

interface Renderable {
    render(): void;
}

interface Reactive {
    react(event: GameEvent): void;
}


interface GameConfig {

}

interface KeyMap {
    [key: string]: () => any;
}