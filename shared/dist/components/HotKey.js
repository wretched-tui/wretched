"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotKey = void 0;
const Container_1 = require("../Container");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
class HotKey extends Container_1.Container {
    #hotKey = { char: '' };
    constructor(props) {
        super(props);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ hotKey }) {
        this.#hotKey = hotKey;
    }
    naturalSize() {
        return geometry_1.Size.zero;
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        viewport.registerHotKey((0, events_1.toHotKeyDef)(this.#hotKey));
    }
}
exports.HotKey = HotKey;
//# sourceMappingURL=HotKey.js.map