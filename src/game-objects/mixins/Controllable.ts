export function Controllable<BaseClass extends Constructable>(BC: BaseClass, keymap: KeyMap) {
    return class extends BC {
        handleInput() {

        }
    }

}