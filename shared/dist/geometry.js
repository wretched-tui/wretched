"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = exports.Size = exports.Point = void 0;
exports.interpolate = interpolate;
class Point {
    x;
    y;
    static zero = new Point(0, 0);
    constructor(...args) {
        const [x, y] = toXY(args);
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Point(this.x, this.y);
    }
    mutableCopy() {
        return this.copy();
    }
    offset(...args) {
        const [x, y] = toXY(args);
        return new Point(this.x + x, this.y + y);
    }
    isEqual(...args) {
        const [x, y] = toXY(args);
        return this.x === x && this.y === y;
    }
}
exports.Point = Point;
class Size {
    width;
    height;
    static zero = new Size(0, 0);
    static one = new Size(1, 1);
    constructor(...args) {
        const [width, height] = toWH(args);
        this.width = Math.max(0, width);
        this.height = Math.max(0, height);
    }
    copy() {
        return new Size(this.width, this.height);
    }
    mutableCopy() {
        const copy = this.copy();
        Object.defineProperty(copy, 'width', {
            enumerable: true,
            writable: true,
        });
        Object.defineProperty(copy, 'height', {
            enumerable: true,
            writable: true,
        });
        return copy;
    }
    isEqual(...args) {
        const [w, h] = toWH(args);
        return this.width === w && this.height === h;
    }
    shrink(...args) {
        const [w, h] = toWH(args);
        return this.grow(-w, -h);
    }
    grow(...args) {
        const [w, h] = toWH(args);
        return new Size(Math.max(0, this.width + w), Math.max(0, this.height + h));
    }
    growWidth(...args) {
        if (args.length === 1 && typeof args[0] === 'number') {
            return this.grow(args[0], 0);
        }
        const [w, h] = toWH(args);
        return new Size(Math.max(this.width + w), Math.max(this.height, h));
    }
    growHeight(...args) {
        if (args.length === 1 && typeof args[0] === 'number') {
            return this.grow(0, args[0]);
        }
        const [w, h] = toWH(args);
        return new Size(Math.max(this.width, w), Math.max(this.height + h));
    }
    /**
     * Restricts width to a maximum size (width must be <= maxWidth)
     */
    maxWidth(maxWidth) {
        return new Size(Math.min(maxWidth, this.width), this.height);
    }
    /**
     * Restricts height to a maximum size (height must be <= maxHeight)
     */
    maxHeight(maxHeight) {
        return new Size(this.width, Math.min(maxHeight, this.height));
    }
    /**
     * Restricts width to a minimum size (width must be >= minWidth)
     */
    minWidth(minWidth) {
        return new Size(Math.max(minWidth, this.width), this.height);
    }
    /**
     * Restricts height to a minimum size (height must be >= minHeight)
     */
    minHeight(minHeight) {
        return new Size(this.width, Math.max(minHeight, this.height));
    }
    /**
     * Assigns width
     */
    withWidth(value) {
        return new Size(value, this.height);
    }
    /**
     * Assigns height
     */
    withHeight(value) {
        return new Size(this.width, value);
    }
    /**
     * Restricts size to a maximum size (size must be <= maxSize)
     */
    max(...args) {
        const [w, h] = toWH(args);
        return new Size(Math.min(w, this.width), Math.min(h, this.height));
    }
    /**
     * Restricts size to a minimum size (size must be >= minSize)
     */
    min(...args) {
        const [w, h] = toWH(args);
        return new Size(Math.max(w, this.width), Math.max(h, this.height));
    }
    abs() {
        if (this.width >= 0 && this.height >= 0) {
            return this;
        }
        else {
            return new Size(Math.abs(this.width), Math.abs(this.height));
        }
    }
    get isEmpty() {
        return this.width === 0 || this.height === 0;
    }
}
exports.Size = Size;
class Rect {
    origin;
    size;
    static zero = new Rect(Point.zero, Size.zero);
    constructor(origin, size) {
        let [x, y] = toXY([origin]);
        let [width, height] = toWH([size]);
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
    atX(value) {
        return new Rect([value, this.origin.y], this.size);
    }
    atY(value) {
        return new Rect([this.origin.x, value], this.size);
    }
    at(...value) {
        return new Rect(toXY(value), this.size);
    }
    offset(...args) {
        const [x, y] = toXY(args);
        return new Rect(this.origin.offset(x, y), this.size);
    }
    withWidth(value) {
        return new Rect(this.origin, [value, this.size.height]);
    }
    withHeight(value) {
        return new Rect(this.origin, [this.size.width, value]);
    }
    withSize(...value) {
        return new Rect(this.origin, toWH(value));
    }
    copy() {
        return new Rect(this.origin.copy(), this.size.copy());
    }
    mutableCopy() {
        return this.copy();
    }
    isEqual(rect) {
        return this.origin.isEqual(rect.origin) && this.size.isEqual(rect.size);
    }
    get isEmpty() {
        return this.size.isEmpty;
    }
    includes(point) {
        return (point.x >= this.minX() &&
            point.x < this.maxX() &&
            point.y >= this.minY() &&
            point.y < this.maxY());
    }
    intersection(rect) {
        const minX = Math.max(this.minX(), rect.minX());
        const minY = Math.max(this.minY(), rect.minY());
        const width = Math.min(this.maxX(), rect.maxX()) - minX;
        const height = Math.min(this.maxY(), rect.maxY()) - minY;
        return new Rect(new Point(minX, minY), new Size(width, height));
    }
    inset(...args) {
        const [top, right, bottom, left] = toInset(args);
        return new Rect(this.min().offset(left, top), this.size.abs().shrink(left + right, top + bottom));
    }
    min() {
        return new Point(this.minX(), this.minY());
    }
    max() {
        return new Point(this.maxX(), this.maxY());
    }
    minX() {
        return this.origin.x;
    }
    maxX() {
        return this.origin.x + this.size.width;
    }
    minY() {
        return this.origin.y;
    }
    maxY() {
        return this.origin.y + this.size.height;
    }
    forEachPoint(fn) {
        const minX = this.minX(), maxX = this.maxX(), minY = this.minY(), maxY = this.maxY();
        let pt = Point.zero.mutableCopy();
        for (let x = minX; x < maxX; ++x)
            for (let y = minY; y < maxY; ++y) {
                pt.x = x;
                pt.y = y;
                fn(pt);
            }
    }
}
exports.Rect = Rect;
function interpolate(x, [x0, x1], [y0, y1], clamp) {
    if (x0 === x1) {
        return y0;
    }
    let ret = y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
    if (clamp) {
        const min = Math.min(y0, y1);
        const max = Math.max(y0, y1);
        ret = Math.min(max, Math.max(min, ret));
    }
    return ret;
}
function toXY(args) {
    if (args.length === 2) {
        return args;
    }
    else {
        const [arg] = args;
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
        const [arg] = args;
        if (Array.isArray(arg)) {
            return [arg[0], arg[1]];
        }
        else {
            return [arg.width, arg.height];
        }
    }
}
function toInset(args) {
    if (args.length > 1) {
        return toInset([
            args,
        ]);
    }
    else {
        const [arg] = args;
        if (typeof arg === 'number') {
            return [arg, arg, arg, arg];
        }
        else if (Array.isArray(arg)) {
            const numbers = arg;
            const [a, b, c, d] = numbers;
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
            return [arg.top ?? 0, arg.right ?? 0, arg.bottom ?? 0, arg.left ?? 0];
        }
    }
}
//# sourceMappingURL=geometry.js.map