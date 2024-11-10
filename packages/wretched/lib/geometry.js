"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = exports.Size = exports.Point = void 0;
exports.interpolate = interpolate;
var Point = /** @class */ (function () {
    function Point() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toXY(args), x = _a[0], y = _a[1];
        this.x = x;
        this.y = y;
    }
    Point.prototype.copy = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.mutableCopy = function () {
        return this.copy();
    };
    Point.prototype.offset = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toXY(args), x = _a[0], y = _a[1];
        return new Point(this.x + x, this.y + y);
    };
    Point.prototype.isEqual = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toXY(args), x = _a[0], y = _a[1];
        return this.x === x && this.y === y;
    };
    Point.zero = new Point(0, 0);
    return Point;
}());
exports.Point = Point;
var Size = /** @class */ (function () {
    function Size() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toWH(args), width = _a[0], height = _a[1];
        this.width = Math.max(0, width);
        this.height = Math.max(0, height);
    }
    Size.prototype.copy = function () {
        return new Size(this.width, this.height);
    };
    Size.prototype.mutableCopy = function () {
        var copy = this.copy();
        Object.defineProperty(copy, 'width', {
            enumerable: true,
            writable: true,
        });
        Object.defineProperty(copy, 'height', {
            enumerable: true,
            writable: true,
        });
        return copy;
    };
    Size.prototype.isEqual = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toWH(args), w = _a[0], h = _a[1];
        return this.width === w && this.height === h;
    };
    Size.prototype.shrink = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toWH(args), w = _a[0], h = _a[1];
        return this.grow(-w, -h);
    };
    Size.prototype.grow = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toWH(args), w = _a[0], h = _a[1];
        return new Size(Math.max(0, this.width + w), Math.max(0, this.height + h));
    };
    Size.prototype.growWidth = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 1 && typeof args[0] === 'number') {
            return this.grow(args[0], 0);
        }
        var _a = toWH(args), w = _a[0], h = _a[1];
        return new Size(Math.max(this.width + w), Math.max(this.height, h));
    };
    Size.prototype.growHeight = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 1 && typeof args[0] === 'number') {
            return this.grow(0, args[0]);
        }
        var _a = toWH(args), w = _a[0], h = _a[1];
        return new Size(Math.max(this.width, w), Math.max(this.height + h));
    };
    /**
     * Restricts width to a maximum size (width must be <= maxWidth)
     */
    Size.prototype.maxWidth = function (maxWidth) {
        return new Size(Math.min(maxWidth, this.width), this.height);
    };
    /**
     * Restricts height to a maximum size (height must be <= maxHeight)
     */
    Size.prototype.maxHeight = function (maxHeight) {
        return new Size(this.width, Math.min(maxHeight, this.height));
    };
    /**
     * Restricts width to a minimum size (width must be >= minWidth)
     */
    Size.prototype.minWidth = function (minWidth) {
        return new Size(Math.max(minWidth, this.width), this.height);
    };
    /**
     * Restricts height to a minimum size (height must be >= minHeight)
     */
    Size.prototype.minHeight = function (minHeight) {
        return new Size(this.width, Math.max(minHeight, this.height));
    };
    /**
     * Assigns width
     */
    Size.prototype.withWidth = function (value) {
        return new Size(value, this.height);
    };
    /**
     * Assigns height
     */
    Size.prototype.withHeight = function (value) {
        return new Size(this.width, value);
    };
    /**
     * Restricts size to a maximum size (size must be <= maxSize)
     */
    Size.prototype.max = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toWH(args), w = _a[0], h = _a[1];
        return new Size(Math.min(w, this.width), Math.min(h, this.height));
    };
    /**
     * Restricts size to a minimum size (size must be >= minSize)
     */
    Size.prototype.min = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toWH(args), w = _a[0], h = _a[1];
        return new Size(Math.max(w, this.width), Math.max(h, this.height));
    };
    Size.prototype.abs = function () {
        if (this.width >= 0 && this.height >= 0) {
            return this;
        }
        else {
            return new Size(Math.abs(this.width), Math.abs(this.height));
        }
    };
    Object.defineProperty(Size.prototype, "isEmpty", {
        get: function () {
            return this.width === 0 || this.height === 0;
        },
        enumerable: false,
        configurable: true
    });
    Size.zero = new Size(0, 0);
    Size.one = new Size(1, 1);
    return Size;
}());
exports.Size = Size;
var Rect = /** @class */ (function () {
    function Rect(origin, size) {
        var _a = toXY([origin]), x = _a[0], y = _a[1];
        var _b = toWH([size]), width = _b[0], height = _b[1];
        if (width < 0) {
            x = x + width;
            width = -width;
        }
        if (height < 0) {
            y = y + height;
            height = -height;
        }
        this.origin = new Point(x, y);
        this.size = new Size(width, height);
    }
    Rect.prototype.atX = function (value) {
        return new Rect([value, this.origin.y], this.size);
    };
    Rect.prototype.atY = function (value) {
        return new Rect([this.origin.x, value], this.size);
    };
    Rect.prototype.at = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        return new Rect(toXY(value), this.size);
    };
    Rect.prototype.offset = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toXY(args), x = _a[0], y = _a[1];
        return new Rect(this.origin.offset(x, y), this.size);
    };
    Rect.prototype.withWidth = function (value) {
        return new Rect(this.origin, [value, this.size.height]);
    };
    Rect.prototype.withHeight = function (value) {
        return new Rect(this.origin, [this.size.width, value]);
    };
    Rect.prototype.withSize = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        return new Rect(this.origin, toWH(value));
    };
    Rect.prototype.copy = function () {
        return new Rect(this.origin.copy(), this.size.copy());
    };
    Rect.prototype.mutableCopy = function () {
        return this.copy();
    };
    Rect.prototype.isEqual = function (rect) {
        return this.origin.isEqual(rect.origin) && this.size.isEqual(rect.size);
    };
    Object.defineProperty(Rect.prototype, "isEmpty", {
        get: function () {
            return this.size.isEmpty;
        },
        enumerable: false,
        configurable: true
    });
    Rect.prototype.includes = function (point) {
        return (point.x >= this.minX() &&
            point.x < this.maxX() &&
            point.y >= this.minY() &&
            point.y < this.maxY());
    };
    Rect.prototype.intersection = function (rect) {
        var minX = Math.max(this.minX(), rect.minX());
        var minY = Math.max(this.minY(), rect.minY());
        var width = Math.min(this.maxX(), rect.maxX()) - minX;
        var height = Math.min(this.maxY(), rect.maxY()) - minY;
        return new Rect(new Point(minX, minY), new Size(width, height));
    };
    Rect.prototype.inset = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = toInset(args), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
        return new Rect(this.min().offset(left, top), this.size.abs().shrink(left + right, top + bottom));
    };
    Rect.prototype.min = function () {
        return new Point(this.minX(), this.minY());
    };
    Rect.prototype.max = function () {
        return new Point(this.maxX(), this.maxY());
    };
    Rect.prototype.minX = function () {
        return this.origin.x;
    };
    Rect.prototype.maxX = function () {
        return this.origin.x + this.size.width;
    };
    Rect.prototype.minY = function () {
        return this.origin.y;
    };
    Rect.prototype.maxY = function () {
        return this.origin.y + this.size.height;
    };
    Rect.prototype.forEachPoint = function (fn) {
        var minX = this.minX(), maxX = this.maxX(), minY = this.minY(), maxY = this.maxY();
        var pt = Point.zero.mutableCopy();
        for (var x = minX; x < maxX; ++x)
            for (var y = minY; y < maxY; ++y) {
                pt.x = x;
                pt.y = y;
                fn(pt);
            }
    };
    Rect.zero = new Rect(Point.zero, Size.zero);
    return Rect;
}());
exports.Rect = Rect;
function interpolate(x, _a, _b, clamp) {
    var x0 = _a[0], x1 = _a[1];
    var y0 = _b[0], y1 = _b[1];
    if (x0 === x1) {
        return y0;
    }
    var ret = y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
    if (clamp) {
        var min = Math.min(y0, y1);
        var max = Math.max(y0, y1);
        ret = Math.min(max, Math.max(min, ret));
    }
    return ret;
}
function toXY(args) {
    if (args.length === 2) {
        return args;
    }
    else {
        var arg = args[0];
        if (Array.isArray(arg)) {
            return [arg[0], arg[1]];
        }
        else {
            return [arg.x, arg.y];
        }
    }
}
function toWH(args) {
    if (args.length === 2) {
        return args;
    }
    else {
        var arg = args[0];
        if (Array.isArray(arg)) {
            return [arg[0], arg[1]];
        }
        else {
            return [arg.width, arg.height];
        }
    }
}
function toInset(args) {
    var _a, _b, _c, _d;
    if (args.length > 1) {
        return toInset([
            args,
        ]);
    }
    else {
        var arg = args[0];
        if (typeof arg === 'number') {
            return [arg, arg, arg, arg];
        }
        else if (Array.isArray(arg)) {
            var numbers = arg;
            var a = numbers[0], b = numbers[1], c = numbers[2], d = numbers[3];
            switch (numbers.length) {
                case 4:
                    return [a, a, b, c];
                case 3:
                    return [a, b, c, b];
                case 2:
                    return [a, b, a, b];
                case 1:
                    return [a, a, a, a];
                default:
                    return [0, 0, 0, 0];
            }
        }
        else {
            return [(_a = arg.top) !== null && _a !== void 0 ? _a : 0, (_b = arg.right) !== null && _b !== void 0 ? _b : 0, (_c = arg.bottom) !== null && _c !== void 0 ? _c : 0, (_d = arg.left) !== null && _d !== void 0 ? _d : 0];
        }
    }
}
