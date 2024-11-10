"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _Container_instances, _Container_children, _Container_update, _Container_removeChild;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
var geometry_1 = require("./geometry");
var View_1 = require("./View");
var util_1 = require("./util");
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container(_a) {
        if (_a === void 0) { _a = {}; }
        var _this = this;
        var child = _a.child, children = _a.children, viewProps = __rest(_a, ["child", "children"]);
        _this = _super.call(this, viewProps) || this;
        _Container_instances.add(_this);
        _Container_children.set(_this, []);
        (0, util_1.define)(_this, 'children', { enumerable: true });
        if (child) {
            _this.add(child);
        }
        else if (children) {
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child_1 = children_1[_i];
                _this.add(child_1);
            }
        }
        return _this;
    }
    Object.defineProperty(Container.prototype, "children", {
        get: function () {
            return __classPrivateFieldGet(this, _Container_children, "f");
        },
        enumerable: false,
        configurable: true
    });
    Container.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Container_instances, "m", _Container_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Container.prototype.naturalSize = function (available) {
        var width = 0;
        var height = 0;
        for (var _i = 0, _a = __classPrivateFieldGet(this, _Container_children, "f"); _i < _a.length; _i++) {
            var child = _a[_i];
            if (!child.isVisible) {
                continue;
            }
            var naturalSize = child.naturalSize(available);
            width = Math.max(width, naturalSize.width);
            height = Math.max(height, naturalSize.height);
        }
        return new geometry_1.Size(width, height);
    };
    Container.prototype.render = function (viewport) {
        this.renderChildren(viewport);
    };
    Container.prototype.renderChildren = function (viewport) {
        for (var _i = 0, _a = __classPrivateFieldGet(this, _Container_children, "f"); _i < _a.length; _i++) {
            var child = _a[_i];
            if (!child.isVisible) {
                continue;
            }
            child.render(viewport);
        }
    };
    Container.prototype.add = function (child, at) {
        // early exit for adding child at its current index
        if (__classPrivateFieldGet(this, _Container_children, "f").length &&
            __classPrivateFieldGet(this, _Container_children, "f")[at !== null && at !== void 0 ? at : __classPrivateFieldGet(this, _Container_children, "f").length - 1] === child) {
            return;
        }
        if (child.parent === this) {
            // only changing the order - remove it from this.#children, and add it back
            // below at the correct index
            __classPrivateFieldSet(this, _Container_children, __classPrivateFieldGet(this, _Container_children, "f").filter(function (view) { return view !== child; }), "f");
        }
        else {
            child.willMoveTo(this);
            if (child.parent && child.parent instanceof Container) {
                var index = __classPrivateFieldGet(child.parent, _Container_children, "f").indexOf(child);
                if (~index) {
                    __classPrivateFieldGet(child.parent, _Container_children, "f").splice(index, 1);
                }
            }
        }
        __classPrivateFieldGet(this, _Container_children, "f").splice(at !== null && at !== void 0 ? at : __classPrivateFieldGet(this, _Container_children, "f").length, 0, child);
        if (child.parent !== this) {
            var parent_1 = child.parent;
            child.parent = this;
            if (parent_1) {
                child.didMoveFrom(parent_1);
            }
        }
        // in theory we could call 'didReorder' in the else clause
        // takes care of didMount, noop if screen == this.screen
        child.moveToScreen(this.screen);
        this.invalidateSize();
    };
    Container.prototype.removeAllChildren = function () {
        for (var _i = 0, _a = __classPrivateFieldGet(this, _Container_children, "f"); _i < _a.length; _i++) {
            var child = _a[_i];
            this.removeChild(child);
        }
    };
    Container.prototype.removeChild = function (child) {
        if (child.parent !== this) {
            return;
        }
        var index = __classPrivateFieldGet(this, _Container_children, "f").indexOf(child);
        if (~index && index >= 0 && index < __classPrivateFieldGet(this, _Container_children, "f").length) {
            var child_2 = __classPrivateFieldGet(this, _Container_children, "f")[index];
            __classPrivateFieldGet(this, _Container_children, "f").splice(index, 1);
            __classPrivateFieldGet(this, _Container_instances, "m", _Container_removeChild).call(this, child_2);
        }
    };
    Container.prototype.moveToScreen = function (screen) {
        _super.prototype.moveToScreen.call(this, screen);
        for (var _i = 0, _a = __classPrivateFieldGet(this, _Container_children, "f"); _i < _a.length; _i++) {
            var child = _a[_i];
            child.moveToScreen(this.screen);
        }
    };
    return Container;
}(View_1.View));
exports.Container = Container;
_Container_children = new WeakMap(), _Container_instances = new WeakSet(), _Container_update = function _Container_update(_a) {
    var child = _a.child, children = _a.children;
    // Stack recreates this logic
    if (child !== undefined) {
        children = (children !== null && children !== void 0 ? children : []).concat([child]);
    }
    if (children === undefined) {
        return;
    }
    if (children.length) {
        var childrenSet = new Set(children);
        for (var _i = 0, _b = __classPrivateFieldGet(this, _Container_children, "f"); _i < _b.length; _i++) {
            var child_3 = _b[_i];
            if (!childrenSet.has(child_3)) {
                __classPrivateFieldGet(this, _Container_instances, "m", _Container_removeChild).call(this, child_3);
            }
        }
        for (var _c = 0, children_2 = children; _c < children_2.length; _c++) {
            var child_4 = children_2[_c];
            this.add(child_4);
        }
    }
    else {
        this.removeAllChildren();
    }
}, _Container_removeChild = function _Container_removeChild(child) {
    child.parent = undefined;
    child.didMoveFrom(this);
    // takes care of didUnmount
    child.moveToScreen(undefined);
};
