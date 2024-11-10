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
var _Viewport_terminal, _Viewport_currentRender, _Viewport_contentSize, _Viewport_visibleRect, _Viewport_offset, _Viewport_screen, _Viewport_style, _Pen_setter, _Pen_initial, _Pen_stack;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Viewport = void 0;
var sys_1 = require("./sys");
var ansi_1 = require("./ansi");
var Style_1 = require("./Style");
var geometry_1 = require("./geometry");
var util_1 = require("./util");
/**
 * Defines a region (contentSize) in which to draw, and a subset (visibleRect) that
 * is on-screen. Anything not in the visibleRect is considered invisible (and any
 * drawing outside the rect will be clipped)
 */
var Viewport = /** @class */ (function () {
    function Viewport(screen, terminal, contentSize) {
        _Viewport_terminal.set(this, void 0);
        _Viewport_currentRender.set(this, null);
        _Viewport_contentSize.set(this, void 0);
        _Viewport_visibleRect.set(this, void 0);
        _Viewport_offset.set(this, void 0);
        _Viewport_screen.set(this, void 0);
        _Viewport_style.set(this, void 0);
        var rect = new geometry_1.Rect(geometry_1.Point.zero, contentSize);
        __classPrivateFieldSet(this, _Viewport_terminal, terminal, "f");
        __classPrivateFieldSet(this, _Viewport_screen, screen, "f");
        __classPrivateFieldSet(this, _Viewport_contentSize, contentSize, "f");
        this.parentRect = rect;
        __classPrivateFieldSet(this, _Viewport_visibleRect, rect, "f");
        __classPrivateFieldSet(this, _Viewport_offset, geometry_1.Point.zero, "f");
        __classPrivateFieldSet(this, _Viewport_style, Style_1.Style.NONE, "f");
        // control visibility of props for inspect(viewport)
        (0, util_1.define)(this, 'contentSize', { enumerable: true });
        (0, util_1.define)(this, 'contentRect', { enumerable: true });
        (0, util_1.define)(this, 'visibleRect', { enumerable: true });
    }
    Object.defineProperty(Viewport.prototype, "contentSize", {
        /**
         * during render, `contentSize` is what you should use for laying out your
         * rectangles. in most cases this is synonymous with "visible" area, but not
         * always.
         */
        get: function () {
            return __classPrivateFieldGet(this, _Viewport_contentSize, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "visibleRect", {
        /*
         * `visibleRect` can be used to optimize drawing. `visibleRect.origin`
         * represents the first visible point, taking clipping into account.
         */
        get: function () {
            return __classPrivateFieldGet(this, _Viewport_visibleRect, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "contentRect", {
        /*
         * `contentRect` is a convenience property, useful for creating clipped inner
         * regions. origin is always [0, 0] and size is contentSize.
         */
        get: function () {
            return new geometry_1.Rect(geometry_1.Point.zero, __classPrivateFieldGet(this, _Viewport_contentSize, "f"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isEmpty", {
        get: function () {
            return __classPrivateFieldGet(this, _Viewport_contentSize, "f").isEmpty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @return boolean Whether the modal creation was successful
     */
    Viewport.prototype.requestModal = function (modal, onClose) {
        if (!__classPrivateFieldGet(this, _Viewport_currentRender, "f")) {
            return false;
        }
        return __classPrivateFieldGet(this, _Viewport_screen, "f").requestModal(__classPrivateFieldGet(this, _Viewport_currentRender, "f"), modal, onClose, new geometry_1.Rect(__classPrivateFieldGet(this, _Viewport_offset, "f"), __classPrivateFieldGet(this, _Viewport_contentSize, "f")));
    };
    Viewport.prototype.registerHotKey = function (key) {
        if (!__classPrivateFieldGet(this, _Viewport_currentRender, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _Viewport_screen, "f").registerHotKey(__classPrivateFieldGet(this, _Viewport_currentRender, "f"), key);
    };
    /**
     * @return boolean Whether the current render target is the focus view
     */
    Viewport.prototype.registerFocus = function () {
        if (!__classPrivateFieldGet(this, _Viewport_currentRender, "f")) {
            return false;
        }
        return __classPrivateFieldGet(this, _Viewport_screen, "f").registerFocus(__classPrivateFieldGet(this, _Viewport_currentRender, "f"));
    };
    /**
     * @see MouseManager.registerMouse
     */
    Viewport.prototype.registerMouse = function (eventNames, rect) {
        if (!__classPrivateFieldGet(this, _Viewport_currentRender, "f") || __classPrivateFieldGet(this, _Viewport_currentRender, "f").screen !== __classPrivateFieldGet(this, _Viewport_screen, "f")) {
            return;
        }
        if (rect) {
            rect = __classPrivateFieldGet(this, _Viewport_visibleRect, "f").intersection(rect);
        }
        else {
            rect = __classPrivateFieldGet(this, _Viewport_visibleRect, "f");
        }
        var maxX = rect.maxX();
        var maxY = rect.maxY();
        var events = typeof eventNames === 'string' ? [eventNames] : eventNames;
        for (var y = rect.minY(); y < maxY; ++y)
            for (var x = rect.minX(); x < maxX; ++x) {
                __classPrivateFieldGet(this, _Viewport_screen, "f").registerMouse(__classPrivateFieldGet(this, _Viewport_currentRender, "f"), __classPrivateFieldGet(this, _Viewport_offset, "f"), new geometry_1.Point(x, y), events);
            }
    };
    Viewport.prototype.registerTick = function () {
        if (!__classPrivateFieldGet(this, _Viewport_currentRender, "f")) {
            return;
        }
        __classPrivateFieldGet(this, _Viewport_screen, "f").registerTick(__classPrivateFieldGet(this, _Viewport_currentRender, "f"));
    };
    /**
     * Clears out, and optionally "paints" default foreground/background colors. If no
     * region is provided, the entire visibleRect is painted.
     */
    Viewport.prototype.paint = function (defaultStyle, region) {
        var _this = this;
        if (region instanceof geometry_1.Point) {
            this.write(' ', region, defaultStyle);
        }
        else {
            region !== null && region !== void 0 ? region : (region = this.visibleRect);
            region.forEachPoint(function (pt) { return _this.paint(defaultStyle, pt); });
        }
    };
    /**
     * Does not support newlines (no default wrapping behavior),
     * always prints left-to-right.
     */
    Viewport.prototype.write = function (input, to, style) {
        var minX = __classPrivateFieldGet(this, _Viewport_visibleRect, "f").minX(), maxX = __classPrivateFieldGet(this, _Viewport_visibleRect, "f").maxX(), minY = __classPrivateFieldGet(this, _Viewport_visibleRect, "f").minY(), maxY = __classPrivateFieldGet(this, _Viewport_visibleRect, "f").maxY();
        if (to.x >= maxX || to.y < minY || to.y >= maxY) {
            return;
        }
        style !== null && style !== void 0 ? style : (style = __classPrivateFieldGet(this, _Viewport_style, "f"));
        var startingStyle = style;
        var x = to.x, y = to.y;
        for (var _i = 0, _a = sys_1.unicode.printableChars(input); _i < _a.length; _i++) {
            var char = _a[_i];
            if (char === '\n') {
                x = to.x;
                y += 1;
                if (y >= maxY) {
                    break;
                }
                continue;
            }
            if (x >= maxX) {
                continue;
            }
            var width = sys_1.unicode.charWidth(char);
            if (width === 0) {
                style =
                    char === ansi_1.RESET
                        ? startingStyle
                        : startingStyle.merge(Style_1.Style.fromSGR(char, startingStyle));
            }
            else if (x >= minX && x + width - 1 < maxX) {
                __classPrivateFieldGet(this, _Viewport_terminal, "f").writeChar(char, __classPrivateFieldGet(this, _Viewport_offset, "f").x + x, __classPrivateFieldGet(this, _Viewport_offset, "f").y + y, style);
                if (__classPrivateFieldGet(this, _Viewport_currentRender, "f") &&
                    // if the currentRender wasn't added as a child to the screen's tree,
                    // we shouldn't perform this check
                    __classPrivateFieldGet(this, _Viewport_currentRender, "f").screen === __classPrivateFieldGet(this, _Viewport_screen, "f")) {
                    __classPrivateFieldGet(this, _Viewport_screen, "f").checkMouse(__classPrivateFieldGet(this, _Viewport_currentRender, "f"), __classPrivateFieldGet(this, _Viewport_offset, "f").x + x, __classPrivateFieldGet(this, _Viewport_offset, "f").y + y);
                }
            }
            x += width;
        }
    };
    /**
     * Forwards 'meta' ANSI sequences (see ITerm) to the terminal
     */
    Viewport.prototype.writeMeta = function (str) {
        __classPrivateFieldGet(this, _Viewport_terminal, "f").writeMeta(str);
    };
    Viewport.prototype.usingPen = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var prevStyle = __classPrivateFieldGet(this, _Viewport_style, "f");
        var pen = new Pen(prevStyle, function (style) {
            __classPrivateFieldSet(_this, _Viewport_style, style !== null && style !== void 0 ? style : prevStyle, "f");
        });
        if (args.length === 2) {
            if (args[0] && args[0] !== Style_1.Style.NONE) {
                pen.replacePen(args[0]);
            }
            args[1](pen);
        }
        else {
            args[0](pen);
        }
        __classPrivateFieldSet(this, _Viewport_style, prevStyle, "f");
    };
    Viewport.prototype._render = function (view, clip, draw) {
        var prevRender = __classPrivateFieldGet(this, _Viewport_currentRender, "f");
        __classPrivateFieldSet(this, _Viewport_currentRender, view, "f");
        this.clipped(clip, draw);
        __classPrivateFieldSet(this, _Viewport_currentRender, prevRender, "f");
    };
    Viewport.prototype.clipped = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var clip;
        var style;
        var draw;
        if (args.length === 3) {
            ;
            clip = args[0], style = args[1], draw = args[2];
        }
        else {
            ;
            clip = args[0], draw = args[1];
            style = __classPrivateFieldGet(this, _Viewport_style, "f");
        }
        var offsetX = __classPrivateFieldGet(this, _Viewport_offset, "f").x + clip.origin.x;
        var offsetY = __classPrivateFieldGet(this, _Viewport_offset, "f").y + clip.origin.y;
        var contentWidth = Math.max(0, clip.size.width);
        var contentHeight = Math.max(0, clip.size.height);
        // visibleRect.origin doesn't go negative - Math.max(0) prevents that.
        // The subtraction of clip.origin.x only has an effect when the clipped
        // origin is *negative*. In that case, the effect is that (0, 0) is outside the
        // visible space, and so visibleRect.origin represents the first visiblePoint
        // (in local coordinates). Basically - trust this math, it looks wrong, but I
        // double checked it.
        var visibleMinX = Math.max(0, __classPrivateFieldGet(this, _Viewport_visibleRect, "f").origin.x - clip.origin.x);
        var visibleMinY = Math.max(0, __classPrivateFieldGet(this, _Viewport_visibleRect, "f").origin.y - clip.origin.y);
        var visibleMaxX = Math.min(clip.size.width, __classPrivateFieldGet(this, _Viewport_visibleRect, "f").origin.x + __classPrivateFieldGet(this, _Viewport_visibleRect, "f").size.width - clip.origin.x);
        var visibleMaxY = Math.min(clip.size.height, __classPrivateFieldGet(this, _Viewport_visibleRect, "f").origin.y +
            __classPrivateFieldGet(this, _Viewport_visibleRect, "f").size.height -
            clip.origin.y);
        var contentSize = new geometry_1.Size(contentWidth, contentHeight);
        var visibleRect = new geometry_1.Rect(new geometry_1.Point(visibleMinX, visibleMinY), new geometry_1.Size(visibleMaxX - visibleMinX, visibleMaxY - visibleMinY));
        var offset = new geometry_1.Point(offsetX, offsetY);
        var prevContentSize = __classPrivateFieldGet(this, _Viewport_contentSize, "f");
        var prevVisibleRect = __classPrivateFieldGet(this, _Viewport_visibleRect, "f");
        var prevOffset = __classPrivateFieldGet(this, _Viewport_offset, "f");
        var prevStyle = __classPrivateFieldGet(this, _Viewport_style, "f");
        __classPrivateFieldSet(this, _Viewport_contentSize, contentSize, "f");
        __classPrivateFieldSet(this, _Viewport_visibleRect, visibleRect, "f");
        __classPrivateFieldSet(this, _Viewport_offset, offset, "f");
        __classPrivateFieldSet(this, _Viewport_style, style, "f");
        draw(this);
        __classPrivateFieldSet(this, _Viewport_contentSize, prevContentSize, "f");
        __classPrivateFieldSet(this, _Viewport_visibleRect, prevVisibleRect, "f");
        __classPrivateFieldSet(this, _Viewport_offset, prevOffset, "f");
        __classPrivateFieldSet(this, _Viewport_style, prevStyle, "f");
    };
    return Viewport;
}());
exports.Viewport = Viewport;
_Viewport_terminal = new WeakMap(), _Viewport_currentRender = new WeakMap(), _Viewport_contentSize = new WeakMap(), _Viewport_visibleRect = new WeakMap(), _Viewport_offset = new WeakMap(), _Viewport_screen = new WeakMap(), _Viewport_style = new WeakMap();
var Pen = /** @class */ (function () {
    function Pen(initialStyle, setter) {
        _Pen_setter.set(this, void 0);
        _Pen_initial.set(this, void 0);
        _Pen_stack.set(this, void 0);
        __classPrivateFieldSet(this, _Pen_setter, setter, "f");
        __classPrivateFieldSet(this, _Pen_initial, initialStyle, "f");
        __classPrivateFieldSet(this, _Pen_stack, [], "f");
    }
    /**
     * Used in Text drawing components - the component usually defines a starting
     * style (`viewport.usingPen(style, pen => {})`), and as it prints characters
     * (`char of unicode.printableChars(line)`) it will detect 0-width SGR codes
     * (`unicode.charWidth(char) === 0`). These codes can be used to create a `Style`
     * object (`Style.fromSGR(char)`).
     *
     * SGR codes do support turn-on/turn-off, but this doesn't work well when, say, the
     * default style already has certain features turned on. For instance, if the
     * string specifies one region to be bold, but the entire Text component is meant
     * to be bold, the behaviour of "turn-off-bold" is actually incorrect here.
     *
     * This is why the `fromSGR` method accepts the default style - it can be compared
     * with the SGR state to determine what to do.
     */
    Pen.prototype.mergePen = function (style) {
        var _a;
        var current = (_a = __classPrivateFieldGet(this, _Pen_stack, "f")[0]) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _Pen_initial, "f");
        style = current.merge(style);
        this.replacePen(style);
    };
    /**
     * replacePen is better when you need to control the drawing style, but you will
     * assign the entire desired style.
     */
    Pen.prototype.replacePen = function (style) {
        __classPrivateFieldGet(this, _Pen_stack, "f")[0] = style;
        __classPrivateFieldGet(this, _Pen_setter, "f").call(this, style);
    };
    Pen.prototype.pushPen = function (style) {
        var _a;
        if (style === void 0) { style = undefined; }
        style !== null && style !== void 0 ? style : (style = (_a = __classPrivateFieldGet(this, _Pen_stack, "f")[0]) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _Pen_initial, "f"));
        // yeah I know I said pushPen but #style[0] is easier!
        __classPrivateFieldGet(this, _Pen_stack, "f").unshift(style);
        __classPrivateFieldGet(this, _Pen_setter, "f").call(this, style);
    };
    Pen.prototype.popPen = function () {
        __classPrivateFieldGet(this, _Pen_setter, "f").call(this, __classPrivateFieldGet(this, _Pen_stack, "f").shift());
    };
    return Pen;
}());
_Pen_setter = new WeakMap(), _Pen_initial = new WeakMap(), _Pen_stack = new WeakMap();
