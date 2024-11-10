"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
(0, wretched_1.interceptConsoleLog)();
class Keys extends wretched_1.View {
    constructor() {
        super({});
    }
    naturalSize() {
        return wretched_1.Size.zero;
    }
    receiveKey(event) {
        console.info({ event });
    }
    render(viewport) {
        viewport.registerFocus();
    }
}
class Mouse extends wretched_1.View {
    constructor() {
        super({});
    }
    naturalSize(available) {
        return available;
    }
    receiveKey(event) {
        console.info({ event });
    }
    render(viewport) {
        viewport.registerMouse(['mouse.button.all']);
    }
}
(0, demo_1.demo)(wretched_1.Stack.down([
    new Keys(),
    // new Mouse(),
    new wretched_1.ConsoleLog({ flex: 1 }),
]), false);
//# sourceMappingURL=events.js.map