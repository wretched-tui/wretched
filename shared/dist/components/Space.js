"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Space = void 0;
const Style_1 = require("../Style");
const View_1 = require("../View");
const geometry_1 = require("../geometry");
class Space extends View_1.View {
    background;
    static horizontal(value, extraProps = {}) {
        return new Space({ width: value, ...extraProps });
    }
    static vertical(value, extraProps = {}) {
        return new Space({ height: value, ...extraProps });
    }
    constructor(props = {}) {
        super(props);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ background }) {
        this.background = background;
    }
    naturalSize() {
        return geometry_1.Size.zero;
    }
    #prev = this.background;
    render(viewport) {
        if (viewport.isEmpty) {
            return;
        }
        if (!this.background) {
            return;
        }
        if (this.#prev !== this.background) {
            this.#prev = this.background;
        }
        const style = new Style_1.Style({ background: this.background });
        viewport.paint(style);
    }
}
exports.Space = Space;
//# sourceMappingURL=Space.js.map