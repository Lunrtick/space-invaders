type Constructable = new (...args: any[]) => {};

declare const enum Shape {
    square,
    round
}
interface GameObjectOptions {
    x: number,
    y: number,
    width: number,
    height: number,
    shape: Shape;
}



interface Player extends GameObjectOptions {
    mass: number;
}

interface Renderable {
    render(): void;
}

interface GameConfig {

}

interface KeyMap {
    [key: string]: () => any;
}