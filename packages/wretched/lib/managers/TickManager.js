"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TickManager_instances, _TickManager_render, _TickManager_tickTimer, _TickManager_tickViews, _TickManager_needsRender, _TickManager_start, _TickManager_stop;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickManager = void 0;
var TickManager = /** @class */ (function () {
    function TickManager(render) {
        _TickManager_instances.add(this);
        _TickManager_render.set(this, void 0);
        _TickManager_tickTimer.set(this, void 0);
        _TickManager_tickViews.set(this, new Set());
        _TickManager_needsRender.set(this, false);
        __classPrivateFieldSet(this, _TickManager_render, render, "f");
    }
    TickManager.prototype.reset = function () {
        __classPrivateFieldSet(this, _TickManager_tickViews, new Set(), "f");
    };
    TickManager.prototype.endRender = function () {
        if (!__classPrivateFieldGet(this, _TickManager_tickViews, "f").size) {
            __classPrivateFieldGet(this, _TickManager_instances, "m", _TickManager_stop).call(this);
        }
        else if (__classPrivateFieldGet(this, _TickManager_tickViews, "f").size) {
            __classPrivateFieldGet(this, _TickManager_instances, "m", _TickManager_start).call(this);
        }
    };
    TickManager.prototype.stop = function () {
        __classPrivateFieldGet(this, _TickManager_instances, "m", _TickManager_stop).call(this);
    };
    TickManager.prototype.registerTick = function (view) {
        __classPrivateFieldGet(this, _TickManager_tickViews, "f").add(view);
    };
    TickManager.prototype.needsRender = function () {
        __classPrivateFieldSet(this, _TickManager_needsRender, true, "f");
        __classPrivateFieldGet(this, _TickManager_instances, "m", _TickManager_start).call(this);
    };
    TickManager.prototype.triggerTick = function (dt) {
        var needsRender = __classPrivateFieldGet(this, _TickManager_needsRender, "f");
        for (var _i = 0, _a = __classPrivateFieldGet(this, _TickManager_tickViews, "f"); _i < _a.length; _i++) {
            var view = _a[_i];
            needsRender = view.receiveTick(dt) || needsRender;
        }
        if (needsRender) {
            __classPrivateFieldGet(this, _TickManager_render, "f").call(this);
            __classPrivateFieldSet(this, _TickManager_needsRender, false, "f");
        }
    };
    return TickManager;
}());
exports.TickManager = TickManager;
_TickManager_render = new WeakMap(), _TickManager_tickTimer = new WeakMap(), _TickManager_tickViews = new WeakMap(), _TickManager_needsRender = new WeakMap(), _TickManager_instances = new WeakSet(), _TickManager_start = function _TickManager_start() {
    var _this = this;
    if (__classPrivateFieldGet(this, _TickManager_tickTimer, "f")) {
        return;
    }
    var prevTime = Date.now();
    __classPrivateFieldSet(this, _TickManager_tickTimer, setInterval(function () {
        var nextTime = Date.now();
        _this.triggerTick(nextTime - (prevTime !== null && prevTime !== void 0 ? prevTime : nextTime));
        prevTime = nextTime;
    }, 16), "f");
}, _TickManager_stop = function _TickManager_stop() {
    if (!__classPrivateFieldGet(this, _TickManager_tickTimer, "f")) {
        return;
    }
    clearInterval(__classPrivateFieldGet(this, _TickManager_tickTimer, "f"));
    __classPrivateFieldSet(this, _TickManager_tickTimer, undefined, "f");
};
