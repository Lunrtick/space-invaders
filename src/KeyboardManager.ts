export const non_continuous_key_codes = new Set(['Space']);


export class KeyboardManager {

    public keymap: KeyMap = {};

    public non_continuous_keys: Set<string>;

    constructor() {
        this.registerListeners();
        this.non_continuous_keys = new Set();
    }

    handleKeydown(kp: KeyboardEvent) {
        this.keymap[kp.code] = true;
    }
    handleKeyup(kp: KeyboardEvent) {
        this.keymap[kp.code] = false;
        if (non_continuous_key_codes.has(kp.code)) {
            this.non_continuous_keys.add(kp.code);
        }
    }

    clearNonContinuousKeys() {
        this.non_continuous_keys.clear();
    }

    registerListeners() {
        window.addEventListener('keydown', (kp: KeyboardEvent) => this.handleKeydown(kp));
        window.addEventListener('keyup', (kp: KeyboardEvent) => this.handleKeyup(kp));
    }
}