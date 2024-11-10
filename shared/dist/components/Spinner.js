"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
const View_1 = require("../View");
const geometry_1 = require("../geometry");
class Spinner extends View_1.View {
    #isAnimating = false;
    #tick = 0;
    #frame = 0;
    #frameLen = 1;
    constructor({ isAnimating, ...props } = {}) {
        super(props);
        this.#update({ isAnimating });
    }
    update({ isAnimating, ...props }) {
        super.update(props);
        this.#update(props);
    }
    #update({ isAnimating }) {
        this.#isAnimating = isAnimating ?? true;
    }
    naturalSize() {
        return new geometry_1.Size(1, 1);
    }
    receiveTick(dt) {
        this.#tick = this.#tick + dt;
        if (this.#tick > HZ) {
            this.#tick %= HZ;
            this.#frame = (this.#frame + 1) % this.#frameLen;
        }
        return true;
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return;
        }
        if (this.#isAnimating) {
            viewport.registerTick();
        }
        const char = ONE[this.#frame];
        viewport.write(char, geometry_1.Point.zero);
        this.#frameLen = ONE.length;
    }
}
exports.Spinner = Spinner;
const ONE = ['⣾', '⣷', '⣯', '⣟', '⡿', '⢿', '⣻', '⣽'];
const HZ = 1000 / 10;
//# sourceMappingURL=Spinner.js.map