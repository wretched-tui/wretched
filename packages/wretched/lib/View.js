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
var _View_instances, _View_screen, _View_theme, _View_prevSizeCache, _View_viewportContentSize, _View_renderedContentSize, _View_invalidateParent, _View_x, _View_y, _View_width, _View_height, _View_minWidth, _View_minHeight, _View_maxWidth, _View_maxHeight, _View_isVisible, _View_isHover, _View_isPressed, _View_update, _View_toDimension, _View_restrictSize, _View_calculateAvailableSize, _View_naturalSizeWrap, _View_renderWrap;
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
exports.parseFlexShorthand = parseFlexShorthand;
var Theme_1 = require("./Theme");
var events_1 = require("./events");
var geometry_1 = require("./geometry");
function parseFlexShorthand(flex) {
    if (flex === 'natural') {
        return 'natural';
    }
    else if (typeof flex === 'string') {
        return +flex.slice('flex'.length); // 'flexN'
    }
    return flex;
}
var View = /** @class */ (function () {
    function View(props) {
        if (props === void 0) { props = {}; }
        _View_instances.add(this);
        // id = performance.now().toString(36)
        this.parent = undefined;
        this.debug = false;
        _View_screen.set(this, undefined);
        _View_theme.set(this, void 0);
        _View_prevSizeCache.set(this, new Map());
        _View_viewportContentSize.set(this, geometry_1.Size.zero);
        _View_renderedContentSize.set(this, geometry_1.Size.zero);
        _View_invalidateParent.set(this, true);
        _View_x.set(this, void 0);
        _View_y.set(this, void 0);
        _View_width.set(this, void 0);
        _View_height.set(this, void 0);
        _View_minWidth.set(this, void 0);
        _View_minHeight.set(this, void 0);
        _View_maxWidth.set(this, void 0);
        _View_maxHeight.set(this, void 0);
        _View_isVisible.set(this, true);
        this.flex = 'natural';
        // mouse handling helpers
        _View_isHover.set(this, false);
        _View_isPressed.set(this, false);
        __classPrivateFieldGet(this, _View_instances, "m", _View_update).call(this, props);
        var render = this.render.bind(this);
        var naturalSize = this.naturalSize.bind(this);
        Object.defineProperties(this, {
            render: {
                enumerable: false,
                value: __classPrivateFieldGet(this, _View_instances, "m", _View_renderWrap).call(this, render).bind(this),
            },
            naturalSize: {
                enumerable: false,
                value: __classPrivateFieldGet(this, _View_instances, "m", _View_naturalSizeWrap).call(this, naturalSize).bind(this),
            },
            // don't want to include these in inspect output
            parent: {
                enumerable: false,
            },
            debug: {
                enumerable: false,
            },
        });
    }
    View.prototype.update = function (props) {
        __classPrivateFieldGet(this, _View_instances, "m", _View_update).call(this, props);
        this.invalidateSize();
    };
    Object.defineProperty(View.prototype, "theme", {
        get: function () {
            var _a, _b, _c;
            return (_c = (_a = __classPrivateFieldGet(this, _View_theme, "f")) !== null && _a !== void 0 ? _a : (_b = this.parent) === null || _b === void 0 ? void 0 : _b.childTheme(this)) !== null && _c !== void 0 ? _c : Theme_1.Theme.plain;
        },
        set: function (value) {
            __classPrivateFieldSet(this, _View_theme, value, "f");
        },
        enumerable: false,
        configurable: true
    });
    View.prototype.childTheme = function (_view) {
        return this.theme;
    };
    Object.defineProperty(View.prototype, "isVisible", {
        get: function () {
            return __classPrivateFieldGet(this, _View_isVisible, "f");
        },
        set: function (value) {
            __classPrivateFieldSet(this, _View_isVisible, value, "f");
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "screen", {
        get: function () {
            return __classPrivateFieldGet(this, _View_screen, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "children", {
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "contentSize", {
        get: function () {
            return __classPrivateFieldGet(this, _View_renderedContentSize, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isHover", {
        get: function () {
            return __classPrivateFieldGet(this, _View_isHover, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isPressed", {
        get: function () {
            return __classPrivateFieldGet(this, _View_isPressed, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "width", {
        get: function () {
            return __classPrivateFieldGet(this, _View_width, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "height", {
        get: function () {
            return __classPrivateFieldGet(this, _View_height, "f");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Called from a view when a property change could affect naturalSize
     */
    View.prototype.invalidateSize = function () {
        var _a;
        __classPrivateFieldSet(this, _View_prevSizeCache, new Map(), "f");
        if (__classPrivateFieldGet(this, _View_invalidateParent, "f")) {
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.invalidateSize();
        }
        this.invalidateRender();
    };
    /**
     * Indicates that a rerender is needed (but size is not affected)
     */
    View.prototype.invalidateRender = function () {
        var _a;
        (_a = __classPrivateFieldGet(this, _View_screen, "f")) === null || _a === void 0 ? void 0 : _a.needsRender();
    };
    /**
     * Called before being added to the parent View
     */
    View.prototype.willMoveTo = function (parent) { };
    /**
     * Called after being removed from the parent View
     */
    View.prototype.didMoveFrom = function (parent) { };
    /**
     * Called after being added to a Screen
     */
    View.prototype.didMount = function (screen) { };
    /**
     * Called after being removed from a Screen (even when about to be moved to a new
     * screen).
     */
    View.prototype.didUnmount = function (screen) { };
    View.prototype.removeFromParent = function () {
        if (!this.parent) {
            return;
        }
        this.parent.removeChild(this);
    };
    View.prototype.moveToScreen = function (screen) {
        if (__classPrivateFieldGet(this, _View_screen, "f") === screen) {
            return;
        }
        var prev = __classPrivateFieldGet(this, _View_screen, "f");
        __classPrivateFieldSet(this, _View_screen, screen, "f");
        if (screen) {
            if (prev) {
                this.didUnmount(prev);
            }
            this.didMount(screen);
        }
        else {
            this.didUnmount(prev);
        }
    };
    /**
     * To register for this event, call `viewport.registerFocus()`, which returns `true`
     * if the current view has the keyboard focus.
     */
    View.prototype.receiveKey = function (event) { };
    /**
     * To register for this event, call `viewport.registerMouse()`
     */
    View.prototype.receiveMouse = function (event, system) {
        if ((0, events_1.isMousePressStart)(event)) {
            __classPrivateFieldSet(this, _View_isPressed, true, "f");
        }
        else if ((0, events_1.isMousePressExit)(event)) {
            __classPrivateFieldSet(this, _View_isPressed, false, "f");
        }
        if ((0, events_1.isMouseEnter)(event)) {
            __classPrivateFieldSet(this, _View_isHover, true, "f");
        }
        else if ((0, events_1.isMouseExit)(event)) {
            __classPrivateFieldSet(this, _View_isHover, false, "f");
        }
    };
    /**
     * Receives the time-delta between previous and current render. Return 'true' if
     * this function causes the view to need a rerender.
     *
     * To register for this event, call `viewport.registerTick()`
     */
    View.prototype.receiveTick = function (dt) {
        return false;
    };
    return View;
}());
exports.View = View;
_View_screen = new WeakMap(), _View_theme = new WeakMap(), _View_prevSizeCache = new WeakMap(), _View_viewportContentSize = new WeakMap(), _View_renderedContentSize = new WeakMap(), _View_invalidateParent = new WeakMap(), _View_x = new WeakMap(), _View_y = new WeakMap(), _View_width = new WeakMap(), _View_height = new WeakMap(), _View_minWidth = new WeakMap(), _View_minHeight = new WeakMap(), _View_maxWidth = new WeakMap(), _View_maxHeight = new WeakMap(), _View_isVisible = new WeakMap(), _View_isHover = new WeakMap(), _View_isPressed = new WeakMap(), _View_instances = new WeakSet(), _View_update = function _View_update(_a) {
    var theme = _a.theme, x = _a.x, y = _a.y, width = _a.width, height = _a.height, minWidth = _a.minWidth, minHeight = _a.minHeight, maxWidth = _a.maxWidth, maxHeight = _a.maxHeight, isVisible = _a.isVisible, padding = _a.padding, flex = _a.flex, debug = _a.debug;
    __classPrivateFieldSet(this, _View_theme, typeof theme === 'string' ? Theme_1.Theme[theme] : theme, "f");
    __classPrivateFieldSet(this, _View_x, x, "f");
    __classPrivateFieldSet(this, _View_y, y, "f");
    __classPrivateFieldSet(this, _View_width, width, "f");
    __classPrivateFieldSet(this, _View_height, height, "f");
    __classPrivateFieldSet(this, _View_minWidth, minWidth, "f");
    __classPrivateFieldSet(this, _View_minHeight, minHeight, "f");
    __classPrivateFieldSet(this, _View_maxWidth, maxWidth, "f");
    __classPrivateFieldSet(this, _View_maxHeight, maxHeight, "f");
    __classPrivateFieldSet(this, _View_isVisible, isVisible !== null && isVisible !== void 0 ? isVisible : true, "f");
    this.padding = toEdges(padding);
    this.flex = flex === undefined ? 'natural' : parseFlexShorthand(flex);
    this.debug = debug !== null && debug !== void 0 ? debug : false;
    Object.defineProperties(this, {
        // only include these if they were defined
        padding: {
            enumerable: padding !== undefined,
        },
        flex: {
            enumerable: flex !== undefined,
        },
    });
}, _View_toDimension = function _View_toDimension(dim, available, natural, prefer) {
    if (dim === 'fill') {
        return available;
    }
    else if (dim === 'shrink') {
        return prefer === 'shrink' ? 0 : available;
    }
    else if (dim === 'natural') {
        return natural();
    }
    return dim;
}, _View_restrictSize = function _View_restrictSize(_calcSize, available, prefer) {
    var memo;
    var calcSize = function () {
        return (memo !== null && memo !== void 0 ? memo : (memo = _calcSize()));
    };
    if (__classPrivateFieldGet(this, _View_width, "f") !== undefined && __classPrivateFieldGet(this, _View_height, "f") !== undefined) {
        // shortcut for explicit or 'fill' on both width & height, skip all the rest
        var width = __classPrivateFieldGet(this, _View_instances, "m", _View_toDimension).call(this, __classPrivateFieldGet(this, _View_width, "f"), available.width, function () { return calcSize().width; }, prefer), height = __classPrivateFieldGet(this, _View_instances, "m", _View_toDimension).call(this, __classPrivateFieldGet(this, _View_height, "f"), available.height, function () { return calcSize().height; }, prefer);
        return new geometry_1.Size(width, height).mutableCopy();
    }
    var size = (prefer === 'shrink' ? calcSize() : available).mutableCopy();
    if (__classPrivateFieldGet(this, _View_width, "f") !== undefined) {
        size.width = __classPrivateFieldGet(this, _View_instances, "m", _View_toDimension).call(this, __classPrivateFieldGet(this, _View_width, "f"), available.width, function () { return calcSize().width; }, prefer);
    }
    else {
        if (__classPrivateFieldGet(this, _View_minWidth, "f") !== undefined) {
            size.width = Math.max(__classPrivateFieldGet(this, _View_minWidth, "f"), size.width);
        }
        if (__classPrivateFieldGet(this, _View_maxWidth, "f") !== undefined) {
            size.width = Math.min(__classPrivateFieldGet(this, _View_maxWidth, "f"), size.width);
        }
    }
    if (__classPrivateFieldGet(this, _View_height, "f") !== undefined) {
        size.height = __classPrivateFieldGet(this, _View_instances, "m", _View_toDimension).call(this, __classPrivateFieldGet(this, _View_height, "f"), available.height, function () { return calcSize().height; }, prefer);
    }
    else {
        if (__classPrivateFieldGet(this, _View_minHeight, "f") !== undefined) {
            size.height = Math.max(__classPrivateFieldGet(this, _View_minHeight, "f"), size.height);
        }
        if (__classPrivateFieldGet(this, _View_maxHeight, "f") !== undefined) {
            size.height = Math.min(__classPrivateFieldGet(this, _View_maxHeight, "f"), size.height);
        }
    }
    return size;
}, _View_calculateAvailableSize = function _View_calculateAvailableSize(parentAvailableSize) {
    var _a, _b;
    var available = parentAvailableSize.mutableCopy();
    if (__classPrivateFieldGet(this, _View_x, "f") || __classPrivateFieldGet(this, _View_y, "f")) {
        available.width -= (_a = __classPrivateFieldGet(this, _View_x, "f")) !== null && _a !== void 0 ? _a : 0;
        available.height -= (_b = __classPrivateFieldGet(this, _View_y, "f")) !== null && _b !== void 0 ? _b : 0;
    }
    if (typeof __classPrivateFieldGet(this, _View_width, "f") === 'number') {
        available.width = __classPrivateFieldGet(this, _View_width, "f");
    }
    else {
        if (__classPrivateFieldGet(this, _View_maxWidth, "f") !== undefined) {
            available.width = Math.min(__classPrivateFieldGet(this, _View_maxWidth, "f"), available.width);
        }
        if (__classPrivateFieldGet(this, _View_minWidth, "f") !== undefined) {
            available.width = Math.max(__classPrivateFieldGet(this, _View_minWidth, "f"), available.width);
        }
    }
    if (typeof __classPrivateFieldGet(this, _View_height, "f") === 'number') {
        available.height = __classPrivateFieldGet(this, _View_height, "f");
    }
    else {
        if (__classPrivateFieldGet(this, _View_maxHeight, "f") !== undefined) {
            available.height = Math.min(__classPrivateFieldGet(this, _View_maxHeight, "f"), available.height);
        }
        if (__classPrivateFieldGet(this, _View_minHeight, "f") !== undefined) {
            available.height = Math.max(__classPrivateFieldGet(this, _View_minHeight, "f"), available.height);
        }
    }
    if (this.padding) {
        available.width -= this.padding.left + this.padding.right;
        available.height -= this.padding.top + this.padding.bottom;
    }
    available.width = Math.max(0, available.width);
    available.height = Math.max(0, available.height);
    return available;
}, _View_naturalSizeWrap = function _View_naturalSizeWrap(naturalSize) {
    var _this = this;
    return function (parentAvailableSize) {
        var cached = __classPrivateFieldGet(_this, _View_prevSizeCache, "f").get(cacheKey(parentAvailableSize));
        if (cached) {
            return cached;
        }
        var available = __classPrivateFieldGet(_this, _View_instances, "m", _View_calculateAvailableSize).call(_this, parentAvailableSize);
        var size = __classPrivateFieldGet(_this, _View_instances, "m", _View_restrictSize).call(_this, function () {
            var size = naturalSize(available);
            if (_this.padding) {
                size = size.grow(_this.padding.left + _this.padding.right, _this.padding.top + _this.padding.bottom);
            }
            return size;
        }, available, 'shrink');
        if (__classPrivateFieldGet(_this, _View_x, "f")) {
            size.width += __classPrivateFieldGet(_this, _View_x, "f");
        }
        if (__classPrivateFieldGet(_this, _View_y, "f")) {
            size.height += __classPrivateFieldGet(_this, _View_y, "f");
        }
        __classPrivateFieldGet(_this, _View_prevSizeCache, "f").set(cacheKey(available), size);
        return size;
    };
}, _View_renderWrap = function _View_renderWrap(render) {
    var _this = this;
    return function (viewport) {
        var _a, _b;
        if (__classPrivateFieldGet(_this, _View_viewportContentSize, "f").width !== viewport.contentSize.width ||
            __classPrivateFieldGet(_this, _View_viewportContentSize, "f").height !== viewport.contentSize.height) {
            __classPrivateFieldSet(_this, _View_invalidateParent, false, "f");
            _this.invalidateSize();
            __classPrivateFieldSet(_this, _View_invalidateParent, true, "f");
        }
        __classPrivateFieldSet(_this, _View_viewportContentSize, viewport.contentSize, "f");
        var origin;
        var contentSize = viewport.contentSize.mutableCopy();
        if (__classPrivateFieldGet(_this, _View_x, "f") || __classPrivateFieldGet(_this, _View_y, "f")) {
            origin = new geometry_1.Point((_a = __classPrivateFieldGet(_this, _View_x, "f")) !== null && _a !== void 0 ? _a : 0, (_b = __classPrivateFieldGet(_this, _View_y, "f")) !== null && _b !== void 0 ? _b : 0);
            contentSize.width -= origin.x;
            contentSize.height -= origin.y;
        }
        else {
            origin = geometry_1.Point.zero;
        }
        if (_this.padding) {
            origin = origin.offset(_this.padding.left, _this.padding.top);
            contentSize.width -= _this.padding.left + _this.padding.right;
            contentSize.height -= _this.padding.top + _this.padding.bottom;
        }
        __classPrivateFieldSet(_this, _View_renderedContentSize, __classPrivateFieldGet(_this, _View_instances, "m", _View_restrictSize).call(_this, function () { return _this.naturalSize(contentSize); }, contentSize, 'grow'), "f");
        var rect = new geometry_1.Rect(origin, __classPrivateFieldGet(_this, _View_renderedContentSize, "f"));
        viewport._render(_this, rect, render);
    };
};
function toEdges(edges) {
    var _a, _b, _c, _d;
    if (!edges) {
        return;
    }
    if (typeof edges === 'number') {
        return {
            top: edges,
            right: edges,
            bottom: edges,
            left: edges,
        };
    }
    return {
        top: (_a = edges.top) !== null && _a !== void 0 ? _a : 0,
        right: (_b = edges.right) !== null && _b !== void 0 ? _b : 0,
        bottom: (_c = edges.bottom) !== null && _c !== void 0 ? _c : 0,
        left: (_d = edges.left) !== null && _d !== void 0 ? _d : 0,
    };
}
function cacheKey(size) {
    return "".concat(size.width, "x").concat(size.height);
}
