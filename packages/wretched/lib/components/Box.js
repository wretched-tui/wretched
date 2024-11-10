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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _Box_instances, _Box_border, _Box_borderChars, _Box_borderSizes, _Box_highlight, _Box_update;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
var sys_1 = require("../sys");
var Container_1 = require("../Container");
var geometry_1 = require("../geometry");
var Style_1 = require("../Style");
var util_1 = require("../util");
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box(props) {
        var _this = _super.call(this, props) || this;
        _Box_instances.add(_this);
        _Box_border.set(_this, 'single');
        _Box_borderChars.set(_this, BORDERS.single);
        _Box_borderSizes.set(_this, BORDER_SIZE_ZERO);
        _Box_highlight.set(_this, false);
        (0, util_1.define)(_this, 'border', { enumerable: true });
        __classPrivateFieldGet(_this, _Box_instances, "m", _Box_update).call(_this, props);
        return _this;
    }
    Object.defineProperty(Box.prototype, "border", {
        get: function () {
            return __classPrivateFieldGet(this, _Box_border, "f");
        },
        set: function (value) {
            var _a;
            var _b, _c;
            __classPrivateFieldSet(this, _Box_border, value, "f");
            _b = this, _c = this, _a = calculateBorder(value), ({ set value(_a) { __classPrivateFieldSet(_b, _Box_borderChars, _a, "f"); } }).value = _a[0], ({ set value(_a) { __classPrivateFieldSet(_c, _Box_borderSizes, _a, "f"); } }).value = _a[1];
        },
        enumerable: false,
        configurable: true
    });
    Box.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Box_instances, "m", _Box_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Box.prototype.naturalSize = function (available) {
        var naturalSize = _super.prototype.naturalSize.call(this, available.shrink(__classPrivateFieldGet(this, _Box_borderSizes, "f").maxLeft + __classPrivateFieldGet(this, _Box_borderSizes, "f").maxRight, __classPrivateFieldGet(this, _Box_borderSizes, "f").maxTop + __classPrivateFieldGet(this, _Box_borderSizes, "f").maxBottom));
        return naturalSize.grow(__classPrivateFieldGet(this, _Box_borderSizes, "f").maxLeft + __classPrivateFieldGet(this, _Box_borderSizes, "f").maxRight, __classPrivateFieldGet(this, _Box_borderSizes, "f").maxTop + __classPrivateFieldGet(this, _Box_borderSizes, "f").maxBottom);
    };
    Box.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return _super.prototype.render.call(this, viewport);
        }
        if (__classPrivateFieldGet(this, _Box_highlight, "f")) {
            viewport.registerMouse('mouse.move');
        }
        var _a = __classPrivateFieldGet(this, _Box_borderChars, "f"), top = _a[0], left = _a[1], tl = _a[2], tr = _a[3], bl = _a[4], br = _a[5], bottom = _a[6], right = _a[7];
        var maxX = viewport.contentSize.width;
        var maxY = viewport.contentSize.height;
        var innerTopWidth = Math.max(0, maxX - __classPrivateFieldGet(this, _Box_borderSizes, "f").topLeft.width - __classPrivateFieldGet(this, _Box_borderSizes, "f").topRight.width);
        var innerBottomWidth = Math.max(0, maxX -
            __classPrivateFieldGet(this, _Box_borderSizes, "f").bottomLeft.width -
            __classPrivateFieldGet(this, _Box_borderSizes, "f").bottomRight.width);
        var innerMiddleWidth = Math.max(0, maxX - __classPrivateFieldGet(this, _Box_borderSizes, "f").maxLeft - __classPrivateFieldGet(this, _Box_borderSizes, "f").maxRight);
        var innerHeight = Math.max(0, maxY - __classPrivateFieldGet(this, _Box_borderSizes, "f").maxTop - __classPrivateFieldGet(this, _Box_borderSizes, "f").maxBottom);
        var leftMaxX = __classPrivateFieldGet(this, _Box_borderSizes, "f").maxLeft;
        var topRightX = __classPrivateFieldGet(this, _Box_borderSizes, "f").topLeft.width + innerTopWidth;
        var bottomRightX = __classPrivateFieldGet(this, _Box_borderSizes, "f").bottomLeft.width + innerBottomWidth;
        var middleRightX = __classPrivateFieldGet(this, _Box_borderSizes, "f").maxLeft + innerMiddleWidth;
        var topInnerY = __classPrivateFieldGet(this, _Box_borderSizes, "f").maxTop;
        var bottomInnerY = __classPrivateFieldGet(this, _Box_borderSizes, "f").maxTop + innerHeight;
        var borderStyle = this.theme.text({ isHover: this.isHover });
        var innerStyle = new Style_1.Style({ background: borderStyle.background });
        var innerOrigin = new geometry_1.Point(__classPrivateFieldGet(this, _Box_borderSizes, "f").maxLeft, __classPrivateFieldGet(this, _Box_borderSizes, "f").maxTop);
        if (innerHeight && innerMiddleWidth) {
            for (var y = 0; y < innerHeight; ++y) {
                var spaces = ' '.repeat(innerMiddleWidth);
                viewport.write(spaces, innerOrigin.offset(0, y), innerStyle);
            }
        }
        viewport.clipped(new geometry_1.Rect(innerOrigin, [innerMiddleWidth, innerHeight]), function (inside) { return _super.prototype.render.call(_this, inside); });
        viewport.usingPen(borderStyle, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var _j = [
                tl.split('\n'),
                top.split('\n'),
                tr.split('\n'),
            ], tlLines = _j[0], topLines = _j[1], trLines = _j[2];
            for (var lineY = 0; lineY < topInnerY; ++lineY) {
                var _k = [
                    (_a = tlLines[lineY]) !== null && _a !== void 0 ? _a : '',
                    (_b = topLines[lineY]) !== null && _b !== void 0 ? _b : '',
                    (_c = trLines[lineY]) !== null && _c !== void 0 ? _c : '',
                ], lineTL = _k[0], lineTop = _k[1], lineTR = _k[2];
                viewport.write(lineTL, new geometry_1.Point(0, lineY));
                if (lineTop.length) {
                    viewport.write(lineTop
                        .repeat(Math.ceil(innerTopWidth / __classPrivateFieldGet(_this, _Box_borderSizes, "f").topMiddle.width))
                        .slice(0, innerTopWidth), new geometry_1.Point(leftMaxX, lineY));
                }
                viewport.write(lineTR, new geometry_1.Point(topRightX, lineY));
            }
            var _l = [left.split('\n'), right.split('\n')], leftLines = _l[0], rightLines = _l[1];
            for (var lineY = topInnerY; lineY < bottomInnerY; ++lineY) {
                var _m = [
                    (_d = leftLines[(lineY - topInnerY) % leftLines.length]) !== null && _d !== void 0 ? _d : '',
                    (_e = rightLines[(lineY - topInnerY) % rightLines.length]) !== null && _e !== void 0 ? _e : '',
                ], lineL = _m[0], lineR = _m[1];
                viewport.write(lineL, new geometry_1.Point(0, lineY));
                viewport.write(lineR, new geometry_1.Point(middleRightX, lineY));
            }
            var _o = [
                bl.split('\n'),
                bottom.split('\n'),
                br.split('\n'),
            ], blLines = _o[0], bottomLines = _o[1], brLines = _o[2];
            for (var lineY = bottomInnerY; lineY < maxY; ++lineY) {
                var _p = [
                    (_f = blLines[lineY - bottomInnerY]) !== null && _f !== void 0 ? _f : '',
                    (_g = bottomLines[lineY - bottomInnerY]) !== null && _g !== void 0 ? _g : '',
                    (_h = brLines[lineY - bottomInnerY]) !== null && _h !== void 0 ? _h : '',
                ], lineBL = _p[0], lineBottom = _p[1], lineBR = _p[2];
                viewport.write(lineBL, new geometry_1.Point(0, lineY));
                if (lineBottom.length) {
                    viewport.write(lineBottom
                        .repeat(Math.ceil(innerBottomWidth / __classPrivateFieldGet(_this, _Box_borderSizes, "f").topMiddle.width))
                        .slice(0, innerBottomWidth), new geometry_1.Point(leftMaxX, lineY));
                }
                viewport.write(lineBR, new geometry_1.Point(bottomRightX, lineY));
            }
        });
    };
    return Box;
}(Container_1.Container));
exports.Box = Box;
_Box_border = new WeakMap(), _Box_borderChars = new WeakMap(), _Box_borderSizes = new WeakMap(), _Box_highlight = new WeakMap(), _Box_instances = new WeakSet(), _Box_update = function _Box_update(_a) {
    var highlight = _a.highlight, border = _a.border;
    __classPrivateFieldSet(this, _Box_highlight, highlight !== null && highlight !== void 0 ? highlight : false, "f");
    this.border = border !== null && border !== void 0 ? border : 'single';
};
function calculateBorder(border) {
    var chars;
    if (typeof border === 'string') {
        chars = BORDERS[border];
    }
    else if (border.length === 8) {
        chars = border;
    }
    else if (border.length === 7) {
        chars = __spreadArray(__spreadArray([], border, true), [border[1]], false);
    }
    else {
        chars = __spreadArray(__spreadArray([], border, true), [border[0], border[1]], false);
    }
    // TLTL\n| TOP TOP\n|TRTR\n
    // TL   2| TOP     0|TR  3
    // ------+----------+----
    // LEFT\n|          |RIGHT\n
    // LEFT 1|          |RIGHT 7
    // ------+----------+----
    // BLBL\n| BOTTOM\n |BRBR\n
    // BL  5 | BOTTOM  6|BR  4
    var topLeft = borderSize(chars[2]);
    var topMiddle = borderSize(chars[0]);
    var topRight = borderSize(chars[3]);
    var leftMiddle = borderSize(chars[1]);
    var bottomLeft = borderSize(chars[4]);
    var bottomMiddle = chars[6] !== undefined ? borderSize(chars[6]) : topMiddle;
    var bottomRight = borderSize(chars[5]);
    var rightMiddle = chars[7] !== undefined ? borderSize(chars[7]) : leftMiddle;
    return [
        chars,
        {
            maxLeft: leftMiddle.width,
            maxRight: rightMiddle.width,
            // if leftMiddle and rightMiddle are the same width as topLeft and topRight
            // corners, use topMiddle.height as maxTop.
            // Otherwise, use the max of the corners and middle.
            maxTop: leftMiddle.width === topLeft.width &&
                rightMiddle.width === topRight.width
                ? topMiddle.height
                : Math.max(topLeft.height, topMiddle.height, topRight.height),
            // if leftMiddle and rightMiddle are the same width as bottomLeft and bottomRight
            // corners, use bottomMiddle.height as maxBottom.
            // Otherwise, use the max of the corners and middle.
            maxBottom: leftMiddle.width === topLeft.width &&
                rightMiddle.width === topRight.width
                ? bottomMiddle.height
                : Math.max(bottomLeft.height, bottomMiddle.height, bottomRight.height),
            topLeft: topLeft,
            topMiddle: topMiddle,
            topRight: topRight,
            leftMiddle: leftMiddle,
            rightMiddle: rightMiddle,
            bottomLeft: bottomLeft,
            bottomMiddle: bottomMiddle,
            bottomRight: bottomRight,
        },
    ];
}
function borderSize(str) {
    if (str === '') {
        return { width: 0, height: 0 };
    }
    return sys_1.unicode.stringSize(str);
}
var BORDERS = {
    none: ['', '', '', '', '', '', '', ''],
    single: ['─', '│', '┌', '┐', '└', '┘', '─', '│'],
    bold: ['━', '┃', '┏', '┓', '┗', '┛', '━', '┃'],
    double: ['═', '║', '╔', '╗', '╚', '╝', '═', '║'],
    rounded: ['─', '│', '╭', '╮', '╰', '╯', '─', '│'],
    dotted: ['⠒', '⡇', '⡖', '⢲', '⠧', '⠼', '⠤', '⢸'],
    popout: [' \n─', '│', ' \n┌', ' /\\   \n/  \\─┐', '└', '┘', '─', '│'],
};
var BORDER_SIZE_ZERO = {
    maxTop: 0,
    maxRight: 0,
    maxBottom: 0,
    maxLeft: 0,
    topMiddle: new geometry_1.Size(0, 0),
    topLeft: new geometry_1.Size(0, 0),
    topRight: new geometry_1.Size(0, 0),
    leftMiddle: new geometry_1.Size(0, 0),
    rightMiddle: new geometry_1.Size(0, 0),
    bottomMiddle: new geometry_1.Size(0, 0),
    bottomLeft: new geometry_1.Size(0, 0),
    bottomRight: new geometry_1.Size(0, 0),
};
