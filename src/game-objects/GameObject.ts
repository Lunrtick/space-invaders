import { GameController } from "../GameController";

export class GameObject implements Renderable {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private shape: Shape;
    private game_controller: GameController;

    constructor(options: GameObjectOptions, controller: GameController) {
        this.x = options.x
        this.y = options.y
        this.width = options.width
        this.height = options.height
        this.shape = options.shape
        this.game_controller = controller
    }
    render() {
        console.log('this needs to be implemented')
    }
}