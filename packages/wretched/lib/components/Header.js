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
var _Header_text, _Header_style, _Header_border;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
exports.H1 = H1;
exports.H2 = H2;
exports.H3 = H3;
exports.H4 = H4;
exports.H5 = H5;
exports.H6 = H6;
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var Style_1 = require("../Style");
var Text_1 = require("./Text");
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header(_a) {
        var _this = this;
        var bold = _a.bold, dim = _a.dim, text = _a.text, font = _a.font, props = __rest(_a, ["bold", "dim", "text", "font"]);
        _this = _super.call(this, props) || this;
        _Header_text.set(_this, void 0);
        _Header_style.set(_this, void 0);
        _Header_border.set(_this, 'single');
        __classPrivateFieldSet(_this, _Header_border, props.border, "f");
        __classPrivateFieldSet(_this, _Header_style, new Style_1.Style({
            bold: bold,
            dim: dim,
        }), "f");
        __classPrivateFieldSet(_this, _Header_text, new Text_1.Text({
            text: text,
            font: font,
            style: __classPrivateFieldGet(_this, _Header_style, "f"),
            wrap: true,
        }), "f");
        _this.add(__classPrivateFieldGet(_this, _Header_text, "f"));
        return _this;
    }
    Header.prototype.naturalSize = function (available) {
        return __classPrivateFieldGet(this, _Header_text, "f").naturalSize(available).grow(2, 1);
    };
    Header.prototype.render = function (viewport) {
        var _this = this;
        var inside = viewport.contentRect.inset({ left: 1, right: 1, bottom: 1 });
        var textSize = __classPrivateFieldGet(this, _Header_text, "f").naturalSize(inside.size);
        viewport.clipped(inside, function (inside) {
            __classPrivateFieldGet(_this, _Header_text, "f").render(inside);
        });
        var maxWidth = textSize.width + 2;
        var border;
        switch (__classPrivateFieldGet(this, _Header_border, "f")) {
            case 'single':
                border = '─';
                break;
            case 'bold':
                border = '━';
                break;
            case 'double':
                border = '═';
                break;
        }
        viewport.write(border.repeat(maxWidth), new geometry_1.Point(0, textSize.height), __classPrivateFieldGet(this, _Header_style, "f"));
    };
    return Header;
}(Container_1.Container));
exports.Header = Header;
_Header_text = new WeakMap(), _Header_style = new WeakMap(), _Header_border = new WeakMap();
function H1(text) {
    if (text === void 0) { text = ''; }
    return new Header({
        text: text,
        border: 'double',
        font: 'script',
        bold: true,
    });
}
function H2(text) {
    if (text === void 0) { text = ''; }
    return new Header({
        text: text,
        border: 'bold',
        font: 'script',
    });
}
function H3(text) {
    if (text === void 0) { text = ''; }
    return new Header({
        text: text,
        border: 'single',
        font: 'sans-bold',
        bold: true,
    });
}
function H4(text) {
    if (text === void 0) { text = ''; }
    return new Header({
        text: text,
        border: 'single',
        font: 'sans',
    });
}
function H5(text) {
    if (text === void 0) { text = ''; }
    return new Header({
        text: text,
        border: 'single',
        font: 'serif-bold',
        bold: true,
        dim: true,
    });
}
function H6(text) {
    if (text === void 0) { text = ''; }
    return new Header({
        text: text,
        font: 'serif-italic',
        border: 'single',
        dim: true,
    });
}
