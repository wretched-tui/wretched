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
var _Separator_instances, _Separator_direction, _Separator_padding, _Separator_border, _Separator_update;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Separator = void 0;
var View_1 = require("../View");
var geometry_1 = require("../geometry");
var Separator = /** @class */ (function (_super) {
    __extends(Separator, _super);
    function Separator(props) {
        var _this = _super.call(this, props) || this;
        _Separator_instances.add(_this);
        _Separator_direction.set(_this, 'vertical');
        _Separator_padding.set(_this, 0);
        _Separator_border.set(_this, 'single');
        __classPrivateFieldGet(_this, _Separator_instances, "m", _Separator_update).call(_this, props);
        return _this;
    }
    Separator.horizontal = function (props) {
        if (props === void 0) { props = {}; }
        return new Separator(__assign({ direction: 'horizontal' }, props));
    };
    Separator.vertical = function (props) {
        if (props === void 0) { props = {}; }
        return new Separator(__assign({ direction: 'vertical' }, props));
    };
    Separator.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Separator_instances, "m", _Separator_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Separator.prototype.naturalSize = function (available) {
        if (__classPrivateFieldGet(this, _Separator_direction, "f") === 'vertical') {
            return new geometry_1.Size(1 + 2 * __classPrivateFieldGet(this, _Separator_padding, "f"), available.height);
        }
        else {
            return new geometry_1.Size(available.width, 1 + 2 * __classPrivateFieldGet(this, _Separator_padding, "f"));
        }
    };
    Separator.prototype.render = function (viewport) {
        if (viewport.isEmpty) {
            return;
        }
        var style = this.theme.text();
        if (__classPrivateFieldGet(this, _Separator_direction, "f") === 'vertical') {
            var char = BORDERS[__classPrivateFieldGet(this, _Separator_border, "f")][0], minY = viewport.visibleRect.minY(), maxY = viewport.visibleRect.maxY();
            for (var y = minY; y < maxY; ++y) {
                viewport.write(char, new geometry_1.Point(__classPrivateFieldGet(this, _Separator_padding, "f"), y), style);
            }
        }
        else {
            var _a = BORDERS[__classPrivateFieldGet(this, _Separator_border, "f")], char = _a[1];
            var pt = viewport.visibleRect.origin.offset(0, __classPrivateFieldGet(this, _Separator_padding, "f"));
            viewport.write(char.repeat(viewport.visibleRect.size.width), pt, style);
        }
    };
    return Separator;
}(View_1.View));
exports.Separator = Separator;
_Separator_direction = new WeakMap(), _Separator_padding = new WeakMap(), _Separator_border = new WeakMap(), _Separator_instances = new WeakSet(), _Separator_update = function _Separator_update(_a) {
    var direction = _a.direction, padding = _a.padding, border = _a.border;
    __classPrivateFieldSet(this, _Separator_direction, direction, "f");
    __classPrivateFieldSet(this, _Separator_padding, padding !== null && padding !== void 0 ? padding : 0, "f");
    __classPrivateFieldSet(this, _Separator_border, border !== null && border !== void 0 ? border : 'single', "f");
};
var BORDERS = {
    single: ['│', '─'],
    leading: ['▏', '▔'],
    trailing: ['▕', '▁'],
    bold: ['┃', '━'],
    dash: ['╵', '╴'],
    dash2: ['╎', '╌'],
    dash3: ['┆', '┄'],
    dash4: ['┊', '┈'],
    double: ['║', '═'],
};
