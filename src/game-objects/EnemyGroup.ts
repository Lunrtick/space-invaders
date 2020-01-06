import { GameObjectGroup } from "./GameObjectGroup";
import { degToRad } from "../utils/index";
import { Enemy } from "./Enemy";



export class EnemyGroup extends GameObjectGroup {
    act(time_step: number) {
        if (!this.edge_objects.left || !this.edge_objects.right) {
            return;
        }
        const bounds = this.game_controller.getBoundingDimensions();
        const is_left = Math.cos(this.bearing) === -1;
        let move = this.getMoveSize();
        if (is_left) {
            move = -move;
            const new_leftmost = this.edge_objects.left.x + move;
            if (new_leftmost < bounds.x.min) {
                move = bounds.x.min - this.edge_objects.left.x;
                this.bearing += 180 * degToRad;
            }
        } else {
            const new_rightmost = this.edge_objects.right.x + move;
            if (new_rightmost > bounds.x.max - this.edge_objects.right.width) {
                move = bounds.x.max - this.edge_objects.right.width - this.edge_objects.right.x;
                this.bearing += 180 * degToRad;
            }
        }
        this.objects.forEach(o => {
            o.x += move;
            if (o instanceof Enemy) {
                o.act(time_step, false);
            }
        });
    }

    private v_max = 1;

    private getMoveSize() {
        let m = this.v_max / 2 + this.v_max / 2 * (1 - this.objects.size / this.max_members);
        return m;
    }

    private getSpeedup() {
        return this.max_members / this.objects.size * 0.7;
    }
}