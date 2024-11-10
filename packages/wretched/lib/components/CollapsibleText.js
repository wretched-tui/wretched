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
var _CollapsibleText_instances, _CollapsibleText_lines, _CollapsibleText_style, _CollapsibleText_isCollapsed, _CollapsibleText_update;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleText = void 0;
var sys_1 = require("../sys");
var View_1 = require("../View");
var Style_1 = require("../Style");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var CollapsibleText = /** @class */ (function (_super) {
    __extends(CollapsibleText, _super);
    function CollapsibleText(props) {
        var _this = _super.call(this, props) || this;
        _CollapsibleText_instances.add(_this);
        _CollapsibleText_lines.set(_this, []);
        _CollapsibleText_style.set(_this, void 0);
        _CollapsibleText_isCollapsed.set(_this, true);
        __classPrivateFieldGet(_this, _CollapsibleText_instances, "m", _CollapsibleText_update).call(_this, props);
        return _this;
    }
    CollapsibleText.prototype.update = function (props) {
        __classPrivateFieldGet(this, _CollapsibleText_instances, "m", _CollapsibleText_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Object.defineProperty(CollapsibleText.prototype, "text", {
        get: function () {
            return __classPrivateFieldGet(this, _CollapsibleText_lines, "f").join('\n');
        },
        set: function (value) {
            __classPrivateFieldSet(this, _CollapsibleText_lines, value.split('\n'), "f");
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    CollapsibleText.prototype.naturalSize = function (available) {
        if (__classPrivateFieldGet(this, _CollapsibleText_lines, "f").length === 0) {
            return geometry_1.Size.zero;
        }
        if (__classPrivateFieldGet(this, _CollapsibleText_lines, "f").length === 1) {
            var _a = sys_1.unicode.stringSize(__classPrivateFieldGet(this, _CollapsibleText_lines, "f"), available.width), lineWidth = _a.width, lineHeight = _a.height;
            if (lineWidth <= available.width && lineHeight === 1) {
                return new geometry_1.Size(lineWidth, 1);
            }
            if (__classPrivateFieldGet(this, _CollapsibleText_isCollapsed, "f")) {
                return new geometry_1.Size(lineWidth + 2, 1);
            }
            return new geometry_1.Size(lineWidth + 2, lineHeight);
        }
        if (__classPrivateFieldGet(this, _CollapsibleText_isCollapsed, "f")) {
            var lineWidth = sys_1.unicode.lineWidth(__classPrivateFieldGet(this, _CollapsibleText_lines, "f")[0]);
            return new geometry_1.Size(lineWidth + 2, 1);
        }
        return new geometry_1.Size(sys_1.unicode.stringSize(__classPrivateFieldGet(this, _CollapsibleText_lines, "f"), available.width)).grow(2, 0);
    };
    CollapsibleText.prototype.receiveMouse = function (event, system) {
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            __classPrivateFieldSet(this, _CollapsibleText_isCollapsed, !__classPrivateFieldGet(this, _CollapsibleText_isCollapsed, "f"), "f");
            this.invalidateSize();
        }
    };
    CollapsibleText.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return;
        }
        var lines = __classPrivateFieldGet(this, _CollapsibleText_lines, "f");
        if (!lines.length) {
            return;
        }
        var startingStyle = Style_1.Style.NONE;
        viewport.usingPen(__classPrivateFieldGet(this, _CollapsibleText_style, "f"), function (pen) {
            var _a = sys_1.unicode.stringSize(lines, viewport.contentSize.width), width = _a.width, height = _a.height;
            var point = new geometry_1.Point(0, 0).mutableCopy();
            var offsetX = 0;
            if (viewport.contentSize.width < width || height > 1) {
                viewport.registerMouse('mouse.button.left');
                viewport.write(__classPrivateFieldGet(_this, _CollapsibleText_isCollapsed, "f") ? '► ' : '▼ ', geometry_1.Point.zero, _this.theme.text({ isPressed: _this.isPressed }));
                offsetX = 2;
            }
            point.x = offsetX;
            for (var _i = 0, _b = __classPrivateFieldGet(_this, _CollapsibleText_lines, "f"); _i < _b.length; _i++) {
                var line = _b[_i];
                var didWrap = false;
                for (var _c = 0, _d = sys_1.unicode.printableChars(line); _c < _d.length; _c++) {
                    var char = _d[_c];
                    var width_1 = sys_1.unicode.charWidth(char);
                    if (width_1 === 0) {
                        pen.mergePen(Style_1.Style.fromSGR(char, startingStyle));
                        continue;
                    }
                    if (!__classPrivateFieldGet(_this, _CollapsibleText_isCollapsed, "f") && point.x >= viewport.contentSize.width) {
                        didWrap = true;
                        point.x = offsetX;
                        point.y += 1;
                    }
                    // don't print preceding whitespace after line wrap
                    if (didWrap && char.match(/\s/)) {
                        continue;
                    }
                    didWrap = false;
                    if (point.x >= viewport.visibleRect.minX() &&
                        point.x + width_1 - 1 < viewport.visibleRect.maxX() &&
                        point.y >= viewport.visibleRect.minY()) {
                        viewport.write(char, point);
                    }
                    point.x += width_1;
                }
                point.y += 1;
                if (point.y >= viewport.visibleRect.maxY()) {
                    break;
                }
                point.x = offsetX;
            }
        });
    };
    return CollapsibleText;
}(View_1.View));
exports.CollapsibleText = CollapsibleText;
_CollapsibleText_lines = new WeakMap(), _CollapsibleText_style = new WeakMap(), _CollapsibleText_isCollapsed = new WeakMap(), _CollapsibleText_instances = new WeakSet(), _CollapsibleText_update = function _CollapsibleText_update(_a) {
    var text = _a.text, style = _a.style;
    __classPrivateFieldSet(this, _CollapsibleText_style, style, "f");
    __classPrivateFieldSet(this, _CollapsibleText_lines, text.split('\n'), "f");
};
