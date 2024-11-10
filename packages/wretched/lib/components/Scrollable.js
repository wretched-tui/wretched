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
var _Scrollable_instances, _Scrollable_showScrollbars, _Scrollable_scrollHeight, _Scrollable_contentOffset, _Scrollable_contentSize, _Scrollable_visibleSize, _Scrollable_prevMouseDown, _Scrollable_update, _Scrollable_maxOffsetX, _Scrollable_maxOffsetY;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrollable = void 0;
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var Style_1 = require("../Style");
/**
 * Scrollable is meant to scroll _a single view_, ie a Stack view. But all the
 * container views are optimized to check their _visibleRect_, and won't render
 * children that are not in view, saving some CPU cycles.
 */
var Scrollable = /** @class */ (function (_super) {
    __extends(Scrollable, _super);
    function Scrollable(props) {
        var _this = _super.call(this, props) || this;
        _Scrollable_instances.add(_this);
        _Scrollable_showScrollbars.set(_this, true);
        _Scrollable_scrollHeight.set(_this, 1);
        _Scrollable_contentOffset.set(_this, void 0);
        _Scrollable_contentSize.set(_this, geometry_1.Size.zero);
        _Scrollable_visibleSize.set(_this, geometry_1.Size.zero);
        _Scrollable_prevMouseDown.set(_this, undefined);
        __classPrivateFieldSet(_this, _Scrollable_contentOffset, { x: 0, y: 0 }, "f");
        __classPrivateFieldGet(_this, _Scrollable_instances, "m", _Scrollable_update).call(_this, props);
        return _this;
    }
    Scrollable.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Scrollable_instances, "m", _Scrollable_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Scrollable.prototype.naturalSize = function (available) {
        var size = _super.prototype.naturalSize.call(this, available);
        return size.withHeight(available.height);
    };
    Scrollable.prototype.receiveMouse = function (event) {
        if (event.name === 'mouse.wheel.up' || event.name === 'mouse.wheel.down') {
            this.receiveWheel(event);
            return;
        }
        if (event.name === 'mouse.button.up') {
            __classPrivateFieldSet(this, _Scrollable_prevMouseDown, undefined, "f");
            return;
        }
        var tooWide = __classPrivateFieldGet(this, _Scrollable_contentSize, "f").width > this.contentSize.width;
        var tooTall = __classPrivateFieldGet(this, _Scrollable_contentSize, "f").height > this.contentSize.height;
        if (tooWide &&
            tooTall &&
            event.position.y === this.contentSize.height - 1 &&
            event.position.x === this.contentSize.width - 1) {
            // bottom-right corner click
            return;
        }
        if (__classPrivateFieldGet(this, _Scrollable_prevMouseDown, "f") === undefined) {
            if (tooWide && event.position.y === this.contentSize.height) {
                __classPrivateFieldSet(this, _Scrollable_prevMouseDown, 'horizontal', "f");
            }
            else if (tooTall && event.position.x === this.contentSize.width) {
                __classPrivateFieldSet(this, _Scrollable_prevMouseDown, 'vertical', "f");
            }
            else {
                return;
            }
        }
        this.receiveMouseDown(event);
    };
    Scrollable.prototype.receiveMouseDown = function (event) {
        var tooWide = __classPrivateFieldGet(this, _Scrollable_contentSize, "f").width > this.contentSize.width;
        var tooTall = __classPrivateFieldGet(this, _Scrollable_contentSize, "f").height > this.contentSize.height;
        if (tooWide && __classPrivateFieldGet(this, _Scrollable_prevMouseDown, "f") === 'horizontal') {
            var maxX = __classPrivateFieldGet(this, _Scrollable_instances, "m", _Scrollable_maxOffsetX).call(this);
            var offsetX = Math.round((0, geometry_1.interpolate)(event.position.x, [0, this.contentSize.width - (tooTall ? 1 : 0)], [0, maxX]));
            __classPrivateFieldSet(this, _Scrollable_contentOffset, {
                x: Math.max(maxX, Math.min(0, offsetX)),
                y: __classPrivateFieldGet(this, _Scrollable_contentOffset, "f").y,
            }, "f");
        }
        else if (tooTall && __classPrivateFieldGet(this, _Scrollable_prevMouseDown, "f") === 'vertical') {
            var maxY = __classPrivateFieldGet(this, _Scrollable_instances, "m", _Scrollable_maxOffsetY).call(this);
            var offsetY = Math.round((0, geometry_1.interpolate)(event.position.y, [0, this.contentSize.height - (tooWide ? 1 : 0)], [0, maxY]));
            __classPrivateFieldSet(this, _Scrollable_contentOffset, {
                x: __classPrivateFieldGet(this, _Scrollable_contentOffset, "f").x,
                y: Math.max(maxY, Math.min(0, offsetY)),
            }, "f");
        }
    };
    Scrollable.prototype.receiveWheel = function (event) {
        var _a, _b;
        var delta = 0;
        if (event.name === 'mouse.wheel.up') {
            delta = __classPrivateFieldGet(this, _Scrollable_scrollHeight, "f") * -1;
        }
        else if (event.name === 'mouse.wheel.down') {
            delta = __classPrivateFieldGet(this, _Scrollable_scrollHeight, "f");
        }
        var tooTall = ((_b = (_a = __classPrivateFieldGet(this, _Scrollable_contentSize, "f")) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0) > this.contentSize.height;
        if (event.ctrl) {
            delta *= 5;
        }
        if (event.shift || !tooTall) {
            this.scrollBy(-delta, 0);
        }
        else {
            this.scrollBy(0, delta);
        }
    };
    /**
     * Moves the visible region. The visible region is stored as a pointer to the
     * top-most row and an offset from the top of that row (see `interface ContentOffset`)
     *
     * Positive offset scrolls *down* (currentOffset goes more negative)
     *
     * When current cell is entirely above the top, we set the `contentOffset` to the
     * row that is at the top of the screen and still visible, similarly if the current
     * cell is below the top, we fetch enough rows about and update the `contentOffset`
     * to point to the top-most row.
     */
    Scrollable.prototype.scrollBy = function (offsetX, offsetY) {
        if (offsetX === 0 && offsetY === 0) {
            return;
        }
        var tooWide = __classPrivateFieldGet(this, _Scrollable_contentSize, "f").width > this.contentSize.width;
        var tooTall = __classPrivateFieldGet(this, _Scrollable_contentSize, "f").height > this.contentSize.height;
        var _a = __classPrivateFieldGet(this, _Scrollable_contentOffset, "f"), x = _a.x, y = _a.y;
        var maxX = __classPrivateFieldGet(this, _Scrollable_instances, "m", _Scrollable_maxOffsetX).call(this);
        var maxY = __classPrivateFieldGet(this, _Scrollable_instances, "m", _Scrollable_maxOffsetY).call(this);
        x = Math.min(0, Math.max(maxX, x - offsetX));
        y = Math.min(0, Math.max(maxY, y - offsetY));
        __classPrivateFieldSet(this, _Scrollable_contentOffset, { x: x, y: y }, "f");
    };
    Object.defineProperty(Scrollable.prototype, "contentSize", {
        get: function () {
            var delta = __classPrivateFieldGet(this, _Scrollable_showScrollbars, "f") ? 1 : 0;
            return _super.prototype.contentSize.shrink(delta, delta);
        },
        enumerable: false,
        configurable: true
    });
    Scrollable.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        viewport.registerMouse('mouse.wheel');
        var contentSize = geometry_1.Size.zero.mutableCopy();
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childSize = child.naturalSize(viewport.contentSize);
            contentSize.width = Math.max(contentSize.width, childSize.width);
            contentSize.height = Math.max(contentSize.height, childSize.height);
        }
        __classPrivateFieldSet(this, _Scrollable_contentSize, contentSize, "f");
        var tooWide = contentSize.width > viewport.contentSize.width;
        var tooTall = contentSize.height > viewport.contentSize.height;
        // #contentOffset is _negative_ (indicates the amount to move the view away
        // from the origin, which will always be up/left of 0,0)
        var outside = new geometry_1.Rect([__classPrivateFieldGet(this, _Scrollable_contentOffset, "f").x, __classPrivateFieldGet(this, _Scrollable_contentOffset, "f").y], viewport.contentSize
            .shrink(__classPrivateFieldGet(this, _Scrollable_contentOffset, "f").x, __classPrivateFieldGet(this, _Scrollable_contentOffset, "f").y)
            .shrink(__classPrivateFieldGet(this, _Scrollable_showScrollbars, "f") && tooTall ? 1 : 0, __classPrivateFieldGet(this, _Scrollable_showScrollbars, "f") && tooWide ? 1 : 0));
        viewport.clipped(outside, function (inside) {
            for (var _i = 0, _a = _this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.render(inside);
            }
        });
        __classPrivateFieldSet(this, _Scrollable_visibleSize, viewport.visibleRect.size.shrink(tooWide ? 1 : 0, tooTall ? 1 : 0), "f");
        if (__classPrivateFieldGet(this, _Scrollable_showScrollbars, "f") && (tooWide || tooTall)) {
            var scrollBar = new Style_1.Style({
                foreground: this.theme.darkenColor,
                background: this.theme.darkenColor,
            });
            var scrollControl = new Style_1.Style({
                foreground: this.theme.highlightColor,
                background: this.theme.highlightColor,
            });
            // scrollMaxX: x of the last column of the view
            // scrollMaxY: y of the last row of the view
            // scrollMaxHorizX: horizontal scroll bar is drawn from 0 to scrollMaxHorizX
            // scrollMaxHorizY: vertical scroll bar is drawn from 0 to scrollMaxHorizY
            var scrollMaxX = viewport.contentSize.width - 1, scrollMaxY = viewport.contentSize.height - 1, scrollMaxHorizX = scrollMaxX - (tooTall ? 1 : 0), scrollMaxVertY = scrollMaxY - (tooWide ? 1 : 0);
            if (tooWide && tooTall) {
                viewport.write('█', new geometry_1.Point(scrollMaxX, scrollMaxY), scrollBar);
            }
            if (tooWide) {
                viewport.registerMouse('mouse.button.left', new geometry_1.Rect(new geometry_1.Point(0, scrollMaxY), new geometry_1.Size(scrollMaxHorizX + 1, 1)));
                var contentOffsetX = -__classPrivateFieldGet(this, _Scrollable_contentOffset, "f").x;
                var viewX = Math.round((0, geometry_1.interpolate)(contentOffsetX, [
                    0,
                    contentSize.width -
                        viewport.contentSize.width +
                        (tooTall ? 1 : 0),
                ], [0, scrollMaxHorizX]));
                for (var x = 0; x <= scrollMaxHorizX; x++) {
                    var inRange = x === viewX;
                    viewport.write(inRange ? '█' : ' ', new geometry_1.Point(x, scrollMaxY), inRange ? scrollControl : scrollBar);
                }
            }
            if (tooTall) {
                viewport.registerMouse('mouse.button.left', new geometry_1.Rect(new geometry_1.Point(scrollMaxX, 0), new geometry_1.Size(1, scrollMaxVertY + 1)));
                var contentOffsetY = -__classPrivateFieldGet(this, _Scrollable_contentOffset, "f").y;
                var viewY = Math.round((0, geometry_1.interpolate)(contentOffsetY, [
                    0,
                    contentSize.height -
                        viewport.contentSize.height +
                        (tooWide ? 1 : 0),
                ], [0, scrollMaxVertY]));
                for (var y = 0; y <= scrollMaxVertY; y++) {
                    var inRange = y === viewY;
                    viewport.write(inRange ? '█' : ' ', new geometry_1.Point(scrollMaxX, y), inRange ? scrollControl : scrollBar);
                }
            }
        }
    };
    return Scrollable;
}(Container_1.Container));
exports.Scrollable = Scrollable;
_Scrollable_showScrollbars = new WeakMap(), _Scrollable_scrollHeight = new WeakMap(), _Scrollable_contentOffset = new WeakMap(), _Scrollable_contentSize = new WeakMap(), _Scrollable_visibleSize = new WeakMap(), _Scrollable_prevMouseDown = new WeakMap(), _Scrollable_instances = new WeakSet(), _Scrollable_update = function _Scrollable_update(_a) {
    var scrollHeight = _a.scrollHeight, showScrollbars = _a.showScrollbars;
    __classPrivateFieldSet(this, _Scrollable_showScrollbars, showScrollbars !== null && showScrollbars !== void 0 ? showScrollbars : true, "f");
    __classPrivateFieldSet(this, _Scrollable_scrollHeight, scrollHeight !== null && scrollHeight !== void 0 ? scrollHeight : 1, "f");
}, _Scrollable_maxOffsetX = function _Scrollable_maxOffsetX() {
    var tooTall = __classPrivateFieldGet(this, _Scrollable_contentSize, "f").height > this.contentSize.height;
    return __classPrivateFieldGet(this, _Scrollable_visibleSize, "f").width - __classPrivateFieldGet(this, _Scrollable_contentSize, "f").width + (tooTall ? 0 : 1);
}, _Scrollable_maxOffsetY = function _Scrollable_maxOffsetY() {
    var tooWide = __classPrivateFieldGet(this, _Scrollable_contentSize, "f").width > this.contentSize.width;
    return (__classPrivateFieldGet(this, _Scrollable_visibleSize, "f").height - __classPrivateFieldGet(this, _Scrollable_contentSize, "f").height + (tooWide ? 0 : 1));
};
