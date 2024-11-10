"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = void 0;
const Container_1 = require("../Container");
class Window extends Container_1.Container {
    constructor({ children, ...viewProps } = {}) {
        super(viewProps);
    }
    naturalSize(available) {
        // even though we use the parent size no matter what, we do need to give child
        // views a chance to "resize" according to the available frame
        super.naturalSize(available);
        return available;
    }
}
exports.Window = Window;
//# sourceMappingURL=Window.js.map