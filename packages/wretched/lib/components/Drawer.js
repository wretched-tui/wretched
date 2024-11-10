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
var _Drawer_instances, _Drawer_drawerSize, _Drawer_isOpen, _Drawer_currentDx, _Drawer_location, _Drawer_onToggle, _Drawer_update, _Drawer_setIsOpen, _Drawer_targetDx, _Drawer_saveDrawerSize, _Drawer_renderTop, _Drawer_renderBottom, _Drawer_renderRight, _Drawer_renderLeft, _Drawer_renderContent, _Drawer_renderDrawerTop, _Drawer_renderDrawerBottom, _Drawer_renderDrawerRight, _Drawer_renderDrawerLeft;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drawer = void 0;
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var Theme_1 = require("../Theme");
var util_1 = require("../util");
var DRAWER_BORDER = 2;
var DRAWER_BTN_SIZE = {
    vertical: new geometry_1.Size(3, 8),
    horizontal: new geometry_1.Size(8, 3),
};
var Drawer = /** @class */ (function (_super) {
    __extends(Drawer, _super);
    function Drawer(_a) {
        var _this = this;
        var content = _a.content, drawer = _a.drawer, props = __rest(_a, ["content", "drawer"]);
        _this = _super.call(this, props) || this;
        _Drawer_instances.add(_this);
        _Drawer_drawerSize.set(_this, geometry_1.Size.zero);
        _Drawer_isOpen.set(_this, false);
        _Drawer_currentDx.set(_this, 0);
        _Drawer_location.set(_this, 'left');
        _Drawer_onToggle.set(_this, void 0);
        if (content) {
            _this.add((_this.contentView = content));
        }
        if (drawer) {
            _this.add((_this.drawerView = drawer));
        }
        __classPrivateFieldGet(_this, _Drawer_instances, "m", _Drawer_update).call(_this, props);
        (0, util_1.define)(_this, 'location', { enumerable: true });
        return _this;
    }
    Object.defineProperty(Drawer.prototype, "location", {
        get: function () {
            return __classPrivateFieldGet(this, _Drawer_location, "f");
        },
        set: function (value) {
            __classPrivateFieldSet(this, _Drawer_location, value, "f");
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    Drawer.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    /**
     * Opens the drawer (does not trigger onToggle)
     */
    Drawer.prototype.open = function () {
        __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_setIsOpen).call(this, true, false);
    };
    /**
     * Closes the drawer (does not trigger onToggle)
     */
    Drawer.prototype.close = function () {
        __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_setIsOpen).call(this, false, false);
    };
    /**
     * Toggles the drawer open/closed (does not trigger onToggle)
     */
    Drawer.prototype.toggle = function () {
        __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_setIsOpen).call(this, !__classPrivateFieldGet(this, _Drawer_isOpen, "f"), false);
    };
    Drawer.prototype.add = function (child, at) {
        _super.prototype.add.call(this, child, at);
        this.contentView = this.children[0];
        this.drawerView = this.children[1];
    };
    Drawer.prototype.naturalSize = function (available) {
        var _a = __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_saveDrawerSize).call(this, available), drawerSize = _a[0], contentSize = _a[1];
        switch (__classPrivateFieldGet(this, _Drawer_location, "f")) {
            case 'top':
            case 'bottom':
                return new geometry_1.Size(Math.max(drawerSize.width + DRAWER_BORDER, contentSize.width), Math.max(drawerSize.height, contentSize.height) +
                    DRAWER_BTN_SIZE.horizontal.height);
            case 'left':
            case 'right':
                return new geometry_1.Size(Math.max(drawerSize.width, contentSize.width) +
                    DRAWER_BTN_SIZE.vertical.width, Math.max(drawerSize.height + DRAWER_BORDER, contentSize.height));
        }
    };
    Drawer.prototype.receiveTick = function (dt) {
        var targetDx = __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_targetDx).call(this);
        var delta;
        switch (__classPrivateFieldGet(this, _Drawer_location, "f")) {
            case 'top':
            case 'bottom':
                delta = (targetDx > __classPrivateFieldGet(this, _Drawer_currentDx, "f") ? 0.05 : -0.05) * dt;
                break;
            case 'left':
            case 'right':
                delta = (targetDx > __classPrivateFieldGet(this, _Drawer_currentDx, "f") ? 0.2 : -0.2) * dt;
                break;
        }
        var target;
        switch (__classPrivateFieldGet(this, _Drawer_location, "f")) {
            case 'top':
            case 'bottom':
                target = __classPrivateFieldGet(this, _Drawer_drawerSize, "f").height;
                break;
            case 'left':
            case 'right':
                target = __classPrivateFieldGet(this, _Drawer_drawerSize, "f").width;
                break;
        }
        var nextDx = Math.max(0, Math.min(target, __classPrivateFieldGet(this, _Drawer_currentDx, "f") + delta));
        if (nextDx !== __classPrivateFieldGet(this, _Drawer_currentDx, "f")) {
            __classPrivateFieldSet(this, _Drawer_currentDx, nextDx, "f");
            return true;
        }
        return false;
    };
    Drawer.prototype.receiveMouse = function (event, system) {
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_setIsOpen).call(this, !__classPrivateFieldGet(this, _Drawer_isOpen, "f"), true);
        }
    };
    Drawer.prototype.childTheme = function (view) {
        var _a, _b;
        if (view === this.drawerView) {
            return this.theme;
        }
        return (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.childTheme(this)) !== null && _b !== void 0 ? _b : Theme_1.Theme.plain;
    };
    Drawer.prototype.render = function (viewport) {
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        if (__classPrivateFieldGet(this, _Drawer_currentDx, "f") !== __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_targetDx).call(this)) {
            viewport.registerTick();
        }
        var drawerSize = __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_saveDrawerSize).call(this, viewport.contentSize)[0];
        var _uiStyle = this.theme.ui({
            isHover: this.isHover,
            isPressed: this.isPressed,
        });
        var textStyle = this.theme
            .text({
            isHover: this.isHover,
            isPressed: this.isPressed,
        })
            .merge({ foreground: _uiStyle.foreground });
        var uiStyle = this.isHover || this.isPressed
            ? _uiStyle
            : _uiStyle.merge({
                background: textStyle.background,
            });
        switch (__classPrivateFieldGet(this, _Drawer_location, "f")) {
            case 'top':
                __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderTop).call(this, viewport, drawerSize, uiStyle, textStyle);
                break;
            case 'right':
                __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderRight).call(this, viewport, drawerSize, uiStyle, textStyle);
                break;
            case 'bottom':
                __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderBottom).call(this, viewport, drawerSize, uiStyle, textStyle);
                break;
            case 'left':
                __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderLeft).call(this, viewport, drawerSize, uiStyle, textStyle);
                break;
        }
    };
    return Drawer;
}(Container_1.Container));
exports.Drawer = Drawer;
_Drawer_drawerSize = new WeakMap(), _Drawer_isOpen = new WeakMap(), _Drawer_currentDx = new WeakMap(), _Drawer_location = new WeakMap(), _Drawer_onToggle = new WeakMap(), _Drawer_instances = new WeakSet(), _Drawer_update = function _Drawer_update(_a) {
    var isOpen = _a.isOpen, location = _a.location, onToggle = _a.onToggle;
    if (isOpen !== undefined) {
        __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_setIsOpen).call(this, isOpen, false);
    }
    __classPrivateFieldSet(this, _Drawer_onToggle, onToggle, "f");
    __classPrivateFieldSet(this, _Drawer_location, location !== null && location !== void 0 ? location : 'left', "f");
}, _Drawer_setIsOpen = function _Drawer_setIsOpen(value, report) {
    var _a;
    __classPrivateFieldSet(this, _Drawer_isOpen, value, "f");
    if (report) {
        (_a = __classPrivateFieldGet(this, _Drawer_onToggle, "f")) === null || _a === void 0 ? void 0 : _a.call(this, value);
    }
}, _Drawer_targetDx = function _Drawer_targetDx() {
    switch (__classPrivateFieldGet(this, _Drawer_isOpen, "f") ? __classPrivateFieldGet(this, _Drawer_location, "f") : '') {
        case 'top':
        case 'bottom':
            return __classPrivateFieldGet(this, _Drawer_drawerSize, "f").height;
        case 'left':
        case 'right':
            return __classPrivateFieldGet(this, _Drawer_drawerSize, "f").width;
        default:
            return 0;
    }
}, _Drawer_saveDrawerSize = function _Drawer_saveDrawerSize(available) {
    var _a, _b, _c, _d;
    var remainingSize;
    switch (__classPrivateFieldGet(this, _Drawer_location, "f")) {
        case 'top':
        case 'bottom':
            remainingSize = available.shrink(0, DRAWER_BTN_SIZE.horizontal.height);
            break;
        case 'left':
        case 'right':
            remainingSize = available.shrink(DRAWER_BTN_SIZE.vertical.width, 0);
            break;
    }
    var drawerSize = (_b = (_a = this.drawerView) === null || _a === void 0 ? void 0 : _a.naturalSize(remainingSize)) !== null && _b !== void 0 ? _b : geometry_1.Size.zero;
    var contentSize = (_d = (_c = this.contentView) === null || _c === void 0 ? void 0 : _c.naturalSize(remainingSize)) !== null && _d !== void 0 ? _d : geometry_1.Size.zero;
    __classPrivateFieldSet(this, _Drawer_drawerSize, drawerSize, "f");
    return [drawerSize, contentSize];
}, _Drawer_renderTop = function _Drawer_renderTop(viewport, drawerSize, uiStyle, textStyle) {
    var drawerButtonRect = new geometry_1.Rect(new geometry_1.Point(0, ~~__classPrivateFieldGet(this, _Drawer_currentDx, "f")), new geometry_1.Size(viewport.contentSize.width, DRAWER_BTN_SIZE.horizontal.height));
    var contentRect = new geometry_1.Rect(new geometry_1.Point(0, DRAWER_BTN_SIZE.horizontal.height - 1), viewport.contentSize.shrink(0, DRAWER_BTN_SIZE.horizontal.height - 1));
    var drawerRect = new geometry_1.Rect(new geometry_1.Point(1, ~~__classPrivateFieldGet(this, _Drawer_currentDx, "f") - __classPrivateFieldGet(this, _Drawer_drawerSize, "f").height), new geometry_1.Size(drawerButtonRect.size.width - DRAWER_BORDER, __classPrivateFieldGet(this, _Drawer_drawerSize, "f").height));
    __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderContent).call(this, viewport, drawerButtonRect, contentRect, drawerRect);
    __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderDrawerTop).call(this, viewport, drawerButtonRect, uiStyle, textStyle);
}, _Drawer_renderBottom = function _Drawer_renderBottom(viewport, drawerSize, uiStyle, textStyle) {
    var drawerButtonRect = new geometry_1.Rect(new geometry_1.Point(0, viewport.contentSize.height -
        ~~__classPrivateFieldGet(this, _Drawer_currentDx, "f") -
        DRAWER_BTN_SIZE.horizontal.height), new geometry_1.Size(viewport.contentSize.width, DRAWER_BTN_SIZE.horizontal.height));
    var contentRect = new geometry_1.Rect(new geometry_1.Point(0, 0), viewport.contentSize.shrink(0, DRAWER_BTN_SIZE.horizontal.height - 1));
    var drawerRect = new geometry_1.Rect(new geometry_1.Point(1, viewport.contentSize.height - __classPrivateFieldGet(this, _Drawer_currentDx, "f")), new geometry_1.Size(drawerButtonRect.size.width - DRAWER_BORDER, __classPrivateFieldGet(this, _Drawer_drawerSize, "f").height));
    __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderContent).call(this, viewport, drawerButtonRect, contentRect, drawerRect);
    __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderDrawerBottom).call(this, viewport, drawerButtonRect, uiStyle, textStyle);
}, _Drawer_renderRight = function _Drawer_renderRight(viewport, drawerSize, uiStyle, textStyle) {
    var drawerButtonRect = new geometry_1.Rect(new geometry_1.Point(viewport.contentSize.width -
        ~~__classPrivateFieldGet(this, _Drawer_currentDx, "f") -
        DRAWER_BTN_SIZE.vertical.width, 0), new geometry_1.Size(DRAWER_BTN_SIZE.vertical.width, viewport.contentSize.height));
    var contentRect = new geometry_1.Rect(new geometry_1.Point(0, 0), viewport.contentSize.shrink(DRAWER_BTN_SIZE.vertical.width - 1, 0));
    var drawerRect = new geometry_1.Rect(new geometry_1.Point(viewport.contentSize.width - __classPrivateFieldGet(this, _Drawer_currentDx, "f"), 1), new geometry_1.Size(__classPrivateFieldGet(this, _Drawer_drawerSize, "f").width, drawerButtonRect.size.height - DRAWER_BORDER));
    __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderContent).call(this, viewport, drawerButtonRect, contentRect, drawerRect);
    __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderDrawerRight).call(this, viewport, drawerButtonRect, uiStyle, textStyle);
}, _Drawer_renderLeft = function _Drawer_renderLeft(viewport, drawerSize, uiStyle, textStyle) {
    var drawerButtonRect = new geometry_1.Rect(new geometry_1.Point(~~__classPrivateFieldGet(this, _Drawer_currentDx, "f"), 0), new geometry_1.Size(DRAWER_BTN_SIZE.vertical.width, viewport.contentSize.height));
    var contentRect = new geometry_1.Rect(new geometry_1.Point(DRAWER_BTN_SIZE.vertical.width - 1, 0), viewport.contentSize.shrink(DRAWER_BTN_SIZE.vertical.width - 1, 0));
    var drawerRect = new geometry_1.Rect(new geometry_1.Point(__classPrivateFieldGet(this, _Drawer_currentDx, "f") - __classPrivateFieldGet(this, _Drawer_drawerSize, "f").width, 1), new geometry_1.Size(__classPrivateFieldGet(this, _Drawer_drawerSize, "f").width, drawerButtonRect.size.height - DRAWER_BORDER));
    __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderContent).call(this, viewport, drawerButtonRect, contentRect, drawerRect);
    __classPrivateFieldGet(this, _Drawer_instances, "m", _Drawer_renderDrawerLeft).call(this, viewport, drawerButtonRect, uiStyle, textStyle);
}, _Drawer_renderContent = function _Drawer_renderContent(viewport, drawerButtonRect, contentRect, drawerRect) {
    var _a;
    // contentView renders before registerMouse so the drawer can be "on top"
    var contentView = this.contentView;
    var drawerView = this.drawerView;
    if (!contentView || !drawerView) {
        return;
    }
    viewport.clipped(contentRect, function (inside) {
        contentView.render(inside);
    });
    if (this.isHover) {
        viewport.registerMouse(['mouse.move', 'mouse.button.left'], drawerButtonRect);
    }
    else {
        var inset = void 0;
        switch (__classPrivateFieldGet(this, _Drawer_location, "f")) {
            case 'top':
                inset = 'bottom';
                break;
            case 'right':
                inset = 'left';
                break;
            case 'bottom':
                inset = 'top';
                break;
            case 'left':
                inset = 'right';
                break;
        }
        viewport.registerMouse(['mouse.move', 'mouse.button.left'], drawerButtonRect.inset((_a = {}, _a[inset] = 1, _a)));
    }
    if (__classPrivateFieldGet(this, _Drawer_currentDx, "f") > 0) {
        viewport.paint(this.theme.text(), drawerRect);
        viewport.clipped(drawerRect, function (inside) {
            drawerView.render(inside);
        });
    }
}, _Drawer_renderDrawerTop = function _Drawer_renderDrawerTop(viewport, drawerButtonRect, uiStyle, textStyle) {
    var _this = this;
    var drawerY = drawerButtonRect.minY(), minX = drawerButtonRect.minX(), maxX = drawerButtonRect.maxX() - 1, point = new geometry_1.Point(0, 0).mutableCopy();
    viewport.usingPen(textStyle, function () {
        for (; point.y < drawerY; point.y++) {
            point.x = minX;
            viewport.write('│', point);
            point.x = maxX;
            viewport.write('│', point);
        }
    });
    viewport.usingPen(uiStyle, function () {
        point.y = drawerButtonRect.minY();
        for (point.x = minX; point.x <= maxX; point.x++) {
            var drawer = void 0;
            if (point.x === 0) {
                if (_this.isHover) {
                    drawer = ['╮', '│', '│'];
                }
                else {
                    drawer = ['╮', '│', ''];
                }
            }
            else if (point.x === maxX) {
                if (_this.isHover) {
                    drawer = ['╭', '│', '│'];
                }
                else {
                    drawer = ['╭', '│', ''];
                }
            }
            else {
                var chevron = void 0;
                if (point.x % 2 === 0) {
                    chevron = ' ';
                }
                else if (__classPrivateFieldGet(_this, _Drawer_isOpen, "f")) {
                    chevron = '∧';
                }
                else {
                    chevron = '∨';
                }
                var c1 = void 0, c2 = void 0, c3 = void 0;
                if (_this.isHover) {
                    c1 = ' ';
                    c2 = chevron;
                    c3 = '─';
                }
                else {
                    c1 = chevron;
                    c2 = '─';
                    c3 = '';
                }
                drawer = [c1, c2, c3];
            }
            viewport.write(drawer[0], point.offset(0, 0));
            viewport.write(drawer[1], point.offset(0, 1));
            if (drawer[2] !== '') {
                viewport.write(drawer[2], point.offset(0, 2));
            }
        }
    });
}, _Drawer_renderDrawerBottom = function _Drawer_renderDrawerBottom(viewport, drawerButtonRect, uiStyle, textStyle) {
    var _this = this;
    var drawerY = drawerButtonRect.maxY(), minX = drawerButtonRect.minX(), maxX = drawerButtonRect.maxX() - 1, point = new geometry_1.Point(0, drawerY).mutableCopy();
    viewport.usingPen(textStyle, function () {
        for (; point.y < viewport.contentSize.height; point.y++) {
            point.x = minX;
            viewport.write('│', point);
            point.x = maxX;
            viewport.write('│', point);
        }
    });
    viewport.usingPen(uiStyle, function () {
        point.y = drawerButtonRect.minY();
        for (point.x = minX; point.x <= maxX; point.x++) {
            var drawer = void 0;
            if (point.x === 0) {
                if (_this.isHover) {
                    drawer = ['╭', '│', '│'];
                }
                else {
                    drawer = ['', '╭', '│'];
                }
            }
            else if (point.x === maxX) {
                if (_this.isHover) {
                    drawer = ['╮', '│', '│'];
                }
                else {
                    drawer = ['', '╮', '│'];
                }
            }
            else {
                var chevron = void 0;
                if (point.x % 2 === 0) {
                    chevron = ' ';
                }
                else if (__classPrivateFieldGet(_this, _Drawer_isOpen, "f")) {
                    chevron = '∨';
                }
                else {
                    chevron = '∧';
                }
                var c1 = void 0, c2 = void 0, c3 = void 0;
                if (_this.isHover) {
                    c1 = '─';
                    c2 = chevron;
                    c3 = ' ';
                }
                else {
                    c1 = '';
                    c2 = '─';
                    c3 = chevron;
                }
                drawer = [c1, c2, c3];
            }
            if (drawer[0] !== '') {
                viewport.write(drawer[0], point.offset(0, 0));
            }
            viewport.write(drawer[1], point.offset(0, 1));
            viewport.write(drawer[2], point.offset(0, 2));
        }
    });
}, _Drawer_renderDrawerRight = function _Drawer_renderDrawerRight(viewport, drawerButtonRect, uiStyle, textStyle) {
    var _this = this;
    var drawerX = drawerButtonRect.maxX(), minY = drawerButtonRect.minY(), maxY = drawerButtonRect.maxY() - 1, point = new geometry_1.Point(drawerX, 0).mutableCopy();
    viewport.usingPen(textStyle, function () {
        for (; point.x < viewport.contentSize.width; point.x++) {
            point.y = minY;
            viewport.write('─', point);
            point.y = maxY;
            viewport.write('─', point);
        }
    });
    viewport.usingPen(uiStyle, function () {
        for (point.y = minY; point.y <= maxY; point.y++) {
            point.x = drawerButtonRect.minX();
            var drawer = void 0;
            if (point.y === 0) {
                if (_this.isHover) {
                    drawer = '╭──';
                }
                else {
                    drawer = '╭─';
                    point.x += 1;
                }
            }
            else if (point.y === maxY) {
                if (_this.isHover) {
                    drawer = '╰──';
                }
                else {
                    drawer = '╰─';
                    point.x += 1;
                }
            }
            else {
                drawer = '';
                if (!_this.isHover) {
                    point.x += 1;
                }
                drawer += '│';
                drawer += __classPrivateFieldGet(_this, _Drawer_isOpen, "f") ? '›' : '‹';
            }
            viewport.write(drawer, point);
        }
    });
}, _Drawer_renderDrawerLeft = function _Drawer_renderDrawerLeft(viewport, drawerButtonRect, uiStyle, textStyle) {
    var _this = this;
    var drawerX = drawerButtonRect.minX(), minY = drawerButtonRect.minY(), maxY = drawerButtonRect.maxY() - 1, point = new geometry_1.Point(0, 0).mutableCopy();
    viewport.usingPen(textStyle, function () {
        for (; point.x < drawerX; point.x++) {
            point.y = minY;
            viewport.write('─', point);
            point.y = maxY;
            viewport.write('─', point);
        }
    });
    viewport.usingPen(uiStyle, function () {
        point.x = drawerX;
        for (point.y = minY; point.y <= maxY; point.y++) {
            var drawer = void 0;
            if (point.y === 0) {
                drawer = '─' + (_this.isHover ? '─' : '') + '╮';
            }
            else if (point.y === maxY) {
                drawer = '─' + (_this.isHover ? '─' : '') + '╯';
            }
            else {
                drawer = '';
                drawer += _this.isHover ? ' ' : '';
                drawer += __classPrivateFieldGet(_this, _Drawer_isOpen, "f") ? '‹' : '›';
                drawer += '│';
            }
            viewport.write(drawer, point);
        }
    });
};
