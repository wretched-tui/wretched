"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _MouseManager_instances, _MouseManager_prevListener, _MouseManager_mouseListeners, _MouseManager_mouseMoveViews, _MouseManager_mouseDownEvent, _MouseManager_mousePosition, _MouseManager_getListener, _MouseManager_getListeners, _MouseManager_sendMouse, _MouseManager_dragMouse, _MouseManager_pressMouse, _MouseManager_scrollMouse, _MouseManager_moveMouse;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseManager = void 0;
var geometry_1 = require("../geometry");
var events_1 = require("../events");
function mouseKey(x, y) {
    return "".concat(~~x, ",").concat(~~y);
}
var MouseManager = /** @class */ (function () {
    function MouseManager() {
        _MouseManager_instances.add(this);
        _MouseManager_prevListener.set(this, void 0);
        _MouseManager_mouseListeners.set(this, new Map());
        _MouseManager_mouseMoveViews.set(this, []);
        _MouseManager_mouseDownEvent.set(this, void 0);
        _MouseManager_mousePosition.set(this, void 0);
    }
    MouseManager.prototype.reset = function () {
        if (__classPrivateFieldGet(this, _MouseManager_mouseDownEvent, "f") || !__classPrivateFieldGet(this, _MouseManager_mousePosition, "f")) {
            __classPrivateFieldSet(this, _MouseManager_prevListener, undefined, "f");
        }
        else {
            __classPrivateFieldSet(this, _MouseManager_prevListener, this.getMouseListener(__classPrivateFieldGet(this, _MouseManager_mousePosition, "f").x, __classPrivateFieldGet(this, _MouseManager_mousePosition, "f").y), "f");
        }
        __classPrivateFieldSet(this, _MouseManager_mouseListeners, new Map(), "f");
    };
    /**
     * @return boolean Whether the mouse.move targets changed
     */
    MouseManager.prototype.commit = function (system) {
        var _a, _b, _c;
        if (__classPrivateFieldGet(this, _MouseManager_mouseDownEvent, "f") || !__classPrivateFieldGet(this, _MouseManager_mousePosition, "f")) {
            return false;
        }
        var listener = this.getMouseListener(__classPrivateFieldGet(this, _MouseManager_mousePosition, "f").x, __classPrivateFieldGet(this, _MouseManager_mousePosition, "f").y);
        var prev = new Set((_b = (_a = __classPrivateFieldGet(this, _MouseManager_prevListener, "f")) === null || _a === void 0 ? void 0 : _a.move.map(function (target) { return target.view; })) !== null && _b !== void 0 ? _b : []);
        var next = new Set((_c = listener === null || listener === void 0 ? void 0 : listener.move.map(function (target) { return target.view; })) !== null && _c !== void 0 ? _c : []);
        var same = prev.size === next.size;
        if (same) {
            for (var _i = 0, prev_1 = prev; _i < prev_1.length; _i++) {
                var view = prev_1[_i];
                if (!next.has(view)) {
                    same = false;
                    break;
                }
            }
        }
        if (!same) {
            this.trigger(__assign({ type: 'mouse', name: 'mouse.move.in', button: 'unknown', ctrl: false, meta: false, shift: false }, __classPrivateFieldGet(this, _MouseManager_mousePosition, "f")), system);
        }
        return !same;
    };
    /**
     * Multiple views can claim the mouse.move event; they will all receive it.
     * Only the last view to claim button or wheel events will receive those events.
     */
    MouseManager.prototype.registerMouse = function (view, offset, point, eventNames) {
        var _a;
        var resolved = offset.offset(point);
        var key = mouseKey(resolved.x, resolved.y);
        var target = {
            view: view,
            offset: offset,
        };
        var listener = (_a = __classPrivateFieldGet(this, _MouseManager_mouseListeners, "f").get(key)) !== null && _a !== void 0 ? _a : { move: [] };
        for (var _i = 0, eventNames_1 = eventNames; _i < eventNames_1.length; _i++) {
            var eventName = eventNames_1[_i];
            if (eventName === 'mouse.move') {
                // search listener.move - only keep views that are in the current views
                // ancestors
                listener.move.unshift(target);
            }
            else if (eventName.startsWith('mouse.button.')) {
                switch (eventName) {
                    case 'mouse.button.left':
                        listener.buttonLeft = target;
                        break;
                    case 'mouse.button.middle':
                        listener.buttonMiddle = target;
                        break;
                    case 'mouse.button.right':
                        listener.buttonRight = target;
                        break;
                    case 'mouse.button.all':
                        listener.buttonAll = target;
                        break;
                }
            }
            else if (eventName === 'mouse.wheel') {
                listener.wheel = target;
            }
            __classPrivateFieldGet(this, _MouseManager_mouseListeners, "f").set(key, listener);
        }
    };
    MouseManager.prototype.checkMouse = function (view, x, y) {
        var listener = this.getMouseListener(x, y);
        if (!listener) {
            return;
        }
        var ancestors = new Set([view]);
        for (var parent_1 = view.parent; !!parent_1; parent_1 = parent_1.parent) {
            ancestors.add(parent_1);
        }
        ;
        [
            'buttonAll',
            'buttonLeft',
            'buttonMiddle',
            'buttonRight',
            'wheel',
        ].forEach(function (prop) {
            var target = listener[prop];
            if (!target) {
                return;
            }
            listener[prop] = ancestors.has(target.view) ? target : undefined;
        });
        listener.move = listener.move.filter(function (_a) {
            var view = _a.view;
            return ancestors.has(view);
        });
        __classPrivateFieldGet(this, _MouseManager_mouseListeners, "f").set(mouseKey(x, y), listener);
    };
    MouseManager.prototype.hasMouseDownListener = function (x, y, event) {
        var listener = this.getMouseListener(x, y);
        if (!listener) {
            return false;
        }
        switch (event.button) {
            case 'left':
                return Boolean(listener.buttonLeft || listener.buttonAll);
            case 'middle':
                return Boolean(listener.buttonMiddle || listener.buttonAll);
            case 'right':
                return Boolean(listener.buttonRight || listener.buttonAll);
        }
        return false;
    };
    MouseManager.prototype.getMouseListener = function (x, y) {
        return __classPrivateFieldGet(this, _MouseManager_mouseListeners, "f").get(mouseKey(x, y));
    };
    MouseManager.prototype.trigger = function (systemEvent, system) {
        if (systemEvent.name === 'mouse.button.down' &&
            !this.hasMouseDownListener(systemEvent.x, systemEvent.y, systemEvent)) {
            system.focusManager.unfocus();
            return;
        }
        __classPrivateFieldSet(this, _MouseManager_mousePosition, new geometry_1.Point(systemEvent.x, systemEvent.y), "f");
        if (systemEvent.name === 'mouse.move.in' && __classPrivateFieldGet(this, _MouseManager_mouseDownEvent, "f")) {
            return this.trigger(__assign(__assign({}, systemEvent), { name: 'mouse.button.up', button: __classPrivateFieldGet(this, _MouseManager_mouseDownEvent, "f").button }), system);
        }
        if (__classPrivateFieldGet(this, _MouseManager_mouseDownEvent, "f")) {
            // ignore scroll wheel
            if (!(0, events_1.isMouseButton)(systemEvent)) {
                return;
            }
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_dragMouse).call(this, systemEvent, __classPrivateFieldGet(this, _MouseManager_mouseDownEvent, "f"), system);
            if (systemEvent.name === 'mouse.button.up') {
                __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_moveMouse).call(this, __assign(__assign({}, systemEvent), { name: 'mouse.move.in' }), system);
            }
        }
        else if ((0, events_1.isMouseButton)(systemEvent)) {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_pressMouse).call(this, systemEvent, system);
        }
        else if ((0, events_1.isMouseWheel)(systemEvent)) {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_scrollMouse).call(this, systemEvent, system);
        }
        else {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_moveMouse).call(this, systemEvent, system);
        }
    };
    return MouseManager;
}());
exports.MouseManager = MouseManager;
_MouseManager_prevListener = new WeakMap(), _MouseManager_mouseListeners = new WeakMap(), _MouseManager_mouseMoveViews = new WeakMap(), _MouseManager_mouseDownEvent = new WeakMap(), _MouseManager_mousePosition = new WeakMap(), _MouseManager_instances = new WeakSet(), _MouseManager_getListener = function _MouseManager_getListener(systemEvent) {
    return __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_getListeners).call(this, systemEvent)[0];
}, _MouseManager_getListeners = function _MouseManager_getListeners(systemEvent) {
    var _a, _b, _c;
    var listener = this.getMouseListener(systemEvent.x, systemEvent.y);
    if (!listener) {
        return [];
    }
    if ((0, events_1.isMouseButton)(systemEvent)) {
        var target = void 0;
        switch (systemEvent.button) {
            case 'left':
                target = (_a = listener.buttonLeft) !== null && _a !== void 0 ? _a : listener.buttonAll;
                break;
            case 'middle':
                target = (_b = listener.buttonMiddle) !== null && _b !== void 0 ? _b : listener.buttonAll;
                break;
            case 'right':
                target = (_c = listener.buttonRight) !== null && _c !== void 0 ? _c : listener.buttonAll;
                break;
            default:
                return [];
        }
        return target ? [target] : [];
    }
    else if ((0, events_1.isMouseWheel)(systemEvent)) {
        return listener.wheel ? [listener.wheel] : [];
    }
    else {
        return listener.move;
    }
}, _MouseManager_sendMouse = function _MouseManager_sendMouse(systemEvent, eventName, target, system) {
    var position = new geometry_1.Point(systemEvent.x - target.offset.x, systemEvent.y - target.offset.y);
    var event = __assign(__assign({}, systemEvent), { name: eventName, position: position });
    target.view.receiveMouse(event, system);
}, _MouseManager_dragMouse = function _MouseManager_dragMouse(systemEvent, mouseDown, unboundSystem) {
    var _a;
    if (systemEvent.name === 'mouse.button.up') {
        __classPrivateFieldSet(this, _MouseManager_mouseDownEvent, undefined, "f");
    }
    var target = mouseDown.target;
    if (!target) {
        return;
    }
    var isInside = ((_a = __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_getListener).call(this, systemEvent)) === null || _a === void 0 ? void 0 : _a.view) === target.view;
    var system = unboundSystem.bind(target.view);
    if (systemEvent.name === 'mouse.button.up') {
        if (isInside) {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, 'mouse.button.up', target, system);
        }
        else {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, 'mouse.button.cancel', target, system);
        }
    }
    else {
        if (isInside && target.wasInside) {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, 'mouse.button.dragInside', target, system);
        }
        else if (isInside) {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, 'mouse.button.enter', target, system);
        }
        else if (target.wasInside) {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, 'mouse.button.exit', target, system);
        }
        else {
            __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, 'mouse.button.dragOutside', target, system);
        }
        target.wasInside = isInside;
        __classPrivateFieldSet(this, _MouseManager_mouseDownEvent, __assign(__assign({}, mouseDown), { target: target }), "f");
    }
}, _MouseManager_pressMouse = function _MouseManager_pressMouse(systemEvent, system) {
    var listener = __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_getListener).call(this, systemEvent);
    if (listener) {
        __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, 'mouse.button.down', listener, system.bind(listener.view));
        __classPrivateFieldSet(this, _MouseManager_mouseDownEvent, {
            target: { view: listener.view, offset: listener.offset, wasInside: true },
            button: systemEvent.button,
        }, "f");
    }
}, _MouseManager_scrollMouse = function _MouseManager_scrollMouse(systemEvent, system) {
    var listener = __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_getListener).call(this, systemEvent);
    if (listener) {
        __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, systemEvent.name, listener, system.bind(listener.view));
    }
}, _MouseManager_moveMouse = function _MouseManager_moveMouse(systemEvent, unboundSystem) {
    var listeners = __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_getListeners).call(this, systemEvent);
    var prevListeners = __classPrivateFieldGet(this, _MouseManager_mouseMoveViews, "f");
    var isFirst = true;
    var _loop_1 = function (listener) {
        var didEnter = true;
        prevListeners = prevListeners.filter(function (prev) {
            if (prev.view === listener.view) {
                didEnter = false;
                return false;
            }
            return true;
        });
        var system = unboundSystem.bind(listener.view);
        if (didEnter) {
            __classPrivateFieldGet(this_1, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this_1, systemEvent, 'mouse.move.enter', listener, system);
        }
        if (isFirst) {
            __classPrivateFieldGet(this_1, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this_1, systemEvent, 'mouse.move.in', listener, system);
        }
        else {
            __classPrivateFieldGet(this_1, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this_1, systemEvent, 'mouse.move.below', listener, system);
        }
        isFirst = false;
    };
    var this_1 = this;
    for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
        var listener = listeners_1[_i];
        _loop_1(listener);
    }
    __classPrivateFieldSet(this, _MouseManager_mouseMoveViews, listeners, "f");
    for (var _a = 0, prevListeners_1 = prevListeners; _a < prevListeners_1.length; _a++) {
        var listener = prevListeners_1[_a];
        var system = unboundSystem.bind(listener.view);
        __classPrivateFieldGet(this, _MouseManager_instances, "m", _MouseManager_sendMouse).call(this, systemEvent, 'mouse.move.exit', listener, system);
    }
};
function checkEventNames(systemEvent) {
    switch (systemEvent.name) {
        case 'mouse.move.in':
            return ['mouse.move'];
        case 'mouse.button.down':
        case 'mouse.button.up':
            return ["mouse.button.".concat(systemEvent.button), 'mouse.button.all'];
        case 'mouse.wheel.down':
        case 'mouse.wheel.up':
            return ['mouse.wheel'];
    }
}
