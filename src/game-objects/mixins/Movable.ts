export function Movable<BaseClass extends Constructable>(BC: BaseClass, mass: number) {
    return class extends BC {
        mass = mass;
        velocity = 0;


    }

}