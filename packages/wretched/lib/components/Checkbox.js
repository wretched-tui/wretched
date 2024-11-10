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
var _Checkbox_instances, _Checkbox_value, _Checkbox_hotKey, _Checkbox_onChange, _Checkbox_textView, _Checkbox_contentView, _Checkbox_update;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Radio = exports.Checkbox = void 0;
var sys_1 = require("../sys");
var Container_1 = require("../Container");
var Text_1 = require("./Text");
var geometry_1 = require("../geometry");
var events_1 = require("../events");
var UI_1 = require("../UI");
var Checkbox = /** @class */ (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox(props) {
        var _this = _super.call(this, props) || this;
        _Checkbox_instances.add(_this);
        _Checkbox_value.set(_this, false);
        _Checkbox_hotKey.set(_this, void 0);
        _Checkbox_onChange.set(_this, void 0);
        _Checkbox_textView.set(_this, void 0);
        _Checkbox_contentView.set(_this, void 0);
        __classPrivateFieldSet(_this, _Checkbox_textView, new Text_1.Text({ alignment: 'center' }), "f");
        _this.add(__classPrivateFieldGet(_this, _Checkbox_textView, "f"));
        __classPrivateFieldGet(_this, _Checkbox_instances, "m", _Checkbox_update).call(_this, props);
        return _this;
    }
    Object.defineProperty(Checkbox.prototype, "value", {
        get: function () {
            return __classPrivateFieldGet(this, _Checkbox_value, "f");
        },
        set: function (value) {
            if (value === __classPrivateFieldGet(this, _Checkbox_value, "f")) {
                return;
            }
            __classPrivateFieldSet(this, _Checkbox_value, value, "f");
            this.invalidateRender();
        },
        enumerable: false,
        configurable: true
    });
    Checkbox.prototype.childTheme = function (view) {
        return (0, UI_1.childTheme)(_super.prototype.childTheme.call(this, view), this.isPressed, this.isHover);
    };
    Checkbox.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Checkbox_instances, "m", _Checkbox_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Object.defineProperty(Checkbox.prototype, "text", {
        get: function () {
            var _a;
            return (_a = __classPrivateFieldGet(this, _Checkbox_textView, "f")) === null || _a === void 0 ? void 0 : _a.text;
        },
        set: function (value) {
            var styledText = __classPrivateFieldGet(this, _Checkbox_hotKey, "f")
                ? (0, events_1.styleTextForHotKey)(value !== null && value !== void 0 ? value : '', __classPrivateFieldGet(this, _Checkbox_hotKey, "f"))
                : value;
            __classPrivateFieldGet(this, _Checkbox_textView, "f").text = styledText !== null && styledText !== void 0 ? styledText : '';
            this.invalidateSize();
        },
        enumerable: false,
        configurable: true
    });
    Checkbox.prototype.naturalSize = function (available) {
        return _super.prototype.naturalSize.call(this, available).grow(BOX_WIDTH, 0);
    };
    Checkbox.prototype.receiveMouse = function (event, system) {
        var _a;
        _super.prototype.receiveMouse.call(this, event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            __classPrivateFieldSet(this, _Checkbox_value, !__classPrivateFieldGet(this, _Checkbox_value, "f"), "f");
            (_a = __classPrivateFieldGet(this, _Checkbox_onChange, "f")) === null || _a === void 0 ? void 0 : _a.call(this, __classPrivateFieldGet(this, _Checkbox_value, "f"));
        }
    };
    Checkbox.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        var uiStyle = this.theme.ui({
            isPressed: this.isPressed,
            isHover: this.isHover,
        });
        viewport.paint(uiStyle);
        var boxWidth = BOX_WIDTH;
        var naturalSize = _super.prototype.naturalSize.call(this, viewport.contentSize.shrink(boxWidth, 0));
        var offset = new geometry_1.Point(boxWidth, Math.round((viewport.contentSize.height - naturalSize.height) / 2));
        var box = this.boxChars()[__classPrivateFieldGet(this, _Checkbox_value, "f") ? 'checked' : 'unchecked'];
        viewport.write(box, geometry_1.Point.zero, uiStyle);
        viewport.clipped(new geometry_1.Rect(offset, naturalSize), uiStyle, function (inside) {
            _super.prototype.render.call(_this, inside);
        });
    };
    Checkbox.prototype.boxChars = function () {
        return BOX.checkbox;
    };
    return Checkbox;
}(Container_1.Container));
exports.Checkbox = Checkbox;
_Checkbox_value = new WeakMap(), _Checkbox_hotKey = new WeakMap(), _Checkbox_onChange = new WeakMap(), _Checkbox_textView = new WeakMap(), _Checkbox_contentView = new WeakMap(), _Checkbox_instances = new WeakSet(), _Checkbox_update = function _Checkbox_update(_a) {
    var text = _a.text, hotKey = _a.hotKey, value = _a.value, onChange = _a.onChange;
    var styledText = hotKey ? (0, events_1.styleTextForHotKey)(text !== null && text !== void 0 ? text : '', hotKey) : text;
    __classPrivateFieldGet(this, _Checkbox_textView, "f").text = styledText !== null && styledText !== void 0 ? styledText : '';
    __classPrivateFieldSet(this, _Checkbox_value, value, "f");
    __classPrivateFieldSet(this, _Checkbox_hotKey, hotKey, "f");
    __classPrivateFieldSet(this, _Checkbox_onChange, onChange, "f");
};
var Radio = /** @class */ (function (_super) {
    __extends(Radio, _super);
    function Radio() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Radio.prototype.boxChars = function () {
        return BOX.radio;
    };
    return Radio;
}(Checkbox));
exports.Radio = Radio;
var BOX = {
    checkbox: {
        unchecked: '☐ ',
        checked: '☑ ',
    },
    radio: {
        unchecked: '◯ ',
        checked: '⦿ ',
    },
};
var BOX_WIDTH = sys_1.unicode.lineWidth(BOX.checkbox.unchecked);
