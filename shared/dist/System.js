"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnboundSystem = exports.System = void 0;
class System {
    view;
    focusManager;
    constructor(view, focusManager) {
        this.view = view;
        this.focusManager = focusManager;
    }
    requestFocus() {
        return this.focusManager.requestFocus(this.view);
    }
}
exports.System = System;
class UnboundSystem {
    focusManager;
    constructor(focusManager) {
        this.focusManager = focusManager;
    }
    bind(view) {
        return new System(view, this.focusManager);
    }
}
exports.UnboundSystem = UnboundSystem;
//# sourceMappingURL=System.js.map