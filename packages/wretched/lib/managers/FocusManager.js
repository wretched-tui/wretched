"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _FocusManager_instances, _FocusManager_didCommit, _FocusManager_currentFocus, _FocusManager_prevFocus, _FocusManager_focusRing, _FocusManager_hotKeys, _FocusManager_reorderRing;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusManager = void 0;
var events_1 = require("../events");
var UNFOCUS = Symbol('UNFOCUS');
var FocusManager = /** @class */ (function () {
    function FocusManager() {
        _FocusManager_instances.add(this);
        _FocusManager_didCommit.set(this, false);
        _FocusManager_currentFocus.set(this, void 0);
        _FocusManager_prevFocus.set(this, void 0);
        _FocusManager_focusRing.set(this, []);
        _FocusManager_hotKeys.set(this, []
        /**
         * If the previous focus-view is not mounted, we can clear out the current
         * focus-view and focus the first that registers.
         *
         * If the previous focus-view is mounted but does not request focus, we can't know
         * that until _after_ the first render. In that case, after render, 'needsRerender'
         * selects the first focus-view and triggers a re-render.
         */
        );
    }
    /**
     * If the previous focus-view is not mounted, we can clear out the current
     * focus-view and focus the first that registers.
     *
     * If the previous focus-view is mounted but does not request focus, we can't know
     * that until _after_ the first render. In that case, after render, 'needsRerender'
     * selects the first focus-view and triggers a re-render.
     */
    FocusManager.prototype.reset = function (isRootView) {
        if (isRootView) {
            __classPrivateFieldSet(this, _FocusManager_prevFocus, __classPrivateFieldGet(this, _FocusManager_currentFocus, "f"), "f");
        }
        __classPrivateFieldSet(this, _FocusManager_currentFocus, undefined, "f");
        __classPrivateFieldSet(this, _FocusManager_focusRing, [], "f");
        __classPrivateFieldSet(this, _FocusManager_hotKeys, [], "f");
        __classPrivateFieldSet(this, _FocusManager_didCommit, false, "f");
    };
    FocusManager.prototype.trigger = function (event) {
        for (var _i = 0, _a = __classPrivateFieldGet(this, _FocusManager_hotKeys, "f"); _i < _a.length; _i++) {
            var _b = _a[_i], view = _b[0], key = _b[1];
            if ((0, events_1.match)(key, event)) {
                return view.receiveKey(event);
            }
        }
        if (event.name === 'tab') {
            if (event.shift) {
                this.prevFocus();
            }
            else {
                this.nextFocus();
            }
        }
        else if (__classPrivateFieldGet(this, _FocusManager_currentFocus, "f") && __classPrivateFieldGet(this, _FocusManager_currentFocus, "f") !== UNFOCUS) {
            __classPrivateFieldGet(this, _FocusManager_currentFocus, "f").receiveKey(event);
        }
    };
    /**
     * Returns whether the current view has focus.
     */
    FocusManager.prototype.registerFocus = function (view) {
        if (!__classPrivateFieldGet(this, _FocusManager_didCommit, "f")) {
            __classPrivateFieldGet(this, _FocusManager_focusRing, "f").push(view);
        }
        if (!__classPrivateFieldGet(this, _FocusManager_currentFocus, "f") && (!__classPrivateFieldGet(this, _FocusManager_prevFocus, "f") || __classPrivateFieldGet(this, _FocusManager_prevFocus, "f") === view)) {
            __classPrivateFieldSet(this, _FocusManager_currentFocus, view, "f");
            return true;
        }
        else if (__classPrivateFieldGet(this, _FocusManager_currentFocus, "f") === view) {
            return true;
        }
        else {
            return false;
        }
    };
    FocusManager.prototype.registerHotKey = function (view, key) {
        if (__classPrivateFieldGet(this, _FocusManager_didCommit, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _FocusManager_hotKeys, "f").push([view, key]);
    };
    FocusManager.prototype.requestFocus = function (view) {
        __classPrivateFieldSet(this, _FocusManager_currentFocus, view, "f");
        return true;
    };
    FocusManager.prototype.unfocus = function () {
        __classPrivateFieldSet(this, _FocusManager_currentFocus, UNFOCUS, "f");
    };
    /**
     * @return boolean Whether the focus changed
     */
    FocusManager.prototype.commit = function () {
        __classPrivateFieldSet(this, _FocusManager_didCommit, true, "f");
        if (__classPrivateFieldGet(this, _FocusManager_prevFocus, "f") === UNFOCUS && !__classPrivateFieldGet(this, _FocusManager_currentFocus, "f")) {
            __classPrivateFieldSet(this, _FocusManager_currentFocus, UNFOCUS, "f");
            return false;
        }
        else if (__classPrivateFieldGet(this, _FocusManager_focusRing, "f").length > 0 &&
            __classPrivateFieldGet(this, _FocusManager_prevFocus, "f") &&
            !__classPrivateFieldGet(this, _FocusManager_currentFocus, "f")) {
            __classPrivateFieldSet(this, _FocusManager_currentFocus, __classPrivateFieldGet(this, _FocusManager_focusRing, "f")[0], "f");
            return true;
        }
        else {
            return false;
        }
    };
    FocusManager.prototype.prevFocus = function () {
        if (__classPrivateFieldGet(this, _FocusManager_currentFocus, "f") === UNFOCUS) {
            __classPrivateFieldSet(this, _FocusManager_currentFocus, __classPrivateFieldGet(this, _FocusManager_focusRing, "f").at(-1), "f");
            return;
        }
        if (__classPrivateFieldGet(this, _FocusManager_focusRing, "f").length <= 1) {
            return;
        }
        __classPrivateFieldGet(this, _FocusManager_instances, "m", _FocusManager_reorderRing).call(this);
        var last = __classPrivateFieldGet(this, _FocusManager_focusRing, "f").pop();
        __classPrivateFieldGet(this, _FocusManager_focusRing, "f").unshift(last);
        __classPrivateFieldSet(this, _FocusManager_currentFocus, last, "f");
        return __classPrivateFieldGet(this, _FocusManager_currentFocus, "f");
    };
    FocusManager.prototype.nextFocus = function () {
        if (__classPrivateFieldGet(this, _FocusManager_currentFocus, "f") === UNFOCUS) {
            __classPrivateFieldSet(this, _FocusManager_currentFocus, __classPrivateFieldGet(this, _FocusManager_focusRing, "f")[0], "f");
            return;
        }
        if (__classPrivateFieldGet(this, _FocusManager_focusRing, "f").length <= 1) {
            return;
        }
        __classPrivateFieldGet(this, _FocusManager_instances, "m", _FocusManager_reorderRing).call(this);
        var first = __classPrivateFieldGet(this, _FocusManager_focusRing, "f").shift();
        __classPrivateFieldGet(this, _FocusManager_focusRing, "f").push(first);
        __classPrivateFieldSet(this, _FocusManager_currentFocus, __classPrivateFieldGet(this, _FocusManager_focusRing, "f")[0], "f");
        return __classPrivateFieldGet(this, _FocusManager_currentFocus, "f");
    };
    return FocusManager;
}());
exports.FocusManager = FocusManager;
_FocusManager_didCommit = new WeakMap(), _FocusManager_currentFocus = new WeakMap(), _FocusManager_prevFocus = new WeakMap(), _FocusManager_focusRing = new WeakMap(), _FocusManager_hotKeys = new WeakMap(), _FocusManager_instances = new WeakSet(), _FocusManager_reorderRing = function _FocusManager_reorderRing() {
    if (!__classPrivateFieldGet(this, _FocusManager_currentFocus, "f") || __classPrivateFieldGet(this, _FocusManager_currentFocus, "f") === UNFOCUS) {
        return;
    }
    var index = __classPrivateFieldGet(this, _FocusManager_focusRing, "f").indexOf(__classPrivateFieldGet(this, _FocusManager_currentFocus, "f"));
    if (~index) {
        var pre = __classPrivateFieldGet(this, _FocusManager_focusRing, "f").slice(0, index);
        __classPrivateFieldSet(this, _FocusManager_focusRing, __classPrivateFieldGet(this, _FocusManager_focusRing, "f").slice(index).concat(pre), "f");
    }
};
function findView(parent, prevFocus) {
    if (parent === prevFocus) {
        return true;
    }
    return parent.children.some(function (child) { return findView(child, prevFocus); });
}
