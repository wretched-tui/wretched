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
var _Button_instances, _Button_hotKey, _Button_onClick, _Button_textView, _Button_border, _Button_align, _Button_update, _Button_borderSize;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var sys_1 = require("../sys");
var Container_1 = require("../Container");
var Text_1 = require("./Text");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var UI_1 = require("../UI");
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(props) {
        var _this = _super.call(this, props) || this;
        _Button_instances.add(_this);
        _Button_hotKey.set(_this, void 0);
        _Button_onClick.set(_this, void 0);
        _Button_textView.set(_this, void 0);
        _Button_border.set(_this, 'default');
        _Button_align.set(_this, 'center');
        __classPrivateFieldSet(_this, _Button_textView, new Text_1.Text({ alignment: 'center' }), "f");
        _this.add(__classPrivateFieldGet(_this, _Button_textView, "f"));
        __classPrivateFieldGet(_this, _Button_instances, "m", _Button_update).call(_this, props);
        return _this;
    }
    Button.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Button.prototype.childTheme = function (view) {
        return (0, UI_1.childTheme)(_super.prototype.childTheme.call(this, view), this.isPressed, this.isHover);
    };
    Button.prototype.naturalSize = function (available) {
        var _a = __classPrivateFieldGet(this, _Button_instances, "m", _Button_borderSize).call(this), left = _a[0], right = _a[1];
        return _super.prototype.naturalSize.call(this, available).grow(left + right, 0);
    };
    Object.defineProperty(Button.prototype, "text", {
        get: function () {
            return __classPrivateFieldGet(this, _Button_textView, "f").text;
        },
        set: function (value) {
            var styledText = __classPrivateFieldGet(this, _Button_hotKey, "f")
                ? (0, events_1.styleTextForHotKey)(value !== null && value !== void 0 ? value : '', __classPrivateFieldGet(this, _Button_hotKey, "f"))
                : (value !== null && value !== void 0 ? value : '');
            __classPrivateFieldGet(this, _Button_textView, "f").text = styledText;
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    Button.prototype.receiveMouse = function (event, system) {
        var _a;
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            (_a = __classPrivateFieldGet(this, _Button_onClick, "f")) === null || _a === void 0 ? void 0 : _a.call(this);
        }
    };
    Button.prototype.receiveKey = function (_) {
        var _a;
        (_a = __classPrivateFieldGet(this, _Button_onClick, "f")) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    Button.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        if (__classPrivateFieldGet(this, _Button_hotKey, "f")) {
            viewport.registerHotKey((0, events_1.toHotKeyDef)(__classPrivateFieldGet(this, _Button_hotKey, "f")));
        }
        var textStyle = this.theme.ui({
            isPressed: this.isPressed,
            isHover: this.isHover,
        });
        var topsStyle = this.theme.ui({
            isPressed: this.isPressed,
            isHover: this.isHover,
            isOrnament: true,
        });
        viewport.visibleRect.forEachPoint(function (pt) {
            if (pt.y === 0 && viewport.contentSize.height > 2) {
                viewport.write('▔', pt, topsStyle);
            }
            else if (pt.y === viewport.contentSize.height - 1 &&
                viewport.contentSize.height > 2) {
                viewport.write('▁', pt, topsStyle);
            }
            else {
                viewport.write(' ', pt, textStyle);
            }
        });
        var _a = __classPrivateFieldGet(this, _Button_instances, "m", _Button_borderSize).call(this), leftWidth = _a[0], rightWidth = _a[1];
        var naturalSize = _super.prototype.naturalSize.call(this, viewport.contentSize.shrink(leftWidth + rightWidth, 0));
        var offsetLeft = __classPrivateFieldGet(this, _Button_align, "f") === 'center'
            ? Math.round((viewport.contentSize.width - naturalSize.width) / 2)
            : __classPrivateFieldGet(this, _Button_align, "f") === 'left'
                ? 1
                : viewport.contentSize.width - naturalSize.width - 1, offset = new geometry_1.Point(offsetLeft, Math.round((viewport.contentSize.height - naturalSize.height) / 2));
        var _b = BORDERS[__classPrivateFieldGet(this, _Button_border, "f")], left = _b[0], right = _b[1], leftX = offset.x - leftWidth, rightX = offset.x + naturalSize.width;
        for (var y = 0; y < naturalSize.height; y++) {
            viewport.write(left, new geometry_1.Point(leftX, offset.y + y), textStyle);
            viewport.write(right, new geometry_1.Point(rightX, offset.y + y), textStyle);
        }
        viewport.clipped(new geometry_1.Rect(offset, naturalSize), function (inside) {
            _super.prototype.render.call(_this, inside);
        });
    };
    return Button;
}(Container_1.Container));
exports.Button = Button;
_Button_hotKey = new WeakMap(), _Button_onClick = new WeakMap(), _Button_textView = new WeakMap(), _Button_border = new WeakMap(), _Button_align = new WeakMap(), _Button_instances = new WeakSet(), _Button_update = function _Button_update(_a) {
    var text = _a.text, border = _a.border, align = _a.align, hotKey = _a.hotKey, onClick = _a.onClick;
    var styledText = hotKey ? (0, events_1.styleTextForHotKey)(text !== null && text !== void 0 ? text : '', hotKey) : text;
    __classPrivateFieldGet(this, _Button_textView, "f").text = styledText !== null && styledText !== void 0 ? styledText : '';
    __classPrivateFieldSet(this, _Button_align, align !== null && align !== void 0 ? align : 'center', "f");
    __classPrivateFieldSet(this, _Button_border, border !== null && border !== void 0 ? border : 'default', "f");
    __classPrivateFieldSet(this, _Button_hotKey, hotKey, "f");
    __classPrivateFieldSet(this, _Button_onClick, onClick, "f");
}, _Button_borderSize = function _Button_borderSize() {
    var _a = BORDERS[__classPrivateFieldGet(this, _Button_border, "f")], left = _a[0], right = _a[1];
    return [sys_1.unicode.lineWidth(left), sys_1.unicode.lineWidth(right)];
};
var BORDERS = {
    default: ['[ ', ' ]'],
    arrows: [' ', ' '],
    none: [' ', ' '],
};
// E0A0 
// E0B0 
