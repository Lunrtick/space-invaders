export function Living<BaseClass extends Constructable>(BC: BaseClass, max_hp: number) {
    return class extends BC {
        max_hp = max_hp;
    }

}