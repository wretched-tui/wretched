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
var _Collapsible_instances, _Collapsible_collapsedView, _Collapsible_expandedView, _Collapsible_isCollapsed, _Collapsible_showCollapsed, _Collapsible_update;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collapsible = void 0;
var Container_1 = require("../Container");
var Text_1 = require("./Text");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var Collapsible = /** @class */ (function (_super) {
    __extends(Collapsible, _super);
    function Collapsible(props) {
        var _this = _super.call(this, props) || this;
        _Collapsible_instances.add(_this);
        /**
         * Also assignable as child-view 0 (this is a React support hack)
         */
        _Collapsible_collapsedView.set(_this, void 0);
        /**
         * Also assignable as child-view 1 (this is a React support hack)
         */
        _Collapsible_expandedView.set(_this, void 0);
        _Collapsible_isCollapsed.set(_this, true);
        _Collapsible_showCollapsed.set(_this, false);
        __classPrivateFieldGet(_this, _Collapsible_instances, "m", _Collapsible_update).call(_this, props);
        return _this;
    }
    Collapsible.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Collapsible_instances, "m", _Collapsible_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Collapsible.prototype.add = function (child, at) {
        _super.prototype.add.call(this, child, at);
        __classPrivateFieldSet(this, _Collapsible_collapsedView, this.children.at(0), "f");
        __classPrivateFieldSet(this, _Collapsible_expandedView, this.children.at(1), "f");
    };
    Collapsible.prototype.removeChild = function (child) {
        _super.prototype.removeChild.call(this, child);
        __classPrivateFieldSet(this, _Collapsible_collapsedView, this.children.at(0), "f");
        __classPrivateFieldSet(this, _Collapsible_expandedView, this.children.at(1), "f");
    };
    Collapsible.prototype.naturalSize = function (available) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var size;
        if (__classPrivateFieldGet(this, _Collapsible_isCollapsed, "f")) {
            size = (_b = (_a = __classPrivateFieldGet(this, _Collapsible_collapsedView, "f")) === null || _a === void 0 ? void 0 : _a.naturalSize(available)) !== null && _b !== void 0 ? _b : geometry_1.Size.zero;
        }
        else if (__classPrivateFieldGet(this, _Collapsible_showCollapsed, "f")) {
            var collapsedSize = (_d = (_c = __classPrivateFieldGet(this, _Collapsible_collapsedView, "f")) === null || _c === void 0 ? void 0 : _c.naturalSize(available)) !== null && _d !== void 0 ? _d : geometry_1.Size.zero;
            var remaining = available.shrink(0, collapsedSize.height);
            size = (_f = (_e = __classPrivateFieldGet(this, _Collapsible_expandedView, "f")) === null || _e === void 0 ? void 0 : _e.naturalSize(remaining)) !== null && _f !== void 0 ? _f : geometry_1.Size.zero;
            size = size.growHeight(collapsedSize);
        }
        else {
            size = (_h = (_g = __classPrivateFieldGet(this, _Collapsible_expandedView, "f")) === null || _g === void 0 ? void 0 : _g.naturalSize(available)) !== null && _h !== void 0 ? _h : geometry_1.Size.zero;
        }
        return size.grow(2, 0);
    };
    Collapsible.prototype.receiveMouse = function (event, system) {
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            __classPrivateFieldSet(this, _Collapsible_isCollapsed, !__classPrivateFieldGet(this, _Collapsible_isCollapsed, "f"), "f");
            this.invalidateSize();
        }
    };
    Collapsible.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        var textStyle = this.theme.text({
            isPressed: this.isPressed,
            isHover: this.isHover,
        });
        viewport.paint(textStyle);
        var offset = new geometry_1.Point(2, 0);
        viewport.write(__classPrivateFieldGet(this, _Collapsible_isCollapsed, "f") ? '►' : '▼', new geometry_1.Point(0, offset.y), textStyle);
        var contentSize = viewport.contentSize.shrink(2, 0);
        viewport.clipped(new geometry_1.Rect(offset, contentSize), function (inside) {
            var _a, _b, _c, _d, _e;
            if (__classPrivateFieldGet(_this, _Collapsible_isCollapsed, "f")) {
                (_a = __classPrivateFieldGet(_this, _Collapsible_collapsedView, "f")) === null || _a === void 0 ? void 0 : _a.render(inside);
            }
            else if (__classPrivateFieldGet(_this, _Collapsible_showCollapsed, "f")) {
                var collapsedSize = (_c = (_b = __classPrivateFieldGet(_this, _Collapsible_collapsedView, "f")) === null || _b === void 0 ? void 0 : _b.naturalSize(contentSize)) !== null && _c !== void 0 ? _c : geometry_1.Size.zero;
                var remaining = contentSize;
                remaining = remaining.shrink(0, collapsedSize.height);
                (_d = __classPrivateFieldGet(_this, _Collapsible_collapsedView, "f")) === null || _d === void 0 ? void 0 : _d.render(inside);
                viewport.clipped(new geometry_1.Rect([0, collapsedSize.height], remaining), function (inside) {
                    var _a;
                    (_a = __classPrivateFieldGet(_this, _Collapsible_expandedView, "f")) === null || _a === void 0 ? void 0 : _a.render(inside);
                });
            }
            else {
                (_e = __classPrivateFieldGet(_this, _Collapsible_expandedView, "f")) === null || _e === void 0 ? void 0 : _e.render(inside);
            }
        });
    };
    return Collapsible;
}(Container_1.Container));
exports.Collapsible = Collapsible;
_Collapsible_collapsedView = new WeakMap(), _Collapsible_expandedView = new WeakMap(), _Collapsible_isCollapsed = new WeakMap(), _Collapsible_showCollapsed = new WeakMap(), _Collapsible_instances = new WeakSet(), _Collapsible_update = function _Collapsible_update(_a) {
    var _b, _c, _d;
    var isCollapsed = _a.isCollapsed, showCollapsed = _a.showCollapsed, collapsedView = _a.collapsed, expandedView = _a.expanded;
    __classPrivateFieldSet(this, _Collapsible_isCollapsed, isCollapsed !== null && isCollapsed !== void 0 ? isCollapsed : true, "f");
    __classPrivateFieldSet(this, _Collapsible_showCollapsed, showCollapsed !== null && showCollapsed !== void 0 ? showCollapsed : false, "f");
    // edge case: expandedView is being assigned, but not collapsedView
    if (expandedView && !collapsedView) {
        collapsedView = (_b = __classPrivateFieldGet(this, _Collapsible_collapsedView, "f")) !== null && _b !== void 0 ? _b : new Text_1.Text();
    }
    if (collapsedView && collapsedView !== __classPrivateFieldGet(this, _Collapsible_collapsedView, "f")) {
        (_c = __classPrivateFieldGet(this, _Collapsible_collapsedView, "f")) === null || _c === void 0 ? void 0 : _c.removeFromParent();
        this.add(collapsedView, 0);
    }
    if (expandedView && expandedView !== __classPrivateFieldGet(this, _Collapsible_expandedView, "f")) {
        (_d = __classPrivateFieldGet(this, _Collapsible_expandedView, "f")) === null || _d === void 0 ? void 0 : _d.removeFromParent();
        this.add(expandedView, 1);
    }
};
