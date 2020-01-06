import { GameObject } from "./GameObject";
import { GameController } from "../GameController";

let current = 1;
function getId() {
    const id = `GObjGroup - ${current}`;
    current += 1;
    return id;
}

export class GameObjectGroup {
    protected capabilities: GameObjectCapabilities = new Set(['act']);

    public name: string;

    public id: string;

    protected context: CanvasRenderingContext2D;

    protected game_controller: GameController;

    protected max_members: number = 0;

    public bearing: number = 0;

    protected objects: Map<string, GameObject> = new Map();

    protected edge_objects: GameObjectGroupEdgeMap = {
        left: null,
        right: null,
        top: null,
        bottom: null
    };

    can(action: string): boolean {
        return this.capabilities.has(action);
    }

    constructor(name: string, gc: GameController, ctx: CanvasRenderingContext2D) {

        this.name = name;

        this.id = getId();

        this.game_controller = gc;

        this.context = ctx;

        this.findEdgeObjects();
    }

    willCollide(r1: Rectangle): GameObject[] {
        return [];
    }

    protected findEdgeObjects() {
        this.objects.forEach(o => {
            if (this.edge_objects.top === null || this.edge_objects.top.y > o.y) {
                this.edge_objects.top = o;
            }

            if (this.edge_objects.left === null || this.edge_objects.left.x > o.x) {
                this.edge_objects.left = o;
            }

            if (this.edge_objects.bottom === null || this.edge_objects.bottom.y + this.edge_objects.bottom.height < o.y + o.height) {
                this.edge_objects.bottom = o;
            }

            if (this.edge_objects.right === null || this.edge_objects.right.x + this.edge_objects.right.width < o.x + o.width) {
                this.edge_objects.right = o;
            }
        });
    }

    act(time_step: number) {

    }

    updateObjects(objs: GameObject[]) {
        this.objects.clear();
        objs.forEach(o => {
            this.objects.set(o.id, o);
        });
        this.findEdgeObjects();

        if (objs.length > this.max_members) {
            this.max_members = objs.length;
        }
    }

    isDead() {
        return this.objects.size === 0;
    }

    handleEvents(er: GameEventRequest[]) {

    }

    destroy() {
        console.log('this group is no more');
    }

}