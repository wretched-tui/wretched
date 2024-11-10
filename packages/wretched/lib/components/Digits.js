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
var _Digits_instances, _Digits_text, _Digits_digits, _Digits_bold, _Digits_style, _Digits_update, _Digits_updateNumber;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Digits = void 0;
var View_1 = require("../View");
var geometry_1 = require("../geometry");
var util_1 = require("../util");
var Digits = /** @class */ (function (_super) {
    __extends(Digits, _super);
    function Digits(props) {
        var _this = _super.call(this, props) || this;
        _Digits_instances.add(_this);
        _Digits_text.set(_this, '');
        _Digits_digits.set(_this, []);
        _Digits_bold.set(_this, false);
        _Digits_style.set(_this, void 0);
        __classPrivateFieldGet(_this, _Digits_instances, "m", _Digits_update).call(_this, props);
        (0, util_1.define)(_this, 'text', { enumerable: true });
        return _this;
    }
    Object.defineProperty(Digits.prototype, "text", {
        get: function () {
            return __classPrivateFieldGet(this, _Digits_text, "f");
        },
        set: function (value) {
            __classPrivateFieldGet(this, _Digits_instances, "m", _Digits_updateNumber).call(this, value);
        },
        enumerable: false,
        configurable: true
    });
    Digits.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Digits_instances, "m", _Digits_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Digits.prototype.naturalSize = function () {
        var _a = __classPrivateFieldGet(this, _Digits_digits, "f").reduce(function (_a, digit) {
            var maxWidth = _a[0], totalHeight = _a[1], currentWidth = _a[2];
            if (digit === '\n') {
                return [maxWidth, totalHeight + 3, 0];
            }
            var w = digit[0];
            var nextWidth = currentWidth + w;
            return [Math.max(maxWidth, nextWidth), totalHeight, nextWidth];
        }, [0, 3, 0]), width = _a[0], height = _a[1];
        return new geometry_1.Size(width, height);
    };
    Digits.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return;
        }
        viewport.usingPen(__classPrivateFieldGet(this, _Digits_style, "f"), function () {
            var point = new geometry_1.Point(0, 0).mutableCopy();
            for (var _i = 0, _a = __classPrivateFieldGet(_this, _Digits_digits, "f"); _i < _a.length; _i++) {
                var digit = _a[_i];
                if (digit === '\n') {
                    point.x = 0;
                    point.y += 3;
                    continue;
                }
                var width = digit[0], lines = digit.slice(1);
                var y = 0;
                for (var _b = 0, lines_1 = lines; _b < lines_1.length; _b++) {
                    var line = lines_1[_b];
                    viewport.write(line, point.offset(0, y++));
                }
                point.x += width;
            }
        });
    };
    return Digits;
}(View_1.View));
exports.Digits = Digits;
_Digits_text = new WeakMap(), _Digits_digits = new WeakMap(), _Digits_bold = new WeakMap(), _Digits_style = new WeakMap(), _Digits_instances = new WeakSet(), _Digits_update = function _Digits_update(_a) {
    var text = _a.text, style = _a.style, bold = _a.bold;
    __classPrivateFieldSet(this, _Digits_style, style, "f");
    __classPrivateFieldSet(this, _Digits_bold, bold !== null && bold !== void 0 ? bold : false, "f");
    __classPrivateFieldGet(this, _Digits_instances, "m", _Digits_updateNumber).call(this, String(text));
}, _Digits_updateNumber = function _Digits_updateNumber(value) {
    var _this = this;
    var filtered = '';
    __classPrivateFieldSet(this, _Digits_digits, value.split('').flatMap(function (c) {
        var upper = c.toUpperCase();
        var digits = __classPrivateFieldGet(_this, _Digits_bold, "f") ? DIGITS_BOLD : DIGITS;
        if (c === '\n') {
            filtered += c;
            return [c];
        }
        else if (digits[c]) {
            filtered += c;
            return [digits[c]];
        }
        else if (digits[upper]) {
            filtered += upper;
            return [digits[upper]];
        }
        else {
            return [];
        }
    }), "f");
    __classPrivateFieldSet(this, _Digits_text, filtered, "f");
};
// prettier-ignore
var DIGITS_BOLD = {
    A: [
        3, // width
        '┏━┓',
        '┣━┫',
        '╹ ╹',
    ],
    B: [
        3,
        '┳━┓',
        '┣━┫',
        '┻━┛',
    ],
    C: [
        3,
        '┏━╸',
        '┃  ',
        '┗━╸',
    ],
    D: [
        3,
        '┳━┓',
        '┃ ┃',
        '┻━┛',
    ],
    E: [
        3,
        '┏━╸',
        '┣━ ',
        '┗━╸',
    ],
    F: [
        3,
        '┏━╸',
        '┣━ ',
        '╹  ',
    ],
    G: [
        3,
        '┏━╸',
        '┃╺┓',
        '┗━┛',
    ],
    H: [
        3,
        '╻ ╻',
        '┣━┫',
        '╹ ╹',
    ],
    I: [
        1,
        '┳',
        '┃',
        '┻',
    ],
    J: [
        2,
        ' ┳',
        ' ┃',
        '┗┛',
    ],
    K: [
        2,
        '╻▗',
        '┣▌',
        '╹▝',
    ],
    L: [
        3,
        '╻  ',
        '┃  ',
        '┗━╸',
    ],
    M: [
        3,
        '┏┳┓',
        '┃╹┃',
        '╹ ╹',
    ],
    N: [
        3,
        '┏┓╻',
        '┃┗┫',
        '╹ ╹',
    ],
    O: [
        3,
        '┏━┓',
        '┃ ┃',
        '┗━┛',
    ],
    P: [
        3,
        '┏━┓',
        '┣━┛',
        '╹',
    ],
    Q: [
        3,
        '┏━┓',
        '┃ ┃',
        '┗╋┛',
    ],
    R: [
        3,
        '┏━┓',
        '┣┳┛',
        '╹┗╸',
    ],
    S: [
        3,
        '┏━┓',
        '┗━┓',
        '┗━┛',
    ],
    T: [
        3,
        '╺┳╸',
        ' ┃ ',
        ' ╹ ',
    ],
    U: [
        3,
        '╻ ╻',
        '┃ ┃',
        '┗━┛',
    ],
    V: [
        4,
        '▗  ▗',
        ' ▚▗▘',
        '  ▘ ',
    ],
    W: [
        5,
        '▗   ▗',
        ' ▚▗▗▘',
        '  ▘▘ ',
    ],
    X: [
        3,
        '▗ ▗',
        ' ▚▘',
        '▗▘▚',
    ],
    Y: [
        3,
        '▗ ▗',
        ' ▚▘',
        ' ▐',
    ],
    Z: [
        3,
        '╺━┓',
        ' ▞',
        '┗━╸',
    ],
    '0': [
        3,
        '┏━┓',
        '┃▞┃',
        '┗━┛',
    ],
    '1': [
        3,
        ' ┓ ',
        ' ┃ ',
        '╺┻╸',
    ],
    '2': [
        3,
        '╺━┓',
        '┏━┛',
        '┗━╸',
    ],
    '3': [
        3,
        '╺━┓',
        ' ━┫',
        '╺━┛',
    ],
    '4': [
        3,
        '╻ ╻',
        '┗━┫',
        '  ╹',
    ],
    '5': [
        3,
        '┏━╸',
        '┗━┓',
        '╺━┛',
    ],
    '6': [
        3,
        '┏━╸',
        '┣━┓',
        '┗━┛',
    ],
    '7': [
        3,
        '╺━┓',
        '  ┃',
        '  ╹',
    ],
    '8': [
        3,
        '┏━┓',
        '┣━┫',
        '┗━┛',
    ],
    '9': [
        3,
        '┏━┓',
        '┗━┫',
        '╺━┛',
    ],
    '+': [
        2,
        '   ',
        '╺╋╸',
        '   ',
    ],
    '-': [
        2,
        '   ',
        '╺━╸',
        '   ',
    ],
    '*': [
        2,
        '  ',
        '▚▞',
        '▞▚',
    ],
    '/': [
        3,
        ' ● ',
        '╺━╸',
        ' ● ',
    ],
    '^': [
        2,
        '╱╲',
        '  ',
        '  ',
    ],
    '%': [
        3,
        '◦ ╱',
        ' ╱ ',
        '╱ ◦',
    ],
    '=': [
        2,
        '▂▂',
        '▂▂',
        '  ',
    ],
    '#': [
        3,
        '╋╋',
        '╋╋',
        '  ',
    ],
    '!': [
        1,
        '╻',
        '┃',
        '◆',
    ],
    ':': [
        1,
        ' ',
        '╏',
        ' ',
    ],
    '.': [
        1,
        ' ',
        ' ',
        '.',
    ],
    ',': [
        1,
        ' ',
        ' ',
        ',',
    ],
    '(': [1,
        '⎛',
        '⎜',
        '⎝'
    ],
    ')': [1,
        '⎞',
        '⎟',
        '⎠'
    ],
    '[': [1,
        '⎡',
        '⎢',
        '⎣'
    ],
    ']': [1,
        '⎤',
        '⎥',
        '⎦'
    ],
    '{': [1,
        '⎧',
        '⎨',
        '⎩'
    ],
    '}': [1,
        '⎫',
        '⎬',
        '⎭'
    ],
    '⁰': [1,
        '0',
        ' ',
        ' ',
    ],
    '¹': [1,
        '1',
        ' ',
        ' ',
    ],
    '²': [1,
        '2',
        ' ',
        ' ',
    ],
    '³': [1,
        '3',
        ' ',
        ' ',
    ],
    '⁴': [1,
        '4',
        ' ',
        ' ',
    ],
    '⁵': [1,
        '5',
        ' ',
        ' ',
    ],
    '⁶': [1,
        '6',
        ' ',
        ' ',
    ],
    '⁷': [1,
        '7',
        ' ',
        ' ',
    ],
    '⁸': [1,
        '8',
        ' ',
        ' ',
    ],
    '⁹': [1,
        '9',
        ' ',
        ' ',
    ],
    ' ': [
        2,
        '  ',
        '  ',
        '  ',
    ],
};
// prettier-ignore
var DIGITS = {
    A: [
        3, // width
        '╭─╮',
        '├─┤',
        '╵ ╵',
    ],
    B: [
        3,
        '┬─╮',
        '├─┤',
        '┴─╯',
    ],
    C: [
        3,
        '╭─╴',
        '│  ',
        '╰─╴',
    ],
    D: [
        3,
        '┬─╮',
        '│ │',
        '┴─╯',
    ],
    E: [
        3,
        '┌─╴',
        '├─ ',
        '└─╴',
    ],
    F: [
        3,
        '┌─╴',
        '├─ ',
        '╵  ',
    ],
    G: [
        3,
        '╭─╮',
        '│─┐',
        '╰─╯',
    ],
    H: [
        3,
        '╷ ╷',
        '├─┤',
        '╵ ╵',
    ],
    I: [
        1,
        '┬',
        '│',
        '┴',
    ],
    J: [
        2,
        ' ┬',
        ' │',
        '╰╯',
    ],
    K: [
        3,
        '╷ ╷',
        '├┬╯',
        '╵└╴',
    ],
    L: [
        3,
        '╷  ',
        '│  ',
        '╰─╴',
    ],
    M: [
        3,
        '┌┬┐',
        '│╵│',
        '╵ ╵',
    ],
    N: [
        3,
        '╷ ╷',
        '│╲│',
        '╵ ╵',
    ],
    O: [
        3,
        '╭─╮',
        '│ │',
        '╰─╯',
    ],
    P: [
        3,
        '╭─╮',
        '├─╯',
        '╵  ',
    ],
    Q: [
        3,
        '╭─╮',
        '│ │',
        '╰┼╯',
    ],
    R: [
        3,
        '╭─╮',
        '├┬╯',
        '╵└╴',
    ],
    S: [
        3,
        '╭─╮',
        '╰─╮',
        '╰─╯',
    ],
    T: [
        3,
        '╶┬╴',
        ' │ ',
        ' ╵ ',
    ],
    U: [
        3,
        '╷ ╷',
        '│ │',
        '╰─╯',
    ],
    V: [
        3,
        '   ',
        '╲ ╱',
        ' ⋁ ',
    ],
    W: [
        3,
        '╷ ╷',
        '│╷│',
        '└┴┘',
    ],
    X: [
        3,
        '∖ ╱',
        ' ╳ ',
        '╱ ∖',
    ],
    Y: [
        3,
        '╲ ╱',
        ' │',
        ' ╵',
    ],
    Z: [
        3,
        '╶─┐',
        ' ╱ ',
        '└─╴',
    ],
    '0': [
        3,
        '╭─╮',
        '│╱│',
        '╰─╯',
    ],
    '1': [
        3,
        ' ┐ ',
        ' │ ',
        '╶┴╴',
    ],
    '2': [
        3,
        '╶─╮',
        '╭─╯',
        '╰─╴',
    ],
    '3': [
        3,
        '╶─╮',
        ' ─┤',
        '╶─╯',
    ],
    '4': [
        3,
        '╷ ╷',
        '└─┤',
        '  ╵',
    ],
    '5': [
        3,
        '┌─╴',
        '└─╮',
        '╶─╯',
    ],
    '6': [
        3,
        '╭─╴',
        '├─╮',
        '╰─╯',
    ],
    '7': [
        3,
        '╶─┐',
        '  │',
        '  ╵',
    ],
    '8': [
        3,
        '╭─╮',
        '├─┤',
        '╰─╯',
    ],
    '9': [
        3,
        '╭─╮',
        '╰─┤',
        '╶─╯',
    ],
    '+': [
        3,
        '   ',
        '╶┼╴',
        '   ',
    ],
    '-': [
        3,
        '   ',
        '╶─╴',
        '   ',
    ],
    '*': [
        2,
        '  ',
        '╲╱',
        '╱╲',
    ],
    '/': [
        3,
        ' • ',
        '╶─╴',
        ' • ',
    ],
    '^': [
        2,
        '╱╲',
        '  ',
        '  ',
    ],
    '%': [
        3,
        '◦ ╱',
        ' ╱ ',
        '╱ ◦',
    ],
    '=': [
        2,
        '__',
        '__',
        '  ',
    ],
    '#': [
        3,
        '┼┼',
        '┼┼',
        '  ',
    ],
    '!': [
        1,
        '╷',
        '│',
        '◆',
    ],
    ':': [
        1,
        ' ',
        '╏',
        ' ',
    ],
    '.': [
        1,
        ' ',
        ' ',
        '.',
    ],
    ',': [
        1,
        ' ',
        ' ',
        ',',
    ],
    '(': [1,
        '⎛',
        '⎜',
        '⎝'
    ],
    ')': [1,
        '⎞',
        '⎟',
        '⎠'
    ],
    '[': [1,
        '⎡',
        '⎢',
        '⎣'
    ],
    ']': [1,
        '⎤',
        '⎥',
        '⎦'
    ],
    '{': [1,
        '⎧',
        '⎨',
        '⎩'
    ],
    '}': [1,
        '⎫',
        '⎬',
        '⎭'
    ],
    '⁰': [1,
        '0',
        ' ',
        ' ',
    ],
    '¹': [1,
        '1',
        ' ',
        ' ',
    ],
    '²': [1,
        '2',
        ' ',
        ' ',
    ],
    '³': [1,
        '3',
        ' ',
        ' ',
    ],
    '⁴': [1,
        '4',
        ' ',
        ' ',
    ],
    '⁵': [1,
        '5',
        ' ',
        ' ',
    ],
    '⁶': [1,
        '6',
        ' ',
        ' ',
    ],
    '⁷': [1,
        '7',
        ' ',
        ' ',
    ],
    '⁸': [1,
        '8',
        ' ',
        ' ',
    ],
    '⁹': [1,
        '9',
        ' ',
        ' ',
    ],
    ' ': [
        2,
        '  ',
        '  ',
        '  ',
    ],
};
