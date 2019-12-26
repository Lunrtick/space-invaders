export function Renderable<BaseClass extends Constructable>(BC: BaseClass, render: () => void) {
    return class extends BC {
        render = render;
    }

}