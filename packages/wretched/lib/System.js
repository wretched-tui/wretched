"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnboundSystem = exports.System = void 0;
var System = /** @class */ (function () {
    function System(view, focusManager) {
        this.view = view;
        this.focusManager = focusManager;
    }
    System.prototype.requestFocus = function () {
        return this.focusManager.requestFocus(this.view);
    };
    return System;
}());
exports.System = System;
var UnboundSystem = /** @class */ (function () {
    function UnboundSystem(focusManager) {
        this.focusManager = focusManager;
    }
    UnboundSystem.prototype.bind = function (view) {
        return new System(view, this.focusManager);
    };
    return UnboundSystem;
}());
exports.UnboundSystem = UnboundSystem;
